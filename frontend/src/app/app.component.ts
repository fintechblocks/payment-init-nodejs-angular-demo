import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AuthorizationService } from './http/api/authorization.service';
import { PaymentConsentType } from './http/model/paymentType';
import { AlertService } from './_services';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  consentId;
  savedPaymentType;
  paymentConsentTypes = PaymentConsentType;

  constructor(
    private _authorizationUrlService: AuthorizationService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private _cookieService: CookieService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        this.checkQueryParams(params);
      });
    });
  }

  checkQueryParams(queryParams) {
    if (queryParams.state) {
      let params = { state: queryParams.state, code: queryParams.code };
      this._authorizationUrlService.postAuthorizationCallback(params).subscribe(result => {
        this.consentId = result.ConsentId;
        this.savedPaymentType = this._cookieService.get("PAYMENT_TYPE");
      }, error => {
        this.alertService.error(error);
      });

      this.removeParamsFromUrl();
    } else {
      this._cookieService.delete('PAYMENT_TYPE');
    }
  }

  removeParamsFromUrl() {
    window.history.pushState({}, document.title, "/" + "");
  }
}