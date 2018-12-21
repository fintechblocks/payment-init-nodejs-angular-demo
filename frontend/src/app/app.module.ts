import { AlertComponent } from './_directives';
import { AlertService } from './_services';
import { ErrorInterceptor } from './_helpers';
import { AuthorizationService } from './http/api/authorization.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatCardModule, MatCheckboxModule } from '@angular/material';
import { AppComponent } from './app.component';
import { ApiModule } from './http/api.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,    
    AlertComponent
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
    ReactiveFormsModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    AlertService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
