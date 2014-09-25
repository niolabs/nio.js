var htmlTemplates = htmlTemplates || {};htmlTemplates['tiles/tiles.html'] = '<header class=tile-header>\n' +
    '	<a class=tile-author>\n' +
    '		<% if (profile_image_url) { %>\n' +
    '			<img class=tile-author-avatar src="<%=profile_image_url%>" alt="<%=name%>\'s avatar">\n' +
    '		<% } %>\n' +
    '		<strong class=tile-author-name><%=name%></strong>\n' +
    '	</a>\n' +
    '	<span class=tile-actions>\n' +
    '		<span class="icon icon-<%=type%>"></span>\n' +
    '	</span>\n' +
    '</header>\n' +
    '<div class=tile-content>\n' +
    '	<% if (media_url) { %>\n' +
    '		<img class=tile-media src="<%=media_url%>" alt="<%=text%>" title="<%=text%>">\n' +
    '	<% } else { %>\n' +
    '		<%=linkify(truncate(text, 150))%>\n' +
    '	<% } %>\n' +
    '</div>\n' +
    '<footer class=tile-footer>\n' +
    '	<p class="tile-share float-left">\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-twitter"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-facebook"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-pinterest"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-envelope"></span>\n' +
    '		</a>\n' +
    '	<p class=float-right>\n' +
    '		<time is=relative-time datetime="<%=time%>">\n' +
    '			<%=time%>\n' +
    '		</time>\n' +
    '		<!--<a target=_blank href="<%=link%>">view post</a>-->\n' +
    '</footer>\n' +
    '';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var nio = nio || {}

// base functions for an event emitter
nio._emitter = {
	on: function (event, fn) {
		this._events = this._events || {}
		this._events[event] = this._events[event] || []
		this._events[event].push(fn)
	},
	off: function (event, fn) {
		this._events = this._events || {}
		if (event in this._events === false) return
		this._events[event].splice(this._events[event].indexOf(fn), 1)
	},
	emit: function (event) {
		this._events = this._events || {}
		if (event in this._events === false) return
		var args = Array.prototype.slice.call(arguments, 1)
		for (var i=0, l=this._events[event].length; i < l; i++)
			this._events[event][i].apply(this, args)
	}
}

nio._mustImplement = function () {
	this.emit('error', new Error('not implemented'))
}

// base functions for a streamer
nio._streamer = _.assign({}, nio._emitter, {
	write: nio._mustImplement,
	push: function (chunk) { if (chunk) this.emit('data', chunk) },
	pipe: function (dest) {
		this.on('data', dest.write.bind(dest))
		return dest
	}
})

function makeTransform(fn) {
	return _.assign(function () {}, nio._streamer, {write: fn})
}

// base functions for a source
nio._source = _.assign({}, nio._streamer, {
	pause: nio._mustImplement,
	resume: nio._mustImplement
})

// sources emit new data
nio.src = {}

// a json source polls an http resource at regular intervals
nio.src.json = function(host, pollRate) {
	var interval = null,
		lastPath = null
	pollRate = pollRate || 20 * 1000

	function source(path) {
		source.fetch(path)
		interval = setInterval(function() {
			return source.fetch(path)
		}, pollRate)
		return source
	}

	return _.assign(source, nio._source, {
		fetch: function (path) {
			lastPath = path
			d3.json(host + '/' + path, function(error, json) {
				var data = json[path]
				if (data && _.isArray(data))
					for (var i = data.length; i--;)
						source.push(data[i])
					else
						source.push(data)
			})
		},
		pause: function() { clearTimeout(interval) },
		resume: function() { source.start(lastPath) }
	})
}

// a socketio source emits data from websockets
nio.src.socketio = function(host) {
	var ws = null

	function source(path) {
		ws = io.connect(host)
		path = path === 'posts' ? 'default' : path

		var sock = ws.socket
		sock.on('connect', function() {
			return ws.emit('ready', path)
		})
		sock.on('connect_failed', function() {
			return console.error('connection failed')
		})
		sock.on('error', function() {
			return console.error('connection error')
		})
		source.resume()
		return source
	}

	return _.assign(source, nio._source, {
		pause: function() {
			ws.on('recvData', function(data) {
				return null
			})
		},
		resume: function() {
			ws.on('recvData', function(data) {
				return source.push(JSON.parse(data))
			})
		}
	})
}

