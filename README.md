node-json-typechecker
=====================

When JSON objects are sent over the network, it cannot be assumed that they have the correct or intended format.  Because of this, my network code is littered with manual type checks to ensure that if a malicious or unintelligent user sends data of the wrong type, it won't throw unexpected errors or pose a security threat.

The purpose of this library is to abstract away the process of checking object integrity.  The module exports consist of a single function, `typecheck`, which is called with an object to check, a template object, and (optionally) a callback.  If a callback is specified, it will be called with parameters `(error, object)` when complete, where `object` is the object passed in (`null` if an error occurs).  If a callback is not specified, an exception will be thrown on an error condition.

### Example

```js
    var typecheck = require('json-typecheck');
    var template = {
        name: 'string',
        age: 'number',
        contact: {
            phone: 'string',
            email: 'string'
        }
    };

    var unsanitized = {
        name: 'John A.',
        age: 'adsf', // Whoops, this should be a number!
        contact: {
            phone: '555-555-5555',
            email: 'john@a.com'
        }
    };

    typecheck(unsanitized, template);
    // [TypeError: Expected key age to be of type number, instead got string]
```

More documentation to come...
