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

function AllCharts(opts) {
	Stream.call(this, opts)

	var chartOptions = _.merge({
		// default options
		chart: {
			backgroundColor: null,
			type: 'spline',
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
	}, opts.options)

	_.assign(this, opts)

	if (this.defaults)
		_.defaults(this, this.defaults)

	if (this.stockChart) {
		this.chart = new Highcharts.StockChart(chartOptions)
	} else {
		this.chart = new Highcharts.Chart(chartOptions)
	}
}
AllCharts.prototype = Object.create(Stream.prototype, {
	defaults: {
		selector: '',
		stockChart: false,
		title: '',
		xLabel: '',
		yLabel: '',
		options: {},
		dataStrategy: 'append', // append, replace, 
		seriesStrategy: 'dynamic' // dynamic, fixed
	},
	write: {
		value: function (chunk) {
			var occurrenceTime = (new Date()).valueOf();
			_.each(chunk, function(data, seriesName) {
				this.handleData(data, this.getSeries(seriesName), occurrenceTime);
			}, this)
		}
	},

	handleData: {
		value: function(data, series, occurrenceTime) {
			// Make sure it is a real series
			if (_.isUndefined(series))
				return

			var shift = true;
			if (this.entries) {
				shift = series.data.length >= this.entries - 1;
			}
			if (this.dataStrategy == 'append') {
				series.addPoint(
					[data.x, data.y], 
					true, 
					shift,
					{duration: 1000, easing: 'linear'})
			} else if (this.dataStrategy == 'replace') {
				series.setData(data)
			} else if (this.dataStrategy == 'signal') {
				series.addPoint(
					[occurrenceTime, data],
					true,
					shift)
			}
		}
	},

	getSeries: {
		value: function(seriesName) {
			// Will return a series based on the series name. 
			// This method may create a series, based on the seriesStrategy
			//
			// seriesStrategy:
			//	  dynamic: If the series name does not exist,
			//				it will be created and returned
			//	  fixed: If the sereis name does not exist,
			//				it will NOT be created, undefined will be returned

			var existingSeries = _.find(this.chart.series, function(series) {
				return series.options.id == seriesName || series.name == seriesName
			})

			if (_.isUndefined(existingSeries) && this.seriesStrategy == 'dynamic') {
				existingSeries = this.chart.addSeries({
					name: seriesName
				}, false)
			}

			return existingSeries
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
exports.chart = function (opts) {
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	})

	return new AllCharts(opts)
}
exports.bar = function (opts) {
	return new BarChart(opts)
}
exports.gauge = function (opts) {
	return new GaugeChart(opts)
}
