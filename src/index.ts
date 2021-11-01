import { sanitize, trim } from './lib/clean'

import {
  validateType,
  validateStringType,
  validateDateType,
  validateArrayType,
  validateObjectType,
  validateNumberType,
} from './lib/types'

import {
  hasValue,
  invalidMax,
  invalidMin,
  invalidIn,
  invalidRegex,
  invalidRequiredIf,
  invalidRequiredUnless,
  invalidRequiredWith,
  invalidRequiredWithout,
  invalidRequiredWithoutAll
} from './lib/functions'

import { loop } from './lib/main'

const validate = async (sentValues: any, sentRules: Validator.Rules): Promise<{ err: any, values: any }> => {

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
  validateType,
  validateNumberType,
  validateDateType,
  validateArrayType,
  validateObjectType,
  validateStringType,
  hasValue,
  invalidMax,
  invalidMin,
  invalidIn,
  invalidRegex,
  invalidRequiredIf,
  invalidRequiredUnless,
  invalidRequiredWith,
  invalidRequiredWithout,
  invalidRequiredWithoutAll
}

