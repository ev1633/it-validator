import * as Types from '../@types/common'

export const invalidNumber = (value: any): boolean => {
  return !(!isNaN(value) || typeof value === "number" || value instanceof Number)
}
export const invalidDate = (value: any): boolean => {
  return !(!isNaN(Date.parse(value)) || value instanceof Date)
}
export const invalidArray = (value: unknown): boolean => {
  return !(value instanceof Array)
}
export const invalidObject = (value: any): boolean => {
  return !(value instanceof Object && !(value instanceof Date) && !(value instanceof Array))
}
export const invalidString = (value: unknown): boolean => {
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

export const convertToArray = (value: string) => {
  if(invalidString(value)) return value
  const theValue = value as string
  if (!theValue.includes(',')) return [theValue];
  return theValue.split(',').map((item) => item.trim());
};

export const convert = (type: Types.Validator.Convert, value: unknown) => {
  switch (type) {
    case Number:
      return Number(value)
    case Array:
      return convertToArray(value as string)
    case Boolean:
      return !!value
    case String:
      return `${value}`
    default:
      return false
  }

}