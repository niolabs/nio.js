/**
 * @name Stream
 * @author Matt Dodge <matt@n.io>
 * @license MIT
 */

var deps = require('./deps');
var _ = deps._;
var inherits = deps.inherits;
var EventEmitter = deps.eventemitter3;

/**
 * Stream is an event emitter for creating pipeline-based asynchronus workflows.
 *
 * @constructor
 * @extends {EventEmitter}
 * @param {function} onwrite
 */
function Stream(opts) {
	if (!(this instanceof Stream)) {
		return new Stream(opts);
	}
	EventEmitter.call(this);

	// listen for events and call onevent functions
	this.on('*', function () {
		var args = [].slice.call(arguments);
		var event = args[0];
		var func = this['on' + event];
		if (func) {
			func.apply(this, args.slice(1));
		}
	})

	if (_.isFunction(opts)) {
		this.onwrite = opts;
	}
	else if (_.isPlainObject(opts)) {
		_.assign(this, opts);
	}
	this.emit('init');
}

inherits(Stream, EventEmitter);

/**
 * emit is overwritten to support the '*' event, which is fired on every event.
 * This lets us listen to all events at once.
 *
 * @return {Stream}
 */
Stream.prototype.emit = function () {
	var args = [].slice.call(arguments);
	EventEmitter.prototype.emit.apply(this, args);

	// emit the '*' event
	args.unshift('*');
	EventEmitter.prototype.emit.apply(this, args);
}

/**
 * push sends chunks down the pipeline.
 *
 * @param {*} chunk Arbitrary write sent down the pipeline.
 */
Stream.prototype.push = function (chunk) {
	if (this.state === Stream.STATES.PAUSE) {
		this.broadcast('pauseddata', chunk);
		return;
	}
	if (_.isUndefined(chunk) || _.isNull(chunk)) {
		return;
	}
	if (_.isEmpty(chunk) && (_.isArray(chunk) || _.isPlainObject(chunk))) {
		return;
	}
	this.emit('data', chunk);
}

/**
 * write handles data that is piped to the stream.
 *
 * For now it just calls the _write function if it exists, but in the future it
 * may emit events or handle special cases.
 *
 * @param {*} chunk Arbitrary data sent down the pipeline.
 */
Stream.prototype.write = function (chunk) {
	if (this.onwrite) {
		this.onwrite(chunk);
	}
}

/**
 * onwrite allows users to read/modify data sent down the pipeline.
 *
 * This function should be overwritten. It passes data along by default.
 *
 * @param {*} chunk Arbitrary data sent down the pipeline.
 * @override
 */
Stream.prototype.onwrite = function (chunk) {
	this.push(chunk);
}

/**
 * pipe connects streams, allowing the parent stream to push data and events to
 * child streams.
 *
 * @param {...Stream|Stream[]} streams Streams to pipe together.
 * @return {Stream} The last stream in the pipeline. {@link Stream}
 */
Stream.prototype.pipe = function () {
	if (_.isArray(arguments[0])) {
		return this.pipe.apply(this, arguments[0]);
	}
	var dest = arguments[0];

	this.on('data', dest.write.bind(dest));
	this.on('broadcast', dest.broadcast.bind(dest));

	// use recursion to pipe the streams together
	if (arguments.length > 1) {
		var args = [].slice.call(arguments, 1);
		dest.pipe.apply(dest, args);
	}
	return dest;
}

/**
 * broadcast sends an event down the pipeline and calls the associated
 * functions on each.
 *
 * @param {string} event The name of the event to broadcast.
 * @param {...*} arguments Any data to send along with the event.
 * @return {Stream} This stream.
 */
Stream.prototype.broadcast = function () {
	var args = [].slice.call(arguments);
	args.unshift('broadcast');
	this.emit.apply(this, args);
	return this;
}

/**
 * onbroadcast emits the arguments to the broadcasted event.
 */
Stream.prototype.onbroadcast = function () {
	if (arguments.length === 0) {
		console.warn('broadcast() called without any arguments');
		return this;
	}

	// handle special case for states
	var event = arguments[0].toUpperCase();
	if (event in Stream.STATES) {
		this.state = Stream.STATES[event];
	}
	this.emit.apply(this, arguments);
}

/**
 * _broadcastOrEmit
 *
 * @param {Boolean} broadcast wether or not to broadcast
 * @return {Function}
 */
Stream.prototype._broadcastOrEmit = function (broadcast) {
	if (broadcast === false) {
		return this.emit.bind(this);
	}
	return this.broadcast.bind(this);
}

/**
 * reset tells a stream to flush their stored values, if any.
 *
 * @return {Stream} this
 */
Stream.prototype.reset = function (broadcast) {
	this._broadcastOrEmit(broadcast)('reset');
	return this;
}

/**
 * States that the stream can be in.
 */
Stream.STATES = {
	DEFAULT: 0,
	PAUSE: 1,
	RESUME: 2
};

/**
 * Set the default state.
 */
Stream.prototype.state = Stream.STATES.DEFAULT;

/**
 * Create a propogating function for each state.
 */
_.each(Stream.STATES, function (value, name) {
	name = name.toLowerCase();
	Stream.prototype[name] = function (broadcast) {
		this.state = value;
		this._broadcastOrEmit(broadcast)(name);
		return this;
	};
});

module.exports = Stream;
