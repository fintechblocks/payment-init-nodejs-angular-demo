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


/**
 * Reflection of The Main Data Payload, with Created Resource ID, Status and Timestamp
 */
export interface PaymentSetupResponse2 {
    /**
     * OB: Unique identification as assigned by the ASPSP to uniquely identify the payment submission resource.
     */
    PaymentSubmissionId: string;
    /**
     * OB: Unique identification as assigned by the ASPSP to uniquely identify the payment setup resource.
     */
    PaymentId: string;
    /**
     * Specifies the status of the payment resource.
     */
    Status?: PaymentSetupResponse2.StatusEnum;
    /**
     * Date and time at which the resource was created.  All dates in the JSON payloads are represented in ISO 8601 date-time format.  All date-time fields in responses must include the timezone. An example is below: 2017-04-05T10:43:07+00:00
     */
    CreationDateTime: Date;
}
export namespace PaymentSetupResponse2 {
    export type StatusEnum = 'AcceptedSettlementCompleted' | 'AcceptedSettlementInProcess' | 'Pending' | 'Rejected';
    export const StatusEnum = {
        AcceptedSettlementCompleted: 'AcceptedSettlementCompleted' as StatusEnum,
        AcceptedSettlementInProcess: 'AcceptedSettlementInProcess' as StatusEnum,
        Pending: 'Pending' as StatusEnum,
        Rejected: 'Rejected' as StatusEnum
    }
}
