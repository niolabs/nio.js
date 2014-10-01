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
