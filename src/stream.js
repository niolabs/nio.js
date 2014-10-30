/**
 * @name Stream
 * @author Liam Curry <lcurry@n.io>
 * @author Matt Dodge <matt@n.io>
 * @license MIT
 */

var _ = require('lodash')
var util = require('util')
var events = require('events')

/**
 * Stream is an event emitter for creating pipeline-based asynchronus workflows.
 *
 * @extends {events.EventEmitter}
 * @constructor
 * @param {function} _write
 */
function Stream(_write) {
	if (!(this instanceof Stream))
		return new Stream(_write)
	events.EventEmitter.call(this)
	if (_write) this._write = _write
	if (this._init) this._init()
}

util.inherits(Stream, events.EventEmitter)

/**
 * push sends chunks down the pipeline.
 *
 * @param {*} chunk Arbitrary data sent down the pipeline.
 */
Stream.prototype.push = function (chunk) {
	if (_.isEmpty(chunk)) return
	this.emit('data', chunk)
}

/**
 * pipe connects streams, allowing the parent stream to push data and events to
 * child streams.
 *
 * @param {...Stream|Stream[]} streams Streams to pipe together.
 * @return {Stream} The last stream in the pipeline. {@link Stream}
 */
Stream.prototype.pipe = function () {
	if (_.isArray(arguments[0]))
		return this.pipe.apply(this, arguments[0])
	var dest = arguments[0]
	this.on('data', dest.write.bind(dest))
	this.on('propogate', dest.propogate.bind(dest))
	// use recursion to pipe the streams together
	if (arguments.length > 1) {
		var args = [].slice.call(arguments, 1)
		dest.pipe.apply(dest, args)
	}
	return dest
}

/**
 * propogate sends an event down the pipeline and calls the associated
 * functions on each.
 *
 * @param {string} event The name of the event to propogate.
 * @param {...*} arguments Any data to send along with the event.
 * @return {Stream} This stream.
 */
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

Stream.NATIVE_PROPOGATING = ['flush', 'pause', 'resume']
/**
 * Native propogating functions that can be called directly.
 */
_.each(Stream.NATIVE_PROPOGATING, function (name) {
	Stream.prototype[name] = function () {
		this.propogate(name)
		return this
	}
})

/**
 * write handles data that is piped to the stream.
 *
 * For now it just calls the _write function if it exists, but in the future it
 * may emit events or handle special cases.
 *
 * @param {*} chunk Arbitrary data sent down the pipeline.
 */
Stream.prototype.write = function (chunk) {
	if (this._write) this._write(chunk)
}

/**
 * _write allows users to read/modify data sent down the pipeline.
 *
 * This function should be overwritten. It passes data along by default.
 *
 * @param {*} chunk Arbitrary data sent down the pipeline.
 * @override
 */
Stream.prototype._write = function (chunk) {
	this.push(chunk)
}

module.exports = Stream
