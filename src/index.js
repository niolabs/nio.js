'use strict';

var _ = require('lodash')

module.exports = window.nio = _.assign(
	{
		stream: require('./stream'),
		events: require('events'),
		utils: require('./utils'),
		tiles: require('./tiles'),
		graphs: require('./graphs'),
		instance: require('./instance'),
		shortcuts: require('./shortcuts')
	},
	require('./sources'),
	require('./streams')
)
