import * as Types from './@types/common'

import { sanitize, trim } from './lib/clean'

import {
  invalidType,
  invalidBoolean,
  invalidNumber,
  invalidDate,
  invalidArray,
  invalidObject,
  invalidString
} from './lib/types'

import {
  hasValue,
  invalidMax,
  invalidMin,
  invalidIn,
  invalidRegex,
  invalidAlpha,
  invalidAlphaNum,
  invalidAlphaDash,
  invalidEmail,
  addError
} from './lib/functions'

import { loop } from './lib/main'

const validate = async (sentValues: any, sentRules: Types.Validator.Rules): Promise<{ err: any, values: any }> => {

  if (!sentValues) return { err: { validatorFatal: "Need some fields to validate" }, values: null }

  if (!sentRules) return { err: { validatorFatal: "Need some rules to validate against" }, values: null }

  try{
    const {err,values} = await (async (sentValues, sentRules) => await loop(sentValues, sentRules(sentValues)))(sentValues, sentRules)
    return {err,values}
  }catch(err:any){
    const error = err.message || err
    return { err: { validatorFatal:error }, values: null }
  }

}

export {
  validate,
  sanitize,
  trim,
  invalidType,
  invalidBoolean,
  invalidNumber,
  invalidDate,
  invalidArray,
  invalidObject,
  invalidString,
  hasValue,
  invalidMax,
  invalidMin,
  invalidIn,
  invalidRegex,
  invalidAlpha,
  invalidAlphaNum,
  invalidAlphaDash,
  invalidEmail,
  addError,
  Types
}

