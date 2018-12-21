import { AlertService } from './_services';
import { PaymentSubmissionsService } from './http/api/paymentSubmissions.service';
import { AuthorizationService } from './http/api/authorization.service';
import { PaymentSetupPOSTRequest } from './http/model/paymentSetupPOSTRequest';
import { PaymentsService } from './http/api/payments.service';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from "lodash";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  emyptyAuthorization: string = '';
  idempotencyKey: string;
  keys = Object.keys;
  paymentData: any;
  paymentForm: FormGroup;
  paymentSubmission: any;
  emptyAuthorization: string = "";
  deptorChecked: boolean = false;

  constructor(
    private _paymentsService: PaymentsService,
    private _paymentSubmissionsService: PaymentSubmissionsService,
    private _authorizationUrlService: AuthorizationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService
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
      creditorAccountSecondaryIdentification: ['0002'],
      creditorAgentIdentification: ['UBRTHUHB'],
      creditorAgentSchemeName: ['BICFI'],
      debtorAgentSchemeName: ['BICFI'],
      debtorAgentIdentification: ["KELRHUHBABC"],
      debtorAccountSchemeName: ["IBAN"],
      debtorAccountIdentification: ["HU29144000180331060700000000"],
      debtorAccountName: ["Kiss Pista"],
      debtorAccountSecondaryIdentification: ["0002"],
      remittanceInformationReference: ["FRESCO-101"],
      remittanceInformationUnstructured: ["Internal ops code 5120101"]
    });
    this.generateIdempotencyKey();
    this.checkQueryParams();
  }

  checkQueryParams() {
    const url = window.location.href;
    if (url.includes("state")) {
      const state = url.split("&")[0].split("=")[1];
      const code = url.split("&")[1].split("=")[1];
      let params = { state: state, code: code };

      this._authorizationUrlService.postAuthorizationCallback(params).subscribe(result => {
        this.paymentSubmission = result.Data;
        this.getPayment(result.Data.PaymentId);
      }, error => {
        this.alertService.error(error);
      });

      this.removeParamsFromUrl();
    }
  }

  removeParamsFromUrl() {
    window.history.pushState({}, document.title, "/" + "");
  }

  getPayment(paymentId) {
    this._paymentsService.getSingleImmediatePayment(paymentId, this.emptyAuthorization).subscribe(result => {
      this.paymentData = result.Data;
    },
      error => {
        this.alertService.error(error);
      });
  }

  generateIdempotencyKey() {
    this.idempotencyKey = this.randomString();
  }

  createPayment() {
    const paymentFormValue = this.paymentForm.value;

    const createPaymentBodyJson = this.createPaymentBody(paymentFormValue);
    this._paymentsService.createSingleImmediatePayment(this.idempotencyKey, this.emyptyAuthorization, createPaymentBodyJson)
      .subscribe(result => {
        this.redirectAuthorizationUrl(result.Data.PaymentId)
      },
        error => {
          this.alertService.error(error);
        });
  }

  createPaymentBody(paymentFormValue) {
    const body: PaymentSetupPOSTRequest = {
      Data: {
        Initiation: {
          InstructionIdentification: paymentFormValue.instructionIdentification,
          EndToEndIdentification: paymentFormValue.endToEndIdentification,
          InstructedAmount: {
            Amount: paymentFormValue.instructedAmount,
            Currency: paymentFormValue.instructedAmountCurrency
          },
          CreditorAgent: {
            SchemeName: paymentFormValue.creditorAgentSchemeName,
            Identification: paymentFormValue.creditorAgentIdentification
          },
          CreditorAccount: {
            SchemeName: paymentFormValue.creditorAccountSchemeName,
            Identification: paymentFormValue.creditorAccountIdentification,
            Name: paymentFormValue.creditorAccountName,
            SecondaryIdentification: paymentFormValue.creditorAccountSecondaryIdentification
          },
          RemittanceInformation: {
            Reference: paymentFormValue.remittanceInformationReference,
            Unstructured: paymentFormValue.remittanceInformationUnstructured
          }
        }
      },
      Risk: {}
    }
    if (this.deptorChecked) {
      body.Data.Initiation.DebtorAgent = {
        SchemeName: paymentFormValue.debtorAgentSchemeName,
        Identification: paymentFormValue.debtorAgentIdentification
      };
      body.Data.Initiation.DebtorAccount = {
        SchemeName: paymentFormValue.debtorAccountSchemeName,
        Identification: paymentFormValue.debtorAccountIdentification,
        Name: paymentFormValue.debtorAccountName,
        SecondaryIdentification: paymentFormValue.debtorAccountSecondaryIdentification
      }
    }

    let cleanedRequestBody = removeEmptyObjects(body);
    cleanedRequestBody.Risk = {};
    return cleanedRequestBody;
  }

  getPaymentSubmission(paymentSubmissionId) {
    this._paymentSubmissionsService.getPaymentSubmission(paymentSubmissionId, this.emptyAuthorization).subscribe(result => {
      this.paymentSubmission = result.Data;
    }),
      error => {
        this.alertService.error(error);
      };

  }

  redirectAuthorizationUrl(paymentId) {
    this._authorizationUrlService.getAuthorizationUrl(paymentId)
      .subscribe(
        url => {
          window.location.href = url
        },
        error => {
          this.alertService.error(error);
        });
  }

  randomString() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    let randomString = "";
    const STRING_LENGTH = 15;
    for (var x = 0; x < STRING_LENGTH; x++) {
      var i = Math.floor(Math.random() * chars.length);
      randomString += chars.charAt(i);
    }
    return randomString;
  }

  isString(value) {
    return typeof value === 'string';
  }
}

/**clean request body recursively */
function removeEmptyObjects(obj) {
  return _(obj)
    .pickBy(_.isObject) // pick objects only
    .mapValues(removeEmptyObjects) // call only for object values
    .omitBy(_.isEmpty) // remove all empty objects
    .assign(_.omitBy(obj, isObjectOrEmpty)) // assign back primitive values
    .value();
}

function isObjectOrEmpty(obj) {
  return _.isObject(obj) || _.isEmpty(obj);
}



