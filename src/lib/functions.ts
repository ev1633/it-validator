import { GenericObject } from './../@types/common/index';
import * as Types from '../@types/common'
// type rule = boolean | null | undefined

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
export const invalidIn = (haystack: Array<any>, value: any = undefined): boolean => {
  if (!haystack.length || !(haystack instanceof Array)) return true
  return !haystack.includes(value)
}
export const invalidRegex = (regex: RegExp, value: any = undefined): boolean => {
  if (value instanceof Date) value = value.toISOString()
  return !(regex).test(String(value))
}
export const invalidMax = (type:Types.Validator.Type, max:number, value: any = undefined): boolean => {
  return (type === Number && Number(value) > max) || (value.length > max)
}
export const invalidMin = (type:Types.Validator.Type, min:number, value: any = undefined): boolean => {
  return (type === Number && Number(value) < min) || (value.length < min)
}
export const invalidRequiredIf = (rule: [string, any], values: GenericObject, value: any = undefined): boolean => {
  return rule.length !== 2 || !(rule[0] in values) || (values[rule[0]] === rule[1] && !hasValue(value))
}
export const invalidRequiredUnless = (rule: [string, any], values: GenericObject, value: any = undefined): boolean => {
  return rule.length !== 2 || !(rule[0] in values) || (values[rule[0]] !== rule[1] && !hasValue(value))
}
export const invalidRequiredWith = (rule: string[], values: any, value: any = undefined): boolean => {
  return !hasValue(value) && rule.some(item => item in values && hasValue(values[item]))
}
export const invalidRequiredWithout = (rule: string[], values: any, value: any = undefined): boolean => {
  return !hasValue(value) && rule.some(item => !(item in values) || !hasValue(values[item]))
}

export const invalidRequiredWithoutAll = (rule: string[], values: any, value: any = undefined): boolean => {
  return !hasValue(value) && rule.every(item => !(item in values) && !hasValue(values[item]))
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

export const addError = (e: null | GenericObject, key: string, value:unknown) => {
    let theErr = e;
    if (!theErr) theErr = {};
    theErr[key] = value;
    return theErr;
  };