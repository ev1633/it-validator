import { sanitize, trim } from '../lib/clean'

import { validateType } from '../lib/types'

import {
  hasValue,
  errorMessage,
  invalidMax,
  invalidMin,
  invalidIn,
  invalidRegex,
  invalidRequiredIf,
  invalidRequiredUnless,
  invalidRequiredWith,
  invalidRequiredWithout,
  invalidRequiredWithoutAll,
  invalidAlpha,
  invalidAlphaNum,
  invalidAlphaDash,
  invalidEmail
} from '../lib/functions'

/**
   * validate a single field with corresponding rule
   * @param  { object } values - all the values sent to the validator
   * @param  { object } rules - the rules to validate against
   */
export const validateField = async (values: GenericObject, rule: Validator.Rule): Promise<any> => {

  if (!rule) return { err: null, value: undefined }

  let value = values[rule.ruleName]

  if (rule.required && !hasValue(value))
    return { err: errorMessage(rule.message, 'required', 'is required'), value }

  if (hasValue(value)) {
    const validType = validateType(rule.type, value)
    if (!validType.valid)
      return { err: errorMessage(rule.message, 'type', `value ${value} doesn't match the type ${validType.type}`), value }

    if (invalidAlpha(rule, value))
      return { err: errorMessage(rule.message, 'alpha', `value ${value} must contain alphabetic characters only`), value }

    if (invalidAlphaNum(rule, value))
      return { err: errorMessage(rule.message, 'alphaNum', `value ${value} must contain alphanumeric characters only`), value }

    if (invalidAlphaDash(rule, value))
      return { err: errorMessage(rule.message, 'alphaDash', `value ${value} must contain alphanumeric characters, dashes or undescores only`), value }

    if (invalidEmail(rule, value))
      return { err: errorMessage(rule.message, 'email', `value ${value} must be a valid email`), value }

    if (invalidIn(rule, value))
      return { err: errorMessage(rule.message, 'in', `value ${value} is not in ${rule.in}`), value }

    if (invalidRegex(rule, value))
      return { err: errorMessage(rule.message, 'regex', `value ${value} has not a valid format`), value }

    if (invalidMax(rule, value))
      return { err: errorMessage(rule.message, 'max', `value ${value} has a max of ${rule.max}`), value }

    if (invalidMin(rule, value))
      return { err: errorMessage(rule.message, 'min', `value ${value} has a min of ${rule.min}`), value }
  }

  if (rule.validate) {
    const validateError = await rule.validate(value)
    if (validateError)
      return { err: errorMessage(rule.message, 'validate', `${validateError}`), value }
  }

  if (invalidRequiredIf(rule, value, values))
    return { err: errorMessage(rule.message, 'requiredIf', `value ${value}, needs to be present if ${rule.requiredIf![0]} is equal to ${rule.requiredIf![1]}`), value }

  if (invalidRequiredUnless(rule, value, values))
    return { err: errorMessage(rule.message, 'requiredUnless', `value ${value}, needs to be present unless ${rule.requiredWithout![0]} is equal to ${rule.requiredWithout![1]}`), value }

  if (invalidRequiredWith(rule, value, values))
    return { err: errorMessage(rule.message, 'requiredWith', `value ${value}, needs to be present if any of [${rule.requiredWith}] is present`), value }

  if (invalidRequiredWithout(rule, value, values))
    return { err: errorMessage(rule.message, 'requiredWithout', `value ${value}, needs to be present if one of [${rule.requiredWithout}] is not present`), value }

  if (invalidRequiredWithoutAll(rule, value, values))
    return { err: errorMessage(rule.message, 'requiredWithoutAll', `value ${value}, needs to be present if all of [${rule.requiredWithoutAll}] is not present`), value }


  if (!rule.required && rule.defaultAfterValidate && !hasValue(value))
    return { err: null, value: rule.defaultAfterValidate }

  if (value) {

    if (rule.clean) {

      if (rule.clean === true || rule.clean.trim)
        value = trim(value)

      if (rule.clean === true || rule.clean.sanitize)
        value = sanitize(value)

    }

    if (!validateType(Number, value) && validateType(String, value))
      value = decodeURI(value)
  }

  return { err: null, value }
}


/**
 * if single field execute validateField, if array or object loop again
 * @param  { string } ruleName - the name of the rule, only for error purpouses
 * @param  { object } rule - the rule object for validation
 * @param  { object } value - the value to validate
 * @return { null | any } - the validated field or null
 */


export const loop = async (values: GenericObject, rules: GenericObject): Promise<{ err: GenericObject | string | null, values: any }> => {

  let validValues: GenericObject = {}
  let errors: GenericObject = {}

  for (let ruleName in rules) {

    let value = values[ruleName]

    const rule: Validator.Rule = rules[ruleName]

    // if the rule is null and value has a value, add it to values
    if (!rule) {
      if (rule === null && value !== undefined) {
        validValues[ruleName] = value
        values[ruleName] = value
      }
      continue
    }

    rule.ruleName = ruleName

    if (!rule.required && rule.default && !hasValue(value)) {
      validValues[ruleName] = rule.default
      values[ruleName] = rule.default
      continue
    }

    let { err, value: validateValue } = await validateField(values, rule)

    if (err) {
      errors[ruleName] = err
      continue
    }

    if (validateValue === undefined) continue


    if ([Array, Object].includes(rule.type)) {

      if (!rule.children) {
        if (validateValue !== undefined) {
          validValues[ruleName] = validateValue
          values[ruleName] = validateValue
        }
        continue
      }

      if (rule.type === Array) {

        const validateArr = []
        const arrErr: GenericObject = {}

        for (const i in validateValue) {

          const arrRes = await loop(validateValue[i], rule.children)

          if (arrRes.err) arrErr[i] = arrRes.err
          else validateArr.push(arrRes.values)
        }
        err = arrErr
        if (err) errors[ruleName] = err
        validateValue = validateArr
        // console.log({ validateArr, arrErr })

      } else {

        const objRes = await loop(validateValue, rule.children)
        err = objRes.err
        if (err) errors[ruleName] = err
        validateValue = objRes.values

      }
    }

    if (!err && validateValue !== undefined) {
      validValues[ruleName] = validateValue
      values[ruleName] = validateValue
    }

  }

  return { err: Object.keys(errors).length ? errors : null, values: validValues }

}