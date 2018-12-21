/**
 * Payment Initiation API Specification
 * Swagger for Payment Initiation API Specification
 *
 * OpenAPI spec version: v1.1.1
 * Contact: ServiceDesk@openbanking.org.uk
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs/Observable';

import { ErrorResponse } from '../model/errorResponse';
import { PaymentSubmissionPOSTRequest } from '../model/paymentSubmissionPOSTRequest';
import { PaymentSubmitGETResponse } from '../model/paymentSubmitGETResponse';
import { PaymentSubmitPOST201Response } from '../model/paymentSubmitPOST201Response';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

import { environment } from './../../../environments/environment';

@Injectable()
export class PaymentSubmissionsService {

    protected basePath = `${environment.apiUrl}/open-banking/v1.1`;
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
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


    /**
     * Create a payment submission
     * Submit a previously setup payment
     * @param x_idempotency_key Every request will be processed only once per x-idempotency-key.  The Idempotency Key will be valid for 24 hours.
     * @param Authorization An Authorisation Token as per https://tools.ietf.org/html/rfc6750
     * @param body Setup a single immediate payment
     * @param x_fapi_financial_id The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.
     * @param x_fapi_customer_last_logged_time The time when the PSU last logged in with the TPP.  All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below:  Sun, 10 Sep 2017 19:43:31 UTC
     * @param x_fapi_customer_ip_address The PSU&#39;s IP address if the PSU is currently logged in with the TPP.
     * @param x_fapi_interaction_id An RFC4122 UID used as a correlation id.
     * @param x_jws_signature DO NOT USE. Header containing a detached JWS signature of the body of the payload.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createPaymentSubmission(x_idempotency_key: string, Authorization: string, body: PaymentSubmissionPOSTRequest, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, observe?: 'body', reportProgress?: boolean): Observable<PaymentSubmitPOST201Response>;
    public createPaymentSubmission(x_idempotency_key: string, Authorization: string, body: PaymentSubmissionPOSTRequest, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PaymentSubmitPOST201Response>>;
    public createPaymentSubmission(x_idempotency_key: string, Authorization: string, body: PaymentSubmissionPOSTRequest, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PaymentSubmitPOST201Response>>;
    public createPaymentSubmission(x_idempotency_key: string, Authorization: string, body: PaymentSubmissionPOSTRequest, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (x_idempotency_key === null || x_idempotency_key === undefined) {
            throw new Error('Required parameter x_idempotency_key was null or undefined when calling createPaymentSubmission.');
        }
        if (Authorization === null || Authorization === undefined) {
            throw new Error('Required parameter Authorization was null or undefined when calling createPaymentSubmission.');
        }
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling createPaymentSubmission.');
        }

        let headers = this.defaultHeaders;
        if (x_idempotency_key !== undefined && x_idempotency_key !== null) {
            headers = headers.set('x-idempotency-key', String(x_idempotency_key));
        }
        if (x_fapi_financial_id !== undefined && x_fapi_financial_id !== null) {
            headers = headers.set('x-fapi-financial-id', String(x_fapi_financial_id));
        }
        if (x_fapi_customer_last_logged_time !== undefined && x_fapi_customer_last_logged_time !== null) {
            headers = headers.set('x-fapi-customer-last-logged-time', String(x_fapi_customer_last_logged_time));
        }
        if (x_fapi_customer_ip_address !== undefined && x_fapi_customer_ip_address !== null) {
            headers = headers.set('x-fapi-customer-ip-address', String(x_fapi_customer_ip_address));
        }
        if (x_fapi_interaction_id !== undefined && x_fapi_interaction_id !== null) {
            headers = headers.set('x-fapi-interaction-id', String(x_fapi_interaction_id));
        }
        if (Authorization !== undefined && Authorization !== null) {
            headers = headers.set('Authorization', String(Authorization));
        }
        if (x_jws_signature !== undefined && x_jws_signature !== null) {
            headers = headers.set('x-jws-signature', String(x_jws_signature));
        }

        // authentication (PSUOAuth2Security) required
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
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.post<PaymentSubmitPOST201Response>(`${this.basePath}/payment-submissions`,
            body,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get a payment submission
     * Get payment submission
     * @param PaymentSubmissionId Unique identification as assigned by the ASPSP to uniquely identify the payment submission resource.
     * @param Authorization An Authorisation Token as per https://tools.ietf.org/html/rfc6750
     * @param x_fapi_financial_id The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.
     * @param x_fapi_customer_last_logged_time The time when the PSU last logged in with the TPP.  All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below:  Sun, 10 Sep 2017 19:43:31 UTC
     * @param x_fapi_customer_ip_address The PSU&#39;s IP address if the PSU is currently logged in with the TPP.
     * @param x_fapi_interaction_id An RFC4122 UID used as a correlation id.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPaymentSubmission(PaymentSubmissionId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, observe?: 'body', reportProgress?: boolean): Observable<PaymentSubmitGETResponse>;
    public getPaymentSubmission(PaymentSubmissionId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PaymentSubmitGETResponse>>;
    public getPaymentSubmission(PaymentSubmissionId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PaymentSubmitGETResponse>>;
    public getPaymentSubmission(PaymentSubmissionId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (PaymentSubmissionId === null || PaymentSubmissionId === undefined) {
            throw new Error('Required parameter PaymentSubmissionId was null or undefined when calling getPaymentSubmission.');
        }
        if (Authorization === null || Authorization === undefined) {
            throw new Error('Required parameter Authorization was null or undefined when calling getPaymentSubmission.');
        }

        let headers = this.defaultHeaders;
        if (x_fapi_financial_id !== undefined && x_fapi_financial_id !== null) {
            headers = headers.set('x-fapi-financial-id', String(x_fapi_financial_id));
        }
        if (x_fapi_customer_last_logged_time !== undefined && x_fapi_customer_last_logged_time !== null) {
            headers = headers.set('x-fapi-customer-last-logged-time', String(x_fapi_customer_last_logged_time));
        }
        if (x_fapi_customer_ip_address !== undefined && x_fapi_customer_ip_address !== null) {
            headers = headers.set('x-fapi-customer-ip-address', String(x_fapi_customer_ip_address));
        }
        if (x_fapi_interaction_id !== undefined && x_fapi_interaction_id !== null) {
            headers = headers.set('x-fapi-interaction-id', String(x_fapi_interaction_id));
        }
        if (Authorization !== undefined && Authorization !== null) {
            headers = headers.set('Authorization', String(Authorization));
        }

        // authentication (PSUOAuth2Security) required
        if (this.configuration.accessToken) {
            let accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

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
        ];

        return this.httpClient.get<PaymentSubmitGETResponse>(`${this.basePath}/payment-submissions/${encodeURIComponent(String(PaymentSubmissionId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
