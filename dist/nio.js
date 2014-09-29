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
nio.src.test = function (msg, rate) {
	var interval = null
	var source = _.assign({}, nio._source, {
		pause: function () { clearInterval(interval) },
		resume: function () {
			interval = setInterval(function () {
				source.push(_.isFunction(msg) ? msg() : msg)
			}, rate || 1000)
		}
	})
	source.resume()
	return source
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