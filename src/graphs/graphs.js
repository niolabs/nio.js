nio.graphs = {}

nio.graphs.line = function (selector) {
	var el = d3.select(selector),
		line = null,
		path = null,
		getX = null,
		getY = null,
		axis = null

	var n = 243,
		duration = 750,
		now = new Date(Date.now() - duration),
		data = []

	var margin = {top: 6, right: 0, bottom: 20, left: 40},
		width = 960 - margin.right,
		height = 120 - margin.top - margin.bottom

	var x = d3.time.scale()
		.domain([now - (n - 2) * duration, now - duration])
		.range([0, width])

	var y = d3.scale.linear()
		.range([height, 0])

	var svg = el.append('svg')

	function render() {
		svg
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.style('margin-left', -margin.left + 'px')
			.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

		svg.append('defs').append('clipPath')
			.attr('id', 'clip')
			.append('rect')
				.attr('width', width)
				.attr('height', height)

		axis = svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

		path = svg.append('g')
			.attr('clip-path', 'url(#clip)')
			.append('path')
				.data([data])
				.attr('class', 'line')

		line = d3.svg.line()
			.interpolate('basis')
			.x(function(d, i) { return x(getX(d)) })
			.y(function(d, i) { return y(getY(d)) })

		update()

		return update
	}

	function update() {
		if (!line) return
		// update the domains
		now = new Date()
		x.domain([now - (n - 2) * duration, now - duration])
		y.domain([0, d3.max(data, getY)])

		// redraw the line
		svg.select('.line')
			.attr('d', line)
			.attr('transform', null)

		// slide the x-axis left
		axis.transition()
			.duration(duration)
			.ease('linear')
			.call(x.axis)

		// slide the line left
		path.transition()
			.duration(duration)
			.ease('linear')
			.attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')')
			.each('end', update)

		// pop the old data point off the front
		data.shift()
	}

	return _.assign({}, nio._streamer, {
		x: function (fn) { getX = fn; return this },
		y: function (fn) { getY = fn; return this },
		render: render,
		write: function (chunk) {
			this.push(chunk)
			data.push(chunk)
			data.shift()
			update()
		}
	})
}
