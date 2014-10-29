var _ = require('lodash')
var util = require('util')
var events = require('events')

function Stream() {
	if (!(this instanceof Stream))
		return new Stream()
	events.EventEmitter.call(this)
	if (this._init) this._init()
}

util.inherits(Stream, events.EventEmitter)

// Send data down the pipeline
Stream.prototype.push = function (chunk) {
	if (_.isUndefined(chunk)) return
	this.emit('data', chunk)
}

// Connect to other streams
Stream.prototype.pipe = function () {
	var dests = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
	var dest = dests[0]
	this.on('data', dest.write.bind(dest))
	this.on('propogate', dest.propogate.bind(dest))
	// use recursion to string the streams together
	if (dests.length > 1)
		dest.pipe(dests.slice(1))
	return dest
}

// Pipe to multiple streams at a time
Stream.prototype.split = function () {
	if (_.isArray(arguments[0]))
		return this.split.apply(this, arguments[0])
	_.each(arguments, this.pipe, this)
	return this
}

// Pull data from other streams
Stream.prototype.pull = function () {
	if (_.isArray(arguments[0]))
		return this.pull.apply(this, arguments[0])
	_.each(arguments, function (source) {source.pipe(this)}, this)
	return this
}

Stream.prototype.write = function (chunk) {
	if (this._write) this._write(chunk)
}

Stream.prototype._write = function (chunk) {
	this.push(chunk)
}

// sends events down the pipeline
Stream.prototype.propogate = function () {
	var args = [].slice.call(arguments)
	if (args.length === 0) {
		console.warn('propogate() called without any arguments')
		return this
	}
	// emit the desired event
	this.emit.apply(this, args)

	// if there's a _func function, run it
	var funcName = '_' + args[0]
	if (this[funcName]) this[funcName]()

	// propogate the event
	args.unshift('propogate')
	this.emit.apply(this, args)
	return this
}

// native propgating functions
_.each([
	'flush',
	'pause',
	'resume'
], function (name) {
	Stream.prototype[name] = function () {
		this.propogate(name)
		return this
	}
})

module.exports = {
	Stream: Stream,
	stream: Stream
}
