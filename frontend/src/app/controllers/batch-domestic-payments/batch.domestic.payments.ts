import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { OBWriteBatchDomesticConsent2 } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { ShowJsonDataDialog } from '../dialogs/show.json.data.dialog';
import { BatchDomesticPaymentsService } from './../../http/api/batchDomesticPayments.service';
import { PaymentConsentType } from './../../http/model/paymentType';
import { AlertService, HelpersService } from '../../_services';
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
  domesticPaymentForm: FormGroup;
  domesticScheduledPaymentForm: FormGroup;
  emptyAuthorization: string = "";
  batchDomesticPaymentId;
  domesticPaymentConsentDataSource;

  domesticPaymentConsentDisplayedColumns: string[] = ['status', 'statusUpdateDateTime', 'creationDateTime', 'arrow'];
  @ViewChild('batchDomesticPaymentConsentPaginator') domesticPaymentConsentPaginator: MatPaginator;
  isEmptyPaymentConsent;

  domesticPaymentDataSource;
  domesticPaymentDisplayedColumns: string[] = ['status', 'statusUpdateDateTime', 'creationDateTime', 'arrow'];
  @ViewChild('batchDomesticPaymentPaginator') domesticPaymentPaginator: MatPaginator;
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
    this.domesticPaymentForm = this.formBuilder.group({
      domesticPayments: this.formBuilder.array([this.createDomesticPaymentGroup()])
    });

    this.domesticScheduledPaymentForm = this.formBuilder.group({
      domesticScheduledPayments: this.formBuilder.array([this.createDomesticScheduledPaymentGroup()])
    });
  }

  get domesticPayments() { 
    return <FormArray>this.domesticPaymentForm.get('domesticPayments'); 
  }

  get domesticScheduledPayments() {
    return <FormArray>this.domesticScheduledPaymentForm.get('domesticScheduledPayments'); 
  }

  createDomesticPaymentGroup(): FormGroup {
    return this.formBuilder.group({
      instructedAmountCurrency: ['HUF'],
      instructedAmount: ['100000.00'],
      instructionIdentification: ['mobilVallet123'],
      endToEndIdentification: ['29152852756654'],
      creditorAccountSchemeName: ['IBAN'],
      creditorAccountIdentification: ['HU14120103740010183300300001'],
      creditorAccountName: ['ACME Inc'],
      secondaryIdentification: ['0002'],
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
    })
  }

  addDomesticPaymentToArray(): void {
    this.domesticPayments.push(this.createDomesticPaymentGroup());
  }

  deleteDomesticPaymentFromArray(index: number): void {
    if(this.domesticPayments.length > 1) {
      this.domesticPayments.removeAt(index);
    }
  }

  createDomesticScheduledPaymentGroup(): FormGroup {
    return this.formBuilder.group({
      scheduledInstructedAmountCurrency: ['HUF'],
      scheduledInstructedAmount: ['100000.00'],
      scheduledInstructionIdentification: ['mobilVallet123'],
      scheduledEndToEndIdentification: ['29152852756654'],
      scheduledRequestedExecutionDateTime: ['2020-08-06T00:00:00+00:00'],
      scheduledCreditorAccountSchemeName: ['IBAN'],
      scheduledCreditorAccountIdentification: ['HU14120103740010183300300001'],
      scheduledCreditorAccountName: ['ACME Inc'],
      scheduledDebtorAccountSchemeName: ["BBAN"],
      scheduledSecondaryIdentification: ['0002'],
      scheduledDebtorAccountIdentification: ["141002132044784901000009"],
      scheduledDebtorAccountName: ["Kiss Pista"],
      scheduledRemittanceInformationReference: ["FRESCO-101"],
      scheduledRemittanceInformationUnstructured: ["Internal ops code 5120101"],
      scheduledLocalInstrument: [""]
    })
  }

  addDomesticScheduledPaymentToArray(): void {
    this.domesticScheduledPayments.push(this.createDomesticScheduledPaymentGroup());
  }

  deleteDomesticScheduledPaymentFromArray(index: number): void {
    if(this.domesticScheduledPayments.length > 1) {
      this.domesticScheduledPayments.removeAt(index);
    }
  }

  createPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const domesticPaymentFormGroups = this.domesticPayments.controls;
    const domesticScheduledPaymentFormGroups = this.domesticScheduledPayments.controls;
    const createPaymentConsentBodyJson: OBWriteBatchDomesticConsent2 = this.createPaymentBody(domesticPaymentFormGroups, domesticScheduledPaymentFormGroups);
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
    const domesticPaymentFormGroups = this.domesticPayments.controls;
    const domesticScheduledPaymentFormGroups = this.domesticScheduledPayments.controls;
    const createPaymentBodyJson = this.createPaymentBody(domesticPaymentFormGroups, domesticScheduledPaymentFormGroups, consentId.trim());
    this._batchDomesticPaymentsService.createBatchDomesticPayments(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.batchDomesticPaymentId = result.Data['BatchDomesticPaymentId'];
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

  createPaymentBody(domesticPaymentFormGroups, domesticScheduledPaymentFormGroups, consentId?) {
    const domesticPayments: Array<any> = this.createDomesticPaymentsArray(domesticPaymentFormGroups);
    const domesticScheduledPayments: Array<any> = this.createDomesticScheduledPaymentsArray(domesticScheduledPaymentFormGroups);

    const body = {
      Data: {
        ConsentId: {},
        DomesticPayments: domesticPayments,
        DomesticScheduledPayments: domesticScheduledPayments
      },
      Risk: {}
    }

    if (consentId) {
      body.Data.ConsentId = consentId;
    }

    let cleanedRequestBody = this._helpersService.cleanObjectsFromEmptyElements(body);
    cleanedRequestBody.Risk = {};

    if (!cleanedRequestBody.Data) {
      cleanedRequestBody.Data = {};
      cleanedRequestBody.Data.DomesticPayments = [];
      cleanedRequestBody.Data.DomesticScheduledPayments = [];
    } else {
      cleanedRequestBody.Data.DomesticPayments = cleanedRequestBody.Data.DomesticPayments ? cleanedRequestBody.Data.DomesticPayments : [];
      cleanedRequestBody.Data.DomesticScheduledPayments = cleanedRequestBody.Data.DomesticScheduledPayments ? cleanedRequestBody.Data.DomesticScheduledPayments : [];
    }

    const requestBody = JSON.parse(JSON.stringify(cleanedRequestBody));
    return requestBody;
  }

  createDomesticPaymentsArray(domesticPaymentFormGroups) {
    let domesticPaymentsArray = [];
    domesticPaymentFormGroups.map((formGroup) => {
      domesticPaymentsArray.push({
        Initiation: {
          InstructionIdentification: formGroup.controls.instructionIdentification.value,
            EndToEndIdentification: formGroup.controls.endToEndIdentification.value,
              LocalInstrument: formGroup.controls.localInstrument.value,
                InstructedAmount: {
            Amount: formGroup.controls.instructedAmount.value,
              Currency: formGroup.controls.instructedAmountCurrency.value
          },
          CreditorAccount: {
            SchemeName: formGroup.controls.creditorAccountSchemeName.value,
            Identification: formGroup.controls.creditorAccountIdentification.value,
            Name: formGroup.controls.creditorAccountName.value,
            SecondaryIdentification: formGroup.controls.secondaryIdentification.value,
            InstantPaymentIdentifiers: {
              Mobile: formGroup.controls.mobile.value,
              TaxNumber: formGroup.controls.taxNumber.value,
              TaxpayerIdentificationNumber: formGroup.controls.taxPayerIdentificationNumber.value,
              EmailAddress: formGroup.controls.email.value
            }
          },
          RemittanceInformation: {
            Reference: formGroup.controls.remittanceInformationReference.value,
              Unstructured: formGroup.controls.remittanceInformationUnstructured.value
          },
          DebtorAccount: {
            SchemeName: formGroup.controls.debtorAccountSchemeName.value,
              Identification: formGroup.controls.debtorAccountIdentification.value,
                Name: formGroup.controls.debtorAccountName.value
          },
          RequestToPayId: formGroup.controls.requestToPayId.value
        }
      });
    });
    return domesticPaymentsArray;
  }

  createDomesticScheduledPaymentsArray(domesticScheduledPaymentFormGroups) {
    let domesticScheduledPaymentsArray = [];
    domesticScheduledPaymentFormGroups.map((formGroup) => {
      domesticScheduledPaymentsArray.push({
        Permission: {},
        Initiation: {
          InstructionIdentification: formGroup.controls.scheduledInstructionIdentification.value,
          EndToEndIdentification: formGroup.controls.scheduledEndToEndIdentification.value,
          RequestedExecutionDateTime: formGroup.controls.scheduledRequestedExecutionDateTime.value,
          LocalInstrument: formGroup.controls.scheduledLocalInstrument.value,
          InstructedAmount: {
            Amount: formGroup.controls.scheduledInstructedAmount.value,
            Currency: formGroup.controls.scheduledInstructedAmountCurrency.value
          },
          CreditorAccount: {
            SchemeName: formGroup.controls.scheduledCreditorAccountSchemeName.value,
            Identification: formGroup.controls.scheduledCreditorAccountIdentification.value,
            Name: formGroup.controls.scheduledCreditorAccountName.value,
            SecondaryIdentification: formGroup.controls.scheduledSecondaryIdentification.value
          },
          RemittanceInformation: {
            Reference: formGroup.controls.scheduledRemittanceInformationReference.value,
            Unstructured: formGroup.controls.scheduledRemittanceInformationUnstructured.value
          },
          DebtorAccount: {
            SchemeName: formGroup.controls.scheduledDebtorAccountSchemeName.value,
            Identification: formGroup.controls.scheduledDebtorAccountIdentification.value,
            Name: formGroup.controls.scheduledDebtorAccountName.value
          }
        }
      });
    });
    return domesticScheduledPaymentsArray;
  }

  openDataDetails(elementData) {
    this.dialog.open(ShowJsonDataDialog, {
      data: elementData
    });
  }
}




