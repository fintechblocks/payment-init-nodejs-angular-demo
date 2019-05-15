import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { OBWriteBatchDomesticConsent2 } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { ShowJsonDataDialog } from '../dialogs/show.json.data.dialog';
import { BatchDomesticPaymentsService } from './../../http/api/batchDomesticPayments.service';
import { PaymentConsentType } from './../../http/model/paymentType';
import { AlertService, HelpersService  } from '../../_services';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'batch-domestic-payments-component',
  templateUrl: './batch.domestic.payment.html',
  styleUrls: ['../../app.component.css']
})
export class BatchDomesticPaymentsComponent implements OnInit {
  @Input() consent_id: string;
  emyptyAuthorization: string = '';
  keys = Object.keys;
  paymentForm: FormGroup;
  emptyAuthorization: string = "";
  consentDeptorChecked: boolean = false;
  deptorChecked: boolean = false;
  domesticPaymentPaymentId;
  domesticPaymentConsentDataSource;

  domesticPaymentConsentDisplayedColumns: string[] = ['status', 'statusUpdateDateTime', 'creationDateTime', 'arrow'];
  @ViewChild(MatPaginator) domesticPaymentConsentPaginator: MatPaginator;
  isEmptyPaymentConsent;

  domesticPaymentDataSource;
  domesticPaymentDisplayedColumns: string[] = ['status', 'statusUpdateDateTime', 'creationDateTime', 'arrow'];
  @ViewChild(MatPaginator) domesticPaymentPaginator: MatPaginator;
  isEmptyPayment;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _batchDomesticPaymentsService: BatchDomesticPaymentsService,
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
      creditorAccountSchemeName: ['IBAN'],
      creditorAccountIdentification: ['HU35120103740010183300200004'],
      creditorAccountName: ['Deichmann Cipőkereskedelmi Korlátolt Felelősségű Társaság'],
      debtorAccountSchemeName: ["IBAN"],
      debtorAccountIdentification: ["HU23103000029321814060584399"],
      debtorAccountName: ["Kiss Pista"],
      remittanceInformationReference: ["FRESCO-101"],
      remittanceInformationUnstructured: ["Internal ops code 5120101"],
      scheduledInstructedAmountCurrency: ['HUF'],
      scheduledInstructedAmount: ['1680.00'],
      scheduledInstructionIdentification: ['mobilVallet123'],
      scheduledEndToEndIdentification: ['29152852756654'],
      scheduledRequestedExecutionDateTime: ['2018-08-06T00:00:00+00:00'],
      scheduledCreditorAccountSchemeName: ['IBAN'],
      scheduledCreditorAccountIdentification: ['HU35120103740010183300200004'],
      scheduledCreditorAccountName: ['Deichmann Cipőkereskedelmi Korlátolt Felelősségű Társaság'],
      scheduledDebtorAccountSchemeName: ["IBAN"],
      scheduledDebtorAccountIdentification: ["HU23103000029321814060584399"],
      scheduledDebtorAccountName: ["Kiss Pista"],
      scheduledRemittanceInformationReference: ["FRESCO-101"],
      scheduledRemittanceInformationUnstructured: ["Internal ops code 5120101"]
    });
  }

  createPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentConsentBodyJson: OBWriteBatchDomesticConsent2 = this.createPaymentBody(paymentFormValue);
    this._batchDomesticPaymentsService.createBatchDomesticPaymentConsents(createPaymentConsentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this._cookieService.set('PAYMENT_TYPE', PaymentConsentType.BATCH_DOMESTIC_PAYMENT_CONSENT);
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
    this._batchDomesticPaymentsService.getBatchDomesticPaymentConsentsConsentId(consentId, this.emptyAuthorization).subscribe(result => {
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

  createPayment(consentId) {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentBodyJson = this.createPaymentBody(paymentFormValue, consentId.trim());
    this._batchDomesticPaymentsService.createBatchDomesticPayments(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.domesticPaymentPaymentId = result.Data.DomesticPaymentId;
      },
        error => {
          this.alertService.error(error);
        });
  }

  getPayment(paymentId) {
    this._batchDomesticPaymentsService.getBatchDomesticPaymentsDomesticPaymentId(paymentId, this.emptyAuthorization).subscribe(result => {
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
        DomesticPayments: [{
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
            DebtorAccount: {}
          }
        }],
        DomesticScheduledPayments: [{
          Permission: {},
          Initiation: {
            InstructionIdentification: paymentFormValue.scheduledInstructionIdentification,
            EndToEndIdentification: paymentFormValue.scheduledEndToEndIdentification,
            RequestedExecutionDateTime: paymentFormValue.scheduledRequestedExecutionDateTime,
            InstructedAmount: {
              Amount: paymentFormValue.scheduledInstructedAmount,
              Currency: paymentFormValue.scheduledInstructedAmountCurrency
            },
            CreditorAccount: {
              SchemeName: paymentFormValue.scheduledCreditorAccountSchemeName,
              Identification: paymentFormValue.scheduledCreditorAccountIdentification,
              Name: paymentFormValue.scheduledCreditorAccountName
            },
            RemittanceInformation: {
              Reference: paymentFormValue.scheduledRemittanceInformationReference,
              Unstructured: paymentFormValue.scheduledRemittanceInformationUnstructured
            },
            DebtorAccount: {}
          }
        }]
      },
      Risk: {}
    }

    if (consentId) {
      body.Data.ConsentId = consentId;
    } else {
      body.Data.DomesticScheduledPayments[0].Permission = "Create";
    }

    if (this.consentDeptorChecked || this.deptorChecked) {
      body.Data.DomesticScheduledPayments[0].Initiation.DebtorAccount = {
        SchemeName: paymentFormValue.scheduledDebtorAccountSchemeName,
        Identification: paymentFormValue.scheduledDebtorAccountIdentification,
        Name: paymentFormValue.scheduledDebtorAccountName
      }
      body.Data.DomesticPayments[0].Initiation.DebtorAccount = {
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




