import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { DomesticScheduledPaymentsService } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { AlertService, HelpersService, LocalStorageService  } from '../../_services';
import { ShowJsonDataDialog } from '../dialogs/show.json.data.dialog';
import { PaymentConsentType } from './../../http/model/paymentType';
@Component({
  selector: 'domestic-Scheduled-payments-component',
  templateUrl: './domestic.scheduled.payment.html',
  styleUrls: ['../../app.component.css']
})
export class DomesticScheduledPaymentsComponent implements OnInit {
  @Input() consent_id: string;

  emyptyAuthorization: string = '';
  keys = Object.keys;
  paymentForm: FormGroup;
  payment: any;
  emptyAuthorization: string = "";
  deptorChecked: boolean = false;
  domesticScheduledPaymentId;

  domesticPaymentConsentDataSource;
  domesticPaymentConsentDisplayedColumns: string[] = ['status', 'identification', 'instructedAmount', 'arrow'];
  @ViewChild(MatPaginator) domesticPaymentConsentPaginator: MatPaginator;
  isEmptyPaymentConsent;

  domesticPaymentConsentFundsConfirmationDataSource;
  domesticPaymentConsentFundsConfirmationDisplayedColumns: string[] = ['fundsAvailableDateTime', 'fundsAvailable', 'arrow'];
  @ViewChild(MatPaginator) domesticPaymentConsentFundsConfirmationPaginator: MatPaginator;
  isEmptyFundsConfirmation;

  domesticPaymentDataSource;
  domesticPaymentDisplayedColumns: string[] = ['status', 'identification', 'instructedAmount', 'arrow'];
  @ViewChild(MatPaginator) domesticPaymentPaginator: MatPaginator;
  isEmptyPayment;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _domesticScheduledPaymentsService: DomesticScheduledPaymentsService,
    public dialog: MatDialog,
    private _localStorageService: LocalStorageService,
    private _helpersService: HelpersService
  ) {}

  ngOnInit() {
    this.paymentForm = this.formBuilder.group({
      instructedAmountCurrency: ['HUF'],
      instructedAmount: ['1680.00'],
      instructionIdentification: ['mobilVallet123'],
      endToEndIdentification: ['29152852756654'],
      requestedExecutionDateTime: ['2018-08-06T00:00:00+00:00'],
      creditorAccountSchemeName: ['IBAN'],
      creditorAccountIdentification: ['HU35120103740010183300200004'],
      creditorAccountName: ['Deichmann Cipőkereskedelmi Korlátolt Felelősségű Társaság'],
      debtorAccountSchemeName: ["IBAN"],
      debtorAccountIdentification: ["HU23103000029321814060584399"],
      debtorAccountName: ["Kiss Pista"],
      remittanceInformationReference: ["FRESCO-101"],
      remittanceInformationUnstructured: ["Internal ops code 5120101"]
    });
  }

  createScheduledPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentConsentBodyJson = this.createPaymentBody(paymentFormValue);
    this._domesticScheduledPaymentsService.createDomesticScheduledPaymentConsents(createPaymentConsentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this._localStorageService.saveInLocal('PAYMENT_TYPE', PaymentConsentType['DOMESTIC_SCHEDULED_PAYMENT_CONSENT']);
        this.redirectAuthorizationUrl(result.Data.ConsentId)
      },
        error => {
          this.alertService.error(error);
        });
  }

  redirectAuthorizationUrl(consentId) {
    this._authorizationUrlService.getAuthorizationUrl(consentId)
      .subscribe(
        url => {
          window.location.href = url
        },
        error => {
          this.alertService.error(error);
        });
  }

  getScheduledPaymentConsent(consentId) {
    this._domesticScheduledPaymentsService.getDomesticScheduledPaymentConsentsConsentId(consentId, this.emptyAuthorization).subscribe(result => {
      this.domesticPaymentConsentDataSource = new MatTableDataSource<any>([result.Data]);
      if (_.isObject(result.Data) && _.isEmpty(result.Data)) {
        this.isEmptyPaymentConsent = true;
      }
      setTimeout(() => this.domesticPaymentConsentDataSource.paginator = this.domesticPaymentConsentPaginator);
    },
      error => {
        this.alertService.error(error);
      });
  }

  createScheduledPayment(consentId) {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentBodyJson = this.createPaymentBody(paymentFormValue, consentId.trim());
    this._domesticScheduledPaymentsService.createDomesticScheduledPayments(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.domesticScheduledPaymentId = result.Data.DomesticScheduledPaymentId;
      },
        error => {
          this.alertService.error(error);
        });
  }

  getScheduledPayment(paymentId) {
    this._domesticScheduledPaymentsService.getDomesticScheduledPaymentsDomesticScheduledPaymentId(paymentId, this.emptyAuthorization).subscribe(result => {
      this.domesticPaymentDataSource = new MatTableDataSource<any>([result.Data]);
      if (_.isObject(result.Data) && _.isEmpty(result.Data)) {
        this.isEmptyPayment = true;
      }
      setTimeout(() => this.domesticPaymentDataSource.paginator = this.domesticPaymentPaginator);
    }),
      error => {
        this.alertService.error(error);
      };
  }

  createPaymentBody(paymentFormValue, consentId?) {
    const body = {
      Data: {
        ConsentId: {},
        Permission: {},
        Initiation: {
          InstructionIdentification: paymentFormValue.instructionIdentification,
          EndToEndIdentification: paymentFormValue.endToEndIdentification,
          RequestedExecutionDateTime: paymentFormValue.requestedExecutionDateTime,
          InstructedAmount: {
            Amount: paymentFormValue.instructedAmount,
            Currency: paymentFormValue.instructedAmountCurrency
          },
          CreditorAccount: {
            SchemeName: paymentFormValue.creditorAccountSchemeName,
            Identification: paymentFormValue.creditorAccountIdentification,
            Name: paymentFormValue.creditorAccountName
          },
          RemittanceInformation: {
            Reference: paymentFormValue.remittanceInformationReference,
            Unstructured: paymentFormValue.remittanceInformationUnstructured
          },
          DebtorAccount: {}
        }
      },
      Risk: {}
    }

    if (consentId) {
      body.Data.ConsentId = consentId;
    } else {
      body.Data.Permission = "Create";
    }

    if (this.deptorChecked) {
      body.Data.Initiation.DebtorAccount = {
        SchemeName: paymentFormValue.debtorAccountSchemeName,
        Identification: paymentFormValue.debtorAccountIdentification,
        Name: paymentFormValue.debtorAccountName
      }
    }

    let cleanedRequestBody = this._helpersService.cleanObjectsFromEmptyElements(body);
    cleanedRequestBody.Risk = {};
    return cleanedRequestBody;
  }

  openDataDetails(elementData) {
    this.dialog.open(ShowJsonDataDialog, {
      data: elementData
    });
  }
}