var E=Object.freeze({__proto__:null});const v=t=>{if(typeof t!="string")return t;const e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"},r=/[&<>"'/]/ig;return t.replace(r,n=>e[n])},$=t=>typeof t!="string"?t:t.trim(),b=t=>!(!isNaN(t)||typeof t=="number"||t instanceof Number),A=t=>!(!isNaN(Date.parse(t))||t instanceof Date),N=t=>!(t instanceof Array),x=t=>!(t instanceof Object&&!(t instanceof Date)&&!(t instanceof Array)),g=t=>!(typeof t=="string"||t instanceof String),W=t=>!(typeof t=="boolean"||[0,1,"1","0","true","false"].includes(t)),p=(t,e)=>{if(!t)return!1;switch(t){case Boolean:return W(e)?"Boolean":!1;case Number:return b(e)?"Number":!1;case Date:return A(e)?"Date":!1;case Array:return N(e)?"Array":!1;case Object:return x(e)?"Object":!1;case String:return g(e)?"String":!1;default:return!1}},R=t=>{if(g(t))return t;const e=t;return e.includes(",")?e.split(",").map(r=>r.trim()):[e]},_=(t,e)=>{try{switch(t){case Number:return Number(e);case Array:return R(e);case Boolean:return!!e;case String:return`${e}`;default:return!1}}catch(r){return e}},F=/\s/g,U=/^[a-zA-Z\s]+$/,B=/^[0-9a-zA-Z\s]+$/,T=/^[0-9a-zA-Z\s-_]+$/,M=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,c=(t=null)=>(typeof t=="string"&&(t=t.replace(F,"").length?t:null),typeof t!="undefined"&&t!==null),j=(t=void 0)=>!t||typeof t!="string"?!0:!U.test(t),D=(t=void 0)=>!t||typeof t!="string"?!0:!B.test(t),w=(t=void 0)=>!t||typeof t!="string"?!0:!T.test(t),I=(t=void 0)=>!t||typeof t!="string"?!0:!M.test(t),O=(t,e=void 0)=>!t.length||!(t instanceof Array)?!0:!t.includes(e),S=(t,e=void 0)=>(e instanceof Date&&(e=e.toISOString()),!t.test(String(e))),V=(t,e,r=void 0)=>t===Number&&Number(r)>e||r.length>e,z=(t,e,r=void 0)=>t===Number&&Number(r)<e||r.length<e,Z=(t,e,r=void 0)=>t.length!==2||!(t[0]in e)||e[t[0]]===t[1]&&!c(r),P=(t,e,r=void 0)=>t.length!==2||!(t[0]in e)||e[t[0]]!==t[1]&&!c(r),C=(t,e,r=void 0)=>!c(r)&&t.some(n=>n in e&&c(e[n])),G=(t,e,r=void 0)=>!c(r)&&t.some(n=>!(n in e)||!c(e[n])),H=(t,e,r=void 0)=>!c(r)&&t.every(n=>!(n in e)&&!c(e[n])),a=(t,e,r)=>t?typeof t=="string"||typeof t!="object"?t:t[e]?t[e]:r:r,J=(t,e,r)=>{if(!t)return{[e]:r};const n=t[e]&&typeof t[e]=="object"&&typeof r=="object"?{...t[e],...r}:r;return{...t,[e]:n}},o=(t,e)=>t?e:()=>!1,K=async(t,e)=>{if(!e)return{err:null,value:void 0};if(!e.type)throw new Error(`${e.ruleName} must have a type property specified`);let r=t[e.ruleName];if(e.required&&!c(r))return{err:a(e.message,"required","is required"),value:r};if(r!=null&&e.convert&&(r=_(e.convert===!0?e.type:e.convert||!1,r)),e.ruleName in t&&t[e.ruleName]!==void 0){const n=p(e.type,r);if(n)return{err:a(e.message,"type",`value ${r} doesn't match the type ${n}`),value:r};if(o(!!e.min,z)(e.type,e.min,r))return{err:a(e.message,"min",`value ${r} has a min of ${e.min}`),value:r};if(o(!!e.max,V)(e.type,e.max,r))return{err:a(e.message,"max",`value ${r} has a max of ${e.max}`),value:r};if(o(e.alpha,j)(r))return{err:a(e.message,"alpha",`value ${r} must contain alphabetic characters only`),value:r};if(o(e.alphaNum,D)(r))return{err:a(e.message,"alphaNum",`value ${r} must contain alphanumeric characters only`),value:r};if(o(e.alphaDash,w)(r))return{err:a(e.message,"alphaDash",`value ${r} must contain alphanumeric characters, dashes or undescores only`),value:r};if(o(e.email,I)(r))return{err:a(e.message,"email",`value ${r} must be a valid email`),value:r};if(o(!!e.in,O)(e.in,r))return{err:a(e.message,"in",`value ${r} is not in ${e.in}`),value:r};if(o(!!e.regex,S)(e.regex,r))return{err:a(e.message,"regex",`value ${r} has not a valid format`),value:r}}if(e.validate){const n=await e.validate(r);if(n)return{err:a(e.message,"validate",`${n}`),value:r}}return o(!!e.requiredIf,Z)(e.requiredIf,t,r)?{err:a(e.message,"requiredIf",`value ${r}, needs to be present if ${e.requiredIf[0]} is equal to ${e.requiredIf[1]}`),value:r}:o(!!e.requiredUnless,P)(e.requiredUnless,t,r)?{err:a(e.message,"requiredUnless",`value ${r}, needs to be present unless ${e.requiredWithout[0]} is equal to ${e.requiredWithout[1]}`),value:r}:o(!!e.requiredWith,C)(e.requiredWith,t,r)?{err:a(e.message,"requiredWith",`value ${r}, needs to be present if any of [${e.requiredWith}] is present`),value:r}:o(!!e.requiredWithout,G)(e.requiredWithout,t,r)?{err:a(e.message,"requiredWithout",`value ${r}, needs to be present if one of [${e.requiredWithout}] is not present`),value:r}:o(!!e.requiredWithoutAll,H)(e.requiredWithoutAll,t,r)?{err:a(e.message,"requiredWithoutAll",`value ${r}, needs to be present if all of [${e.requiredWithoutAll}] is not present`),value:r}:!e.required&&e.defaultAfterValidate&&!c(r)?{err:null,value:e.defaultAfterValidate}:(r&&(e.clean&&((e.clean===!0||e.clean.trim)&&(r=$(r)),(e.clean===!0||e.clean.sanitize)&&(r=v(r))),p({...e,type:Number},r)&&!p({...e,type:String},r)&&(r=decodeURI(r))),{err:null,value:r})},y=async(t,e)=>{let r={},n={};for(let i in e){let u=t[i];const s=e[i];if(!s){s===null&&u!==void 0&&(r[i]=u,t[i]=u);continue}if(s.ruleName=i,!s.required&&s.default&&!c(u)){r[i]=s.default,t[i]=s.default;continue}let{err:f,value:d}=await K(t,s);if(f){n[i]=f;continue}if(d!==void 0){if(s.type===Array||s.type===Object){if(!s.children){r[i]=d,t[i]=d;continue}if(s.type===Array){const l=[],h={};for(const q in d){const m=await y(d[q],s.children);m.err?h[q]=m.err:l.push(m.values)}f=Object.keys(h).length?h:null,f&&(n[i]=f),d=l}else{const l=await y(d,s.children);f=l.err,f&&(n[i]=f),d=l.values}}!f&&d!==void 0&&(r[i]=d,t[i]=d)}}return{err:Object.keys(n).length?n:null,values:r}},L=async(t,e)=>{if(!t)return{err:{validatorFatal:"Need some fields to validate"},values:null};if(!e)return{err:{validatorFatal:"Need some rules to validate against"},values:null};try{const{err:r,values:n}=await(async(i,u)=>await y(i,u(i)))(t,e);return{err:r,values:n}}catch(r){return{err:{validatorFatal:r.message||r},values:null}}};export{E as Types,J as addError,R as convertToArray,c as hasValue,j as invalidAlpha,w as invalidAlphaDash,D as invalidAlphaNum,N as invalidArray,W as invalidBoolean,A as invalidDate,I as invalidEmail,O as invalidIn,V as invalidMax,z as invalidMin,b as invalidNumber,x as invalidObject,S as invalidRegex,g as invalidString,p as invalidType,v as sanitize,$ as trim,L as validate};
