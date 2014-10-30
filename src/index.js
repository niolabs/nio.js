'use strict';

var _ = require('lodash')

module.exports = window.nio = _.assign(
	{
		// exposing various dependencies
		d3: require('d3'),
		_: require('lodash'),

		// our modules
		stream: require('./stream'),
		utils: require('./utils'),
		tiles: require('./tiles'),
		graphs: require('./graphs'),
		instance: require('./instance'),
		shortcuts: require('./shortcuts')
	},
	require('./sources'),
	require('./streams')
)
