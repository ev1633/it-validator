import * as Types from '../@types/common'
export const hasValue = (value: any): boolean => {
  if (typeof value === 'string')
    value = value.replace(/\s/g, "").length ? value : null
  return (typeof value !== 'undefined' && value !== null)
}
export const invalidAlpha = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.alpha) return false
  return !/^[a-zA-Z\s]+$/.test(value)
}

export const invalidAlphaNum = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.alphaNum) return false
  return !/^[0-9a-zA-Z\s]+$/.test(value)
}

export const invalidAlphaDash = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.alphaDash) return false
  return !/^[0-9a-zA-Z\s-_]+$/.test(value)
}

export const invalidEmail = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.email) return false
  const res = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value)
  console.log({ res })
  return !res
}

export const invalidMax = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.max) return false
  return (rule.type === Number && Number(value) > rule.max) || (value.length > rule.max)
}
export const invalidMin = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.min) return false
  return (rule.type === Number && Number(value) < rule.min) || (value.length < rule.min)
}
export const invalidIn = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.in) return false
  return rule.in && !rule.in.includes(value)
}
export const invalidRegex = (rule: Types.Validator.Rule, value: any): boolean => {
  if (!rule || !rule.regex) return false
  if (value instanceof Date) value = value.toISOString()
  return !(rule.regex).test(String(value))
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

