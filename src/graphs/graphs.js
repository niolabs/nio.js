nio.graphs = {}

function getter(name) {
	return function (value) {
		if (!value) return this['_' + name]
		this['_' + name] = value
		return this
	}
}

nio.graphs._graph = _.assign({}, nio._streamer, {
	width: getter('width'),
	height: getter('height'),
	domains: getter('domains'),
	tickFormat: getter('tickFormat'),
	title: getter('title'),
	labels: getter('labels'),
	render: nio._mustImplement
})

nio.graphs.dataset = function() {
	return _.assign({}, nio._streamer, {
		getter: function(name, value) {
			if (!value) return this[name]
			this[name] = _.isString(value) ? function(d) {
				return d[value]
			} : value
			return this
		},
		x: function(value) {
			return this.getter('getX', value)
		},
		y: function(value) {
			return this.getter('getY', value)
		},
		id: function(value) {
			return this.getter('getID', value)
		},
		label: function(value) {
			return this.getter('getLabel', value)
		},
		write: function(chunk) {
			this.push({
				x: this.getX ? this.getX(chunk) : 0,
				y: this.getY ? this.getY(chunk) : 0,
				id: this.getID ? this.getID(chunk) : '',
				label: this.getLabel ? this.getLabel(chunk) : ''
			})
		}
	})
}

nio.graphs.line = function(selector) {
	var n = 243,
		duration = 750,
		now = new Date(Date.now() - duration),
		data = []

	function render() {
		var margin = {top: 6, right: 40, bottom: 20, left: 0},
			width = (this.width() || 960) - margin.right,
			height = (this.height() || 200) - margin.top - margin.bottom,
			tickFormat = this.tickFormat() || function (d) { return d }

		var domains = this.domains()

		var x = d3.time.scale()
			.domain([now - (n - 2) * duration, now - duration])
			.range([0, width])

		var y = d3.scale.linear()
			.domain(domains && domains.y ? domains.y : [0, 100])
			.range([height, 0])

		var line = d3.svg.line()
			.interpolate('basis')
			.x(function(d, i) {return x(now - (n - 1 - i) * duration)})
			.y(function(d, i) {return y(d.y)})

		var svg = d3.select(selector).append('svg')
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
		var yAxisTicks = makeYAxis().tickFormat(tickFormat)
		var yAxisTicksEl = yAxis.append('g')
			.attr('class', 'y ticks')
			.call(yAxisTicks)

		function makeXAxis() {
			return d3.svg.axis().scale(x).orient('bottom')
		}

		var xAxis = svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
		/*var xAxisGrid = makeXAxis().tickSize(-height, 0, 0).tickFormat('')
		var xAxisGridEl = xAxis.append('g')
			.attr('class', 'x grid')
			.call(xAxisGrid)*/
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

		var labels = this.labels()
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
			x.domain([now - (n - 2) * duration, now - duration])

			// push the accumulated count onto the back, and reset the count
			data.forEach(function(d) {
				d.values.push(d.latest)
				d.values.shift()
			})

			var value = values.selectAll('.value')
				.data(data)

			var valueEnter = value.enter().append('g').attr('class', 'value')
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

			value.exit().remove()

			value.select('text')
				.text(function (d) { return tickFormat(d.latest.y) })

			value
				.transition()
				.duration(duration)
				.ease('linear')
				.attr('transform', function (d) {
					return 'translate(0,' + y(d.latest.y) + ')'
				})


			// redraw the line
			var path = g.selectAll('.line')
				.data(data)

			path.enter().append('path')
				.attr('class', 'line')
				.style('opacity', 0)
				.style('stroke', function(d) {
					return color(d.id)
				})
				.transition()
				.ease('linear')
				.duration(duration)
				.style('opacity', 1)

			path.exit().remove()
			path.attr('d', function(d) { return line(d.values) })

			//g.style('transform', 'translate(0,0)')
				/*transition()
				.style(
				.duration(duration)
				.each('end', tick)*/
			g.attr('transform', null)
				.transition()
				.duration(duration)
				.ease('linear')
				.attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')')
				.each('end', tick)

			// slide the x-axis left
			/*xAxisGridEl
				.transition()
				.duration(duration)
				.ease('linear')
				.call(xAxisGrid)*/

			xAxisTicksEl
				.transition()
				.duration(duration)
				.ease('linear')
				.call(xAxisTicks)
			// slide the line left
		}

		tick()
	}

	return _.assign(render, nio.graphs._graph, {
		render: render,
		write: function(chunk) {
			this.push(chunk)
			// detect if it's a new series
			if (!_.any(data, function(d) { return d.id === chunk.id })) {
				console.log('new series:', chunk.id)
				data.push({
					id: chunk.id,
					values: d3.range(n).map(function() { return {x: 0, y: 0} }),
					latest: chunk
				})
			}
			for (var i=data.length; i--;)
				if (data[i].id === chunk.id)
					data[i].latest = chunk
		}
	})
}
