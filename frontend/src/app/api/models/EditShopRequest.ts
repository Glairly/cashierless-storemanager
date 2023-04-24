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
 * @interface EditShopRequest
 */
export interface EditShopRequest {
    /**
     * 
     * @type {number}
     * @memberof EditShopRequest
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof EditShopRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof EditShopRequest
     */
    phoneNumber?: string;
}

/**
 * Check if a given object implements the EditShopRequest interface.
 */
export function instanceOfEditShopRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;

    return isInstance;
}

export function EditShopRequestFromJSON(json: any): EditShopRequest {
    return EditShopRequestFromJSONTyped(json, false);
}

export function EditShopRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): EditShopRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'phoneNumber': !exists(json, 'phone_number') ? undefined : json['phone_number'],
    };
}

export function EditShopRequestToJSON(value?: EditShopRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'phone_number': value.phoneNumber,
    };
}