// a mux allows combining multiple sources into one
nio.src.mux = function() {
	var sources = [].slice.call(arguments)

	function source(path) {
		sources.forEach(function (src) {
			return src(path)
		})
		return source
	}

	return _.assign(source, nio._source, {
		pause: function () {
			sources.forEach(function (src) {
				return src.pause()
			})
		},
		resume: function () {
			sources.forEach(function(src) {
				return src.resume()
			})
		}
	})
}

// a test source emits preset messages at regular intervals
nio.src.test = function (rate) {
	var msg = null,
		interval = null
	rate = rate || 1000

	function source(path) {
		msg = path
		interval = setInterval(function () { source.push(msg) }, rate)
		return source
	}

	return _.assign(source, nio._source, {
		pause: function () { clearInterval(interval) },
		resume: function () { source(msg) }
	})
}

// collect puts everything it receives into an array and makes it filterable
nio.collect = function () {
	var transforms = [],
		filters = [],
		data = [],
		dupeFn = null

	return _.assign({}, nio._streamer, {
		write: function (chunk) {
			var id = dupeFn ? dupeFn(chunk) : null
			if (dupeFn && _.any(data, function (d) { return id === dupeFn(d) }))
				return
			data.push(chunk)
			transforms.forEach(function (t) { data = t(data) })
			this.push(data)
		},
		transform: function (fn) {
			transforms.push(fn)
			return this
		},
		sort: function (fn, reverse) {
			return this.transform(function (data) {
				var sorted = _.sortBy(data, fn)
				return reverse ? sorted.reverse() : sorted
			})
		},
		dupes: function (fn) {
			if (!fn) fn = function (d) { return d }
			dupeFn = fn
			data = _.unique(data, fn)
			return this
		}
	})
}

nio.transform = function (fn) {
	return makeTransform(function (chunk) {
		this.push(fn(chunk))
	})
}

nio.defaults = function (opts) {
	return nio.transform(function (chunk) {
		return _.defaults(chunk, opts)
	})
}

// log outputs everything it gets to the console
nio.log = function () {
	return makeTransform(function (chunk) {
		console.log(chunk)
		this.push(chunk)
	})
}

nio.filter = function (fn) {
	return nio.transform(function (chunk) {
		return fn(chunk) ? chunk : null
	})
}

nio.utils = {}

// turns urls and twitter handles/hashtags into links
nio.utils.linkify = function (text) {
    text = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a target=_blank href='$1'>$1</a>")
    text = text.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>")
    return text.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>")
}

nio.utils.truncate = function (text, len) {
    if (text.length > len) return text.substring(0, len - 3) + '...'
    return text
}

window.nio = nio

require('./tiles/tiles')
require('./graphs/graphs')

},{"./graphs/graphs":2,"./tiles/tiles":3}],2:[function(require,module,exports){
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
		data = d3.range(n).map(function() { return latestData }),
		//latestData = {},
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

			//for (var id in dataset)
			//	dataset[id].data.push(dataset[id].latest)

			data.push(latestData)

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

},{}],3:[function(require,module,exports){
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: nio.utils
})

nio.tiles = function(selector) {
	var el = d3.select(selector),
		posts = [],
		lazyRender = _.debounce(render, 1000)

	function render() {
		var elTiles = el.selectAll('div').data(posts)
		elTiles.enter().append('div')
		elTiles.attr('class', function(p) {
			return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '')
		}).html(function(p) {
			return template(p)
		});
		elTiles.exit()
	}

	lazyRender()

	return _.assign({}, nio._streamer, {
		write: function (data) {
			posts = data
			lazyRender()
			this.push(posts)
		}
	})
}

},{}]},{},[1])