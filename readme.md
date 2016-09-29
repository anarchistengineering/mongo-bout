mongo-bout
===

**In no way is this meant to replace Sift, it was an experiment to reimplement and learn!**

The idea was to create an ES6 version of just the matcher from [Sift.js](https://github.com/crcn/sift.js).  Allows you to check a pattern against an object or an array of objects and see if it matches.

Install
---

```
npm install mongo-bout
```

Usage
---

See if values match a pattern:

```js
const {matches} = require('mongo-bout');

const pattern = {a: 1};
const customMatch = matches(pattern);

console.log(customMatch({a: 1})); // -> true
console.log(customMatch({a: 2})); // -> false
console.log(customMatch([{a: 1, b: 2}])); // -> true
console.log(customMatch([{a: 1}, {b: 2}])); // -> true
console.log(customMatch([{a: 2}, {b: 2}])); // -> false

console.log(matches({a: 1}, {a: 1})); // -> true
console.log(matches({a: 1}, {a: 2})); // -> false
console.log(matches({a: 1}, [{a: 1, b: 2}])); // -> true
console.log(matches({a: 1}, [{a: 1}, {b: 2}])); // -> true
console.log(matches({a: 1}, [{a: 2}, {b: 2}])); // -> false
```

To filter arrays, similar to how Sift works:

```js
const {filter} = require('./');

const pattern = {a: 1};
const customFilter = filter(pattern);

console.log(customFilter({a: 1})); // -> [ { a: 1 } ]
console.log(customFilter({a: 2})); // -> []
console.log(customFilter([{a: 1, b: 2}])); // -> [ { a: 1, b: 2 } ]
console.log(customFilter([{a: 1}, {b: 2}])); // -> [ { a: 1 } ]
console.log(customFilter([{a: 2}, {b: 2}])); // -> []

console.log(filter({a: 1}, {a: 1})); // -> [ { a: 1 } ]
console.log(filter({a: 1}, {a: 2})); // -> []
console.log(filter({a: 1}, [{a: 1, b: 2}])); // -> [ { a: 1, b: 2 } ]
console.log(filter({a: 1}, [{a: 1}, {b: 2}])); // -> [ { a: 1 } ]
console.log(filter({a: 1}, [{a: 2}, {b: 2}])); // -> []
```

## Supported Operators:

**NOTE:** This section is copy/pasted directly from the sift readme.  At this level they are interchangeable.

See MongoDB's [advanced queries](http://www.mongodb.org/display/DOCS/Advanced+Queries) for more info.

### $in

array value must be *$in* the given query:

Intersecting two arrays:

```javascript
//filtered: ['Brazil']
filter({ $in: ['Costa Rica','Brazil'] }, ['Brazil','Haiti','Peru','Chile']);
```

Here's another example. This acts more like the $or operator:

```javascript
filter({ location: { $in: ['Costa Rica','Brazil'] } }, { name: 'Craig', location: 'Brazil' });
```

### $nin

Opposite of $in:

```javascript
//filtered: ['Haiti','Peru','Chile']
filter({ $nin: ['Costa Rica','Brazil'] }, ['Brazil','Haiti','Peru','Chile']);
```

### $exists

Checks if whether a value exists:

```javascript
//filtered: ['Craig','Tim']
filter({ $exists: true }, ['Craig',null,'Tim']);
```

You can also filter out values that don't exist

```javascript
//filtered: [{ name: 'Craig', city: 'Minneapolis' }]
filter({ city: { $exists: false } }, [ { name: 'Craig', city: 'Minneapolis' }, { name: 'Tim' }]);
```

### $gte

Checks if a number is >= value:

```javascript
//filtered: [2, 3]
filter({ $gte: 2 }, [0, 1, 2, 3]);
```

### $gt

Checks if a number is > value:

```javascript
//filtered: [3]
filter({ $gt: 2 }, [0, 1, 2, 3]);
```

### $lte

Checks if a number is <= value.

```javascript
//filtered: [0, 1, 2]
filter({ $lte: 2 }, [0, 1, 2, 3]);
```

### $lt

Checks if number is < value.

```javascript
//filtered: [0, 1]
filter({ $lt: 2 }, [0, 1, 2, 3]);
```

### $eq

Checks if query == value. Note that **$eq can be omitted**. For **$eq**, and **$ne**

```javascript
//filtered: [{ state: 'MN' }]
filter({ state: {$eq: 'MN' }}, [{ state: 'MN' }, { state: 'CA' }, { state: 'WI' }]);
```

Or:

```javascript
//filtered: [{ state: 'MN' }]
filter({ state: 'MN' }, [{ state: 'MN' }, { state: 'CA' }, { state: 'WI' }]);
```

### $ne

Checks if query != value.

```javascript
//filtered: [{ state: 'CA' }, { state: 'WI'}]
filter({ state: {$ne: 'MN' }}, [{ state: 'MN' }, { state: 'CA' }, { state: 'WI' }]);
```

### $mod

Modulus:

```javascript
//filtered: [300, 600]
filter({ $mod: [3, 0] }, [100, 200, 300, 400, 500, 600]);
```

### $all

values must match **everything** in array:

```javascript
//filtered: [ { tags: ['books','programming','travel' ]} ]
filter({ tags: {$all: ['books','programming'] }}, [
{ tags: ['books','programming','travel' ] },
{ tags: ['travel','cooking'] } ]);
```

### $and

ability to use an array of expressions. All expressions must test true.

```javascript
//filtered: [ { name: 'Craig', state: 'MN' }]

filter({ $and: [ { name: 'Craig' }, { state: 'MN' } ] }, [
{ name: 'Craig', state: 'MN' },
{ name: 'Tim', state: 'MN' },
{ name: 'Joe', state: 'CA' } ]);
```

### $or

OR array of expressions.

```javascript
//filtered: [ { name: 'Craig', state: 'MN' }, { name: 'Tim', state: 'MN' }]
filter({ $or: [ { name: 'Craig' }, { state: 'MN' } ] }, [
{ name: 'Craig', state: 'MN' },
{ name: 'Tim', state: 'MN' },
{ name: 'Joe', state: 'CA' } ]);
```

### $nor

opposite of or:

```javascript
//filtered: [ { name: 'Tim', state: 'MN' }, { name: 'Joe', state: 'CA' }]
filter({ $nor: [ { name: 'Craig' }, { state: 'MN' } ] }, [
{ name: 'Craig', state: 'MN' },
{ name: 'Tim', state: 'MN' },
{ name: 'Joe', state: 'CA' } ]);
```


### $size

Matches an array - must match given size:

```javascript
//filtered: ['food','cooking']
filter({ tags: { $size: 2 } }, [ { tags: ['food','cooking'] }, { tags: ['traveling'] }]);
```

### $type

Matches a values based on the type

```javascript
filter({ $type: Date }, [new Date(), 4342, 'hello world']); //returns single date
filter({ $type: String }, [new Date(), 4342, 'hello world']); //returns ['hello world']
```

### $regex

Matches values based on the given regular expression

```javascript
filter({ $regex: /^f/i, $nin: ["frank"] }, ["frank", "fred", "sam", "frost"]); // ["fred", "frost"]
filter({ $regex: "^f", $options: "i", $nin: ["frank"] }, ["frank", "fred", "sam", "frost"]); // ["fred", "frost"]
```

### $where

Matches based on some javascript comparison

```javascript
filter({ $where: "this.name === 'frank'" }, [{name:'frank'},{name:'joe'}]); // ["frank"]
filter({
  $where: function() {
    return this.name === "frank"
  }
}, [{name:'frank'},{name:'joe'}]); // ["frank"]
```

### $elemMatch

Matches elements of array

```javascript
var bills = [{
    month: 'july',
    casts: [{
        id: 1,
        value: 200
    },{
        id: 2,
        value: 1000
    }]
},
{
    month: 'august',
    casts: [{
        id: 3,
        value: 1000,
    }, {
        id: 4,
        value: 4000
    }]
}];

var result = filter({
    casts: {$elemMatch:{
        value: {$gt: 1000}
    }}
}, bills); // {month:'august', casts:[{id:2, value: 1000},{id: 4, value: 4000}]}
```

### $not

Not expression:

```javascript
filter({$not:{$in:['craig','tim']}}, ['craig','tim','jake']); //['jake']
filter({$not:{$size:5}}, ['craig','tim','jake']); //['tim','jake']
```

TODO
---

 * Implement custom operations
