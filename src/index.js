var _ = require('lodash-node')

module.exports = window.nio = _.assign(
	{
		// exposing various dependencies
		d3: require('d3'),
		_: require('lodash-node'),

		// our modules
		stream: require('./stream'),
		highcharts: require('./highcharts'),
		map: require('./map/map'),
		utils: require('./utils'),
		graphs: require('./graphs'),
		instance: require('./instance'),
		model: require('./model')
	},
	require('./sources'),
	require('./streams')
)
