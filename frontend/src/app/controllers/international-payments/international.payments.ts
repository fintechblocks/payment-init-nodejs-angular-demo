import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { OBWriteInternationalConsent2 } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { InternationalPaymentsService } from '../../http/api/internationalPayments.service';
import { AlertService, HelpersService, LocalStorageService  } from '../../_services';
import { ShowJsonDataDialog } from '../dialogs/show.json.data.dialog';
import { PaymentConsentType } from './../../http/model/paymentType';

@Component({
  selector: 'international-payments-component',
  templateUrl: './international.payment.html',
  styleUrls: ['../../app.component.css']
})
export class InternationalPaymentsComponent implements OnInit {
  @Input() consent_id: string;

  emyptyAuthorization: string = '';
  keys = Object.keys;
  paymentForm: FormGroup;
  emptyAuthorization: string = "";
  consentDeptorChecked: boolean = false;
  deptorChecked: boolean = false;
  internationalPaymentPaymentId;
  internationalPaymentConsentDataSource;

  internationalPaymentConsentDisplayedColumns: string[] = ['status', 'identification', 'instructedAmount', 'arrow'];
  @ViewChild(MatPaginator) internationalPaymentConsentPaginator: MatPaginator;
  isEmptyPaymentConsent;

  internationalPaymentConsentFundsConfirmationDataSource;
  internationalPaymentConsentFundsConfirmationDisplayedColumns: string[] = ['fundsAvailableDateTime', 'fundsAvailable', 'arrow'];
  @ViewChild(MatPaginator) internationalPaymentConsentFundsConfirmationPaginator: MatPaginator;
  isEmptyFundsConfirmation;

  internationalPaymentDataSource;
  internationalPaymentDisplayedColumns: string[] = ['status', 'identification', 'instructedAmount', 'arrow'];
  @ViewChild(MatPaginator) internationalPaymentPaginator: MatPaginator;
  isEmptyPayment;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _internationalPaymentsService: InternationalPaymentsService,
    public dialog: MatDialog,
    private _localStorageService: LocalStorageService,
    private _helpersService: HelpersService
  ) { }

  ngOnInit() {
    this.paymentForm = this.formBuilder.group({
      instructedAmountCurrency: ['HUF'],
      instructedAmount: ['1680.00'],
      instructionIdentification: ['mobilVallet123'],
      endToEndIdentification: ['29152852756654'],
      creditorAccountSchemeName: ['IBAN'],
      creditorAccountIdentification: ['HU35120103740010183300200004'],
      creditorAccountName: ['Deichmann Cipőkereskedelmi Korlátolt Felelősségű Társaság'],
      debtorAccountSchemeName: ["IBAN"],
      debtorAccountIdentification: ["HU23103000029321814060584399"],
      debtorAccountName: ["Kiss Pista"],
      remittanceInformationReference: ["FRESCO-101"],
      remittanceInformationUnstructured: ["Internal ops code 5120101"],
      currencyOfTransfer: ["USD"],
      unitCurrency: ["GBP"],
      rateType: ["Actual"]
    });
  }

  createPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();

    const paymentFormValue = this.paymentForm.value;
    const createPaymentConsentBodyJson: OBWriteInternationalConsent2 = this.createPaymentBody(paymentFormValue);
    this._internationalPaymentsService.createInternationalPaymentConsents(createPaymentConsentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this._localStorageService.saveInLocal('PAYMENT_TYPE', PaymentConsentType['INTERNATIONAL_PAYMENT_CONSENT']);

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

  getPaymentConsent(consentId) {
    this._internationalPaymentsService.getInternationalPaymentConsentsConsentId(consentId, this.emptyAuthorization).subscribe(result => {
      this.internationalPaymentConsentDataSource = new MatTableDataSource<any>([result.Data]);
      if (_.isObject(result.Data) && _.isEmpty(result.Data)) {
        this.isEmptyPaymentConsent = true;
      }
      setTimeout(() => this.internationalPaymentConsentDataSource.paginator = this.internationalPaymentConsentPaginator);
    },
      error => {
        this.alertService.error(error);
      });
  }

  getPaymentConsentFundsConfirmation(consentId) {
    this._internationalPaymentsService.getInternationalPaymentConsentsConsentIdFundsConfirmation(consentId, this.emyptyAuthorization)
      .subscribe(result => {
        this.internationalPaymentConsentFundsConfirmationDataSource = new MatTableDataSource<any>([result.Data]);
        if (_.isObject(result.Data) && _.isEmpty(result.Data)) {
          this.isEmptyFundsConfirmation = true;
        }
        setTimeout(() => this.internationalPaymentConsentFundsConfirmationDataSource.paginator = this.internationalPaymentConsentFundsConfirmationPaginator);
      },
        error => {
          this.alertService.error(error);
        });
  }

  createPayment(consentId) {
    let idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;

    const createPaymentBodyJson = this.createPaymentBody(paymentFormValue, consentId.trim());
    this._internationalPaymentsService.createInternationalPayments(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.internationalPaymentPaymentId = result.Data.InternationalPaymentId;
      },
        error => {
          this.alertService.error(error);
        });
  }

  getPayment(paymentId) {
    this._internationalPaymentsService.getInternationalPaymentsInternationalPaymentId(paymentId, this.emptyAuthorization).subscribe(result => {
      this.internationalPaymentDataSource = new MatTableDataSource<any>([result.Data]);
      if (_.isObject(result.Data) && _.isEmpty(result.Data)) {
        this.isEmptyPayment = true;
      }
      setTimeout(() => this.internationalPaymentDataSource.paginator = this.internationalPaymentPaginator);
    }),
      error => {
        this.alertService.error(error);
      };
  }

  createPaymentBody(paymentFormValue, consentId?) {
    const body = {
      Data: {
        ConsentId: {},
        Initiation: {
          InstructionIdentification: paymentFormValue.instructionIdentification,
          EndToEndIdentification: paymentFormValue.endToEndIdentification,
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
          ExchangeRateInformation: {
            UnitCurrency: paymentFormValue.unitCurrency,
            RateType: paymentFormValue.rateType
          },
          CurrencyOfTransfer: paymentFormValue.currencyOfTransfer,
          DebtorAccount: {}
        }
      },
      Risk: {}
    }

    if (consentId) {
      body.Data.ConsentId = consentId;
    }

    if (this.consentDeptorChecked) {
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




