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
  invalidEmail
} from './lib/functions'

import { loop } from './lib/main'

const validate = async (sentValues: any, sentRules: Types.Validator.Rules): Promise<{ err: any, values: any }> => {

  if (!sentValues) return { err: { validatorFatal: "Need some fields to validate" }, values: null }

  if (!sentRules) return { err: { validatorFatal: "Need some rules to validate against" }, values: null }

  return await (async (sentValues, sentRules) => {

    const rules = sentRules(sentValues)

    const { err, values } = await loop(sentValues, rules)

    return { err, values }

  })(sentValues, sentRules)
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
  Types
}

