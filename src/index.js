"use strict";
(function () {

	var deps = require('./deps');

	var nio = deps._.assign(
		{
			_: deps._,

			// our modules
			Stream: require('./stream'),
			utils: require('./utils'),
			source: require('./sources')
		},
		require('./streams')
	);


    if (typeof module !== 'undefined' && module.exports) {
		module.exports = nio;
    } 
	
	// TODO: Is there a better way to check this?
	if (typeof window !== 'undefined') {
		window.nio = nio;
    }
})();

