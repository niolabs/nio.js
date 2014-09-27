nio.graphs = {}

nio.graphs._graph = _.assign({}, nio._streamer, {
	width: function (value) {
		if (!value) return this.width
		this.width = value
		return this
	},
	height: function (value) {
		if (!value) return this.height
		this.height = value
		return this
	},
	domains: function (value) {
		if (!value) return this.domains
		this.domains = value
		return this
	},
	render: nio._mustImplement
})

nio.graphs.dataset = function () {
	return _.assign({}, nio._streamer, {
		getter: function (name, value) {
			if (!value) return this[name]
			this[name] = _.isString(value) ? function (d) { return d[value] } : value
			return this
		},
		x: function (value) { return this.getter('getX', value) },
		y: function (value) { return this.getter('getY', value) },
		id: function (value) { return this.getter('getID', value) },
		label: function (value) { return this.getter('getLabel', value) },
		write: function (chunk) {
			this.push({
				x: this.getX ? this.getX(chunk) : 0,
				y: this.getY ? this.getY(chunk) : 0,
				id: this.getID ? this.getID(chunk) : '',
				label: this.getLabel ? this.getLabel(chunk) : ''
			})
		}
	})
}

nio.graphs.line = function (selector) {

var n = 243,
    duration = 750,
    now = new Date(Date.now() - duration),
	data = []

	function render() {
		var margin = {top: 6, right: 0, bottom: 20, left: 40},
			width = 960 - margin.right,
			height = 120 - margin.top - margin.bottom;

		var x = d3.time.scale()
			.domain([now - (n - 2) * duration, now - duration])
			.range([0, width]);

		var y = d3.scale.linear()
			.domain([0, 100])
			.range([height, 0]);

		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d, i) { return x(now - (n - 1 - i) * duration); })
			.y(function(d, i) { return y(d.y); });

		var svg = d3.select("body").append("p").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("margin-left", -margin.left + "px")
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("defs").append("clipPath")
			.attr("id", "clip")
		.append("rect")
			.attr("width", width - 10)
			.attr("height", height);

		var axis = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

		var clip = svg.append('g')
			.attr("clip-path", "url(#clip)")

		var g = clip.append('g')

		tick();

		var color = d3.scale.category10()

		function tick() {
		// update the domains
		now = new Date();
		x.domain([now - (n - 2) * duration, now - duration]);

		// push the accumulated count onto the back, and reset the count
		data.forEach(function (d) {
			d.values.push(d.latest)
			d.values.shift()
		})

		// redraw the line
			var path = g.selectAll('.line')
				.data(data)

			path.enter().append("path")
				.attr("class", "line")
				.style('opacity', 0)
				.style('stroke', function (d) { return color(d.id) })
				.transition()
					.duration(500)
					.style('opacity', 1)

			path.attr("d", function(d) { return line(d.values) })

			g.attr("transform", null)
				.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(now - (n - 1) * duration) + ")")
					.each("end", tick);


		// slide the x-axis left
		axis.transition()
			.duration(duration)
			.ease("linear")
			.call(x.axis);

		// slide the line left
		}
	}

	return _.assign(render, nio.graphs._graph, {
		domains: function (obj) { domains = obj; return this },
		render: render,
		write: function (chunk) {
			this.push(chunk)
			// detect if it's a new series
			if (!_.any(data, function (d) { return d.id === chunk.id })) {
				console.log('new series:', chunk.id)
				data.push({
					id: chunk.id,
					values: d3.range(n).map(function() { return {x: 0, y: 0}}),
					latest: chunk
				})
				//update()
			}
			for (var i=data.length; i--;)
				if (data[i].id === chunk.id)
					data[i].latest = chunk
		}
	})
}
