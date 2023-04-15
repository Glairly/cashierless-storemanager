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
import type { TransactionItemRequest } from './TransactionItemRequest';
import {
    TransactionItemRequestFromJSON,
    TransactionItemRequestFromJSONTyped,
    TransactionItemRequestToJSON,
} from './TransactionItemRequest';

/**
 * 
 * @export
 * @interface AnonymousTransactionRequest
 */
export interface AnonymousTransactionRequest {
    /**
     * 
     * @type {number}
     * @memberof AnonymousTransactionRequest
     */
    shopId: number;
    /**
     * 
     * @type {string}
     * @memberof AnonymousTransactionRequest
     */
    shopName: string;
    /**
     * 
     * @type {Array<TransactionItemRequest>}
     * @memberof AnonymousTransactionRequest
     */
    items: Array<TransactionItemRequest>;
    /**
     * 
     * @type {Array<string>}
     * @memberof AnonymousTransactionRequest
     */
    barcodes: Array<string>;
}

/**
 * Check if a given object implements the AnonymousTransactionRequest interface.
 */
export function instanceOfAnonymousTransactionRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "shopId" in value;
    isInstance = isInstance && "shopName" in value;
    isInstance = isInstance && "items" in value;
    isInstance = isInstance && "barcodes" in value;

    return isInstance;
}

export function AnonymousTransactionRequestFromJSON(json: any): AnonymousTransactionRequest {
    return AnonymousTransactionRequestFromJSONTyped(json, false);
}

export function AnonymousTransactionRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AnonymousTransactionRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'shopId': json['shop_id'],
        'shopName': json['shop_name'],
        'items': ((json['items'] as Array<any>).map(TransactionItemRequestFromJSON)),
        'barcodes': json['barcodes'],
    };
}

export function AnonymousTransactionRequestToJSON(value?: AnonymousTransactionRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'shop_id': value.shopId,
        'shop_name': value.shopName,
        'items': ((value.items as Array<any>).map(TransactionItemRequestToJSON)),
        'barcodes': value.barcodes,
    };
}

