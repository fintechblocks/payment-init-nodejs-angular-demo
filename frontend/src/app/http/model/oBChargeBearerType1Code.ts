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
 * Specifies which party/parties will bear the charges associated with the processing of the payment transaction.
 */
export type OBChargeBearerType1Code = 'BorneByCreditor' | 'BorneByDebtor' | 'FollowingServiceLevel' | 'Shared';

export const OBChargeBearerType1Code = {
    BorneByCreditor: 'BorneByCreditor' as OBChargeBearerType1Code,
    BorneByDebtor: 'BorneByDebtor' as OBChargeBearerType1Code,
    FollowingServiceLevel: 'FollowingServiceLevel' as OBChargeBearerType1Code,
    Shared: 'Shared' as OBChargeBearerType1Code
}
