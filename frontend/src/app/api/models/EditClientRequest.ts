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
 * @interface EditClientRequest
 */
export interface EditClientRequest {
    /**
     * 
     * @type {number}
     * @memberof EditClientRequest
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof EditClientRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof EditClientRequest
     */
    gender?: string;
    /**
     * 
     * @type {string}
     * @memberof EditClientRequest
     */
    phoneNumber?: string;
    /**
     * 
     * @type {string}
     * @memberof EditClientRequest
     */
    profileImage?: string;
}

/**
 * Check if a given object implements the EditClientRequest interface.
 */
export function instanceOfEditClientRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;

    return isInstance;
}

export function EditClientRequestFromJSON(json: any): EditClientRequest {
    return EditClientRequestFromJSONTyped(json, false);
}

export function EditClientRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): EditClientRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'gender': !exists(json, 'gender') ? undefined : json['gender'],
        'phoneNumber': !exists(json, 'phone_number') ? undefined : json['phone_number'],
        'profileImage': !exists(json, 'profile_image') ? undefined : json['profile_image'],
    };
}

export function EditClientRequestToJSON(value?: EditClientRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'gender': value.gender,
        'phone_number': value.phoneNumber,
        'profile_image': value.profileImage,
    };
}

