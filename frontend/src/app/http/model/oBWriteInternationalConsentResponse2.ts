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
import { Links } from './links';
import { Meta } from './meta';
import { OBRisk1 } from './oBRisk1';
import { OBWriteDataInternationalConsentResponse2 } from './oBWriteDataInternationalConsentResponse2';


export interface OBWriteInternationalConsentResponse2 {
    Data: OBWriteDataInternationalConsentResponse2;
    Risk: OBRisk1;
    Links: Links;
    Meta: Meta;
}
