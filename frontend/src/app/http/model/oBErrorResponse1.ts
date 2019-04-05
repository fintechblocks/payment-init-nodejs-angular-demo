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
import { OBError1 } from './oBError1';


/**
 * An array of detail error codes, and messages, and URLs to documentation to help remediation.
 */
export interface OBErrorResponse1 {
    /**
     * High level textual error code, to help categorize the errors.
     */
    Code?: string;
    /**
     * A unique reference for the error instance, for audit purposes, in case of unknown/unclassified errors.
     */
    Id?: string;
    /**
     * Brief Error message, e.g., 'There is something wrong with the request parameters provided'
     */
    Message?: string;
    Errors?: Array<OBError1>;
}