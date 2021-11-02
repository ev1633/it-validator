type GenericObject = { [key: string]: any }
namespace Validator {
  type Type = Number | Date | Array | Object | String

  type Rules = (v: any) => { [key: string]: ValidationRule }

  type Rule = {
    ruleName: string
    required?: boolean,
    type?: Type,
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

  } | null
}