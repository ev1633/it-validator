import {
  hasValue,
  invalidAlpha,
  invalidAlphaNum,
  invalidAlphaDash,
  invalidIn,
  invalidRegex,
  invalidMax,
  invalidMin,
  invalidRequiredIf,
  invalidRequiredUnless,
  invalidRequiredWith,
  invalidRequiredWithout,
  invalidRequiredWithoutAll
} from './functions';

describe('functions', () => {

  test('returns true if input has a usable value', () => {
    expect(hasValue('')).toBe(false)
    expect(hasValue()).toBe(false)
    expect(hasValue('5')).toBe(true)
    expect(hasValue(null)).toBe(false)
    expect(hasValue(false)).toBe(true)
    expect(hasValue(true)).toBe(true)
    expect(hasValue(undefined)).toBe(false)
  })

  test('returns true if input does not consists of alphabetical caracters or spaces', () => {
    expect(invalidAlpha('')).toBe(true)
    expect(invalidAlpha(true)).toBe(true)
    expect(invalidAlpha('$')).toBe(true)
    expect(invalidAlpha(5)).toBe(true)
    expect(invalidAlpha('5')).toBe(true)
    expect(invalidAlpha('_')).toBe(true)
    expect(invalidAlpha(null)).toBe(true)
    expect(invalidAlpha(undefined)).toBe(true)
    expect(invalidAlpha(false)).toBe(true)
  })

  test('returns true if input does not consists of alphanumerical caracters or spaces', () => {
    expect(invalidAlphaNum('')).toBe(true)
    expect(invalidAlphaNum(true)).toBe(true)
    expect(invalidAlphaNum('$')).toBe(true)
    expect(invalidAlphaNum(5)).toBe(true)
    expect(invalidAlphaNum('5 ')).toBe(false)
    expect(invalidAlphaNum(true)).toBe(true)
    expect(invalidAlphaNum(false)).toBe(true)
    expect(invalidAlphaNum(null)).toBe(true)
    expect(invalidAlphaNum('_')).toBe(true)
  })


  test('returns true if input does not consists of alphanumerical caracters, dashes or spaces', () => {
    expect(invalidAlphaDash('')).toBe(true)
    expect(invalidAlphaDash(true)).toBe(true)
    expect(invalidAlphaDash('$')).toBe(true)
    expect(invalidAlphaDash(5)).toBe(true)
    expect(invalidAlphaDash('5')).toBe(false)
    expect(invalidAlphaDash(true)).toBe(true)
    expect(invalidAlphaDash(false)).toBe(true)
    expect(invalidAlphaDash(null)).toBe(true)
  })

  test('returns true if input is not in array', () => {
    expect(invalidIn([1, 2], '')).toBe(true)
    expect(invalidIn([1, 2], 1)).toBe(false)
    expect(invalidIn([], 1)).toBe(true)
    expect(invalidIn([], '')).toBe(true)
    expect(invalidIn([1], {})).toBe(true)
    expect(invalidIn(['one', 'two'], 'two')).toBe(false)
    expect(invalidIn([1, 2], '2')).toBe(true)
  })

  test('returns true if input does not pass regex', () => {
    expect(invalidRegex(/^[0-9a-zA-Z]+$/, '')).toBe(true)
    expect(invalidRegex(/^asd+$/, 'asdc')).toBe(true)
    expect(invalidRegex(/^asd+$/, 'asd')).toBe(false)
    expect(invalidRegex(/^[0-9]+$/, 123)).toBe(false)
  })

  test('returns true if input if greater than max', () => {
    expect(invalidMax(Number,12, 'asdasdasdasd')).toBe(false)
    expect(invalidMax(Number,2, 'asdc')).toBe(true)
    expect(invalidMax(Number,8, 'asd')).toBe(false)
    expect(invalidMax(Number,123, 123)).toBe(false)
    expect(invalidMax(Number,14, 15)).toBe(true)
    expect(invalidMax(Number,14, true)).toBe(false)
  })

  test('returns true if input if less than min', () => {
    expect(invalidMin(Number,5, 'asdc')).toBe(true)
    expect(invalidMin(Number,2, 'as')).toBe(false)
    expect(invalidMin(Number,8, 'asd')).toBe(true)
    expect(invalidMin(Number,123, 123)).toBe(false)
    expect(invalidMin(Number,15, 14)).toBe(true)
    expect(invalidMin(Number,15, true)).toBe(true)
    expect(invalidMin(String,2, '')).toBe(true)
  })

  test('returns true if the value of first parameter does not match the second parameter', () => {
    expect(invalidRequiredIf(['another_field', 10], { "another_field": 10 }, 10)).toBe(false)
    expect(invalidRequiredIf(['another_field', 10], { "another_field": 10 }, null)).toBe(true)
    expect(invalidRequiredIf(['another_field', 11], { "another_field": 10 })).toBe(false)
  })

  test('returns true if the value of first parameter matches the second parameter', () => {
    expect(invalidRequiredUnless(['another_field', 10], { "another_field": 10 })).toBe(false)
    expect(invalidRequiredUnless(['another_field', 10], { "another_field": 11 }, 14)).toBe(false)
    expect(invalidRequiredUnless(['another_field', 10], { "another_field": 11 }, true)).toBe(false)
    expect(invalidRequiredUnless(['another_field', 10], { "another_field": 11 }, false)).toBe(false)
    expect(invalidRequiredUnless(['another_field', 10], { "another_field": 11 }, null)).toBe(true)
    expect(invalidRequiredUnless(['another_field', 1], { "another_field": 10 })).toBe(true)
  })

  test('returns true if the third parameter is missing or does not have a valid value and one of the values in the first parameter is in the second parameter and has a value', () => {
    expect(invalidRequiredWith(['another_field'], { "another_field": 10 })).toBe(true)
    expect(invalidRequiredWith(['another_field', 'other'], { "other": 11 }, false)).toBe(false)
    expect(invalidRequiredWith(['another_field', 'other'], { "other": 11 })).toBe(true)
    expect(invalidRequiredWith(['another_field', 'other'], { "other": 11 }, null)).toBe(true)
    expect(invalidRequiredWith(['another_field', 'other'], { "another": 11 }, null)).toBe(false)
  })

  test('returns true when the third parameter is not valid or missing and some of the first parameters values is not present in the second', () => {
    expect(invalidRequiredWithout(['another_field'], { "another_field": 10 })).toBe(false)
    expect(invalidRequiredWithout(['another_field'], { "other": 11 })).toBe(true)
    expect(invalidRequiredWithout(['another_field'], { "other": 11 }, null)).toBe(true)
  })

  test('returns true when the third parameter is not valid or missing and all of the first parameters values are not present in the second', () => {
    expect(invalidRequiredWithoutAll(['another_field', 'other'], { "another_field": 10 })).toBe(false)
    expect(invalidRequiredWithoutAll(['another_field', 'other'], { "another": 10 })).toBe(true)
    expect(invalidRequiredWithoutAll(['another_field', 'other'], { "another": 10 }, 1)).toBe(false)
  })


})

