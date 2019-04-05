import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { OBWriteDomesticStandingOrder2, OBWriteDomesticStandingOrderConsent2 } from '../../http';
import { AuthorizationService } from '../../http/api/authorization.service';
import { AlertService, HelpersService, LocalStorageService  } from '../../_services';
import { DomesticStandingOrdersService } from './../../http/api/domesticStandingOrders.service';
import { PaymentConsentType } from './../../http/model/paymentType';
import { ShowJsonDataDialog } from './../dialogs/show.json.data.dialog';

@Component({
  selector: 'domestic-standing-order-component',
  templateUrl: './domestic.standing.order.html',
  styleUrls: ['../../app.component.css']
})
export class DomesticStandingOrderComponent implements OnInit {
  @Input() consent_id: string;

  emyptyAuthorization: string = '';
  keys = Object.keys;
  paymentForm: FormGroup;
  emptyAuthorization: string = "";
  consentDeptorChecked: boolean = false;
  deptorChecked: boolean = false;
  domesticPaymentPaymentId;

  domesticPaymentConsentDataSource;
  domesticPaymentConsentDisplayedColumns: string[] = ['status', 'firstPaymentDateTime', 'finalPaymentDateTime', 'arrow'];
  @ViewChild(MatPaginator) domesticPaymentConsentPaginator: MatPaginator;
  isEmptyPaymentConsent;

  domesticPaymentDataSource;
  domesticPaymentDisplayedColumns: string[] = ['status', 'firstPaymentDateTime', 'finalPaymentDateTime', 'arrow'];
  @ViewChild(MatPaginator) domesticPaymentPaginator: MatPaginator;
  isEmptyPayment;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _domesticStandingOrdersService: DomesticStandingOrdersService,
    public dialog: MatDialog,
    private _localStorageService: LocalStorageService,
    private _helpersService: HelpersService
  ) { }

  ngOnInit() {
    this.paymentForm = this.formBuilder.group({
      initiationFrequency: ['EvryDay'],
      initiationReference: ['Pocket money for Damien'],
      firstPaymentDateTime: ['1976-06-06T06:06:06+00:00'],
      firstPaymentAmount: ['6.66'],
      firstPaymentCurrency: ['HUF'],
      creditorAccountSchemeName: ['IBAN'],
      creditorAccountIdentification: ['HU23103000029321814060584399'],
      creditorAccountName: ['Bob Clements'],
      recurringPaymentFirstPaymentAmount: ['7.00'],
      recurringPaymentFirstPaymentCurrency: ['HUF'],
      finalPaymentDateTime: ['2020-03-20T06:06:06+00:00'],
      finalPaymentAmount: ['7.00'],
      finalPaymentCurrency: ['HUF'],
      debtorAccountSchemeName: ["IBAN"],
      debtorAccountIdentification: ["HU23103000029321814060584399"],
      debtorAccountName: ["Kiss Pista"]
    });
  }

  createPaymentConsent() {
    const idempotencyKey = this._helpersService.generateIdempotencyKey();
    const paymentFormValue = this.paymentForm.value;
    const createPaymentConsentBodyJson: OBWriteDomesticStandingOrderConsent2 = this.createPaymentBody(paymentFormValue);
    this._domesticStandingOrdersService.createDomesticStandingOrderConsents(createPaymentConsentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this._localStorageService.saveInLocal('PAYMENT_TYPE', PaymentConsentType['DOMESTIC_STANDING_ORDER_CONSENT']);

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
    this._domesticStandingOrdersService.getDomesticStandingOrderConsentsConsentId(consentId, this.emptyAuthorization).subscribe(result => {
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
    const createPaymentBodyJson: OBWriteDomesticStandingOrder2 = this.createPaymentBody(paymentFormValue, consentId.trim());
    this._domesticStandingOrdersService.createDomesticStandingOrders(createPaymentBodyJson, this.emyptyAuthorization, idempotencyKey)
      .subscribe(result => {
        this.domesticPaymentPaymentId = result.Data.DomesticStandingOrderId;
      },
        error => {
          this.alertService.error(error);
        });
  }

  getPayment(paymentId) {
    this._domesticStandingOrdersService.getDomesticStandingOrdersDomesticStandingOrderId(paymentId, this.emptyAuthorization).subscribe(result => {
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
        Permission: "Create",
        Initiation: {
          Frequency: paymentFormValue.initiationFrequency,
          Reference: paymentFormValue.initiationReference,
          FirstPaymentDateTime: paymentFormValue.firstPaymentDateTime,
          FirstPaymentAmount: {
            Amount: paymentFormValue.firstPaymentAmount,
            Currency: paymentFormValue.firstPaymentCurrency
          },
          RecurringPaymentAmount: {
            Amount: paymentFormValue.recurringPaymentFirstPaymentAmount,
            Currency: paymentFormValue.recurringPaymentFirstPaymentCurrency
          },
          FinalPaymentDateTime: paymentFormValue.finalPaymentDateTime,
          FinalPaymentAmount: {
            Amount: paymentFormValue.finalPaymentAmount,
            Currency: paymentFormValue.finalPaymentCurrency
          },
          CreditorAccount: {
            SchemeName: paymentFormValue.creditorAccountSchemeName,
            Identification: paymentFormValue.creditorAccountIdentification,
            Name: paymentFormValue.creditorAccountName
          },
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
    const requestBody = JSON.parse(JSON.stringify(cleanedRequestBody));
    return requestBody;
  }

  openDataDetails(elementData) {
    this.dialog.open(ShowJsonDataDialog, {
      data: elementData
    });
  }
}