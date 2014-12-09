'use strict';

var _ = require('lodash')
var Stream = require('./stream')

function HighChart(opts) {
	Stream.call(this, opts)
	var chartOptions = {
		chart: {
			type: 'spline',
			backgroundColor: null,
			renderTo: opts.selector
		},
		title: {
			text: opts.title
		},
		credits: {
			enabled: false
		},
		xAxis: {
			type: 'datetime',
			title: {
				text: opts.xLabel
			}
		},
		yAxis: {
			title: {
				text: opts.yLabel
			}
		}
	}
	_.merge(chartOptions, opts.options)
	this.chart = new Highcharts.Chart(chartOptions)
}
HighChart.prototype = Object.create(Stream.prototype, {
	defaults: {
		selector: '',
		title: '',
		xLabel: '',
		yLabel: '',
		options: {}
	},
	write: {
		value: function (chunk) {
			var chunkId = chunk.id || 0
			var existingSeries = _.find(this.chart.series, function(series) {
				return series.name == chunkId
			})
			if (_.isUndefined(existingSeries)) {
				existingSeries = this.chart.addSeries({
					name: chunkId
				}, false)
			}

			existingSeries.addPoint(
				[Date.now(), chunk.y], 
				true, 
				existingSeries.data.length >= this.entries,
				{duration: 1000, easing: 'linear'}
			)
		}
	}
})

exports.line = function (opts) {
	return new HighChart(opts)
}
