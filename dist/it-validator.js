"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var index=Object.freeze({__proto__:null});const sanitize=t=>{const e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"},r=/[&<>"'/]/ig;return t.replace(r,i=>e[i])},trim=t=>t.trim(),invalidNumber=t=>!(!isNaN(t)||typeof t=="number"||t instanceof Number),invalidDate=t=>!(!isNaN(Date.parse(t))||t instanceof Date),invalidArray=t=>!(t instanceof Array),invalidObject=t=>!(t instanceof Object&&!(t instanceof Date)&&!(t instanceof Array)),invalidString=t=>!(typeof t=="string"||t instanceof String),invalidBoolean=t=>!(typeof t=="boolean"||[0,1,"1","0","true","false"].includes(t)),invalidType=(t,e)=>{if(!t)return!1;switch(t){case Boolean:return invalidBoolean(e)?"Boolean":!1;case Number:return invalidNumber(e)?"Number":!1;case Date:return invalidDate(e)?"Date":!1;case Array:return invalidArray(e)?"Array":!1;case Object:return invalidObject(e)?"Object":!1;case String:return invalidString(e)?"String":!1;default:return!1}},hasValueRegex=/\s/g,invalidAlphaRegex=/^[a-zA-Z\s]+$/,invalidAlphaNumRegex=/^[0-9a-zA-Z\s]+$/,invalidAlphaDashRegex=/^[0-9a-zA-Z\s-_]+$/,invalidEmailRegex=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,hasValue=(t=null)=>(typeof t=="string"&&(t=t.replace(hasValueRegex,"").length?t:null),typeof t!="undefined"&&t!==null),invalidAlpha=(t=void 0)=>!t||typeof t!="string"?!0:!invalidAlphaRegex.test(t),invalidAlphaNum=(t=void 0)=>!t||typeof t!="string"?!0:!invalidAlphaNumRegex.test(t),invalidAlphaDash=(t=void 0)=>!t||typeof t!="string"?!0:!invalidAlphaDashRegex.test(t),invalidEmail=(t=void 0)=>!t||typeof t!="string"?!0:!invalidEmailRegex.test(t),invalidIn=(t,e=void 0)=>!t.length||!(t instanceof Array)?!0:!t.includes(e),invalidRegex=(t,e=void 0)=>(e instanceof Date&&(e=e.toISOString()),!t.test(String(e))),invalidMax=(t,e,r=void 0)=>t===Number&&Number(r)>e||r.length>e,invalidMin=(t,e,r=void 0)=>t===Number&&Number(r)<e||r.length<e,invalidRequiredIf=(t,e,r=void 0)=>t.length!==2||!(t[0]in e)||e[t[0]]===t[1]&&!hasValue(r),invalidRequiredUnless=(t,e,r=void 0)=>t.length!==2||!(t[0]in e)||e[t[0]]!==t[1]&&!hasValue(r),invalidRequiredWith=(t,e,r=void 0)=>!hasValue(r)&&t.some(i=>i in e&&hasValue(e[i])),invalidRequiredWithout=(t,e,r=void 0)=>!hasValue(r)&&t.some(i=>!(i in e)||!hasValue(e[i])),invalidRequiredWithoutAll=(t,e,r=void 0)=>!hasValue(r)&&t.every(i=>!(i in e)&&!hasValue(e[i])),errorMessage=(t,e,r)=>t?typeof t=="string"||typeof t!="object"?t:t[e]?t[e]:r:r,execIfPresent=(t,e)=>t?e:()=>!1,validateField=async(t,e)=>{if(!e)return{err:null,value:void 0};if(!e.type)throw new Error(`${e.ruleName} must have a type property specified`);let r=t[e.ruleName];if(e.required&&!hasValue(r))return{err:errorMessage(e.message,"required","is required"),value:r};if(e.ruleName in t&&t[e.ruleName]!==void 0){const i=invalidType(e.type,r);if(i)return{err:errorMessage(e.message,"type",`value ${r} doesn't match the type ${i}`),value:r};if(execIfPresent(!!e.min,invalidMin)(e.type,e.min,r))return{err:errorMessage(e.message,"min",`value ${r} has a min of ${e.min}`),value:r};if(execIfPresent(!!e.max,invalidMax)(e.type,e.max,r))return{err:errorMessage(e.message,"max",`value ${r} has a max of ${e.max}`),value:r};if(execIfPresent(e.alpha,invalidAlpha)(r))return{err:errorMessage(e.message,"alpha",`value ${r} must contain alphabetic characters only`),value:r};if(execIfPresent(e.alphaNum,invalidAlphaNum)(r))return{err:errorMessage(e.message,"alphaNum",`value ${r} must contain alphanumeric characters only`),value:r};if(execIfPresent(e.alphaDash,invalidAlphaDash)(r))return{err:errorMessage(e.message,"alphaDash",`value ${r} must contain alphanumeric characters, dashes or undescores only`),value:r};if(execIfPresent(e.email,invalidEmail)(r))return{err:errorMessage(e.message,"email",`value ${r} must be a valid email`),value:r};if(execIfPresent(!!e.in,invalidIn)(e.in,r))return{err:errorMessage(e.message,"in",`value ${r} is not in ${e.in}`),value:r};if(execIfPresent(!!e.regex,invalidRegex)(e.regex,r))return{err:errorMessage(e.message,"regex",`value ${r} has not a valid format`),value:r}}if(e.validate){const i=await e.validate(r);if(i)return{err:errorMessage(e.message,"validate",`${i}`),value:r}}return execIfPresent(!!e.requiredIf,invalidRequiredIf)(e.requiredIf,t,r)?{err:errorMessage(e.message,"requiredIf",`value ${r}, needs to be present if ${e.requiredIf[0]} is equal to ${e.requiredIf[1]}`),value:r}:execIfPresent(!!e.requiredUnless,invalidRequiredUnless)(e.requiredUnless,t,r)?{err:errorMessage(e.message,"requiredUnless",`value ${r}, needs to be present unless ${e.requiredWithout[0]} is equal to ${e.requiredWithout[1]}`),value:r}:execIfPresent(!!e.requiredWith,invalidRequiredWith)(e.requiredWith,t,r)?{err:errorMessage(e.message,"requiredWith",`value ${r}, needs to be present if any of [${e.requiredWith}] is present`),value:r}:execIfPresent(!!e.requiredWithout,invalidRequiredWithout)(e.requiredWithout,t,r)?{err:errorMessage(e.message,"requiredWithout",`value ${r}, needs to be present if one of [${e.requiredWithout}] is not present`),value:r}:execIfPresent(!!e.requiredWithoutAll,invalidRequiredWithoutAll)(e.requiredWithoutAll,t,r)?{err:errorMessage(e.message,"requiredWithoutAll",`value ${r}, needs to be present if all of [${e.requiredWithoutAll}] is not present`),value:r}:!e.required&&e.defaultAfterValidate&&!hasValue(r)?{err:null,value:e.defaultAfterValidate}:(r&&(e.clean&&((e.clean===!0||e.clean.trim)&&(r=trim(r)),(e.clean===!0||e.clean.sanitize)&&(r=sanitize(r))),invalidType({...e,type:Number},r)&&!invalidType({...e,type:String},r)&&(r=decodeURI(r))),{err:null,value:r})},loop=async(t,e)=>{let r={},i={};for(let n in e){let d=t[n];const a=e[n];if(!a){a===null&&d!==void 0&&(r[n]=d,t[n]=d);continue}if(a.ruleName=n,!a.required&&a.default&&!hasValue(d)){r[n]=a.default,t[n]=a.default;continue}let{err:o,value:s}=await validateField(t,a);if(o){i[n]=o;continue}if(s!==void 0){if(a.type===Array||a.type===Object){if(!a.children){r[n]=s,t[n]=s;continue}if(a.type===Array){const f=[],l={};for(const u in s){const c=await loop(s[u],a.children);c.err?l[u]=c.err:f.push(c.values)}o=l,o&&(i[n]=o),s=f}else{const f=await loop(s,a.children);o=f.err,o&&(i[n]=o),s=f.values}}!o&&s!==void 0&&(r[n]=s,t[n]=s)}}return{err:Object.keys(i).length?i:null,values:r}},validate=async(t,e)=>{if(!t)return{err:{validatorFatal:"Need some fields to validate"},values:null};if(!e)return{err:{validatorFatal:"Need some rules to validate against"},values:null};try{const{err:r,values:i}=await(async(n,d)=>await loop(n,d(n)))(t,e);return{err:r,values:i}}catch(r){return{err:{validatorFatal:r.message||r},values:null}}};exports.Types=index,exports.hasValue=hasValue,exports.invalidAlpha=invalidAlpha,exports.invalidAlphaDash=invalidAlphaDash,exports.invalidAlphaNum=invalidAlphaNum,exports.invalidArray=invalidArray,exports.invalidBoolean=invalidBoolean,exports.invalidDate=invalidDate,exports.invalidEmail=invalidEmail,exports.invalidIn=invalidIn,exports.invalidMax=invalidMax,exports.invalidMin=invalidMin,exports.invalidNumber=invalidNumber,exports.invalidObject=invalidObject,exports.invalidRegex=invalidRegex,exports.invalidString=invalidString,exports.invalidType=invalidType,exports.sanitize=sanitize,exports.trim=trim,exports.validate=validate;
