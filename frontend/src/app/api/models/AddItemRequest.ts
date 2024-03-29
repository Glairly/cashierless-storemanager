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
 * @interface AddItemRequest
 */
export interface AddItemRequest {
    /**
     * 
     * @type {number}
     * @memberof AddItemRequest
     */
    shopId: number;
    /**
     * 
     * @type {string}
     * @memberof AddItemRequest
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof AddItemRequest
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof AddItemRequest
     */
    type: number;
}

/**
 * Check if a given object implements the AddItemRequest interface.
 */
export function instanceOfAddItemRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "shopId" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function AddItemRequestFromJSON(json: any): AddItemRequest {
    return AddItemRequestFromJSONTyped(json, false);
}

export function AddItemRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AddItemRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'shopId': json['shop_id'],
        'name': json['name'],
        'price': json['price'],
        'type': json['type'],
    };
}

export function AddItemRequestToJSON(value?: AddItemRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'shop_id': value.shopId,
        'name': value.name,
        'price': value.price,
        'type': value.type,
    };
}

