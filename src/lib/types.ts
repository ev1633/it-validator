import * as Types from '../@types/common'
export const invalidNumber = (value: any): boolean => {
  return !(!isNaN(value) || typeof value === "number" || value instanceof Number)
}
export const invalidDate = (value: any): boolean => {
  return !(!isNaN(Date.parse(value)) || value instanceof Date)
}
export const invalidArray = (value: any): boolean => {
  return !(value instanceof Array)
}
export const invalidObject = (value: any): boolean => {
  return !(value instanceof Object && !(value instanceof Date) && !(value instanceof Array))
}
export const invalidString = (value: any): boolean => {
  return !(typeof value === 'string' || value instanceof String)
}
export const invalidBoolean = (value: any): boolean => {
  return !(typeof value === 'boolean' || [0, 1, '1', '0', 'true', 'false'].includes(value))
}

/**
  * check type and execute validating function
  * @param  { function } type - type of value to validate
  * @param { any } value - value to validate
  * @return { object }
  */

export const invalidType = (type: Types.Validator.Type | undefined, value: any): boolean | string => {
  if (!type) return false

  switch (type) {
    case Boolean:
      return invalidBoolean(value) ? 'Boolean' : false
    case Number:
      return invalidNumber(value) ? 'Number' : false
    case Date:
      return invalidDate(value) ? 'Date' : false
    case Array:
      return invalidArray(value) ? 'Array' : false
    case Object:
      return invalidObject(value) ? 'Object' : false
    case String:
      return invalidString(value) ? 'String' : false
    default:
      return false
  }

}
