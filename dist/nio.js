var htmlTemplates = htmlTemplates || {};htmlTemplates['tiles/tiles.html'] = '<div id="<%=id%>" class="tile tile--<%=type%><% if (media_url) { %> has-media<% } %><% if (profile_image_url) { %> has-profile-image<% } %>">\n' +
    '	<header class=tile-header>\n' +
    '		<a class="tile-author u-block" href=#<%=id%>>\n' +
    '			<% if (profile_image_url) { %>\n' +
    '				<img class=tile-author-avatar src="<%=profile_image_url%><% if (type === \'facebook\') { %>?type=normal<% } %>" alt="<%=name%>\'s avatar">\n' +
    '			<% } %>\n' +
    '			<strong class="tile-author-name u-textTruncate"><%=name%></strong>\n' +
    '			<time is=relative-time datetime="<%=time%>"><%=time%></time>\n' +
    '		</a>\n' +
    '		<span class="icon icon-<%=type%>"></span>\n' +
    '	</header>\n' +
    '	<div class=tile-content>\n' +
    '		<% if (media_url) { %>\n' +
    '			<img class=tile-media src="<%=media_url%>" alt="<%=text%>" title="<%=text%>">\n' +
    '			<div class="tile-text u-marquee">\n' +
    '				<div>\n' +
    '					<span><%=linkify(text)%></span>\n' +
    '					<span><%=linkify(text)%></span>\n' +
    '				</div>\n' +
    '			</div>\n' +
    '		<% } else { %>\n' +
    '			<div class=tile-text>\n' +
    '				<% if (type === \'rss\') { %>\n' +
    '					<p><strong class=font-header><%=text%></strong>\n' +
    '					<%=linkify(alt_text)%>\n' +
    '				<% } else { %>\n' +
    '					<p><%=linkify(text)%>\n' +
    '				<% } %>\n' +
    '				<p class="on-expand u-muted">\n' +
    '					<time is=local-time datetime="<%=time%>"><%=time%></time>\n' +
    '			</div>\n' +
    '		<% } %>\n' +
    '	</div>\n' +
    '	<footer class=tile-footer>\n' +
    '		<a class="block u-pullLeft" href="<%=link%>" target=_blank>\n' +
    '			View on <%=mediaTypeName(type)%>\n' +
    '			<span class="icon icon-external icon-mini"></span>\n' +
    '		</a>\n' +
    '		<a class="block u-pullRight" href=#>\n' +
    '			Share\n' +
    '			<span class="icon icon-share icon-mini"></span>\n' +
    '		</a>\n' +
    '	</footer>\n' +
    '</div>\n' +
    '';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// base streams
exports.passthrough = function (fn) {
	return new PassThrough(fn)
}
exports.readable = function (fn) {
	return new Readable(fn)
}
exports.transform = function (fn) {
	return new Transform(fn)
}

// source streams
exports.socketio = function (host) {
	return new SocketIOStream(host)
}
exports.json = function (host, pollRate) {
	return new JSONStream(host, pollRate)
}
exports.generate = function (msg, rate) {
	return new GeneratorStream(msg, rate)
}

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

// base functions for a source
function Source() {
	Readable.call(this)
}
Source.prototype = Object.create(Readable.prototype, {
	start: {value: mustImplement},
	pause: {value: mustImplement},
	resume: {value: mustImplement}
})
exports.Source = Source

