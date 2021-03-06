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


/**
 * Identifies the nature of the postal address.
 */
export type OBAddressTypeCode = 'Business' | 'Correspondence' | 'DeliveryTo' | 'MailTo' | 'POBox' | 'Postal' | 'Residential' | 'Statement';

export const OBAddressTypeCode = {
    Business: 'Business' as OBAddressTypeCode,
    Correspondence: 'Correspondence' as OBAddressTypeCode,
    DeliveryTo: 'DeliveryTo' as OBAddressTypeCode,
    MailTo: 'MailTo' as OBAddressTypeCode,
    POBox: 'POBox' as OBAddressTypeCode,
    Postal: 'Postal' as OBAddressTypeCode,
    Residential: 'Residential' as OBAddressTypeCode,
    Statement: 'Statement' as OBAddressTypeCode
}
