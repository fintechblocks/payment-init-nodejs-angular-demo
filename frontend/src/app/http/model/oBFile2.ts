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
import { OBCashAccountDebtor4 } from './oBCashAccountDebtor4';
import { OBExternalFileType1Code } from './oBExternalFileType1Code';
import { OBExternalLocalInstrument1Code } from './oBExternalLocalInstrument1Code';
import { OBRemittanceInformation1 } from './oBRemittanceInformation1';
import { OBSupplementaryData1 } from './oBSupplementaryData1';


/**
 * The Initiation payload is sent by the initiating party to the ASPSP. It is used to request movement of funds using a payment file.
 */
export interface OBFile2 {
    FileType: OBExternalFileType1Code;
    /**
     * A base64 encoding of a SHA256 hash of the file to be uploaded.
     */
    FileHash: string;
    /**
     * Reference for the file.
     */
    FileReference?: string;
    /**
     * Number of individual transactions contained in the payment information group.
     */
    NumberOfTransactions?: string;
    /**
     * Total of all individual amounts included in the group, irrespective of currencies.
     */
    ControlSum?: number;
    /**
     * Date at which the initiating party requests the clearing agent to process the payment. Usage: This is the date on which the debtor's account is to be debited. All dates in the JSON payloads are represented in ISO 8601 date-time format. All date-time fields in responses must include the timezone. An example is below: 2017-04-05T10:43:07+00:00
     */
    RequestedExecutionDateTime?: Date;
    LocalInstrument?: OBExternalLocalInstrument1Code;
    DebtorAccount?: OBCashAccountDebtor4;
    RemittanceInformation?: OBRemittanceInformation1;
    SupplementaryData?: OBSupplementaryData1;
}
