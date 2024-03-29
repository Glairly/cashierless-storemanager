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
 * @interface SignUpRequest
 */
export interface SignUpRequest {
    /**
     * 
     * @type {string}
     * @memberof SignUpRequest
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof SignUpRequest
     */
    password: string;
    /**
     * 
     * @type {string}
     * @memberof SignUpRequest
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof SignUpRequest
     */
    name: string;
    /**
     * 
     * @type {boolean}
     * @memberof SignUpRequest
     */
    isShopOwner?: boolean;
    /**
     * 
     * @type {string}
     * @memberof SignUpRequest
     */
    gender?: string;
    /**
     * 
     * @type {Date}
     * @memberof SignUpRequest
     */
    birthdate?: Date;
    /**
     * 
     * @type {string}
     * @memberof SignUpRequest
     */
    phoneNumber: string;
    /**
     * 
     * @type {Blob}
     * @memberof SignUpRequest
     */
    faceImg?: Blob;
    /**
     * 
     * @type {string}
     * @memberof SignUpRequest
     */
    profileImg?: string;
}

/**
 * Check if a given object implements the SignUpRequest interface.
 */
export function instanceOfSignUpRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "phoneNumber" in value;

    return isInstance;
}

export function SignUpRequestFromJSON(json: any): SignUpRequest {
    return SignUpRequestFromJSONTyped(json, false);
}

export function SignUpRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SignUpRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'username': json['username'],
        'password': json['password'],
        'email': json['email'],
        'name': json['name'],
        'isShopOwner': !exists(json, 'is_shop_owner') ? undefined : json['is_shop_owner'],
        'gender': !exists(json, 'gender') ? undefined : json['gender'],
        'birthdate': !exists(json, 'birthdate') ? undefined : (new Date(json['birthdate'])),
        'phoneNumber': json['phone_number'],
        'faceImg': !exists(json, 'face_img') ? undefined : json['face_img'],
        'profileImg': !exists(json, 'profile_img') ? undefined : json['profile_img'],
    };
}

export function SignUpRequestToJSON(value?: SignUpRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
        'password': value.password,
        'email': value.email,
        'name': value.name,
        'is_shop_owner': value.isShopOwner,
        'gender': value.gender,
        'birthdate': value.birthdate === undefined ? undefined : (value.birthdate.toISOString()),
        'phone_number': value.phoneNumber,
        'face_img': value.faceImg,
        'profile_img': value.profileImg,
    };
}

