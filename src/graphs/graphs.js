nio.graphs = {}

_.assign(nio.graphs._graph, nio._streamer, {
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

/*_.assign(nio.graphs.dataset, nio._streamer, {
	x: function (fn) {
		if (!value) return this.getX
		this.getX = fn
		return this
	},
	y: function (fn) {
		if (!value) return this.getY
		this.getY = fn
		return this
	},
	id: function (fn) {
		if (!value) return this.getID
		this.getID = fn
		return this
	}
})*/

nio.graphs.line = function (selector) {
	var getY = function (y) { return y },
		getX = function (x) { return x },
		getID = null,
		domains = {}

	var n = 243,
		latestData = { percent: 0 },
		data = d3.range(n).map(function() { return latestData }),
		datasets = {}

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
			.domain(domains.y || d3.max(data, getY));

		var line = d3.svg.line()
			.interpolate("basis")
			.x(function(d, i) { return x(now - (n - 1 - i) * duration); })
			.y(function(d) { return y(getY(d) || 0); });

		var svg = d3.select("body").append("p").append("svg")
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

		//d3.select(window)
		//	.on("scroll", function() { ++count; });

		function tick() {

			// update the domains
			now = new Date();
			x.domain([now - (n - 2) * duration, now - duration]);

			// push the accumulated count onto the back, and reset the count
			//data.push(Math.min(30, count));
			console.log(latestData)
			data.push(latestData)
			//count = 0;

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

	return _.assign({}, nio._streamer, {
		x: function (fn) { getX = fn; return this },
		y: function (fn) { getY = fn; return this },
		domains: function (obj) { domains = obj; return this },
		render: render,
		write: function (chunk) {
			this.push(chunk)
			latestData = chunk
		}
	})
}
