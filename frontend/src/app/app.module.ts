import { HelpersService } from './_services/helpers.service';
import { InternationalScheduledPaymentsComponent } from './controllers/international-scheduled-payment/international.scheduled.payments';
import { BatchInternationalPaymentsComponent } from './controllers/batch-international-payments/batch.international.payments';
import { InternationalPaymentsComponent } from './controllers/international-payments/international.payments';
import { BatchDomesticPaymentsComponent } from './controllers/batch-domestic-payments/batch.domestic.payments';
import { DomesticStandingOrderComponent } from './controllers/domestic-standing-order/domestic.standing.order';
import { DomesticScheduledPaymentsComponent } from './controllers/domestic-scheduled-payment/domestic.scheduled.payments';
import { DomesticPaymentsComponent } from './controllers/domestic-payments/domestic.payments';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatInputModule, MatPaginatorModule, MatTableModule, MatExpansionModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ApiModule } from './http/api.module';
import { AuthorizationService } from './http/api/authorization.service';
import { AlertComponent } from './_directives';
import { ErrorInterceptor } from './_helpers';
import { ExampleService } from './_helpers/example/example.service';
import { AlertService } from './_services';
import { ShowJsonDataDialog } from './controllers/dialogs/show.json.data.dialog';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    ShowJsonDataDialog,
    DomesticPaymentsComponent,
    DomesticScheduledPaymentsComponent,
    DomesticStandingOrderComponent,
    BatchDomesticPaymentsComponent,
    InternationalPaymentsComponent,
    BatchInternationalPaymentsComponent,
    InternationalScheduledPaymentsComponent
  ],
  imports: [
    BrowserModule,
    ApiModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatTableModule, 
    MatExpansionModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    AlertService,
    AuthorizationService,
    ExampleService,
    HelpersService, 
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [
    ShowJsonDataDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
