/**
  * check type and execute validating function
  * @param  { function } type - type of value to validate
  * @param { any } value - value to validate
  * @return { object }
  */
export const validateType = (type: Validator.Type, value: any): GenericObject => {
  const validated: { valid: boolean, type: Validator.Type } = { valid: false, type: null }
  switch (type) {
    case Number:
      validated.type = "Number"
      validated.valid = validateNumberType(value)
      break;
    case Date:
      validated.type = "Date"
      validated.valid = validateDateType(value)
      break;
    case Array:
      validated.type = "Array"
      validated.valid = validateArrayType(value)
      break;
    case Object:
      validated.type = "Object"
      validated.valid = validateObjectType(value)
      break;
    case String:
      validated.type = "String"
      validated.valid = validateStringType(value)
      break;
    default:
      validated.type = "String"
      validated.valid = validateStringType(value)
  }
  return validated

}
export const validateNumberType = (value: any): boolean => {
  return (!isNaN(value) || typeof value === "number" || value instanceof Number)
}
export const validateDateType = (value: any): boolean => {
  return (!isNaN(Date.parse(value)) || value instanceof Date)
}
export const validateArrayType = (value: any): boolean => {
  return (value instanceof Array)
}
export const validateObjectType = (value: any): boolean => {
  return (value instanceof Object)
}
export const validateStringType = (value: any): boolean => {
  return (typeof value === 'string' || value instanceof String)
}