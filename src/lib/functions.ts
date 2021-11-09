import * as Types from '../@types/common'
type rule = boolean | null | undefined

const hasValueRegex = /\s/g
const invalidAlphaRegex = /^[a-zA-Z\s]+$/
const invalidAlphaNumRegex = /^[0-9a-zA-Z\s]+$/
const invalidAlphaDashRegex = /^[0-9a-zA-Z\s-_]+$/
const invalidEmailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
export const hasValue = (value: any = null): boolean => {
  if (typeof value === 'string')
    value = value.replace(hasValueRegex, "").length ? value : null
  return (typeof value !== 'undefined' && value !== null)
}
export const invalidAlpha = (value: any = undefined): boolean => {
  if (!value || !(typeof value === 'string')) return true
  return !invalidAlphaRegex.test(value)
}

export const invalidAlphaNum = (value: any = undefined): boolean => {
  if (!value || !(typeof value === 'string')) return true
  return !invalidAlphaNumRegex.test(value)
}

export const invalidAlphaDash = (value: any = undefined): boolean => {
  if (!value || !(typeof value === 'string')) return true
  return !invalidAlphaDashRegex.test(value)
}

export const invalidEmail = (value: any = undefined): boolean => {
  if (!value || !(typeof value === 'string')) return true
  return !invalidEmailRegex.test(value)
}
export const invalidIn = (haystack: Array<any>, value: any): boolean => {
  if (!haystack.length || !(haystack instanceof Array)) return true
  return !haystack.includes(value)
}
export const invalidRegex = (regex: RegExp, value: any): boolean => {
  if (value instanceof Date) value = value.toISOString()
  return !(regex).test(String(value))
}
export const invalidMax = (max: number, value: any): boolean => {
  return (typeof value === 'number' && Number(value) > max) || (value.length > max)
}
export const invalidMin = (min: number, value: any): boolean => {
  return (typeof value === 'number' && Number(value) < min) || (value.length < min)
}


export const invalidRequiredIf = (rule: Types.Validator.Rule, value: any, values: any): boolean => {
  if (!rule || !rule.requiredIf) return false
  return rule.requiredIf.length == 2 && !hasValue(value) && values[rule.requiredIf[0]] === rule.requiredIf[1]
}
export const invalidRequiredUnless = (rule: Types.Validator.Rule, value: any, values: any): boolean => {
  if (!rule || !rule.requiredUnless) return false
  return rule.requiredUnless.length == 2 && !hasValue(value) && values[rule.requiredUnless[0]] !== rule.requiredUnless[1]
}
export const invalidRequiredWith = (rule: Types.Validator.Rule, value: any, values: any): boolean => {
  if (!rule || !rule.requiredWith) return false
  return !hasValue(value) && rule.requiredWith.some(item => item in values && hasValue(values[item]))
}
export const invalidRequiredWithout = (rule: Types.Validator.Rule, value: any, values: any): boolean => {
  if (!rule || !rule.requiredWithout) return false
  return !hasValue(value) && rule.requiredWithout.some(item => !(item in values) && !hasValue(values[item]))
}

export const invalidRequiredWithoutAll = (rule: Types.Validator.Rule, value: any, values: any): boolean => {
  if (!rule || !rule.requiredWithoutAll) return false
  return !hasValue(value) && rule.requiredWithoutAll.every(item => !(item in values) && !hasValue(values[item]))
}

export const errorMessage = (message: string | Types.GenericObject | undefined, type: string, base: string,): string => {
  // if not message return base
  if (!message) return base
  // if message is a string or if it's not an object  return the string
  if (typeof message === 'string' || typeof message !== 'object') return message
  // if message contains a property that matches the type, return that message
  if (message[type]) return message[type]

  return base
}

