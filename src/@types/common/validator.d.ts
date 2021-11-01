type GenericObject = { [key: string]: any }
namespace Validator {
  type Type = Number | Date | Array<any> | Object | String | null

  type Rules = (v: any) => { [key: string]: ValidationRule }

  type Rule = {
    ruleName: string
    required?: boolean,
    type?: ValidationType,
    min?: number,
    max?: number,
    in?: (string | number)[],
    regex?: RegExp,
    requiredIf?: [string, any],
    requiredUnless?: [string, any],
    requiredWith?: string[],
    requiredWithout?: string[],
    requiredWithoutAll?: string[],
    validate?: Function,
    default?: any,
    defaultAfterValidate?: any,
    children?: [] | GenericObject,
    clean?: { sanitize?: boolean, trim?: boolean },
    message?: string,
    alpha?: boolean,
    alphaNum?: boolean,
    alphaDash?: boolean,
    email?: boolean,
  } | null
}