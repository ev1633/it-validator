# it-validator

## _DISCLAIMER_
>_I'm making this library because I needed a validation library that can grow and adapt to every project(something I couldn't really find online).<br/>The docs aren't really finished, and the library still has some way to go, I'll update and extend it over time.<br/>Happy coding._

## The it-validator is an async validation library designed to make request validations easier
- [Installation](#installation)
- [The basics](#the-basics)
- [Available methods](#available-methods)
- [Errors](#errors)
- [Values](#values)
- [Including values without validating](#including-values-without-validating)
- [Why a function returning an object?](#why-a-function-returning-an-object)
- [Custom validations?](#custom-validations)
- [What is the rules parameter for?](#what-is-the-rules-paramater-for)

### Installation
The it-validator work both on Node and your browser.
```js
npm i it-validator
#or
yarn add it-validator
```
### The basics

To start using the library, you'll need 3 things:
- The object to validate
- The rules function that returns the rules to validate with
- The actual validator call

#### The object to validate
It's a simple object that needs validation
```js
const obj = {
  requiredString: "I'm required",
  someNumberGreaterThan5: 6,
  onlyRequiredWithoutAnotherField:null
}
```

#### The rules
A function that accepts a parameter ( you can name it whatever you want, more on this later ) and returns the actual rules object
```js
const rules = (obj) => ({
  requiredString: { required:true, type:String },
  someNumberGreaterThan5: { type: Number, min: 6 },
  onlyRequiredWithoutAnotherField: { requiredWithout: ['someNumberGreaterThan5'] }
})
```

#### The validator call
Now that you have your object and rules, let's validate them

First you need to import the validate method
```js
import { validate } from it-validator"
```

Then you call the validate function using async/await or .then.<br/>
The validate function accepts 2 parameters: (the object, the rules)<br/>
It will return an object containing the err and values properties
```js
const { err, values } = await validate(obj, rules)
```



### Errors

The error returned by the validator is an object containing all the failed rules as props.<br/>
Every property in the error message is a property from the object you sent to validate that didn't pass your requirements 

#### Custom error for every type of validation

Each error contains a default message, but you can override this.
In the rules object you can provide a message property with a text for every failed validation for that specific rule.
See the [message](#message) section of the [Available methods](#available-methods).

### Values

Sometimes you may wish to continue with a valid values object even when you have errors. <br/>
That's why the library still returns a values object containing every value that passed validations.



### Why a function returning an object?

In order to allow the validate function to be asynchronous and to be able to access another values in the object you sent to validate, we need to initialize the rules as a function that accepts a parameter and returns an object with the actual rules.


### Custom Validations

The library provides you a way of making your own custom validations inside the rules using the validate property.<br/>
See the [validate](#validate) method in [Available methods](#available-methods)


### What is the rules parameter for?

The misterious parameter you sent the rules function is not required, it's only for a special cases where one of your rules requires another of your rules value.
One example would be using this parameter along with the validate property.

```js
const rules = (values) => {
  const validateTheRequiredString = (value) => {
    if( !values.stringCompany ) return "I'm missing my company";
    return undefined;
  }
  return {
    stringCompany: { type: String },
    requiredString: { required:true, type:String, validate: validateTheRequiredString }
  }
  
}
```

### Including values without validating
If you wish to include a field in the values result without validating it you just set a null to the rule.
```js
const rules = (values) => ({
  includeWithoutvalidation: null
})
```



### Available methods
- [type](#type)
- [required](#required)
- [min and max](#min-and-max)
- [email](#email)
- [in](#in)
- [regex](#regex)
- [requiredIf](#requiredif)
- [requiredUnless](#requiredunless)
- [requiredWith](#requiredwith)
- [requiredWithout](#requiredwithout)
- [requiredWithoutAll](#requiredWithoutAll)
- [alpha](#alpha)
- [validate](#validate)
- [default](#default)
- [clean](#clean)
- [message](#message)
- [children](#children)

#### type
Checks if the value corresponds with the specified type
```js
const rules = (values) => ({
  stringField: { type:String }
})
```
The available types are:
  - String
  - Number: not a strict validation, a string containing a posible number will evaluate to true
  - Object
  - Array
  - Date

#### required
The field must be present, not null, not undefined and not an empty string ''
```js
const rules = (values) => ({
  requiredField: { required: true }
})
```

#### min and max
Specify the min or max values of the field. For numbers will be the exact value of the number, for strings and arrays will be the length of it.
```js
const rules = (values) => ({
  stringBetween3and6Length: { min: 3, max: 6 },
  numberBetween2and4: { min: 2, max: 4 }
})
```

#### email
A very simple validation for email, it's not perfect but it will validate a simple email.
```js
const rules = (values) => ({
  simpleEmail: { email:true }
})
```

#### in
The value will only pass the validation if it's in the declared array.
```js
const rules = (values) => ({
  numberOnlyBelow3: { type: Number, in: [1,2,3] },
  specificStrings: { type: String, in:['one string', 'or maybe this one'] }
})
```

#### regex
Specify a regex to validate against
```js
const rules = (values) => ({
  regexValidation: { regex: /^[a-z]+$/ }
})
```

### requiredIf
The field under validation is required only if the specified field has the declared value.
You declare it with and array with the first item beeing the field, and the second item beeing the value of that field.
```js
const rules = (values) => ({
  sometimesRequired: { requiredIf: ['otherField', 4] },
  otherField: { type: String }
})
```
The validation of the value is strict, it validates type too, so in this case 4 won't be the same as '4'.

### requiredUnless
The inverse of requiredIf. The field under validation is required, unless the specified field has the declared value.
```js
const rules = (values) => ({
  requiredUnlessOtherFieldIs4: { requiredUnless: ['otherField', 4] },
  otherField: { type: String }
})
```


### requiredWith
The field under validation is required if any of the specified fields is present and has a value.

```js
const rules = (values) => ({
  requiredWithCompany: { requiredWith: ['otherField', 'someOther', 'andOneMore'] },
  otherField: { type: String },
  someOther: { type: String },
  andOneMore: { type: String }
})
```


### requiredWithout
The field under validation is required if any of the specified fields is not present or it doesn't have a value.

```js
const rules = (values) => ({
  requiredWithoutCompany: { requiredWithout: ['otherField', 'someOther', 'andOneMore'] },
  otherField: { type: String },
  someOther: { type: String },
  andOneMore: { type: String }
})
```

### requiredWithoutAll
The field under validation is required if any of the specified fields is not present or it doesn't have a value.
```js
const rules = (values) => ({
  requiredWithoutAllCompany: { requiredWithoutAll: ['otherField', 'someOther', 'andOneMore'] },
  otherField: { type: String },
  someOther: { type: String },
  andOneMore: { type: String }
})
```

### alpha
The field under validation must be contain alphabetic characters only. <br/>
To be easier to validate inputs or request this also accepts spaces.

```js
const rules = (values) => ({
  onlyAlpha: { alpha: true }
})
```

### alphaNum
The field under validation must be contain alphanumeric characters only. <br/>
To be easier to validate inputs or request this also accepts spaces.

```js
const rules = (values) => ({
  onlyAlphaNum: { alphaNum: true }
})
```

### alphaDash
The field under validation must be contain alphanumeric, dashes or undescores characters only. <br/>
To be easier to validate inputs or request this also accepts spaces.

```js
const rules = (values) => ({
  onlyAlphaDash: { alphaDash: true }
})
```

### validate
It allows you to use a custom function to validate the field.<br/>
If you want to generate an error just return the string you wish for your error, otherwise return undefined or don't return at all.<br/><br/>
When using this validate functions, you have the value available as the function parameter (you can call this parameter any way you want).<br/>
You can declare it inside the object of the rule

```js
const rules = (values) => ({
  requiredString: { 
    required:true, 
    type:String, 
    validate: (value) => {
      if(value.length > 20) return "string can't be greater than 20";
      return undefined;
    } 
  }
})
```

Or you can make use of the rules beeing a function and declare another function inside

```js
const rules = (values) => {
  const validateTheRequiredString = (value) => {
    if( value.length > 20 ) return "string can't be greater than 20";
    return undefined;
  } 
  return {
    requiredString: { required:true, type:String, validate: validateTheRequiredString }
  }
  
}
```

You can also make use of the validate beeing an async function to make a call to an APi for example.

```js
const rules = (values) => {
  const validateTheRequiredString = async (value) => {
    const externalData = await axios.get('https://yourapi.com')
    if( !externalData ) return "string can't be greater than 20";
    return undefined;
  } 
  return {
    requiredString: { required:true, type:String, validate: validateTheRequiredString }
  }
  
}
```

### default
Sometimes you may wish to have some default value when non is sent in you values object.
This default value, will be set before any validation, so be aware when using other rules like requiredWith.
```js
const rules = (values) => ({
  withDefaultValue: { default: "I'm a default value" }
})
```

### defaultAfterValidate
Because the [default] method is executed before validating, sometimes it may not be a good fit for you.
The [defaultAfterValidate] will add a default value to your property after all validations.
```js
const rules = (values) => ({
  withDefaultAfterValidate: { defaultAfterValidate: "I'm a default value after every validation" }
})
```


### clean
[clean] is another method that modifies the value you are trying to validate.<br/>
After every validation, the clean will "clean" your input.<br/>
It has two sub-methods. 
First the trim method, that does exactly that, trim start and end of your input.
Second the sanitize method, that will safely encode some characters for db manipulation.
```
  '&' => '&amp;'
  '<' => '&lt;'
  '>' => '&gt;'
  '"' => '&quot;'
  "'" => '&#x27;'
  "/" => '&#x2F;'
```
The easiest way is to set a true value, it will execute both the trim and sanitize methods.
```js
const rules = (values) => ({
  cleanWithTrue: { clean: true }
})
```
But if you just want one of the sub-methods, you can pass an object.
```js
const rules = (values) => ({
  cleanWithSanitize: { clean: { sanitize: true } },
  cleanWithTrim: { clean: { trim: true } }
})
```


### message
It let's you declare a custom error message for every type of validation in the rule or an specific one for each rule validation.

Single error message for every rule validation:
```js
const rules = (obj) => ({
  requiredString: { required:true, type:String, message: "I'm required" },
  someNumberGreaterThan5: { type: Number, min: 6, message: "I must be greater than 5" },
  requiredWithoutAnotherField: { requiredWithout: ['someNumberGreaterThan5'], message: "Sometimes I'm required" }
})
```

Specific message for each validation:
```js
const rules = (obj) => ({
  requiredString: { required:true, type:String, message:{ required: "I'm required", type: "I must be a string" } },
})
```

### children
[children] method is specific for the types Array and Object.
The library allows you to validate nested objects or array (maybe of objects too).
