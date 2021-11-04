import * as Types from '../@types/common'
export const sanitize = (string: string) => {
  const map: Types.GenericObject = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match) => (map[match]));
}

export const trim = (string: string) => {
  return string.trim()
}