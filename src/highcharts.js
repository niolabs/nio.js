'use strict';

var _ = require('lodash-node')
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

	// If they have specified a maximum time to keep points
	// start a job to clean up old points every few seconds
	if (this.maxTime) {
		setInterval(_.bind(this.trimOldData, this), 1000);
	}
}
AllCharts.prototype = Object.create(Stream.prototype, {
	defaults: {
		selector: '',
		stockChart: false,
		title: '',
		xLabel: '',
		yLabel: '',
		entries: false,
		maxTime: false, // the max duration a series should show (seconds)
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

			if (_.isArray(data) && data.length == 1) {
				data = data[0];
			}

			var shift = true;
			if (this.entries) {
				shift = series.data.length >= this.entries - 1;
			}

			if (this.maxTime) {
				// shift if false for maxTime, rely on the job
				// to remove points instead
				shift = false;
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
			} else if (this.dataStrategy == 'raw') {
				series.addPoint(data, true, shift)
			}
		}
	},

	trimOldData: {
		value: function() {
			var now = (new Date()).valueOf(),
				removed = false;
			_.each(this.chart.series, function(series) {
				// Don't rely on series.data, if there is grouping it will be empty
				// Instead, we will look at series.options.data and remove old items
				var toRemove = 0;
				_.each(series.options.data, function(point) {
					if (point && point[0] && (now - point[0]) / 1000 > this.maxTime) {
						toRemove++;
						removed = true;
					} else {
						// Otherwise, it's not old, keep it
						// return false so we can exit the loop
						return false;
					}
				}, this);

				if (toRemove > 0) {
					series.setData(_.slice(series.options.data, toRemove), false);
				}
			}, this);

			// Remove any empty series if the series strategy is not fixed
			if (this.seriesStrategy != 'fixed') {
				_.each(this.chart.series, function(series) {
					if (series && series.options.data.length == 0) {
						try {
							series.remove(false);
							removed = true;
						} catch (e) {
							console.error("Could not remove series...");
						}
					}
				});
			}

			if (removed) {
				this.chart.redraw();
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
