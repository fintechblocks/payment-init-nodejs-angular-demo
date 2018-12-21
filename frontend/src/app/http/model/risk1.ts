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
import { RiskDeliveryAddress } from './riskDeliveryAddress';


/**
 * Reflection of POSTed Risk profile 
 */
export interface Risk1 {
    /**
     * Specifies the payment context
     */
    PaymentContextCode?: Risk1.PaymentContextCodeEnum;
    /**
     * Category code conforms to ISO 18245, related to the type of services or goods the merchant provides for the transaction
     */
    MerchantCategoryCode?: string;
    /**
     * The unique customer identifier of the PSU with the merchant.
     */
    MerchantCustomerIdentification?: string;
    DeliveryAddress?: RiskDeliveryAddress;
}
export namespace Risk1 {
    export type PaymentContextCodeEnum = 'BillPayment' | 'EcommerceGoods' | 'EcommerceServices' | 'Other' | 'PersonToPerson';
    export const PaymentContextCodeEnum = {
        BillPayment: 'BillPayment' as PaymentContextCodeEnum,
        EcommerceGoods: 'EcommerceGoods' as PaymentContextCodeEnum,
        EcommerceServices: 'EcommerceServices' as PaymentContextCodeEnum,
        Other: 'Other' as PaymentContextCodeEnum,
        PersonToPerson: 'PersonToPerson' as PaymentContextCodeEnum
    }
}
