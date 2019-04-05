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
import { OBRisk1 } from './oBRisk1';
import { OBWriteDataInternationalStandingOrderConsent2 } from './oBWriteDataInternationalStandingOrderConsent2';


export interface OBWriteInternationalStandingOrderConsent2 {
    Data: OBWriteDataInternationalStandingOrderConsent2;
    Risk: OBRisk1;
}