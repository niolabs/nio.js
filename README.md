# nio.js

Work with streams in JavaScript

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
