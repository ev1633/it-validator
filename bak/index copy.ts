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
  errorMessage,
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


const validate = async (sentValues: any, sentRules: Validator.Rules): Promise<{ err: any, values: any }> => {
  if (!sentValues) throw "Need some fields to validate"
  if (!sentRules) throw "Need some rules to validate against"
  // const errors: string[] = []
  const errors: GenericObject = {}
  const values = sentValues
  const rules = sentRules(values)
  const validValues: GenericObject = {}
  /**
  * loop rules, execute loop 
  * @param  { object } fields = null - fields to validate
  * @param  { object } rules = null - rules to validate the fields with
  * @return { object }
  */
  const validate = async (): Promise<{ err: any, values: any }> => {

    Object.keys(rules).forEach(async (rule) => {
      const valid = await loop(rule, rules[rule], values[rule])
      console.log({ valid, rule })
      if (valid !== 'undefined' && typeof valid !== 'undefined') {
        validValues[rule] = valid
        values[rule] = valid
      }
    })

    return { err: Object.keys(errors).length ? errors : null, values: validValues }
  }

  /**
   * validate a single field with corresponding rule
   * @param  { string } ruleName - the name of the rule, only for error purpouses
   * @param  { object } rule - the rule object for validation
   * @param  { object } value - the value to validate
   * @return { undefined | any } - if valid the value else undefined
   */
  const validateField = async (ruleName: string, rule: Validator.Rule, value: any): Promise<any> => {
    console.log({ ruleName, values })
    if (!rule) return undefined

    if (rule.required && !hasValue(value)) {
      errors[ruleName] = errorMessage(rule.message, 'required', 'is required')
      return undefined
    } else if (!rule.required && rule.default && !hasValue(value)) {
      return rule.default
    }

    if (hasValue(value)) {
      const validType = validateType((rule as any).type, value)
      if (!validType.valid) {
        errors[ruleName] = errorMessage(rule.message, 'type', `value ${value} doesn't match the type ${validType.type}`)
        return undefined
      }

      if (invalidIn(rule, value)) {
        errors[ruleName] = errorMessage(rule.message, 'in', `value ${value} is not in ${rule.in}`)
        return undefined
      }

      if (invalidRegex(rule, value)) {
        errors[ruleName] = errorMessage(rule.message, 'regex', `value ${value} has not a valid format`)
        return undefined
      }

      if (invalidMax(rule, value)) {
        errors[ruleName] = errorMessage(rule.message, 'max', `value ${value} has a max of ${rule.max} characters`)
        return undefined
      }

      if (invalidMin(rule, value)) {
        errors[ruleName] = errorMessage(rule.message, 'min', `value ${value} has a min of ${rule.min} characters`)
        return undefined
      }
    }

    if (rule.validate) {
      const validateError = rule.validate(value)
      if (validateError) {
        errors[ruleName] = errorMessage(rule.message, 'validate', `value ${value}, ${validateError}`)
        return undefined
      }
    }

    if (invalidRequiredIf(rule, value, values)) {
      errors[ruleName] = errorMessage(rule.message, 'requiredIf', `value ${value}, needs to be present if ${rule.requiredIf![0]} is equal to ${rule.requiredIf![1]}`)
      return undefined
    }

    if (invalidRequiredUnless(rule, value, values)) {
      errors[ruleName] = errorMessage(rule.message, 'requiredUnless', `value ${value}, needs to be present unless ${rule.requiredWithout![0]} is equal to ${rule.requiredWithout![1]}`)
      return undefined
    }

    if (invalidRequiredWith(rule, value, values)) {
      errors[ruleName] = errorMessage(rule.message, 'requiredWith', `value ${value}, needs to be present if any of [${rule.requiredWith}] is present`)
      return undefined
    }

    if (invalidRequiredWithout(rule, value, values)) {
      errors[ruleName] = errorMessage(rule.message, 'requiredWithout', `value ${value}, needs to be present if any of [${rule.requiredWithout}] is not present`)
      return undefined
    }

    if (invalidRequiredWithoutAll(rule, value, values)) {
      errors[ruleName] = errorMessage(rule.message, 'requiredWithoutAll', `value ${value}, needs to be present if one of [${rule.requiredWithoutAll}] is not present`)
      return undefined
    }

    // if (rule.format)
    //   return rule.format.params ? rule.format.formatter(value, rule.format.params) : rule.format.formatter(value)

    if (!rule.required && rule.defaultAfterValidate && !hasValue(value)) {
      return rule.defaultAfterValidate
    }

    if (rule.clean) {

      if (rule.clean === true || rule.clean.trim)
        value = trim(value)

      if (rule.clean === true || rule.clean.sanitize)
        value = sanitize(value)

    }

    if (validateStringType(value)) return decodeURI(value)
    else return value
  }

  const loopArray = async (ruleName: string, rule: Validator.Rule, value: any): Promise<any> => {

    if (!rule) return undefined

    if (!value || !value.length) {
      if (rule.required) {
        errors[ruleName] = errorMessage(rule.message, 'required', `is required`)
        return undefined
      }
      return undefined
    }

    if (!(value instanceof Array)) {
      errors[ruleName] = errorMessage(rule.message, 'type', `must be of type Array`)
      return undefined
    }

    if (rule.max && value.length > rule.max) {
      errors[ruleName] = errorMessage(rule.message, 'max', `cannot have more than ${rule.max} children`)
      return undefined
    }

    if (!rule.children) return value

    if (rule.children instanceof Object) {
      const result = []
      value.forEach(async item => {
        const valid = await validateField(`${ruleName}.children`, (rule as GenericObject).children, item)
        if (hasValue(valid)) result[item] = valid
      })
      return value
    }

    return value.map(async item => {
      return await loop(`${ruleName}`, { ...rule, type: Object }, item)
    })

  }

  const loopObject = (ruleName: string, rule: Validator.Rule, value: any) => {

    if (!rule) return undefined

    if (!value) {
      if (rule.required) {
        errors[ruleName] = errorMessage(rule.message, 'required', `is required`)
        return undefined
      }
      return undefined
    }

    if (!(value instanceof Object)) {
      errors[ruleName] = errorMessage(rule.message, 'type', `children must be of type Object`)
      return undefined
    }

    if (!rule.children) return value

    const object: GenericObject = {}

    Object.keys((rule as any).children).forEach(async item => {
      const valid = await loop(`${ruleName}.${item}`, (rule as any).children[item], value[item])
      if (hasValue(valid)) object[item] = valid
    })

    return object

  }
  /**
   * if single field execute validateField, if array or object loop again
   * @param  { string } ruleName - the name of the rule, only for error purpouses
   * @param  { object } rule - the rule object for validation
   * @param  { object } value - the value to validate
   * @return { null | any } - the validated field or null
   */
  const loop = async (ruleName: string, rule: Validator.Rule, value: any): Promise<any> => {
    if (!rule) return value
    if (rule.type === Date || ![Array, Object].includes((rule as any).type))
      return await validateField(ruleName, rule, value)


    if (rule.type === Array)
      return await loopArray(ruleName, rule, value)


    if (rule.type === Object)
      return loopObject(ruleName, rule, value)
  }

  return await validate()
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
  invalidRequiredWithout
}

