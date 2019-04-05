import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthorizationService } from './http/api/authorization.service';
import { PaymentConsentType } from './http/model/paymentType';
import { AlertService } from './_services';
import { LocalStorageService } from './_services/local.storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  consentId;
  savedLocalStorage;
  paymentConsentTypes = PaymentConsentType;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private _localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.checkQueryParams();
  }

  checkQueryParams() {
    const url = window.location.href;
    if (url.includes("state")) {
      const state = url.split("&")[0].split("=")[1];
      const code = url.split("&")[1].split("=")[1];
      let params = { state: state, code: code };
      this._authorizationUrlService.postAuthorizationCallback(params).subscribe(result => {
        this.consentId = result.ConsentId;
        this.savedLocalStorage = this._localStorageService.getFromLocal("PAYMENT_TYPE");
      }, error => {
        this.alertService.error(error);
      });

      this.removeParamsFromUrl();
    } else {
      this._localStorageService.removeFromLocal('PAYMENT_TYPE');
    }
  }

  removeParamsFromUrl() {
    window.history.pushState({}, document.title, "/" + "");
  }
}