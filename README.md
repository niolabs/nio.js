# nio.js

Work with streams in JavaScript

* [Getting Started](#getting-started)
* [Examples](#examples)
* [API Documentation](#api-documentation)

## Getting Started

There are a few ways to make use of nio.js, follow the instructions for the one that applies to your situation

### Browser Application (with bower)

1. Install from bower
   ```
   bower install -S nio.js
   ```

2. Add the script to your HTML
   ```html
   <script src="./bower_components/nio.js/dist/nio.js"></script>
   ```
3. Use it! - See the [Examples Section](#examples)

### Browser Application (without bower)

1. Download the source file:
   https://raw.githubusercontent.com/neutralio/nio.js/master/dist/nio.js

2. Add the script to your HTML
   ```html
   <script src="./nio.js"></script>
   ```
3. Use it! - See the [Examples Section](#examples)

### Node Application (TODO: Make this actually work)

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

### Log data from a socket.io server

```js
nio.source.socketio({
   host: 'http://yoursocketserver.com:8080',
   room: ['socket', 'rooms', 'go', 'here']
}).pipe(nio.log())
```

## API Documentation

### Stream Methods

The following methods allow you to filter/manipulate/work with streams of data. You can pipe streams (via `.pipe(...)`) into these methods, which will then return their own streams.

#### nio.pass(func)

Pass the data through and then perform a function on it.
 
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
   chunk.test_b += 5;
   return chunk;
})).pipe(nio.log("Final value"));
```

*Output*:
```
Final value 7
```
   
   Note that this time we did return something from the function. The output of the function is what will be emitted to the stream.
