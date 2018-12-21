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
 * Information that locates and identifies a specific address, as defined by postal services or in free format text.
 */
export interface RiskDeliveryAddress {
    /**
     * Information that locates and identifies a specific address, as defined by postal services, that is presented in free format text.
     */
    AddressLine?: Array<string>;
    /**
     * Name of a street or thoroughfare
     */
    StreetName?: string;
    /**
     * Number that identifies the position of a building on a street.
     */
    BuildingNumber?: string;
    /**
     * Identifier consisting of a group of letters and/or numbers that is added to a postal address to assist the sorting of mail
     */
    PostCode?: string;
    /**
     * Name of a built-up area, with defined boundaries, and a local government.
     */
    TownName: string;
    /**
     * Identifies a subdivision of a country, for instance state, region, county.
     */
    CountrySubDivision?: Array<string>;
    /**
     * Nation with its own government, occupying a particular territory.
     */
    Country: string;
}
