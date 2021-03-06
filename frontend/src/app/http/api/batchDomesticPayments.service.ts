/**
 * Payment Initiation API
 * Swagger for Payment Initiation API Specification
 *
 * OpenAPI spec version: v3.1.0
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

import { OBErrorResponse1 } from '../model/oBErrorResponse1';
import { OBWriteBatchDomestic2 } from '../model/oBWriteBatchDomestic2';
import { OBWriteBatchDomesticConsent2 } from '../model/oBWriteBatchDomesticConsent2';
import { OBWriteBatchDomesticConsentResponse2 } from '../model/oBWriteBatchDomesticConsentResponse2';
import { OBWriteBatchDomesticResponse2 } from '../model/oBWriteBatchDomesticResponse2';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';

import { environment } from './../../../environments/environment';

@Injectable()
export class BatchDomesticPaymentsService {

    protected basePath = environment.apiUrl+ '/open-banking/v3.1/pisp';
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
     * Create Batch Domestic Payment Consents
     * 
     * @param OBWriteBatchDomesticConsent2Param Default
     * @param Authorization An Authorisation Token as per https://tools.ietf.org/html/rfc6750
     * @param x_idempotency_key Every request will be processed only once per x-idempotency-key.  The Idempotency Key will be valid for 24 hours.
     * @param x_fapi_financial_id The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.
     * @param x_fapi_customer_last_logged_time The time when the PSU last logged in with the TPP. All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: Sun, 10 Sep 2017 19:43:31 UTC
     * @param x_fapi_customer_ip_address The PSU&#39;s IP address if the PSU is currently logged in with the TPP.
     * @param x_fapi_interaction_id An RFC4122 UID used as a correlation id.
     * @param x_jws_signature A detached JWS signature of the body of the payload.
     * @param x_customer_user_agent Indicates the user-agent that the PSU is using.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createBatchDomesticPaymentConsents(OBWriteBatchDomesticConsent2Param: OBWriteBatchDomesticConsent2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe?: 'body', reportProgress?: boolean): Observable<OBWriteBatchDomesticConsentResponse2>;
    public createBatchDomesticPaymentConsents(OBWriteBatchDomesticConsent2Param: OBWriteBatchDomesticConsent2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<OBWriteBatchDomesticConsentResponse2>>;
    public createBatchDomesticPaymentConsents(OBWriteBatchDomesticConsent2Param: OBWriteBatchDomesticConsent2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<OBWriteBatchDomesticConsentResponse2>>;
    public createBatchDomesticPaymentConsents(OBWriteBatchDomesticConsent2Param: OBWriteBatchDomesticConsent2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (OBWriteBatchDomesticConsent2Param === null || OBWriteBatchDomesticConsent2Param === undefined) {
            throw new Error('Required parameter OBWriteBatchDomesticConsent2Param was null or undefined when calling createBatchDomesticPaymentConsents.');
        }
        if (Authorization === null || Authorization === undefined) {
            throw new Error('Required parameter Authorization was null or undefined when calling createBatchDomesticPaymentConsents.');
        }
        if (x_idempotency_key === null || x_idempotency_key === undefined) {
            throw new Error('Required parameter x_idempotency_key was null or undefined when calling createBatchDomesticPaymentConsents.');
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
        if (x_idempotency_key !== undefined && x_idempotency_key !== null) {
            headers = headers.set('x-idempotency-key', String(x_idempotency_key));
        }
        if (x_jws_signature !== undefined && x_jws_signature !== null) {
            headers = headers.set('x-jws-signature', String(x_jws_signature));
        }
        if (x_customer_user_agent !== undefined && x_customer_user_agent !== null) {
            headers = headers.set('x-customer-user-agent', String(x_customer_user_agent));
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
            'application/json; charset=utf-8'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.post<OBWriteBatchDomesticConsentResponse2>(`${this.basePath}/batch-domestic-payment-consents`,
            OBWriteBatchDomesticConsent2Param,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Create Batch Domestic Payments
     * 
     * @param OBWriteBatchDomestic2Param Default
     * @param Authorization An Authorisation Token as per https://tools.ietf.org/html/rfc6750
     * @param x_idempotency_key Every request will be processed only once per x-idempotency-key.  The Idempotency Key will be valid for 24 hours.
     * @param x_fapi_financial_id The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.
     * @param x_fapi_customer_last_logged_time The time when the PSU last logged in with the TPP. All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: Sun, 10 Sep 2017 19:43:31 UTC
     * @param x_fapi_customer_ip_address The PSU&#39;s IP address if the PSU is currently logged in with the TPP.
     * @param x_fapi_interaction_id An RFC4122 UID used as a correlation id.
     * @param x_jws_signature A detached JWS signature of the body of the payload.
     * @param x_customer_user_agent Indicates the user-agent that the PSU is using.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createBatchDomesticPayments(OBWriteBatchDomestic2Param: OBWriteBatchDomestic2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe?: 'body', reportProgress?: boolean): Observable<OBWriteBatchDomesticResponse2>;
    public createBatchDomesticPayments(OBWriteBatchDomestic2Param: OBWriteBatchDomestic2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<OBWriteBatchDomesticResponse2>>;
    public createBatchDomesticPayments(OBWriteBatchDomestic2Param: OBWriteBatchDomestic2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<OBWriteBatchDomesticResponse2>>;
    public createBatchDomesticPayments(OBWriteBatchDomestic2Param: OBWriteBatchDomestic2, Authorization: string, x_idempotency_key: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_jws_signature?: string, x_customer_user_agent?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (OBWriteBatchDomestic2Param === null || OBWriteBatchDomestic2Param === undefined) {
            throw new Error('Required parameter OBWriteBatchDomestic2Param was null or undefined when calling createBatchDomesticPayments.');
        }
        if (Authorization === null || Authorization === undefined) {
            throw new Error('Required parameter Authorization was null or undefined when calling createBatchDomesticPayments.');
        }
        if (x_idempotency_key === null || x_idempotency_key === undefined) {
            throw new Error('Required parameter x_idempotency_key was null or undefined when calling createBatchDomesticPayments.');
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
        if (x_idempotency_key !== undefined && x_idempotency_key !== null) {
            headers = headers.set('x-idempotency-key', String(x_idempotency_key));
        }
        if (x_jws_signature !== undefined && x_jws_signature !== null) {
            headers = headers.set('x-jws-signature', String(x_jws_signature));
        }
        if (x_customer_user_agent !== undefined && x_customer_user_agent !== null) {
            headers = headers.set('x-customer-user-agent', String(x_customer_user_agent));
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

        return this.httpClient.post<OBWriteBatchDomesticResponse2>(`${this.basePath}/batch-domestic-payments`,
            OBWriteBatchDomestic2Param,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Batch Domestic Payment Consent
     * 
     * @param ConsentId ConsentId
     * @param Authorization An Authorisation Token as per https://tools.ietf.org/html/rfc6750
     * @param x_fapi_financial_id The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.
     * @param x_fapi_customer_last_logged_time The time when the PSU last logged in with the TPP. All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: Sun, 10 Sep 2017 19:43:31 UTC
     * @param x_fapi_customer_ip_address The PSU&#39;s IP address if the PSU is currently logged in with the TPP.
     * @param x_fapi_interaction_id An RFC4122 UID used as a correlation id.
     * @param x_customer_user_agent Indicates the user-agent that the PSU is using.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getBatchDomesticPaymentConsentsConsentId(ConsentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe?: 'body', reportProgress?: boolean): Observable<OBWriteBatchDomesticConsentResponse2>;
    public getBatchDomesticPaymentConsentsConsentId(ConsentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<OBWriteBatchDomesticConsentResponse2>>;
    public getBatchDomesticPaymentConsentsConsentId(ConsentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<OBWriteBatchDomesticConsentResponse2>>;
    public getBatchDomesticPaymentConsentsConsentId(ConsentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (ConsentId === null || ConsentId === undefined) {
            throw new Error('Required parameter ConsentId was null or undefined when calling getBatchDomesticPaymentConsentsConsentId.');
        }
        if (Authorization === null || Authorization === undefined) {
            throw new Error('Required parameter Authorization was null or undefined when calling getBatchDomesticPaymentConsentsConsentId.');
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
        if (x_customer_user_agent !== undefined && x_customer_user_agent !== null) {
            headers = headers.set('x-customer-user-agent', String(x_customer_user_agent));
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
            'application/json; charset=utf-8'
        ];

        return this.httpClient.get<OBWriteBatchDomesticConsentResponse2>(`${this.basePath}/batch-domestic-payment-consents/${encodeURIComponent(String(ConsentId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Batch Domestic Payment
     * 
     * @param BatchDomesticPaymentId BatchDomesticPaymentId
     * @param Authorization An Authorisation Token as per https://tools.ietf.org/html/rfc6750
     * @param x_fapi_financial_id The unique id of the ASPSP to which the request is issued. The unique id will be issued by OB.
     * @param x_fapi_customer_last_logged_time The time when the PSU last logged in with the TPP. All dates in the HTTP headers are represented as RFC 7231 Full Dates. An example is below: Sun, 10 Sep 2017 19:43:31 UTC
     * @param x_fapi_customer_ip_address The PSU&#39;s IP address if the PSU is currently logged in with the TPP.
     * @param x_fapi_interaction_id An RFC4122 UID used as a correlation id.
     * @param x_customer_user_agent Indicates the user-agent that the PSU is using.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getBatchDomesticPaymentsDomesticPaymentId(BatchDomesticPaymentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe?: 'body', reportProgress?: boolean): Observable<OBWriteBatchDomesticResponse2>;
    public getBatchDomesticPaymentsDomesticPaymentId(BatchDomesticPaymentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<OBWriteBatchDomesticResponse2>>;
    public getBatchDomesticPaymentsDomesticPaymentId(BatchDomesticPaymentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<OBWriteBatchDomesticResponse2>>;
    public getBatchDomesticPaymentsDomesticPaymentId(BatchDomesticPaymentId: string, Authorization: string, x_fapi_financial_id?: string, x_fapi_customer_last_logged_time?: string, x_fapi_customer_ip_address?: string, x_fapi_interaction_id?: string, x_customer_user_agent?: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (BatchDomesticPaymentId === null || BatchDomesticPaymentId === undefined) {
            throw new Error('Required parameter BatchDomesticPaymentId was null or undefined when calling getBatchDomesticPaymentsDomesticPaymentId.');
        }
        if (Authorization === null || Authorization === undefined) {
            throw new Error('Required parameter Authorization was null or undefined when calling getBatchDomesticPaymentsDomesticPaymentId.');
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
        if (x_customer_user_agent !== undefined && x_customer_user_agent !== null) {
            headers = headers.set('x-customer-user-agent', String(x_customer_user_agent));
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
            'application/json; charset=utf-8'
        ];

        return this.httpClient.get<OBWriteBatchDomesticResponse2>(`${this.basePath}/batch-domestic-payments/${encodeURIComponent(String(BatchDomesticPaymentId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
