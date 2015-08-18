"use strict";

var deps = require('./deps');

module.exports = window.nio = _.assign(
	{
		_: deps._,

		// our modules
		Stream: require('./stream'),
		utils: require('./utils')
		//source: require('./sources')
	},
	require('./streams')
)
