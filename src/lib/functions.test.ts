import { hasValue, invalidAlpha, invalidAlphaNum, invalidAlphaDash, invalidIn, invalidRegex, invalidMax, invalidMin } from './functions';

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
    expect(invalidMax(12, 'asdasdasdasd')).toBe(false)
    expect(invalidMax(2, 'asdc')).toBe(true)
    expect(invalidMax(8, 'asd')).toBe(false)
    expect(invalidMax(123, 123)).toBe(false)
    expect(invalidMax(14, 15)).toBe(true)
    expect(invalidMax(14, true)).toBe(false)
  })

  test('returns true if input if less than min', () => {
    expect(invalidMin(5, 'asdc')).toBe(true)
    expect(invalidMin(2, 'as')).toBe(false)
    expect(invalidMin(8, 'asd')).toBe(true)
    expect(invalidMin(123, 123)).toBe(false)
    expect(invalidMin(15, 14)).toBe(true)
    expect(invalidMin(15, true)).toBe(false)
  })

})

