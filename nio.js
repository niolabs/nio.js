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
    '		<%=linkify(text)%>\n' +
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
module.exports.EventEmitter = EventEmitter

function EventEmitter() {}

EventEmitter.prototype.on = function (event, fct) {
	this._events = this._events || {}
	this._events[event] = this._events[event]	|| []
	this._events[event].push(fct)
}

EventEmitter.prototype.off = function (event, fct) {
	this._events = this._events || {}
	if (event in this._events === false) return
	this._events[event].splice(this._events[event].indexOf(fct), 1)
}

EventEmitter.prototype.emit = function (event) {
	this._events = this._events || {}
	if (event in this._events === false) return
	for (var i=0; i<this._events[event].length; i++) {
		this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
	}
}

},{}],2:[function(require,module,exports){
var Stream = require('./stream')
var util = require('./util')

function JSONSource(host, pollRate) {
	if (!(this instanceof JSONSource))
		return new JSONSource(host, pollRate)
	Stream.call(this)
	this.host = host
	this.pollRate = pollRate || 30 * 1000
	this.interval = null
	this.path = null
}

util.inherits(JSONSource, Stream)

JSONSource.prototype._poll = function () {
	var path = this.path
	d3.json(this.host + '/' + path, function (error, json) {
		var data = json[path]
		if (data && _.isArray(data))
			for (var i=data.length; i--;)
				this.push(data[i])
		else
			this.push(data)
	}.bind(this))
	return this
}

JSONSource.prototype.get = function (path) {
	this.stop()
	this.path = path
	this._poll()
	this.interval = setInterval(this._poll.bind(this), this.pollRate)
	return this
}

JSONSource.prototype.stop = function () {
	if (this.interval) clearInterval(this.interval)
	return this
}

function socketio(host) {
	var ws = null
	var sock = null
	function fetch(type) {
		ws = io.connect(host, {'force new connection': true})
		sock = ws.socket
		sock.on('connect', function () {
			ws.emit('ready', type == 'posts' ? 'default' : path)
		})
		sock.on('connect_failed', function () {
			console.error('connection failed')
		})
		sock.on('error', function () {
			console.error('connection error')
		})
		ws.on('recvData', function (data) {
			fetch.push(type, JSON.parse(data))
		})
		return this
	}
	fetch.host = function (value) {
		if (!arguments.length) return host
		host = value
		return this
	}
	fetch.stop = function (value) {
		if (!ws) return
		ws.disconnect()
	}
	return _.assign(fetch, Stream.prototype)
}

// mux is a multiplexer that aggregates signals sent from sources
function mux() {
	var sources = []
	function fetch(type) {
		sources.forEach(function (source) {
			source.on('data', function (data) {
				fetch.push(data)
			})
			source(type)
		})
		return this
	}
	fetch.source = function (source) {
		sources.push(source)
		return this
	}
	fetch.stop = function () {
		sources.forEach(function (source) {
			source.stop()
		})
		return this
	}
	return _.assign(fetch, Stream.prototype)
}

function TestStream() {
	console.log(this)
	setInterval(function () {
		this.push('hello world')
	}.bind(this), 1000)
}
util.inherits(TestStream, Stream)

function logStream() {
	return Stream.make(function (chunk) {
		console.log(chunk)
		this.push(chunk)
	})
}

function Collection(modelFn) {
	if (!(this instanceof Collection))
		return new Collection(modelFn)
	Stream.call(this)
	this.modelFn = modelFn
	this.data = []
	this.transforms = []
	this.transformFn = null
}

util.inherits(Collection, Stream)

Collection.prototype.write = function (chunk) {
	var model = new this.modelFn(chunk)
	if (!_.any(this.data, function (m) { return model.getID() == m.getID() })) {
		this.data.push(model)
		if (this.transformFn)
			this.data = this.transformFn(this.data)
		this.push(this.data)
	}
}

Collection.prototype.transform = function (fn) {
	this.transforms.push(fn)
	this.transformFn = this.transforms[0]
	return this
}

Collection.prototype.sort = function (prop, reverse) {
	this.transform(function (data) {
		var sorted = _.sortBy(data, function (d) { return d[prop] })
		return reverse ? sorted.reverse() : sorted
	})
	return this
}

module.exports = window.nio = {
	json: JSONSource,
	socketio: socketio,
	mux: mux,
	models: require('./models'),
	tiles: require('./tiles/tiles.js'),
	collection: Collection,
	utils: {
		logStream: logStream
	}
}

},{"./models":3,"./stream":4,"./tiles/tiles.js":5,"./util":6}],3:[function(require,module,exports){
function Post(opts) {
	_.assign(this, Post.defaults, opts)
}

Post.prototype.getID = function () {
	return this.id
}

Post.defaults = {
	profile_image_url: null,
	media_url: null
}

module.exports = {
	Post: Post,
}

},{}],4:[function(require,module,exports){
/* A naive, barebones implementation of node's Stream API. */
module.exports = Stream

var EventEmitter = require('./events').EventEmitter
var util = require('./util')

function Stream() {
	EventEmitter.call(this)
}

util.inherits(Stream, EventEmitter)

Stream.prototype.push = function (chunk) {
	this.emit('data', chunk)
}

Stream.prototype.write = function (chunk) {
	this.emit('error', new Error('not implemented'))
}

Stream.prototype.pipe = function (dest) {
	this.on('data', dest.write.bind(dest))
	return dest
}

Stream.make = function (writeFunc) {
	var stream = new Stream()
	stream.write = writeFunc.bind(stream)
	return stream
}

},{"./events":1,"./util":6}],5:[function(require,module,exports){
var Stream = require('../stream')
var util = require('../util')
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: { 'linkify': linkify }
})

function linkify(str) {
	str = str.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a target=_blank href='$1'>$1</a>")
	str = str.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>")
	return str.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>")
}

function TileView(selector) {
	if (!(this instanceof TileView))
		return new TileView(selector)
	this.el = d3.select(selector)
	this.posts = []
	this.lazyUpdate = _.debounce(this.update.bind(this), 1000)
}

util.inherits(TileView, Stream)

TileView.prototype.update = function () {
	var elTiles = this.el.selectAll('div').data(this.posts)

	elTiles.enter().append('div')

	elTiles
		.attr('class', function (p) {
			return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '')
		})
		.html(function (p) { return template(p) })

	elTiles.exit()

	return this
}

TileView.prototype.write = function (chunk) {
	this.posts = chunk
	this.lazyUpdate()
	this.push(chunk)
}

module.exports = TileView

},{"../stream":4,"../util":6}],6:[function(require,module,exports){
module.exports.inherits = function (ctor, superCtor) {
	ctor.super_ = superCtor
	ctor.prototype = Object.create(superCtor.prototype, {
			constructor: {
			value: ctor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	})
}

},{}]},{},[2])