import * as Types from '../@types/common'
import { sanitize, trim } from '../lib/clean'

import { invalidType, convert } from '../lib/types'

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
  invalidEmail,
} from '../lib/functions'

declare type rule = boolean | null | undefined

const execIfPresent = (rule: rule, hof: Function) => {
  if (!rule) return () => false
  return hof
}
/**
   * validate a single field with corresponding rule
   * @param  { object } values - all the values sent to the validator
   * @param  { object } rules - the rules to validate against
   */
export const validateField = async (values: Types.GenericObject, rule: Types.Validator.Rule): Promise<any> => {

  if (!rule) return { err: null, value: undefined }
  if (!rule.type) throw new Error(`${rule.ruleName} must have a type property specified`)
  let value = values[rule.ruleName]

  if (rule.required && !hasValue(value))
    return { err: errorMessage(rule.message, 'required', 'is required'), value }

  if (value !== null && value !== undefined && rule.convert) value = convert(rule.convert === true ? rule.type : rule.convert || false, value)

  if (rule.ruleName in values && values[rule.ruleName] !== undefined) {
    const notValidType = invalidType(rule.type, value)
    if (notValidType)
      return { err: errorMessage(rule.message, 'type', `value ${value} doesn't match the type ${notValidType}`), value }

    if (execIfPresent(!!rule.min, invalidMin)(rule.type, rule.min, value))
      return { err: errorMessage(rule.message, 'min', `value ${value} has a min of ${rule.min}`), value }

    if (execIfPresent(!!rule.max, invalidMax)(rule.type, rule.max, value))
      return { err: errorMessage(rule.message, 'max', `value ${value} has a max of ${rule.max}`), value }

    if (execIfPresent(rule.alpha, invalidAlpha)(value))
      return { err: errorMessage(rule.message, 'alpha', `value ${value} must contain alphabetic characters only`), value }

    if (execIfPresent(rule.alphaNum, invalidAlphaNum)(value))
      return { err: errorMessage(rule.message, 'alphaNum', `value ${value} must contain alphanumeric characters only`), value }

    if (execIfPresent(rule.alphaDash, invalidAlphaDash)(value))
      return { err: errorMessage(rule.message, 'alphaDash', `value ${value} must contain alphanumeric characters, dashes or undescores only`), value }

    if (execIfPresent(rule.email, invalidEmail)(value))
      return { err: errorMessage(rule.message, 'email', `value ${value} must be a valid email`), value }

    if (execIfPresent(!!rule.in, invalidIn)(rule.in, value))
      return { err: errorMessage(rule.message, 'in', `value ${value} is not in ${rule.in}`), value }

    if (execIfPresent(!!rule.regex, invalidRegex)(rule.regex, value))
      return { err: errorMessage(rule.message, 'regex', `value ${value} has not a valid format`), value }
  }

  if (rule.validate) {
    const validateError = await rule.validate(value)
    if (validateError)
      return { err: errorMessage(rule.message, 'validate', `${validateError}`), value }
  }

  if (execIfPresent(!!rule.requiredIf, invalidRequiredIf)(rule.requiredIf, values, value))
    return { err: errorMessage(rule.message, 'requiredIf', `value ${value}, needs to be present if ${rule.requiredIf![0]} is equal to ${rule.requiredIf![1]}`), value }

  if (execIfPresent(!!rule.requiredUnless, invalidRequiredUnless)(rule.requiredUnless, values, value))
    return { err: errorMessage(rule.message, 'requiredUnless', `value ${value}, needs to be present unless ${rule.requiredWithout![0]} is equal to ${rule.requiredWithout![1]}`), value }

  if (execIfPresent(!!rule.requiredWith, invalidRequiredWith)(rule.requiredWith, values, value))
    return { err: errorMessage(rule.message, 'requiredWith', `value ${value}, needs to be present if any of [${rule.requiredWith}] is present`), value }

  if (execIfPresent(!!rule.requiredWithout, invalidRequiredWithout)(rule.requiredWithout, values, value))
    return { err: errorMessage(rule.message, 'requiredWithout', `value ${value}, needs to be present if one of [${rule.requiredWithout}] is not present`), value }

  if (execIfPresent(!!rule.requiredWithoutAll, invalidRequiredWithoutAll)(rule.requiredWithoutAll, values, value))
    return { err: errorMessage(rule.message, 'requiredWithoutAll', `value ${value}, needs to be present if all of [${rule.requiredWithoutAll}] is not present`), value }


  if (!rule.required && rule.defaultAfterValidate && !hasValue(value))
    return { err: null, value: rule.defaultAfterValidate }

  if (value) {

    if (rule.clean) {

      if (rule.clean.trim)
        value = trim(value)

      if (rule.clean.sanitize)
        value = sanitize(value)

    }

    if (invalidType({ ...rule, type: Number }, value) && !invalidType({ ...rule, type: String }, value))
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


export const loop = async (values: Types.GenericObject, rules: Types.GenericObject): Promise<{ err: Types.GenericObject | string | null, values: any }> => {

  let validValues: Types.GenericObject = {}
  let errors: Types.GenericObject = {}

  for (let ruleName in rules) {

    let value = values[ruleName]

    const rule: Types.Validator.Rule = rules[ruleName]

    // if the rule is null and value has a value, add it to values
    if (!rule) {
      if (rule === null && value !== undefined) {
        validValues[ruleName] = value
        values[ruleName] = value
      }
      continue
    }

    rule.ruleName = ruleName

    // if it's not required, has a default and not a value, set the default
    if (!rule.required && rule.default && !hasValue(value)) {
      validValues[ruleName] = rule.default
      values[ruleName] = rule.default
      continue
    }

    // first validate de field no matter what type it is
    let { err, value: validateValue } = await validateField(values, rule)

    // if there is an error, add it to the errors and continue to the next one
    if (err) {
      errors[ruleName] = err
      continue
    }

    // undefined means that the value won't be added
    if (validateValue === undefined) continue

    if (rule.type === Array || rule.type === Object) {

      // if it has no children then it's already validated, just continue
      if (!rule.children) {
        validValues[ruleName] = validateValue
        values[ruleName] = validateValue
        continue
      }

      if (rule.type === Array) {

        const validateArr = []
        const arrErr: Types.GenericObject = {}

        for (const i in validateValue) {

          const arrRes = await loop(validateValue[i], rule.children)
          if (arrRes.err) arrErr[i] = arrRes.err
          else validateArr.push(arrRes.values)
        }

        err = Object.keys(arrErr).length ? arrErr : null
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
    //  console.log({ validateValue, err })
    if (!err && validateValue !== undefined) {
      validValues[ruleName] = validateValue
      values[ruleName] = validateValue
    }

  }

  return { err: Object.keys(errors).length ? errors : null, values: validValues }

}