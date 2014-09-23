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
