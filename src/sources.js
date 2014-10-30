var _ = require('lodash')
var url = require('url')
var d3 = require('d3')
var util = require('util')
var Stream = require('./stream')
var utils = require('./utils')

function JSONStream(uri) {
	if (!(this instanceof JSONStream))
		return new JSONStream(uri)
	this.uri = uri
	this.params = {}
	Stream.call(this)
}

util.inherits(JSONStream, Stream)

// applys query parameters to a uri
function applyParams(uri, params) {
	var u = url.parse(uri, true)
	u.search = null
	u.query = params
	return u.format()
}

JSONStream.prototype._init = function () { this._resume() }

JSONStream.prototype._resume = function () {
	this._flush()
	var uri = applyParams(this.uri, this.params)
	this.xhr = d3.json(uri, function (error, json) {
		this.push(json)
	}.bind(this))
	return this
}

JSONStream.prototype._pause = function () {
	this._flush()
	return this
}

JSONStream.prototype._flush = function () {
	this.params = {}
	if (this.xhr) this.xhr.abort()
}

function SocketIOStream(opts) {
	if (!(this instanceof SocketIOStream))
		return new SocketIOStream(opts)
	Stream.call(this)
	this.ws = null
	this.host = opts.host
	this.rooms = opts.rooms
}

util.inherits(SocketIOStream, Stream)

SocketIOStream.prototype._resume = function () {
	/* global io */
	if (!window.io) {
		var s = utils.loadScript(this.host + '/socket.io/socket.io.js')
		s.onload = function () { this._resume() }.bind(this)
		return this
	}

	this._flush()
	this.ws = io.connect(this.host)

	var sock = this.ws.socket
	sock.on('connect', function () {
		_.each(this.rooms, function (room) {
			this.ws.emit('ready', room)
		}, this)
	}.bind(this))
	sock.on('connect_failed', function () {
		console.error('connection failed')
	})
	sock.on('error', function () {
		console.error('connection error')
	})
	this.ws.on('recvData', function (data) {
		this.push(JSON.parse(data))
	}.bind(this))
	return this
}

SocketIOStream.prototype._pause = function () {
	this._flush()
	return this
}

SocketIOStream.prototype._flush = function () {
	if (this.ws && this.ws.socket.connected)
		this.ws.disconnect()
}

function GeneratorStream(msg, rate) {
	if (!(this instanceof GeneratorStream))
		return new GeneratorStream(msg, rate)
	Stream.call(this)
	this.msg = msg || 'Hello world'
	this.rate = rate || 1000
}

util.inherits(GeneratorStream, Stream)

GeneratorStream.prototype._init = function () { this._resume() }

GeneratorStream.prototype._resume = function () {
	this.interval = setInterval(function () {
		this.push(_.isFunction(this.msg) ? this.msg() : this.msg)
	}.bind(this), this.rate)
	return this
}

GeneratorStream.prototype._pause = function () {
	this._flush()
	return this
}

GeneratorStream.prototype._flush = function () {
	if (this.interval) clearInterval(this.interval)
}

module.exports = {
	SocketIOStream: SocketIOStream,
	socketio: SocketIOStream,
	JSONStream: JSONStream,
	json: JSONStream,
	GeneratorStream: GeneratorStream,
	generate: GeneratorStream
}
