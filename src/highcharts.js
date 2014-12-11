'use strict';

var _ = require('lodash')
var Stream = require('./stream')

var getGlobalChartOptions = function(opts) {
	return {
		chart: {
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
}

function LineChart(opts) {
	Stream.call(this, opts)
	var chartOptions = _.merge({}, getGlobalChartOptions(opts), {
		chart: {
			type: 'spline'
		},
		xAxis: {
			type: 'datetime'
		}
	}, opts.options)
	this.chart = new Highcharts.Chart(chartOptions)
}
LineChart.prototype = Object.create(Stream.prototype, {
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

function BarChart(opts) {
	Stream.call(this, opts)
	var chartOptions = _.merge({}, getGlobalChartOptions(opts), {
		chart: {
			type: 'column'
		}
	}, opts.options)
	this.chart = new Highcharts.Chart(chartOptions)
}
BarChart.prototype = Object.create(Stream.prototype, {
	defaults: {
		selector: '',
		title: '',
		xLabel: '',
		yLabel: '',
		options: {}
	},
	write: {
		// One should write a chunk that looks like the following:
		// {
		//	 values: [1,2,3,10,20,30]
		// }
		value: function (chunk) {
			if (this.chart.series.length == 0) 
				return

			this.chart.series[0].setData(chunk.values, true, {duration: 1000, easing: 'linear'})
		}
	}
})

function GaugeChart(opts) {
	Stream.call(this, opts)
	var chartOptions = _.merge({}, getGlobalChartOptions(opts), {
		chart: {
			type: 'solidgauge'
		}
	}, opts.options)
	this.chart = new Highcharts.Chart(chartOptions)
}
GaugeChart.prototype = Object.create(Stream.prototype, {
	defaults: {
		selector: '',
		title: '',
		xLabel: '',
		yLabel: '',
		options: {}
	},
	write: {
		// One should write a chunk that looks like the following:
		// {
		//	 values: [1]
		// }
		value: function (chunk) {
			if (this.chart.series.length == 0) 
				return

			this.chart.series[0].points[0].update(chunk.values[0])
		}
	}
})
exports.line = function (opts) {
	return new LineChart(opts)
}
exports.bar = function (opts) {
	return new BarChart(opts)
}
exports.gauge = function (opts) {
	return new GaugeChart(opts)
}
