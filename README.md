# it-validator

## The it-validator is an async validation library designed to make request validations easier
- [The basics](#the-basics)
- [Available methods](#available-methods)


### The basics

To start using the library, you'll need 3 things:
- The object to validate
- The rules function that returns the rules to validate with
- The actual validator call

#### The object to validate
It's a simple object that need validation
```
const obj = {
  requiredString: "I'm required",
  someNumberGreaterThan5: 6,
  onlyRequiredWithoutAnotherField:null
}
```

#### The rules
A function that accepts the object that need's validation as a parameter and returns the actual rules object
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

Then you call the validate function using async/await or .then.
The validate function accepts 2 parameters: (the object, the rules)
It will return an object containing the err and values properties
```
const { err, values } = await validate(obj, rules)
```

### Available methods
