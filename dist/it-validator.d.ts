declare type GenericObject = {
    [key: string]: any;
};
declare namespace Validator {
    type Type = Number | Date | ArrayConstructor | Object | String | Boolean;
    type Rules = (v: any) => {
        [key: string]: any;
    };
    type Convert = boolean | Type;
    type Rule = {
        ruleName: string;
        required?: boolean;
        type: Type;
        min?: number;
        max?: number;
        email?: boolean;
        in?: (string | number)[];
        regex?: RegExp;
        requiredIf?: [string, any];
        requiredUnless?: [string, any];
        requiredWith?: string[];
        requiredWithout?: string[];
        requiredWithoutAll?: string[];
        alpha?: boolean;
        alphaNum?: boolean;
        alphaDash?: boolean;
        validate?: Function;
        default?: any;
        defaultAfterValidate?: any;
        children?: [] | GenericObject;
        clean?: {
            sanitize?: boolean;
            trim?: boolean;
        };
        message?: string;
        convert?: Convert;
    } | null;
}

type index_GenericObject = GenericObject;
declare const index_Validator: typeof Validator;
declare namespace index {
  export {
    index_GenericObject as GenericObject,
    index_Validator as Validator,
  };
}

declare const sanitize: (string: string) => string;
declare const trim: (string: string) => string;

declare const invalidNumber: (value: any) => boolean;
declare const invalidDate: (value: any) => boolean;
declare const invalidArray: (value: unknown) => boolean;
declare const invalidObject: (value: any) => boolean;
declare const invalidString: (value: unknown) => boolean;
declare const invalidBoolean: (value: any) => boolean;
/**
  * check type and execute validating function
  * @param  { function } type - type of value to validate
  * @param { any } value - value to validate
  * @return { object }
  */
declare const invalidType: (type: Validator.Type | undefined, value: any) => boolean | string;
declare const convertToArray: (value: string) => string | string[];

declare const hasValue: (value?: any) => boolean;
declare const invalidAlpha: (value?: any) => boolean;
declare const invalidAlphaNum: (value?: any) => boolean;
declare const invalidAlphaDash: (value?: any) => boolean;
declare const invalidEmail: (value?: any) => boolean;
declare const invalidIn: (haystack: Array<any>, value?: any) => boolean;
declare const invalidRegex: (regex: RegExp, value?: any) => boolean;
declare const invalidMax: (type: Validator.Type, max: number, value?: any) => boolean;
declare const invalidMin: (type: Validator.Type, min: number, value?: any) => boolean;
declare const addError: (err: null | GenericObject, key: string, value: unknown) => {
    [x: string]: unknown;
};

declare const validate: (sentValues: any, sentRules: Validator.Rules) => Promise<{
    err: any;
    values: any;
}>;

export { index as Types, addError, convertToArray, hasValue, invalidAlpha, invalidAlphaDash, invalidAlphaNum, invalidArray, invalidBoolean, invalidDate, invalidEmail, invalidIn, invalidMax, invalidMin, invalidNumber, invalidObject, invalidRegex, invalidString, invalidType, sanitize, trim, validate };
