import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { BASE_PATH } from '../variables';
import { environment } from './../../../environments/environment';

@Injectable()
export class AuthorizationService {
  protected basePath = `${environment.apiUrl}`;

  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (let consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  public postAuthorizationCallback(body: any): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error('Required parameter body was null or undefined when calling postAuthorizationCallback.');
    }

    let headers = this.defaultHeaders;

    // authentication (TPPOAuth2Security) required
    if (this.configuration.accessToken) {
      let accessToken = typeof this.configuration.accessToken === 'function'
        ? this.configuration.accessToken()
        : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
      'application/json; charset=utf-8'
    ];
    let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [
      'application/json; charset=utf-8'
    ];
    let httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set("Content-Type", httpContentTypeSelected);
    }

    let observe: any = 'body';
    let reportProgress: boolean = false;
    return this.httpClient.post<any>(`${this.basePath}/authorization-callback`,
      body,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress
      }
    );
  }


  public getAuthorizationUrl(ConsentId): Observable<any> {

    let headers = this.defaultHeaders;
    let queryParameters = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
    if (ConsentId !== undefined) {
      queryParameters = queryParameters.set('ConsentId', ConsentId);
  }
    // authentication (PSUOAuth2Security) required
    if (this.configuration.accessToken) {
      let accessToken = typeof this.configuration.accessToken === 'function'
        ? this.configuration.accessToken()
        : this.configuration.accessToken;
      headers = headers.set('Authorization', 'Bearer ' + accessToken);
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json; charset=utf-8'];
    let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set("Accept", httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    let consumes: string[] = [];

    return this.httpClient.get<any>(`${this.basePath}/authorization-url`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,        
        headers: headers
      }
    );
  }
}

