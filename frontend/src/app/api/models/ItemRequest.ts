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
 * @interface ItemRequest
 */
export interface ItemRequest {
    /**
     * 
     * @type {number}
     * @memberof ItemRequest
     */
    quantity: number;
    /**
     * 
     * @type {string}
     * @memberof ItemRequest
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof ItemRequest
     */
    price: number;
    /**
     * 
     * @type {number}
     * @memberof ItemRequest
     */
    type: number;
}

/**
 * Check if a given object implements the ItemRequest interface.
 */
export function instanceOfItemRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "quantity" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "price" in value;
    isInstance = isInstance && "type" in value;

    return isInstance;
}

export function ItemRequestFromJSON(json: any): ItemRequest {
    return ItemRequestFromJSONTyped(json, false);
}

export function ItemRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ItemRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'quantity': json['quantity'],
        'name': json['name'],
        'price': json['price'],
        'type': json['type'],
    };
}

export function ItemRequestToJSON(value?: ItemRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'quantity': value.quantity,
        'name': value.name,
        'price': value.price,
        'type': value.type,
    };
}

