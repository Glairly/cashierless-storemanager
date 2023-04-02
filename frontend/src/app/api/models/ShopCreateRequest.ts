/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ShopCreateRequest
 */
export interface ShopCreateRequest {
    /**
     * 
     * @type {string}
     * @memberof ShopCreateRequest
     */
    shopName: string;
    /**
     * 
     * @type {number}
     * @memberof ShopCreateRequest
     */
    machineId: number;
    /**
     * 
     * @type {number}
     * @memberof ShopCreateRequest
     */
    clientId: number;
    /**
     * 
     * @type {string}
     * @memberof ShopCreateRequest
     */
    phoneNumber: string;
}

/**
 * Check if a given object implements the ShopCreateRequest interface.
 */
export function instanceOfShopCreateRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "shopName" in value;
    isInstance = isInstance && "machineId" in value;
    isInstance = isInstance && "clientId" in value;
    isInstance = isInstance && "phoneNumber" in value;

    return isInstance;
}

export function ShopCreateRequestFromJSON(json: any): ShopCreateRequest {
    return ShopCreateRequestFromJSONTyped(json, false);
}

export function ShopCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ShopCreateRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'shopName': json['shop_name'],
        'machineId': json['machine_id'],
        'clientId': json['client_id'],
        'phoneNumber': json['phone_number'],
    };
}

export function ShopCreateRequestToJSON(value?: ShopCreateRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'shop_name': value.shopName,
        'machine_id': value.machineId,
        'client_id': value.clientId,
        'phone_number': value.phoneNumber,
    };
}

