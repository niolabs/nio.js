'use strict';

var _ = require('lodash')
var d3 = require('d3')

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
			for (var i = 0, l = this._events[event].length; i < l; i++)
				this._events[event][i].apply(this, args)
		}
	}
})

function mustImplement(name) {
	return function () {
		if (!this[name]) {
			this.emit('error', new Error(name + ' has not been implemented'))
		} else {
			this[name].apply(this, arguments)
		}
	}
}
exports.mustImplement = mustImplement

function Readable(fn) {
	EventEmitter.call(this)
	if (fn) fn.apply(this)
}
Readable.prototype = Object.create(EventEmitter.prototype, {
	push: {
		value: function (chunk) { 
			if (typeof chunk !== 'undefined') {
				this.emit('data', chunk) 
			}
		}
	},
	pipe: {
		value: function () {
			var dests = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
			var dest = dests[0]
			this.on('data', dest.write.bind(dest))
			// use recursion to string the streams together
			if (dests.length > 1)
				dest.pipe(dests.slice(1))
			return dest
		}
	},
	split: {
		value: function () {
			var dests = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
			for (var i = dests.length; i--;)
				this.pipe(dests[i])
			return this
		}
	},
	pull: {
		value: function () {
			var sources = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
			for (var i = sources.length; i--;)
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
		value: function (path, params) {
			if (params) {
				var qs = []
				for (var param in params)
					if (params[param])
						qs.push(param + '=' + encodeURIComponent(params[param]))
				path += '?' + qs.join('&')
			}
			this.fetch(path)
			this.interval = setInterval(function () {
				return this.fetch(path)
			}.bind(this), this.pollRate)
			return this
		}
	},
	fetch: {
		value: function (path) {
			this.lastPath = path
			console.log(path)
			d3.json(this.host + '/' + path, function (error, json) {
				this.push(json)
			}.bind(this))
			return this
		}
	},
	pause: {
		value: function () {
			clearTimeout(this.interval)
			return this
		}
	},
	resume: {
		value: function () {
			this.start(this.lastPath)
			return this
		}
	}
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
			/* global io */
			this.path = path
			this.ws = io.connect(this.host)

			var sock = this.ws.socket
			sock.on('connect', function () {
				return this.ws.emit('ready', path)
			}.bind(this))
			sock.on('connect_failed', function () {
				console.error('connection failed')
			})
			sock.on('error', function () {
				console.error('connection error')
			})
			this.ws.on('recvData', function (data) {
				return this.push(JSON.parse(data))
			}.bind(this))
			return this
		}
	},
	pause: {
		value: function () {
			this.ws.disconnect()
			return this
		}
	},
	resume: {
		value: function () {
			this.start(this.path)
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
	pause: {
		value: function () {
			clearInterval(this.interval)
			return this
		}
	},
	resume: {
		value: function () {
			return this.start()
		}
	}
})
exports.GeneratorStream = GeneratorStream
