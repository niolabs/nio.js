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
    '		<a target=_blank href="<%=link%>">\n' +
    '			<time is=relative-time datetime="<%=time%>">\n' +
    '				<%=time%>\n' +
    '			</time>\n' +
    '		</a>\n' +
    '</footer>\n' +
    '';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var stream = require('./stream')
var src = require('./src')
var utils = require('./utils')

var nio = window.nio = {
	stream: stream,
	utils: utils,
	src: src,
	socketio: src.socketio,
	json: src.json,
	generate: src.generate,
	tiles: require('./tiles/tiles').tiles,
	graphs: require('./graphs/graphs')
}

// collects chunks into an array for sorting/manipulating sets of data
nio.collect = function (opts) {
	var transforms = opts.transforms || []
	var max = opts.max || 9
	var min = opts.min || 0

	var getID = opts.dupes || false
	if (getID)
		if (_.isString(getID))
			getID = function (d) { return d[opts.dupes] }
		else if (_.isBoolean(getID))
			getID = function (d) { return d }

	var sortDesc = opts.sortDesc || true
	var sortBy = opts.sort || false
	if (sortBy)
		if (_.isString(sortBy))
			sortBy = function (d) { return d[opts.sort] }
		else if (_.isBoolean(sortBy))
			sortBy = function (d) { return d }

	var data = []
	return stream.transform(function (chunk) {
		if (getID) {
			var id = getID(chunk)
			var isDupe = function (d) { return id === getID(d) }
			if (_.any(data, isDupe)) return
		}

		data.push(chunk)
		for (var i=0, l=transforms.length; i<l; i++)
			data = transforms[i](data)

		if (sortBy) {
			data = _.sortBy(data, sortBy)
			if (sortDesc)
				data = data.reverse()
		}

		if (max && data.length > max)
			data = data.slice(0, max)

		if (min && data.length < min)
			return

		this.push(data)
	})
}

// pushes down a select property
nio.pick = function (name) {
	return stream.transform(function (chunk) {
		if (!(name in chunk)) return
		var data = chunk[name]
		if (_.isArray(data))
			for (var i=data.length; i--;)
				this.push(data[i])
		else
			this.push(data)
	})
}

// Sets defaults on the chunk
nio.defaults = function (opts) {
	return stream.transform(function (chunk) {
		this.push(_.defaults(chunk, opts))
	})
}

// Logs output to the console.
nio.log = function (prefix) {
	return stream.passthrough(function (chunk) {
		prefix ?
			console.log(prefix, chunk) :
			console.log(chunk)
	})
}

// Combines multiple streams into one.
nio.join = function () {
	var river = new stream.PassThrough()
	var sources = [].slice.call(arguments)
	for (var i=sources.length; i--;)
		sources[i].pipe(river)
	return river
}

// Will only push a chunk if the function it's passed to returns true.
nio.filter = function (fn) {
	return stream.transform(function (chunk) {
		if (fn(chunk)) this.push(chunk)
	})
}

// Renames/calculates property values on the chunk
nio.map = function (map) {
	return stream.transform(function (chunk) {
		for (var name in map) {
			var value = map[name]
			if (_.isFunction(value))
				value = value(chunk)
			chunk[name] = value
		}
		this.push(chunk)
	})
}

// delays sending chunks down the pipe
nio.throttle = function (delay) {
	var throttled = _.throttle(function (chunk) {
		this.push(chunk)
	}, delay)
	return stream.transform(throttled)
}

