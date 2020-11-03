import { CookieService } from 'ngx-cookie-service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { OBWriteBatchInternationalConsent2 } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { BatchInternationalPaymentsService } from '../../http/api/batchInternationalPayments.service';
import { AlertService, HelpersService } from '../../_services';
import { ShowJsonDataDialog } from '../dialogs/show.json.data.dialog';
import { PaymentConsentType } from './../../http/model/paymentType';

@Component({
  selector: 'batch-international-payments-component',
  templateUrl: './batch.international.payment.html',
  styleUrls: ['../../app.component.css']
})
export class BatchInternationalPaymentsComponent implements OnInit {
  @Input() consent_id: string;

  emyptyAuthorization: string = '';
  keys = Object.keys;
  internationalPaymentForm: FormGroup;
  internationalScheduledPaymentForm: FormGroup;
  emptyAuthorization: string = "";
  batchInternationalPaymentId;

  internationalPaymentConsentDataSource;
  internationalPaymentConsentDisplayedColumns: string[] = ['status', 'statusUpdateDateTime', 'creationDateTime', 'arrow'];
  @ViewChild('batchInternationalPaymentConsentPaginator') internationalPaymentConsentPaginator: MatPaginator;
  isEmptyPaymentConsent;

  internationalPaymentDataSource;
  internationalPaymentDisplayedColumns: string[] = ['status', 'statusUpdateDateTime', 'creationDateTime', 'arrow'];
  @ViewChild('batchInternationalPaymentPaginator') internationalPaymentPaginator: MatPaginator;
  isEmptyPayment;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _batchInternationalPaymentsService: BatchInternationalPaymentsService,
    public dialog: MatDialog,
    private _cookieService: CookieService,
    private _helpersService: HelpersService
  ) { }

  ngOnInit() {
    this.internationalPaymentForm = this.formBuilder.group({
      internationalPayments: this.formBuilder.array([this.createInternationalPaymentGroup()])
    });
    
    this.internationalScheduledPaymentForm = this.formBuilder.group({
      internationalScheduledPayments: this.formBuilder.array([this.createInternationalScheduledPaymentGroup()])
    });
  }

  get internationalPayments() { 
    return <FormArray>this.internationalPaymentForm.get('internationalPayments'); 
  }

  get internationalScheduledPayments() {
    return <FormArray>this.internationalScheduledPaymentForm.get('internationalScheduledPayments'); 
  }

  addAddressLine(index: number):void {
    const addressLine = <FormArray>this.internationalPayments.controls[index].get('creditorPostalAddress').get('creditorAddressLine')
    if (addressLine.length < 7) {
      addressLine.push(this.formBuilder.control(""));
    }
  }

  scheduledAddAddressLine(index: number):void {
    const addressLine = <FormArray>this.internationalScheduledPayments.controls[index].get('scheduledCreditorPostalAddress').get('scheduledCreditorAddressLine')
    if (addressLine.length < 7) {
      addressLine.push(this.formBuilder.control(""));
    }
  }

  createInternationalPaymentGroup(): FormGroup {
    return this.formBuilder.group({
      instructedAmountCurrency: ['HUF'],
      instructedAmount: ['100000.00'],
      instructionIdentification: ['mobilVallet123'],
      endToEndIdentification: ['29152852756654'],
      creditorAccountSchemeName: ['IBAN'],
      creditorAccountIdentification: ['DE89370400440532013000'],
      creditorAccountName: ['ACME Inc'],
      secondaryIdentification: ['0002'],
      debtorAccountSchemeName: ["BBAN"],
      debtorAccountIdentification: ["141002132044784901000009"],
      debtorAccountName: ["Kiss Pista"],
      remittanceInformationReference: ["FRESCO-101"],
      remittanceInformationUnstructured: ["Internal ops code 5120101"],
      currencyOfTransfer: ["USD"],
      unitCurrency: ["GBP"],
      rateType: ["Actual"],
      localInstrument: [""],
      chargeBearer: ["Shared"],
      creditorName: ["CRENM"],
      creditorPostalAddress: this.formBuilder.group({
        creditorAddressLine: this.formBuilder.array(["Kis utca 13"])
      }),
      creditorAgentName: ["BANK_NAME"],
      creditorAgentIdentification: ["BANKSWIFTCODE"]
    });
  }

  addInternationalPaymentToArray(): void {
    this.internationalPayments.push(this.createInternationalPaymentGroup());
  }

  deleteInternationalPaymentFromArray(index: number): void {
    if(this.internationalPayments.length > 1) {
      this.internationalPayments.removeAt(index);
    }
  }

  createInternationalScheduledPaymentGroup(): FormGroup {
    return this.formBuilder.group({
      scheduledInstructedAmountCurrency: ['HUF'],
      scheduledInstructedAmount: ['100000.00'],
      scheduledInstructionIdentification: ['mobilVallet123'],
      scheduledEndToEndIdentification: ['29152852756654'],
      scheduledRequestedExecutionDateTime: ['2020-08-06T00:00:00+00:00'],
      scheduledCreditorAccountSchemeName: ['IBAN'],
      scheduledCreditorAccountIdentification: ['DE89370400440532013000'],
      scheduledCreditorAccountName: ['ACME Inc'],
      scheduledSecondaryIdentification: ['0002'],
      scheduledDebtorAccountSchemeName: ["BBAN"],
      scheduledDebtorAccountIdentification: ["141002132044784901000009"],
      scheduledDebtorAccountName: ["Kiss Pista"],
      scheduledRemittanceInformationReference: ["FRESCO-101"],
      scheduledRemittanceInformationUnstructured: ["Internal ops code 5120101"],
      scheduledCurrencyOfTransfer: ["USD"],
      scheduledUnitCurrency: ["GBP"],
      scheduledRateType: ["Actual"],
      scheduledLocalInstrument: [""],
      scheduledChargeBearer: ["Shared"],
      scheduledCreditorName: ["CRENM"],
      scheduledCreditorPostalAddress: this.formBuilder.group({
        scheduledCreditorAddressLine: this.formBuilder.array(["Kis utca 13"])
      }),
      scheduledCreditorAgentName: ["BANK_NAME"],
      scheduledCreditorAgentIdentification: ["BANKSWIFTCODE"]
    });
  }

  addInternationalScheduledPaymentToArray(): void {
    this.internationalScheduledPayments.push(this.createInternationalScheduledPaymentGroup());
  }

  deleteInternationalScheduledPaymentFromArray(index: number): void {
    if(this.internationalScheduledPayments.length > 1) {
      this.internationalScheduledPayments.removeAt(index);
    }
  }

  createPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const internationalPaymentFormGroups = this.internationalPayments.controls;
    const internationalScheduledPaymentFormGroups = this.internationalScheduledPayments.controls;
    const createPaymentConsentBodyJson: OBWriteBatchInternationalConsent2 = this.createPaymentBody(internationalPaymentFormGroups, internationalScheduledPaymentFormGroups);
    this._batchInternationalPaymentsService.createBatchInternationalPaymentConsents(createPaymentConsentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this._cookieService.set('PAYMENT_TYPE', PaymentConsentType.BATCH_INTERNATIONAL_PAYMENT_CONSENT);
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
    this._batchInternationalPaymentsService.getBatchInternationalPaymentConsentsConsentId(consentId, this.emptyAuthorization).subscribe(result => {
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

  createPayment(consentId) {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const internationalPaymentFormGroups = this.internationalPayments.controls;
    const internationalScheduledPaymentFormGroups = this.internationalScheduledPayments.controls;
    const createPaymentBodyJson = this.createPaymentBody(internationalPaymentFormGroups, internationalScheduledPaymentFormGroups, consentId.trim());
    this._batchInternationalPaymentsService.createBatchInternationalPayments(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.batchInternationalPaymentId = result.Data['BatchInternationalPaymentId'];
      },
        error => {
          this.alertService.error(error);
        });
  }

  getPayment(paymentId) {
    this._batchInternationalPaymentsService.getBatchInternationalPaymentsInternationalPaymentId(paymentId, this.emptyAuthorization).subscribe(result => {
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

  createPaymentBody(internationalPaymentFormGroups, internationalScheduledPaymentFormGroups, consentId?) {
    const internationalPayments: Array<any> = this.createInternationalPaymentsArray(internationalPaymentFormGroups);
    const internationalScheduledPayments: Array<any> = this.createInternationalScheduledPaymentsArray(internationalScheduledPaymentFormGroups);

    const body = {
      Data: {
        ConsentId: {},
        InternationalPayments: internationalPayments,
        InternationalScheduledPayments: internationalScheduledPayments
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
      cleanedRequestBody.Data.InternationalPayments = [];
      cleanedRequestBody.Data.InternationalScheduledPayments = [];
    } else {
      cleanedRequestBody.Data.InternationalPayments = cleanedRequestBody.Data.InternationalPayments ? cleanedRequestBody.Data.InternationalPayments : [];
      cleanedRequestBody.Data.InternationalScheduledPayments = cleanedRequestBody.Data.InternationalScheduledPayments ? cleanedRequestBody.Data.InternationalScheduledPayments : [];
    }

    const requestBody = JSON.parse(JSON.stringify(cleanedRequestBody));
    return requestBody;
  }

  createInternationalPaymentsArray(formGroup) {
    let internationalPaymentsArray = [];
    formGroup.map(formGroup => {
      internationalPaymentsArray.push(
        {
          Initiation: {
            ChargeBearer: formGroup.controls.chargeBearer.value,
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
              SecondaryIdentification: formGroup.controls.secondaryIdentification.value
            },
            CreditorAgent: {
              Identification: formGroup.controls.creditorAgentIdentification.value,
              Name: formGroup.controls.creditorAgentName.value
            },
            Creditor: {
              Name: formGroup.controls.creditorName.value,
              PostalAddress: {
                AddressLine: formGroup.controls.creditorPostalAddress.controls.creditorAddressLine.value
              }
            },
            RemittanceInformation: {
              Reference: formGroup.controls.remittanceInformationReference.value,
              Unstructured: formGroup.controls.remittanceInformationUnstructured.value
            },
            ExchangeRateInformation: {
              UnitCurrency: formGroup.controls.unitCurrency.value,
              RateType: formGroup.controls.rateType.value
            },
            CurrencyOfTransfer: formGroup.controls.currencyOfTransfer.value,
            DebtorAccount: {
              SchemeName: formGroup.controls.debtorAccountSchemeName.value,
              Identification: formGroup.controls.debtorAccountIdentification.value,
              Name: formGroup.controls.debtorAccountName.value
            }
          }
        }
      );
    });
    
    return internationalPaymentsArray;
  }

  createInternationalScheduledPaymentsArray(formGroup) {
    let internationalScheduledPaymentsArray = [];
    formGroup.map(formGroup => {
      internationalScheduledPaymentsArray.push(
        {
          Permission: {},
          Initiation: {
            ChargeBearer: formGroup.controls.scheduledChargeBearer.value,
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
            CreditorAgent: {
              Identification: formGroup.controls.scheduledCreditorAgentIdentification.value,
              Name: formGroup.controls.scheduledCreditorAgentName.value
            },
            Creditor: {
              Name: formGroup.controls.scheduledCreditorName.value,
              PostalAddress: {
                AddressLine: formGroup.controls.scheduledCreditorPostalAddress.controls.scheduledCreditorAddressLine.value
              }
            },
            RemittanceInformation: {
              Reference: formGroup.controls.scheduledRemittanceInformationReference.value,
              Unstructured: formGroup.controls.scheduledRemittanceInformationUnstructured.value
            },
            ExchangeRateInformation: {
              UnitCurrency: formGroup.controls.scheduledUnitCurrency.value,
              RateType: formGroup.controls.scheduledRateType.value
            },
            CurrencyOfTransfer: formGroup.controls.scheduledCurrencyOfTransfer.value,
            DebtorAccount: {
              SchemeName: formGroup.controls.scheduledDebtorAccountSchemeName.value,
              Identification: formGroup.controls.scheduledDebtorAccountIdentification.value,
              Name: formGroup.controls.scheduledDebtorAccountName.value
            }
          }
        }
      );
    });

    return internationalScheduledPaymentsArray;
  }

  openDataDetails(elementData) {
    this.dialog.open(ShowJsonDataDialog, {
      data: elementData
    });
  }
}