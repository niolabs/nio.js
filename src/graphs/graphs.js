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
		blankData = {x: 0, y: 0, id: '', label: ''},
		latestData = blankData,
		data = d3.range(n).map(function() { return latestData })

	function render() {
		var duration = 750,
			now = new Date(Date.now() - duration),
			count = 0

		var margin = {top: 6, right: 0, bottom: 20, left: 40},
			width = 960 - margin.right,
			height = 120 - margin.top - margin.bottom;

		var x = d3.time.scale()
			.domain(domains.x || [now - (n - 2) * duration, now - duration])
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0])
			.domain(domains.y || d3.max(data, function (d) { return d.y }));

		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d, i) { return x(now - (n - 1 - i) * duration); })
			.y(function(d) { return y(d.y || 0); });

		var svg = d3.select(selector).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.style("margin-left", -margin.left + "px")
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("defs").append("clipPath")
			.attr("id", "clip")
		.append("rect")
			.attr("width", width)
			.attr("height", height);

		var axis = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

		var path = svg.append("g")
			.attr("clip-path", "url(#clip)")
		.append("path")
			.data([data])
			.attr("class", "line");

		tick();

		function tick() {

			// update the domains
			now = new Date();
			x.domain([now - (n - 2) * duration, now - duration]);

			data.push(latestData)
			latestData = blankData

			// redraw the line
			svg.select(".line")
				.attr("d", line)
				.attr("transform", null);

			// slide the x-axis left
			axis.transition()
				.duration(duration)
				.ease("linear")
				.call(x.axis);

			// slide the line left
			path.transition()
				.duration(duration)
				.ease("linear")
				.attr("transform", "translate(" + x(now - (n - 1) * duration) + ")")
				.each("end", tick);

			// pop the old data point off the front
			data.shift();
		}
	}

	return _.assign({}, nio.graphs._graph, {
		domains: function (obj) { domains = obj; return this },
		render: render,
		write: function (chunk) {
			this.push(chunk)
			latestData = chunk
		}
	})
}
