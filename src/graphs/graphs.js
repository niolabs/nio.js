'use strict'

var _ = require('lodash')
var core = require('../core')

function property(name) {
	var privname = '_' + name
	return {
		get: function () { return this[privname] },
		set: function (value) { this[privname] = value }
	}
}

function Graph(opts) {
	core.PassThrough.call(this)
	if (_.isString(opts))
		this.selector = opts
	else
		_.assign(this, opts)
	if (this.defaults)
		_.defaults(this, this.defaults)
}
var _graphDef = {
	render: {value: core.mustImplement},
	update: {value: core.mustImplement}
}
var _graphProps = [
	'width', 'height', 'domains', 'tickFormat',
	'title', 'labels', 'points', 'margin', 'autoScaleY'
]
_graphProps.forEach(function (name) { _graphDef[name] = property(name) })
Graph.prototype = Object.create(core.PassThrough.prototype, _graphDef)

function LineGraph(opts) {
	Graph.call(this, opts)
	this.data = []
}
LineGraph.prototype = Object.create(Graph.prototype, {
	defaults: {
		static: true,
		value: {
			margin: {top: 6, right: 40, bottom: 20, left: 0},
			height: 200,
			width: 600,
			tickFormat: function (d) { return d },
			points: 243,
			duration: 750,
			rendered: false,
			autoScaleY: false
		}
	},
	render: {
		value: function () {
			this.rendered = true
			var domains = this.domains
			var now = new Date()

			var margin = this.margin
			var height = this.height - margin.top - margin.bottom
			var width = this.width - margin.left - margin.right
			var points = this.points
			var duration = this.duration
			var tickFormat = this.tickFormat

			// False if we don't scale the Y - otherwise the percentage to scale each value
			var autoScaleY = this.autoScaleY

			var x = d3.time.scale()
				.domain([now - (points - 2) * duration, now - duration])
				.range([0, width])

			var y = d3.scale.linear()
				.domain(domains && domains.y ? domains.y : [0, 100])
				.range([height, 0])

			var line = d3.svg.line()
				.interpolate('basis')
				.x(function(d, i) {return x(now - (points - 1 - i) * duration)})
				.y(function(d, i) {return y(d.y)})

			var svg = d3.select(this.selector).append('svg')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				//.style('margin-right', -margin.right + 'px')
				.append('g')
					.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

			svg.append('defs').append('clipPath')
				.attr('id', 'clip')
				.append('rect')
				.attr('width', width - 0)
				.attr('height', height)

			function makeYAxis() {
				return d3.svg.axis().scale(y).ticks(5).orient('right')
			}

			var yAxis = svg.append('g')
				.attr('class', 'y axis')
				.attr('transform', 'translate(' + width + ',0)')
			var yAxisGrid = makeYAxis().tickSize(-width, 0, 0).tickFormat('')
			var yAxisGridEl = yAxis.append('g')
				.attr('class', 'y grid')
				.call(yAxisGrid)
			var yAxisTicks = makeYAxis()
			if (this.tickFormat)
				yAxisTicks.tickFormat(this.tickFormat)
			var yAxisTicksEl = yAxis.append('g')
				.attr('class', 'y ticks')
				.call(yAxisTicks)

			function makeXAxis() {
				return d3.svg.axis().scale(x).orient('bottom')
			}

			var xAxis = svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + height + ')')
			//var xAxisGrid = makeXAxis().tickSize(-height, 0, 0).tickFormat('')
			//var xAxisGridEl = xAxis.append('g')
			//	.attr('class', 'x grid')
			//	.call(xAxisGrid)
			var xAxisTicks = makeXAxis()
			var xAxisTicksEl = xAxis.append('g')
				.attr('class', 'x ticks')
				.call(xAxisTicks)


			var clip = svg.append('g')
				.attr('clip-path', 'url(#clip)')

			var g = clip.append('g').attr('class', 'lines')

			var color = d3.scale.category10()

			var values = svg.append('g')
				.attr('class', 'values')
				.attr('transform', 'translate(' + width + ',0)')

			var labels = this.labels
			if (labels && labels.y)
				svg.append('text')
					.attr('class', 'y label')
					.attr('text-anchor', 'end')
					.attr('y', width - 15)
					.attr('x', -6)
					.attr('dy', '.75em')
					.attr('transform', 'rotate(-90)')
					.text(labels.y)

			if (labels && labels.x)
				svg.append('text')
					.attr('class', 'x label')
					.attr('text-anchor', 'end')
					.attr('y', height - 15)
					.attr('x', 25)
					.text(labels.x)

			var self = this
			function tick() {
				// update the domains
				now = new Date()
				x.domain([now - (points - 2) * duration, now - duration])

				// push the accumulated count onto the back, and reset the count
				self.data.forEach(function(d) {
					d.values.push(d.latest)
					d.values.shift()
				})

				if (autoScaleY && self.data.length) {
					var extents = d3.extent(self.data[0].values, function(d) { return d.y })

					if (! isNaN(extents[0])) {
					y.domain([extents[0] * (1 - autoScaleY), extents[1] * (1 + autoScaleY)])
					}
				}


				var valueJoin = values.selectAll('.value').data(self.data)
				var valueEnter = valueJoin.enter().append('g').attr('class', 'value')
					.attr('class', 'value')
					.attr('transform', function (d) {
						return 'translate(0,' + y(d.latest.y) + ')'
					})
				valueEnter.append('text')
					.attr('x', 9)
					.attr('dy', '.32em')
					.style('fill', function (d) { return color(d.id) })
				valueEnter.append('line')
					.attr('x2', 6)
					.attr('y2', 0)
					.style('stroke', function (d) { return color(d.id) })
					.style('fill', 'none')

				valueJoin.exit().remove()
				valueJoin.select('text')
					.text(function (d) { return tickFormat(d.latest.y) })
				valueJoin
					.transition()
					.duration(duration)
					.ease('linear')
					.attr('transform', function (d) {
						return 'translate(0,' + y(d.latest.y) + ')'
					})

				// redraw the line
				var pathJoin = g.selectAll('.line').data(self.data)
				var pathEnter = pathJoin.enter().append('path')
					.attr('class', 'line')
					.style('opacity', 0)
					.style('stroke', function(d) {
						return color(d.id)
					})
					.transition()
					.ease('linear')
					.duration(duration)
					.style('opacity', 1)
				var pathExit = pathJoin.exit().remove()
				pathJoin.attr('d', function(d) { return line(d.values) })

				g.attr('transform', null)
					.transition()
					.duration(duration)
					.ease('linear')
					.attr('transform', 'translate(' + x(now - (points - 1) * duration) + ')')
					.each('end', tick)

				yAxisTicksEl
					.transition()
					.duration(duration)
					.ease('linear')
					.call(yAxisTicks)

				// slide the x-axis left
				xAxisTicksEl
					.transition()
					.duration(duration)
					.ease('linear')
					.call(xAxisTicks)
				// slide the line left
			}
			tick()
			return this
		}
	},
	write: {
		value: function(chunk) {
			// detect if it's a new series
			if (!this.rendered)
				this.render()
			if (!_.any(this.data, function(d) { return d.id === chunk.id })) {
				var values = d3.range(this.points).map(function() { return {x: 0, y: 0} })
				this.data.push({id: chunk.id, values: values, latest: chunk})
			}
			for (var i=this.data.length; i--;)
				if (this.data[i].id === chunk.id)
					this.data[i].latest = chunk
		}
	}
})

exports.line = function(opts) {
	return new LineGraph(opts)
}
