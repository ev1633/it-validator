export declare type GenericObject = { [key: string]: any }
export namespace Validator {
  export declare type Type = Number | Date | ArrayConstructor | Object | String | Boolean

  export declare type Rules = (v: any) => { [key: string]: any }

  export declare type Convert = boolean | Type

  export declare type Rule = {
    ruleName: string
    required?: boolean,
    type: Type,
    min?: number,
    max?: number,
    email?: boolean,
    in?: (string | number)[],
    regex?: RegExp,
    requiredIf?: [string, any],
    requiredUnless?: [string, any],
    requiredWith?: string[],
    requiredWithout?: string[],
    requiredWithoutAll?: string[],
    alpha?: boolean,
    alphaNum?: boolean,
    alphaDash?: boolean,
    validate?: Function,
    default?: any,
    defaultAfterValidate?: any,
    children?: [] | GenericObject,
    clean?: { sanitize?: boolean, trim?: boolean },
    message?: string,
    convert?: Convert
  } | null
}