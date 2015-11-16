# nio.js

Work with streams in JavaScript

* [Getting Started](#getting-started)
* [Examples](#examples)
* [API Documentation](#api-documentation)
  * [Stream Methods](#stream-methods)
  * [Source Methods](#source-methods)
  

[![Build Status](https://travis-ci.org/nioinnovation/nio.js.svg?branch=master)](https://travis-ci.org/nioinnovation/nio.js)
[![Code Climate](https://codeclimate.com/github/nioinnovation/nio.js/badges/gpa.svg)](https://codeclimate.com/github/nioinnovation/nio.js)
[![npm version](https://badge.fury.io/js/niojs.svg)](http://badge.fury.io/js/niojs)
[![Bower version](https://badge.fury.io/bo/nio.js.svg)](http://badge.fury.io/bo/nio.js)

## Getting Started

There are a few ways to make use of nio.js, follow the instructions for the one that applies to your situation

### Browser Application (with bower)

1. Install from bower
   ```
   bower install nio.js
   ```

2. Add the script to your HTML
   ```html
   <script src="./bower_components/nio.js/dist/nio.min.js"></script>
   ```
3. Use it! - See the [Examples Section](#examples)

### Browser Application (without bower)

1. Download the source file:
   https://raw.githubusercontent.com/nioinnovation/nio.js/v1/dist/nio.min.js

2. Add the script to your HTML
   ```html
   <script src="./nio.min.js"></script>
   ```
3. Use it! - See the [Examples Section](#examples)

### Node Application

1. Install from npm
   ```
   npm install niojs
   ```
   
2. Require nio
   ```js
   var nio = require('niojs')
   ```
   
3. Use it! - See the [Examples Section](#examples)


## Examples

### Log data from a few rooms on a socket.io server

```js
nio.source.socketio(
 'http://yoursocketserver.com:8080',
 ['socket', 'rooms', 'go', 'here'],
 120 // optional - will immediately stream cached data within the last 120 seconds
).pipe(nio.log())
```

## API Documentation

### Stream Methods

The following methods allow you to filter/manipulate/work with streams of data. You can pipe streams (via `.pipe(...)`) into these methods, which will then return their own streams.

#### nio.pass(func)

Perform a function on the data but pass it through unchanged. Changes to the data inside of the function will not be realized in the output stream. Use `nio.func()` to do that.
 
*Example*: 
```js
nio.source.generate({
   test_a: 1,
   test_b: 2
}).pipe(nio.pass(function(chunk) {
   console.log("My value is " + chunk.test_a);
}));
```

*Output*:
```
My value is 1
```

Note that you did not have to return anything from the function, the original chunk was already emitted from the `pass` function.
   
   
#### nio.func(func)
 
Perform a function on the data and emit the results of the function.

*Example*: 
```js
nio.source.generate({
   test_a: 1,
   test_b: 2
}).pipe(nio.func(function(chunk) {
   return chunk.test_b + 5;
})).pipe(nio.log("Final value"));
```

*Output*:
```
Final value 7
```
   
   Note that this time we did return something from the function. The output of the function is what will be emitted to the stream.


#### nio.log(prefix="")
 
Log the data of the stream to the JavaScript console, with an optional prefix


#### nio.filter(func)
 
Only emit the data if the function evaluates to true


#### nio.has(property)
 
Only emit the data if it contains an attribute `property`.


#### nio.is(property, value)
 
Only emit the data if it contains an attribute `property` and if its value is `value`.


#### nio.get(property)
 
Emit the value of `property` on the data, if it exists.



### Source Methods

The following methods allow you to connect to data sources or generate data in a stream

#### nio.source.socketio(host, rooms)

Connect to a socket.io server and subscribe to a list of rooms.

#### nio.source.generate(data, maxTimes=1, rate=100)

Generate an asynchronous data stream at a regular interval.

 * **data** (function or object): If `data` is a function, it can receive one argument which would be the iteration number (starting at 0) of the current execution. If it is an object, that object will be emitted.
 * **maxTimes** (int): How many times the data will get generated. Defaults to 1. Setting this to a negative number will cause it to run indefinitely.
 * **rate** (int): The rate (in milliseconds) of how often to generate the data.

*Example #1*: 
```js
nio.source.generate({val: 1})
 .pipe(nio.log("output"));
```

*Output #1*:
```
output {val: 1}
```

*Example #2*: 
```js
nio.source.generate({val: 1}, 3)
 .pipe(nio.log("output"));
```

*Output #2*:
```
output {val: 1}
output {val: 1}
output {val: 1}
```

*Example #3*: 
```js
nio.source.generate(function(iter) {
 return {val: iter};
}, 3).pipe(nio.log("output"));
```

*Output #3*:
```
output {val: 0}
output {val: 1}
output {val: 2}
```