// outputs the chunk to an element
nio.display = function (selector, property) {
	var el = d3.select(selector)
	var getDisplay = property
	if (_.isString(getDisplay))
		getDisplay = function (d) { return d[property] }
	var setHTML = function (chunk) {
		el.html(getDisplay ? getDisplay(chunk) : chunk)
	}
	return stream.passthrough(setHTML)
}

},{"./graphs/graphs":2,"./src":3,"./stream":4,"./tiles/tiles":5,"./utils":6}],2:[function(require,module,exports){
var stream = require('../stream')

function property(name) {
	var privname = '_' + name
	return {
		get: function () { return this[privname] },
		set: function (value) { this[privname] = value }
	}
}

function Graph(opts) {
	stream.PassThrough.call(this)
	if (_.isString(opts))
		this.selector = opts
	else
		_.assign(this, opts)
	if (this.defaults)
		_.defaults(this, this.defaults)
}
var _graphDef = {
	render: {value: stream.mustImplement},
	update: {value: stream.mustImplement}
}
var _graphProps = [
	'width', 'height', 'domains', 'tickFormat',
	'title', 'labels', 'points', 'margin'
]
_graphProps.forEach(function (name) { _graphDef[name] = property(name) })
Graph.prototype = Object.create(stream.PassThrough.prototype, _graphDef)

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
			duration: 750
		}
	},
	render: {
		value: function () {
			var domains = this.domains
			var now = new Date()

			var margin = this.margin
			var height = this.height - margin.top - margin.bottom
			var width = this.width - margin.left - margin.right
			var points = this.points
			var duration = this.duration
			var tickFormat = this.tickFormat

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

				// slide the x-axis left
				//xAxisGridEl
				//	.transition()
				//	.duration(duration)
				//	.ease('linear')
				//	.call(xAxisGrid)

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
			if (!_.any(this.data, function(d) { return d.id === chunk.id })) {
				console.log('new series:', chunk.id)
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

},{"../stream":4}],3:[function(require,module,exports){
var stream = require('./stream')

// base functions for a source
function Source() {
	stream.Readable.call(this)
}
Source.prototype = Object.create(stream.Readable.prototype, {
	start: {value: stream.mustImplement},
	pause: {value: stream.mustImplement},
	resume: {value: stream.mustImplement}
})
exports.Source = Source

function JSONSource(host, pollRate) {
	Source.call(this)
	this.host = host
	this.interval = null
	this.lastPath = null
	this.pollRate = pollRate || 20 * 1000
}
JSONSource.prototype = Object.create(Source.prototype, {
	start: {
		value: function (path) {
			this.fetch(path)
			this.interval = setInterval(function() {
				return this.fetch(path)
			}.bind(this), this.pollRate)
			return this
		}
	},
	fetch: {
		value: function (path) {
			this.lastPath = path
			d3.json(this.host + '/' + path, function(error, json) {
				this.push(json)
			}.bind(this))
			return this
		}
	},
	pause: {value: function() { clearTimeout(this.interval); return this }},
	resume: {value: function() { this.start(this.lastPath); return this }}
})
exports.JSONSource = JSONSource
exports.json = function (host, pollRate) {
	return new JSONSource(host, pollRate)
}

function SocketIOSource(host) {
	Source.call(this)
	this.ws = null
	this.host = host
}
SocketIOSource.prototype = Object.create(Source.prototype, {
	start: {
		value: function (path) {
			this.path = path
			this.ws = io.connect(this.host)

			var sock = this.ws.socket
			sock.on('connect', function() {
				return this.ws.emit('ready', path)
			}.bind(this))
			sock.on('connect_failed', function() {
				console.error('connection failed')
			})
			sock.on('error', function() {
				console.error('connection error')
			})
			this.resume()
			return this
		}
	},
	pause: {
		value: function() {
			this.ws.on('recvData', function(data) { return null })
			return this
		}
	},
	resume: {
		value: function() {
			this.ws.on('recvData', function(data) {
				return this.push(JSON.parse(data))
			}.bind(this))
			return this
		}
	}
})
exports.SocketIOSource = SocketIOSource
exports.socketio = function (host) {
	return new SocketIOSource(host)
}

function GeneratorSource(msg, rate) {
	this.msg = msg || 'Hello world'
	this.rate = rate || 1000
	this.interval = null
}
GeneratorSource.prototype = Object.create(Source.prototype, {
	start: {
		value: function () {
			this.interval = setInterval(function () {
				this.push(_.isFunction(this.msg) ? this.msg() : this.msg)
			}.bind(this), this.rate)
			return this
		}
	},
	pause: {value: function () { clearInterval(this.interval); return this }},
	resume: {value: function() { return this.start() }}
})
exports.GeneratorSource = GeneratorSource
exports.generate = function (msg, rate) {
	return new GeneratorSource(msg, rate)
}

},{"./stream":4}],4:[function(require,module,exports){
// base functions for an event emitter
function EventEmitter() {}
EventEmitter.prototype = Object.create(Object.prototype, {
	on: {
		value: function (event, fn) {
			this._events = this._events || {}
			this._events[event] = this._events[event] || []
			this._events[event].push(fn)
		}
	},
	off: {
		value: function (event, fn) {
			this._events = this._events || {}
			if (event in this._events === false) return
			this._events[event].splice(this._events[event].indexOf(fn), 1)
		}
	},
	emit: {
		value: function (event) {
			this._events = this._events || {}
			if (event in this._events === false) return
			var args = Array.prototype.slice.call(arguments, 1)
			for (var i=0, l=this._events[event].length; i < l; i++)
				this._events[event][i].apply(this, args)
		}
	}
})
exports.EventEmitter = EventEmitter

function mustImplement(name) {
	return function () {
		if (!this[name])
			this.emit('error', new Error(name + ' has not been implemented'))
		else
			this[name].apply(this, arguments)
	}
}
exports.mustImplement = mustImplement

function Readable() {
	EventEmitter.call(this)
}
Readable.prototype = Object.create(EventEmitter.prototype, {
	push: {
		value: function (chunk) { if (chunk) this.emit('data', chunk) }
	},
	pipe: {
		value: function (dest) {
			this.on('data', dest.write.bind(dest))
			return dest
		}
	},
	split: {
		value: function () {
			var dests = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
			for (var i=dests.length; i--;)
				this.pipe(dests[i])
			return this
		}
	},
	pull: {
		value: function () {
			var sources = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
			for (var i=sources.length; i--;)
				sources[i].pipe(this)
			return this
		}
	}
})
exports.Readable = Readable

function Transform(_write) {
	Readable.call(this)
	this._write = _write
}
Transform.prototype = Object.create(Readable.prototype, {
	write: {
		value: mustImplement('_write')
	}
})
exports.Transform = Transform
exports.transform = function (fn) {
	return new Transform(fn)
}

function PassThrough(_write) {
	Readable.call(this)
	this._write = _write
}
PassThrough.prototype = Object.create(Readable.prototype, {
	write: {
		value: function (chunk) {
			this.push(chunk)
			if (this._write) this._write(chunk)
		}
	}
})
exports.PassThrough = PassThrough
exports.passthrough = function (fn) {
	return new PassThrough(fn)
}

},{}],5:[function(require,module,exports){
var stream = require('../stream')
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: require('../utils')
})

exports.tiles = function(opts) {
	var selector = _.isString(opts) ? opts : opts.selector
	var animSpeed = opts.hasOwnProperty('animSpeed') ? opts.animSpeed : 750
	var numCols = opts.numCols || 3

	var elMain = d3.select(selector)
	//var elCols = []
	//for (var i=numCols; i--;)
	//	elCols[i] = elMain.append('div').style('float', 'left')

	// caching these functions
	var getHTML = function (d) { return template(d) }
	var getID = function (d) { return d ? d.id : console.log(d) }
	var getClass = function (d) {
		return 'tile tile-' + d.type + (d.media_url ? ' tile-has-media' : '')
	}

	function render(posts) {
		var elTile = elMain.selectAll('.tile').data(posts, getID)
		var elTileJoin = elTile.order()
		var elTileEnter = elTile.enter().append('div')
			.attr('class', getClass)
			.html(getHTML)
		var elTileExit = elTile.exit()
		if (animSpeed) {
			elTileEnter
				.style('opacity', 0)
				.transition()
					.duration(animSpeed)
					.style('opacity', 1)
			elTileExit.transition()
				.duration(animSpeed)
				.style('opacity', 0)
				.remove()
		} else {
			elTileExit.remove()
		}
	}

	return stream.passthrough(_.throttle(render, 1000))
}

},{"../stream":4,"../utils":6}],6:[function(require,module,exports){
// turns urls and twitter handles/hashtags into links
exports.linkify = function (text) {
    text = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a target=_blank href='$1'>$1</a>")
    text = text.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>")
    return text.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>")
}

exports.truncate = function (text, len) {
    if (text.length > len) return text.substring(0, len - 3) + '...'
    return text
}

exports.isArray = _.isArray
exports.isFunc = _.isFunction
exports.isStr = _.isString

},{}]},{},[1])