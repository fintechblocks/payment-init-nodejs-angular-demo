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
import { OBExternalAccountIdentification4Code } from './oBExternalAccountIdentification4Code';


/**
 * Provides the details to identify the beneficiary account.
 */
export interface OBCashAccountCreditor3 {
    SchemeName: OBExternalAccountIdentification4Code;
    /**
     * Identification assigned by an institution to identify an account. This identification is known by the account owner.
     */
    Identification: string;
    /**
     * Name of the account, as assigned by the account servicing institution. Usage: The account name is the name or names of the account owner(s) represented at an account level. The account name is not the product name or the nickname of the account. OB: ASPSPs may carry out name validation for Confirmation of Payee, but it is not mandatory.
     */
    Name: string;
    /**
     * This is secondary identification of the account, as assigned by the account servicing institution. This can be used by building societies to additionally identify accounts with a roll number (in addition to a sort code and account number combination).
     */
    SecondaryIdentification?: string;
}
