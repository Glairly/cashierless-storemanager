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


/**
 * An enumeration.
 * @export
 */
export const BBoxType = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type BBoxType = typeof BBoxType[keyof typeof BBoxType];


export function BBoxTypeFromJSON(json: any): BBoxType {
    return BBoxTypeFromJSONTyped(json, false);
}

export function BBoxTypeFromJSONTyped(json: any, ignoreDiscriminator: boolean): BBoxType {
    return json as BBoxType;
}

export function BBoxTypeToJSON(value?: BBoxType | null): any {
    return value as any;
}

