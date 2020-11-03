import { CookieService } from 'ngx-cookie-service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { OBWriteDomesticConsent2 } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { DomesticPaymentsService } from '../../http/api/domesticPayments.service';
import { AlertService, HelpersService } from '../../_services';
import { PaymentConsentType } from './../../http/model/paymentType';
import { ShowJsonDataDialog } from './../dialogs/show.json.data.dialog';
@Component({
  selector: 'domestic-payments-component',
  templateUrl: './domestic.payment.html',
  styleUrls: ['../../app.component.css']
})
export class DomesticPaymentsComponent implements OnInit {
  @Input() consent_id: string;
  emyptyAuthorization: string = '';
  keys = Object.keys;
  paymentForm: FormGroup;
  emptyAuthorization: string = "";
  consentDebtorChecked: boolean = false;
  debtorChecked: boolean = false;
  domesticPaymentPaymentId;

  domesticPaymentConsentDataSource;
  domesticPaymentConsentDisplayedColumns: string[] = ['status', 'identification', 'instructedAmount', 'arrow'];
  @ViewChild('domesticPaymentConsentPaginator') domesticPaymentConsentPaginator: MatPaginator;
  isEmptyPaymentConsent;

  domesticPaymentConsentFundsConfirmationDataSource;
  domesticPaymentConsentFundsConfirmationDisplayedColumns: string[] = ['fundsAvailableDateTime', 'fundsAvailable', 'arrow'];
  @ViewChild('domesticPaymentConsentFundsConfirmationPaginator') domesticPaymentConsentFundsConfirmationPaginator: MatPaginator;
  isEmptyFundsConfirmation;

  domesticPaymentDataSource;
  domesticPaymentDisplayedColumns: string[] = ['status', 'identification', 'instructedAmount', 'arrow'];
  @ViewChild('domesticPaymentPaginator') domesticPaymentPaginator: MatPaginator;
  isEmptyPayment;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _domesticPaymentsService: DomesticPaymentsService,
    public dialog: MatDialog,
    private _cookieService: CookieService,
    private _helpersService: HelpersService
  ) { }

  ngOnInit() {
    this.paymentForm = this.formBuilder.group({
      instructedAmountCurrency: ['HUF'],
      instructedAmount: ['100000.00'],
      instructionIdentification: ['mobilVallet123'],
      endToEndIdentification: ['29152852756654'],
      creditorAccountSchemeName: ['IBAN'],
      creditorAccountIdentification: ['HU35120103740010183300200004'],
      creditorAccountName: ['Deichmann Cipőkereskedelmi Korlátolt Felelősségű Társaság'],
      debtorAccountSchemeName: ["BBAN"],
      debtorAccountIdentification: ["141002132044784901000009"],
      debtorAccountName: ["Kiss Pista"],
      remittanceInformationReference: ["FRESCO-101"],
      remittanceInformationUnstructured: ["Internal ops code 5120101"],
      localInstrument: [""],
      mobile: [""],
      taxNumber: [""],
      taxPayerIdentificationNumber: [""],
      email: [""],
      requestToPayId: [""]
    });
  }

  createPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentConsentBodyJson: OBWriteDomesticConsent2 = this.createPaymentBody(paymentFormValue);
    this._domesticPaymentsService.createDomesticPaymentConsents(createPaymentConsentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this._cookieService.set('PAYMENT_TYPE', PaymentConsentType.DOMESTIC_PAYMENT_CONSENT);
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
    this._domesticPaymentsService.getDomesticPaymentConsentsConsentId(consentId, this.emptyAuthorization).subscribe(result => {
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

  getPaymentConsentFundsConfirmation(consentId) {
    this._domesticPaymentsService.getDomesticPaymentConsentsConsentIdFundsConfirmation(consentId, this.emyptyAuthorization)
      .subscribe(result => {
        this.domesticPaymentConsentFundsConfirmationDataSource = new MatTableDataSource<any>([result.Data]);
        if (_.isObject(result.Data) && _.isEmpty(result.Data)) {
          this.isEmptyFundsConfirmation = true;
        }
        setTimeout(() => this.domesticPaymentConsentFundsConfirmationDataSource.paginator = this.domesticPaymentConsentFundsConfirmationPaginator);
      },
        error => {
          this.alertService.error(error);
        });
  }

  createPayment(consentId) {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentBodyJson = this.createPaymentBody(paymentFormValue, consentId.trim());
    this._domesticPaymentsService.createDomesticPayments(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.domesticPaymentPaymentId = result.Data.DomesticPaymentId;
      },
        error => {
          this.alertService.error(error);
        });
  }

  getPayment(paymentId) {
    this._domesticPaymentsService.getDomesticPaymentsDomesticPaymentId(paymentId, this.emptyAuthorization).subscribe(result => {
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
        Initiation: {
          InstructionIdentification: paymentFormValue.instructionIdentification,
          EndToEndIdentification: paymentFormValue.endToEndIdentification,
          LocalInstrument: paymentFormValue.localInstrument,
          InstructedAmount: {
            Amount: paymentFormValue.instructedAmount,
            Currency: paymentFormValue.instructedAmountCurrency
          },
          CreditorAccount: {
            SchemeName: paymentFormValue.creditorAccountSchemeName,
            Identification: paymentFormValue.creditorAccountIdentification,
            Name: paymentFormValue.creditorAccountName,
            InstantPaymentIdentifiers: {
              Mobile: paymentFormValue.mobile,
              TaxNumber: paymentFormValue.taxNumber,
              TaxpayerIdentificationNumber: paymentFormValue.taxPayerIdentificationNumber,
              EmailAddress: paymentFormValue.email
            }
          },
          RemittanceInformation: {
            Reference: paymentFormValue.remittanceInformationReference,
            Unstructured: paymentFormValue.remittanceInformationUnstructured
          },
          DebtorAccount: {},
          RequestToPayId: paymentFormValue.requestToPayId
        }
      },
      Risk: {}
    }

    if (consentId) {
      body.Data.ConsentId = consentId;
    }
    
    if (this.consentDebtorChecked || this.debtorChecked) {
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