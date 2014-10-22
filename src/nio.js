'use strict';

var _ = require('lodash')

module.exports = window.nio = _.assign(
	{
		utils: require('./utils'),
		tiles: require('./tiles'),
		graphs: require('./graphs'),
		instance: require('./instance'),
		shortcuts: require('./shortcuts')
	},
	require('./core'),
	require('./streams')
)
