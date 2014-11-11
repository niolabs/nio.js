var _ = require('lodash')

module.exports = window.nio = _.assign(
	{
		// exposing various dependencies
		d3: require('d3'),
		_: require('lodash'),

		// our modules
		stream: require('./stream'),
		utils: require('./utils'),
		graphs: require('./graphs'),
		instance: require('./instance'),
		model: require('./model')
	},
	require('./sources'),
	require('./streams')
)
