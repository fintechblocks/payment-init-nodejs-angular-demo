import { CookieService } from 'ngx-cookie-service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { HelpersService } from '../../_services';
import { InternationalScheduledPaymentsService } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { AlertService } from '../../_services';
import { ShowJsonDataDialog } from '../dialogs/show.json.data.dialog';
import { PaymentConsentType } from './../../http/model/paymentType';

@Component({
  selector: 'international-Scheduled-payments-component',
  templateUrl: './international.scheduled.payment.html',
  styleUrls: ['../../app.component.css']
})
export class InternationalScheduledPaymentsComponent implements OnInit {
  @Input() consent_id: string;

  emyptyAuthorization: string = '';
  keys = Object.keys;
  paymentForm: FormGroup;
  payment: any;
  emptyAuthorization: string = "";
  deptorChecked: boolean = false;
  consentDeptorChecked: boolean = false;
  internationalScheduledPaymentId;
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
    private _internationalScheduledPaymentsService: InternationalScheduledPaymentsService,
    public dialog: MatDialog,
    private _cookieService: CookieService,
    private _helpersService: HelpersService
  ) { }

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
      remittanceInformationUnstructured: ["Internal ops code 5120101"],
      currencyOfTransfer: ["USD"],
      unitCurrency: ["GBP"],
      rateType: ["Actual"]
    });
  }

  createScheduledPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentConsentBodyJson = this.createPaymentBody(paymentFormValue);
    this._internationalScheduledPaymentsService.createInternationalScheduledPaymentConsents(createPaymentConsentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this._cookieService.set('PAYMENT_TYPE', PaymentConsentType.INTERNATIONAL_SCHEDULED_PAYMENT_CONSENT);
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
    this._internationalScheduledPaymentsService.getInternationalScheduledPaymentConsentsConsentId(consentId, this.emptyAuthorization).subscribe(result => {
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
    this._internationalScheduledPaymentsService.getInternationalScheduledPaymentConsentsConsentIdFundsConfirmation(consentId, this.emyptyAuthorization)
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


  createScheduledPayment(consentId) {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentBodyJson = this.createPaymentBody(paymentFormValue, consentId.trim());
    this._internationalScheduledPaymentsService.createInternationalScheduledPayments(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.internationalScheduledPaymentId = result.Data.InternationalScheduledPaymentId;
      },
        error => {
          this.alertService.error(error);
        });
  }

  getScheduledPayment(paymentId) {
    this._internationalScheduledPaymentsService.getInternationalScheduledPaymentsInternationalScheduledPaymentId(paymentId, this.emptyAuthorization).subscribe(result => {
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
    } else {
      body.Data.Permission = "Create";
    }

    if (this.deptorChecked || this.consentDeptorChecked) {
      body.Data.Initiation.DebtorAccount = {
        SchemeName: paymentFormValue.debtorAccountSchemeName,
        Identification: paymentFormValue.debtorAccountIdentification,
        Name: paymentFormValue.debtorAccountName
      }
    }

    let cleanedRequestBody = this._helpersService.cleanObjectsFromEmptyElements(body);
    cleanedRequestBody.Risk = {};
    const requestBody = JSON.parse(JSON.stringify(cleanedRequestBody));
    return requestBody;
  }

  openDataDetails(elementData) {
    this.dialog.open(ShowJsonDataDialog, {
      data: elementData
    });
  }
}