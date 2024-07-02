import { invalidNumber, invalidString, invalidBoolean, invalidArray, invalidObject, invalidDate, invalidType } from './types';

describe('individual types', () => {

  test('returns true if input is not a possible number', () => {
    expect(invalidNumber('s')).toBe(true)
    expect(invalidNumber(5)).toBe(false)
    expect(invalidNumber('5')).toBe(false)
    expect(invalidNumber('5s')).toBe(true)
    expect(invalidNumber('-5')).toBe(false)
    expect(invalidNumber(0)).toBe(false)
    expect(invalidNumber('0')).toBe(false)
    expect(invalidNumber(null)).toBe(false)
    expect(invalidNumber(false)).toBe(false)
    expect(invalidNumber(true)).toBe(false)
    expect(invalidNumber(undefined)).toBe(true)
  }) 

  test('returns true if input is not a string', () => {
    expect(invalidString('s')).toBe(false)
    expect(invalidString(5)).toBe(true)
    expect(invalidString('5')).toBe(false)
    expect(invalidString('5s')).toBe(false)
    expect(invalidString('-5')).toBe(false)
    expect(invalidString(0)).toBe(true)
    expect(invalidString('')).toBe(false)
    expect(invalidString(null)).toBe(true)
    expect(invalidString(false)).toBe(true)
    expect(invalidString(true)).toBe(true)
    expect(invalidString(undefined)).toBe(true)
  })

  test('returns true if input is not a Boolean', () => {
    expect(invalidBoolean(true)).toBe(false)
    expect(invalidBoolean(false)).toBe(false)
    expect(invalidBoolean(0)).toBe(false)
    expect(invalidBoolean(1)).toBe(false)
    expect(invalidBoolean('1')).toBe(false)
    expect(invalidBoolean('0')).toBe(false)
    expect(invalidBoolean('true')).toBe(false)
    expect(invalidBoolean('false')).toBe(false)
    expect(invalidBoolean(null)).toBe(true)
    expect(invalidBoolean(undefined)).toBe(true)
  })

  test('returns true if input is not an Array', () => {
    expect(invalidArray([])).toBe(false)
    expect(invalidArray([1, 2])).toBe(false)
    expect(invalidArray('[]')).toBe(true)
    expect(invalidArray({})).toBe(true)
    expect(invalidArray('string, string2')).toBe(true)
    expect(invalidArray(null)).toBe(true)
    expect(invalidArray(false)).toBe(true)
    expect(invalidArray(undefined)).toBe(true)
  })

  test('returns true if input is not an Object', () => {
    expect(invalidObject([])).toBe(true)
    expect(invalidObject([1, 2])).toBe(true)
    expect(invalidObject(Date())).toBe(true)
    expect(invalidObject({})).toBe(false)
    expect(invalidObject({ test: 'string' })).toBe(false)
    expect(invalidObject(null)).toBe(true)
    expect(invalidObject(false)).toBe(true)
    expect(invalidObject(undefined)).toBe(true)
  })

  test('returns true if input is not a possible Date format', () => {
    expect(invalidDate([])).toBe(true)
    expect(invalidDate(Date())).toBe(false)
    expect(invalidDate(123)).toBe(false)
    expect(invalidDate('2020/12/20')).toBe(false)
    expect(invalidDate('2020/20/20')).toBe(true)
    expect(invalidDate(null)).toBe(true)
    expect(invalidDate(false)).toBe(true)
    expect(invalidDate(undefined)).toBe(true)
  })


})

describe('invalidType', () => {
  test('returns the Type if input is does not match the type', () => {
    expect(invalidType(Number, 8)).toBe(false)
    expect(invalidType(Number, '8')).toBe(false)
    expect(invalidType(Number, 's')).toBe("Number")
    expect(invalidType(String, '')).toBe(false)
    expect(invalidType(String, 'string')).toBe(false)
    expect(invalidType(String, 8)).toBe("String")
    expect(invalidType(Boolean, 's')).toBe('Boolean')
    expect(invalidType(Boolean, 1)).toBe(false)
    expect(invalidType(Object, [])).toBe('Object')
    expect(invalidType(Object, {})).toBe(false)
    expect(invalidType(Array, {})).toBe("Array")
    expect(invalidType(Array, [])).toBe(false)
    expect(invalidType(Date, new Date())).toBe(false)
    expect(invalidType(Date, 'string')).toBe("Date")
  })
})