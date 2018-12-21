import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {_throw} from 'rxjs/observable/throw';

@Injectable()//{providedIn: 'root'}

export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  // intercept request and add token
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
        catchError(error => {
          const oldErrorMessage = error.message;
          error.message = oldErrorMessage + '. Please restart the process later';
          const err = error.message + '. Message: ' + error.error.message || error.statusText;
          return _throw(err);
        })
      )

  };


}