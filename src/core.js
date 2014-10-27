'use strict';

var _ = require('lodash')
var d3 = require('d3')
var utils = require('./utils')
var util = require('util')
var events = require('events')

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
	events.EventEmitter.call(this)
	if (fn) fn.apply(this)
}

util.inherits(Readable, events.EventEmitter)

Readable.prototype.push = function (chunk) {
	if (typeof chunk !== 'undefined') {
		this.emit('data', chunk)
	}
}

Readable.prototype.pipe = function () {
	var dests = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
	var dest = dests[0]
	this.on('data', dest.write.bind(dest))
	// use recursion to string the streams together
	if (dests.length > 1)
		dest.pipe(dests.slice(1))
	return dest
}

Readable.prototype.split = function () {
	var dests = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
	for (var i = dests.length; i--;)
		this.pipe(dests[i])
	return this
}

Readable.prototype.pull = function () {
	var sources = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
	for (var i = sources.length; i--;)
		sources[i].pipe(this)
	return this
}

exports.Readable = Readable

function Transform(_write) {
	Readable.call(this)
	this._write = _write
}

util.inherits(Transform, Readable)

Transform.prototype.write = mustImplement('_write')

exports.Transform = Transform

function PassThrough(_write) {
	Readable.call(this)
	this._write = _write
}

util.inherits(PassThrough, Readable)

PassThrough.prototype.write = function (chunk) {
	this.push(chunk)
	if (this._write) this._write(chunk)
}

exports.PassThrough = PassThrough

// base functions for a source
function Source() {
	Readable.call(this)
}
util.inherits(Source, Readable)
Source.prototype.start = mustImplement('start')
Source.prototype.pause = mustImplement('pause')
Source.prototype.resume = mustImplement('resume')
exports.Source = Source

function JSONStream(host, pollRate) {
	Source.call(this)
	this.host = host
	this.interval = null
	this.lastPath = null
	this.pollRate = pollRate || 20 * 1000
}

util.inherits(JSONStream, Source)

JSONStream.prototype.start = function (path, params) {
	if (this.interval)
		clearInterval(this.interval)
	this.path = path || this.path
	this.params = params || this.params
	if (this.params) {
		var qs = []
		for (var param in this.params)
			if (this.params[param])
				qs.push(param + '=' + encodeURIComponent(this.params[param]))
		this.path += '?' + qs.join('&')
	}
	this.fetch(this.path)
	this.interval = setInterval(function () {
		return this.fetch(this.path)
	}.bind(this), this.pollRate)
	return this
}

JSONStream.prototype.fetch = function (path) {
	d3.json(this.host + '/' + path, function (error, json) {
		this.push(json)
	}.bind(this))
	return this
}

JSONStream.prototype.stop = function () {
	clearInterval(this.interval)
	return this
}

exports.JSONStream = JSONStream

function SocketIOStream(host) {
	Source.call(this)
	this.ws = null
	this.host = host
}

util.inherits(SocketIOStream, Source)

SocketIOStream.prototype.start = function (path) {
	/* global io */
	if (!window.io) {
		var s = utils.loadScript(this.host + '/socket.io/socket.io.js')
		s.onload = function () { this.start(path) }.bind(this)
		return this
	}
	this.path = path || this.path
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

SocketIOStream.prototype.stop = function () {
	this.ws.disconnect()
	return this
}

exports.SocketIOStream = SocketIOStream

function GeneratorStream(msg, rate) {
	Source.call(this)
	this.msg = msg || 'Hello world'
	this.rate = rate || 1000
	this.interval = null
	this.start()
}

util.inherits(GeneratorStream, Source)

GeneratorStream.prototype.start = function () {
	this.interval = setInterval(function () {
		this.push(_.isFunction(this.msg) ? this.msg() : this.msg)
	}.bind(this), this.rate)
	return this
}

GeneratorStream.prototype.pause = function () {
	clearInterval(this.interval)
	return this
}

GeneratorStream.prototype.resume = function () {
	return this.start()
}

exports.GeneratorStream = GeneratorStream
