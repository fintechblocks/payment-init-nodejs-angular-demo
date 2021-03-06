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
import { OBAuthorisation1 } from './oBAuthorisation1';
import { OBExternalPermissions2Code } from './oBExternalPermissions2Code';
import { OBInternationalScheduled2 } from './oBInternationalScheduled2';


export interface OBWriteDataInternationalScheduledConsent2 {
    Permission: OBExternalPermissions2Code;
    Initiation: OBInternationalScheduled2;
    Authorisation?: OBAuthorisation1;
}