function JSONStream(host, pollRate) {
	Source.call(this)
	this.host = host
	this.interval = null
	this.lastPath = null
	this.pollRate = pollRate || 20 * 1000
}
JSONStream.prototype = Object.create(Source.prototype, {
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
exports.JSONStream = JSONStream

function SocketIOStream(host) {
	Source.call(this)
	this.ws = null
	this.host = host
}
SocketIOStream.prototype = Object.create(Source.prototype, {
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
exports.SocketIOStream = SocketIOStream

function GeneratorStream(msg, rate) {
	this.msg = msg || 'Hello world'
	this.rate = rate || 1000
	this.interval = null
}
GeneratorStream.prototype = Object.create(Source.prototype, {
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
exports.GeneratorStream = GeneratorStream

},{}],2:[function(require,module,exports){
var nio = window.nio = require('./core')
nio.utils = require('./utils')

// collects chunks into an array for sorting/manipulating sets of data
nio.collect = function (opts) {
	var transforms = opts.transforms || []
	var size = opts.size || 9
	var max = opts.max || size
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

	var stream = nio.transform(function (chunk) {
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

	stream.sort = function (value) {
		if (!value) return sortBy
		sortBy = value
		return this
	}

	stream.size = function (value) {
		if (!value) return size
		size = min = max = value
		return this
	}

	return stream
}

// pushes down a select property
nio.pick = function (name) {
	return nio.transform(function (chunk) {
		if (!(name in chunk)) return
		var data = chunk[name]
		if (_.isArray(data))
			for (var i=data.length; i--;)
				this.push(data[i])
		else
			this.push(data)
	})
}

// sets defaults on the chunk
nio.defaults = function (opts) {
	return nio.transform(function (chunk) {
		this.push(_.defaults(chunk, opts))
	})
}

// logs output to the console
nio.log = function (prefix) {
	return nio.passthrough(function (chunk) {
		prefix ?
			console.log(prefix, chunk) :
			console.log(chunk)
	})
}

// combines multiple streams into one
nio.join = function () {
	var river = new nio.PassThrough()
	var sources = [].slice.call(arguments)
	for (var i=sources.length; i--;)
		sources[i].pipe(river)
	return river
}

// will only push a chunk if the function it's passed to returns true
nio.filter = function (fn) {
	return nio.transform(function (chunk) {
		if (fn(chunk)) this.push(chunk)
	})
}

// renames/calculates property values on the chunk
nio.map = function (map) {
	return nio.transform(function (chunk) {
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
	return nio.transform(throttled)
}

// outputs the chunk to an element
nio.display = function (selector, property) {
	var el = d3.select(selector)
	var getDisplay = property
	if (_.isString(getDisplay))
		getDisplay = function (d) { return d[property] }
	return nio.passthrough(function (chunk) {
		el.html(getDisplay ? getDisplay(chunk) : chunk)
	})
}

// visualizations
nio.tiles = require('./tiles/tiles').tiles
nio.graphs = require('./graphs/graphs')
nio.instance = require('./instance/instance').instance

},{"./core":1,"./graphs/graphs":3,"./instance/instance":5,"./tiles/tiles":7,"./utils":8}],3:[function(require,module,exports){
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
	'title', 'labels', 'points', 'margin'
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
			rendered: false
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
			if (!this.rendered)
				this.render()
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

},{"../core":1}],4:[function(require,module,exports){
var core = require('../core')

function nioAPI() {
    core.Readable.call(this)
}
nioAPI.prototype = Object.create(core.Readable.prototype, {
    makeRequest : {
	value: function(endpoint, postData) {
	    var xhr = d3.json('http://' + this.ip + '/' + endpoint)
		    .header("Authorization", this.authHeader)

	    if (typeof postData === 'undefined') {
		// They want a get request
		xhr.get(function(err, data) {
		    this.push(data)
		}.bind(this))
	    } else {
		// They want a post request
		xhr.post(postData, function(err, data) {
		    this.push(data)
		}.bind(this))
	    }
	}
    },

    setInstance: {
	value: function(ip, authHeader) {
	    this.ip = ip
	    this.authHeader = authHeader
	}
    },

    getChild: {
	value: function(type) {
	    var newType = new type()
	    newType.setInstance(this.ip, this.authHeader)
	    return newType
	}
    }
})
exports.API = nioAPI

},{"../core":1}],5:[function(require,module,exports){
var nio = require('./api'),
    service = require('./service')

exports.instance = function(ip, opts) {
    var header = "Basic " + btoa(opts.user + ":" + opts.pass),
	instance = new Instance()
	
    instance.setInstance(ip, header)
    return instance
}

function Instance() {
    nio.API.call(this)
}
Instance.prototype = Object.create(nio.API.prototype, {
    service: {
	value: function(serviceName) {
	    var child = this.getChild(service.Service)
	    child.makeRequest('services/' + serviceName)
	    return child
	}
    },

    services: {
	value: function() {
	    var child = this.getChild(service.Collection)
	    child.makeRequest('services')
	    return child
	}
    },

    serviceStatus: {
	value: function(serviceName, status) {
	    var child = this.getChild(service.Status)
	    child.makeRequest('services/' + serviceName + '/' + status)
	    return child
	}
    }
})

},{"./api":4,"./service":6}],6:[function(require,module,exports){
var nio = require('./api')

exports.Service = Service
exports.Collection = ServiceCollection
exports.Status = ServiceStatus

function Service() {
    nio.API.call(this)
}
Service.prototype = Object.create(nio.API.prototype, {})

function ServiceCollection() {
    nio.API.call(this)
}
ServiceCollection.prototype = Object.create(nio.API.prototype, {})

function ServiceStatus() {
    nio.API.call(this)
}
ServiceStatus.prototype = Object.create(nio.API.prototype, {})

},{"./api":4}],7:[function(require,module,exports){
var core = require('../core')
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: require('../utils')
})

exports.tiles = function(opts) {
	var selector = _.isPlainObject(opts) ? opts.selector : opts
	var numCols = opts.numCols || 3
	var animSpeed = opts.hasOwnProperty('animSpeed') ? opts.animSpeed : 0

	var elMain = d3.select(selector)
	//var elCols = []
	//for (var i=numCols; i--;)
	//	elCols[i] = elMain.append('div').style('float', 'left')

	// caching these functions
	var getHTML = function (d) { return template(d) }
	var getID = function (d) { return d ? d.id : console.log(d) }

	var tile = elMain.selectAll('.tile-wrapper')

	function render(posts) {
		tile = tile.data(posts, getID)
		var tileJoin = tile.order()

		var tileEnter = tile.enter().append('div')
			.attr('class', 'tile-wrapper')
			.html(getHTML)
			.on('click', function (d, i) {
				var el = d3.select(this).select('.tile')
				var isExpanded = el.classed('is-expanded')
				if (!isExpanded)
					elMain.selectAll('.tile').classed('is-expanded', false)
				el.classed('is-expanded', !isExpanded)
			})
			.select('.tile')
			.classed('flip-in', true)
		var tileExit = tile.exit()

		// animations will be disabled if animSpeed = 0
		if (animSpeed) {
			tileEnter
				.style('opacity', 0)
				.transition()
					.duration(animSpeed)
					.style('opacity', 1)
			tileExit.transition()
				.duration(animSpeed)
				.style('opacity', 0)
				.remove()
		} else {
			tileExit.remove()
		}
	}

	return nio.passthrough(render)
}

},{"../core":1,"../utils":8}],8:[function(require,module,exports){
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

var mediaTypeNames = {
	'twitter': 'Twitter',
	'twitter-photo': 'Twitter',
	'facebook': 'Facebook',
	'gplus': 'Google+',
	'linkedin': 'LinkedIn',
	'rss': 'RSS'
}

exports.mediaTypeName = function (type) {
	return type in mediaTypeNames ? mediaTypeNames[type] : type
}

},{}]},{},[2])