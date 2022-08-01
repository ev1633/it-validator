export type GenericObject = { [key: string]: any }
export namespace Validator {
  export type Type = Number | Date | Array<any> | Object | String | Boolean

  export type Rules = (v: any) => { [key: string]: any }

  export type Rule = {
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
    message?: string
  } | null
}