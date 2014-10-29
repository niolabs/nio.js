var _ = require('lodash')
var url = require('url')
var d3 = require('d3')
var util = require('util')
var core = require('./core')
var utils = require('./utils')

function JSONStream(uri) {
	if (!(this instanceof JSONStream))
		return new JSONStream(uri)
	this.uri = uri
	core.Stream.call(this)
}

util.inherits(JSONStream, core.Stream)

// applys query parameters to a uri
function applyParams(uri, params) {
	var u = url.parse(uri, true)
	u.search = null
	u.query = params
	return u.format()
}

JSONStream.prototype._init = function () {this._resume()}
JSONStream.prototype._resume = function (params) {
	this._flush()
	var uri = applyParams(this.uri, params)
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
	if (this.xhr) this.xhr.abort()
}

function SocketIOStream(opts) {
	if (!(this instanceof SocketIOStream))
		return new SocketIOStream(opts)
	core.Stream.call(this)
	this.ws = null
	this.host = opts.host
	this.rooms = opts.rooms

	/* global io */
	if (!window.io) {
		var s = utils.loadScript(this.host + '/socket.io/socket.io.js')
		s.onload = function () {this.resume()}.bind(this)
		return this
	}

	this._resume()
}

util.inherits(SocketIOStream, core.Stream)

SocketIOStream.prototype._resume = function () {
	this._flush()
	this.ws = io.connect(this.host)

	var sock = this.ws.socket
	sock.on('connect', function () {
		return this.ws.emit('ready', this.path)
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
	core.Stream.call(this)
	this.msg = msg || 'Hello world'
	this.rate = rate || 1000
	this._resume()
}

util.inherits(GeneratorStream, core.Stream)

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
