"use strict";
(function () {

	var deps = require('./deps');

	var nio = deps._.assign(
		{
			_: deps._,

			_version: '1.1.0',

			// our modules
			Stream: require('./stream'),
			utils: require('./utils'),
			source: require('./sources')
		},
		require('./streams')
	)

    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this; 

    if (typeof module !== 'undefined' && module.exports) {
		module.exports = nio;
    } else {
		root.nio = nio;
    }
})();

