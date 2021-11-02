# it-validator

## The it-validator is an async validation library designed to make request validations easier
- [The basics](#the-basics)
- [Available methods](#available-methods)
- [Errors](#errors)
- [Values](#values)
- [Why a function returning an object?](#why-a-function-returning-an-object)
- [Custom validations?](#custom-validations)
- [What is the rules parameter for?](#what-is-the-rules-paramater-for)



### The basics

To start using the library, you'll need 3 things:
- The object to validate
- The rules function that returns the rules to validate with
- The actual validator call

#### The object to validate
It's a simple object that needs validation
```
const obj = {
  requiredString: "I'm required",
  someNumberGreaterThan5: 6,
  onlyRequiredWithoutAnotherField:null
}
```

#### The rules
A function that accepts a parameter( you can name it however you want, more on this later) that needs validation as a parameter and returns the actual rules object
```
const rules = (obj) => {
  requiredString: { required:true, type:String },
  someNumberGreaterThan5: { type: Number, min: 6 },
  onlyRequiredWithoutAnotherField: { requiredWithout: ['someNumberGreaterThan5'] }
}
```

#### The validator call
Now that you have your object and rules, let's validate them

First you need to import the validate method
```
import { validate } from 'it-validator'
```

Then you call the validate function using async/await or .then.<br/>
The validate function accepts 2 parameters: (the object, the rules)<br/>
It will return an object containing the err and values properties
```
const { err, values } = await validate(obj, rules)
```


### Errors
The error returned by the validator is an object containig all the failed rules as props.<br/>
Every property in the error message is a property from the object you sent to validate that didn't pass your requirements 

#### Custom error for every type of validation
Each error contains a default message, but you can override this.
In the rules object you can provide a message property with a text for every failed validation for that specific rule
```
const rules = (obj) => {
  requiredString: { required:true, type:String, message:"I'm required" },
  someNumberGreaterThan5: { type: Number, min: 6, message:"I must be grater than 5" },
  onlyRequiredWithoutAnotherField: { requiredWithout: ['someNumberGreaterThan5'], message:"Sometime I'm required" }
}
```
Another option is to provide a specific message for a type of validation
```
const rules = (obj) => {
  requiredString: { required:true, type:String, message:{ required: "I'm required", type: "I must be a string" } },
}
```



### Values
Sometimes you may wish yo continue with a valid values object even when you have errors. <br/>
That's why the library still returns a values object containing every value that passed validations.



### Why a function returning an object?
In order to allow the validate function to be asynchronous and to be able to access another values in the object you sent to validate we need to initialize the rules as function that accepts a parameter and returns an object with the actual rules.


### Custom Validations
The library provides you a way of making your own custom validations inside the rules using the validate property.<br/>
If you want to generate an error just return the string you wish for your error, otherwise return undefined.<br/><br/>
You can declare it inside the object of the rule
```
const rules = (values) => {
  requiredString: { required:true, type:String, validate: (value) => {
    if(value.length > 20) return 'string can't be greater than 20';
    return undefined;
  } },
}
```
Or you can make use of the rules beeing a function and declare another function inside
```
const rules = (values) => {
  const validateTheRequiredString = (value) => {
    if( value.length > 20 ) return 'string can't be greater than 20';
    return undefined;
  } 
  requiredString: { required:true, type:String, validate: validateTheRequiredString },
}
```
When using this validate functions you have the value available as the function parameter (you can call this parameter any way you want).


### What is the rules parameter for?
The misterious parameter you sent the rules function is not required, it's only for a special cases where one of your rules requires another of your rules value.
One example would be using this parameter along with the validate property.
```
const rules = (values) => {
  const validateTheRequiredString = (value) => {
    if( !values.stringCompany ) return 'I'm missing my company';
    return undefined;
  } 
  strinCompany: { type: String },
  requiredString: { required:true, type:String, validate: validateTheRequiredString },
}
```

### Available methods
