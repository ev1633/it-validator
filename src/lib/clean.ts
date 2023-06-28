import * as Types from '../@types/common'
export const sanitize = (value: string) => {
  if (typeof value !== 'string') return value
  const map: Types.GenericObject = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return value.replace(reg, (match) => (map[match]));
}

export const trim = (value: string) => {
  if (typeof value !== 'string') return value
  return value.trim()
}