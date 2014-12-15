'use strict';

var _ = require('lodash')
var d3 = require('d3')
var stream = require('./stream')

/**
 * getPropertyFunc creates a function that gets a property on an object.
 *
 * @param {(string|function)=} value
 * @return {function}
 */
function getPropertyFunc(value) {
	if (_.isUndefined(value))
		return function (chunk) { return chunk }
	else if (_.isString(value))
		return function (chunk) { return chunk[value] }
	else if (_.isFunction(value))
		return value
	else
		throw new Error('value must be a string or function')
}

/**
 * func pushes the returned chunk down the pipeline.
 *
 * @param {function} fn
 * @return {stream}
 */
exports.func = function (fn) {
	return stream(function (chunk) {
		var results = fn.call(this, chunk)
		this.push(results)
	})
}

/**
 * pass creates a stream observes chunks passed through it.
 *
 * @param {function} fn
 * @return {stream}
 */
exports.pass = function (fn) {
	return stream(function (chunk) {
		this.push(chunk)
		if (fn) fn.call(this, chunk)
	})
}

/**
 * times halts the stream when a set number of chunks have passed through it.
 * Useful for testing/debugging.
 *
 * @param {number} max
 * @return {stream}
 */
exports.times = function (max) {
	var count = 0
	return stream({
		onwrite: function (chunk) {
			if (count === max) return
			this.push(chunk)
			count++
		},
		onreset: function () {count = 0}
	})
}

/**
 * once halts the stream after one chunk has passed through it. Useful for
 * testing/debugging.
 *
 * @return {stream}
 */
exports.once = _.partial(exports.times, 1)

/**
 * pull creates a stream that passes data from other streams. This is useful
 * for pulling in data mid-pipeline.
 *
 * TODO: is this function really necessary? why not just use pipe?
 *
 * @param {(...stream|stream[])} streams Streams to pull from.
 * @return {stream} The unified stream.
 */
exports.pull = function () {
	if (_.isArray(arguments[0]))
		return this.apply(this, arguments[0])
	var s = stream()
	_.each(arguments, function (source) {source.pipe(s)})
	return s
}

/**
 * split creates a stream that pushes data to each argument individually.
 *
 * @param {(...stream|stream[])} streams Streams to push to.
 * @return {stream} The original split stream.
 */
exports.split = function () {
	if (_.isArray(arguments[0]))
		return this.apply(this, arguments[0])
	var s = stream()
	_.each(arguments, s.pipe, s)
	return this
}

/**
 * join combines multiple streams into one.
 *
 * @param {(...stream|stream[])} streams Streams to combine.
 * @return {stream}
 */
exports.join = function () {
	if (_.isArray(arguments[0]))
		return this.apply(this, arguments[0])
	var s = new exports.pass()
	_.each(arguments, function (source) {source.pipe(s)})
	return s
}

// will only push a chunk if the function it's passed to returns true
exports.filter = function (fn) {
	return stream(function (chunk) {
		if (fn.call(this, chunk)) this.push(chunk)
	})
}

/**
 * filter to push chunk if property's value is value.
 *
 * @param property
 * @param value
 * @return {stream}
 */
exports.is = function (property, value) {
    return exports.filter(function(d) {
        return d[property] == value
    })
}

/**
 * unique IDs chunks that are sent to it and only pushes ones it hasn't seen
 * yet.
 *
 * @param {(string|function)=} value The property getter for the chunk ID.
 * @return {stream}
 */
exports.unique = function (value) {
	var fn = getPropertyFunc(value)
	var seen = []
	var s = exports.func(function (chunk) {
		var id = fn(chunk)
		if (_.contains(seen, id))
			return
		seen.push(id)
		return chunk
	})
	s.onreset = function () {
		seen = []
	}
	return s
}

/**
 * wait will halt the stream until a timeout is reached or a function returns
 * true.
 *
 * @param {(function|number|{fn: function(*), timeout: number})} opts The filter
 * function, timeout, or object containing both.
 * @return {stream}
 */
exports.wait = function (opts) {
	if (_.isFunction(opts))
		opts = {fn: opts}
	if (_.isNumber(opts))
		opts = {timeout: opts}

	var waiting = true
	var lastChunk = null
	var s = stream(function (chunk) {
		if (opts.fn && opts.fn(chunk))
			waiting = false
		if (waiting)
			lastChunk = chunk
		else
			this.push(chunk)
	})

	if (opts.timeout)
		setTimeout(function () {
			if (!waiting) return
			waiting = false
			s.push(lastChunk)
		}, opts.timeout)

	return s
}

/**
 * collect puts chunks into an array. This can be useful for sorting or
 * manipulating sets of data.
 *
 * TODO: clean this up by replacing some of the sorting/limiting with .sort()
 * and .limit().
 *
 * @param {object=} opts
 * @return {stream}
 */
exports.collect = function (opts) {
	opts = opts || {}
	var size = opts.size || 9
	var max = opts.max || size
	var min = opts.min || 0

	var sortDesc = opts.sortDesc || true
	var sortBy = opts.sort || false
	if (sortBy) {
		if (_.isString(sortBy)) {
			sortBy = function (d) { return d[opts.sort] }
		} else if (_.isBoolean(sortBy)) {
			sortBy = function (d) { return d }
		}
	}

	var data = []

	var s = stream(function (chunk) {
		data.push(chunk)

		if (sortBy) {
			data = _.sortBy(data, sortBy)
			if (sortDesc)
				data = data.reverse()
		}

		if (max && data.length > max)
			data = data.slice(0, max)
		if (min && data.length < min)
			return

		this.push(data)
	})

	s.sort = function (value) {
		if (!value) return sortBy
		sortBy = value
		return this
	}

	s.size = function (value) {
		if (!value) return size
		size = min = max = value
		return this
	}

	s.onreset = function () {
		data = []
	}

	s.onreset()

	return s
}

/**
 * get pushes a property on the chunks passed to it.
 *
 * @param {(string|function)=} value The property getter for the chunk ID.
 * @return {stream}
 */
exports.get = function (value) {
	var fn = getPropertyFunc(value)
	return exports.func(fn)
}

/**
 * setProps is a helper function that sets properties on chunks.
 *
 * @param {object} chunk
 * @param {object} map
 * @return {object} The modified chunk.
 */
exports.setProps = function (chunk, map) {
	_.each(map, function (value, name) {
		if (_.isFunction(value))
			value = value(chunk)
		chunk[name] = value
	})
	return chunk
}

/**
 * set renames/calculates property values on the chunk
 *
 * @param map
 * @return stream
 */
exports.set = function (map) {
	return stream(function (chunk) {
		this.push(exports.setProps(chunk, map))
	})
}

/**
 * single pushes each item in an array.
 *
 * @return {stream}
 */
exports.single = function () {
	return stream(function (chunk) {
		if (_.isArray(chunk))
			_.each(chunk, this.push, this)
		else
			this.push(chunk)
	})
}

/**
 * defaults assigns defaults to chunks.
 *
 * @param {object} opts Default property values.
 * @return {stream}
 */
exports.defaults = function (opts) {
	return exports.func(_.partialRight(_.defaults, opts))
}

/**
 * log logs chunks passed through it.
 *
 * @param {string=} prefix Prefix log output.
 * @return stream
 */
exports.log = function (prefix) {
	return exports.pass(function (chunk) {
		if (prefix) {
			console.log(prefix, chunk)
		} else {
			console.log(chunk)
		}
	})
}

/**
 * throttle delays sending chunks down the pipe
 *
 * @param {number} delay
 * @return {stream}
 */
exports.throttle = function (delay) {
	var pass = function (chunk) {this.push(chunk)}
	var s = stream()
	s.onreset = function () {
		this.onwrite = _.throttle(pass, delay)
	}
	s.onreset()
	return s
}

/**
 * debounce
 *
 * @param {number} delay
 * @return {stream}
 */
exports.debounce = function (delay) {
	var debounced = _.debounce(function (chunk) {this.push(chunk)}, delay)
	return stream(debounced)
}

/**
 * display outputs the chunk to a DOM element
 *
 * @param {string} selector
 * @param {(string|function)} property
 * @return {stream}
 */
exports.display = function (selector, property) {
	var el = d3.select(selector)
	var getDisplay = property
	if (_.isString(getDisplay))
		getDisplay = function (d) { return d[property] }
	return exports.pass(function (chunk) {
		el.html(getDisplay ? getDisplay(chunk) : chunk)
	})
}

/**
 * changed will only send chunks if they are different from the last
 *
 * @return {stream}
 */
exports.changed = function () {
	var previous = null
	var s = stream(function (chunk) {
		if (_.isEqual(chunk, previous)) return
		this.push(chunk)
		previous = chunk
		this.broadcast('changed', chunk, previous, _.difference(chunk, previous))
	})
	s.onreset = function () {previous = null}
	return s
}

// counts chunks that match a function
/*exports.count = function (opts) {
	// TODO: incomplete
	if (_.isFunction(opts))
		opts = [{id: 'count', fn: opts}]
	var counter = getPropertyFunc(value)
	var counts = {}
	var s = exports.pass(function (chunk) {

	})
	s.onreset = function () {counts = {}}
	return s
}*/

/**
 * on listens to an event on the pipeline
 *
 * @param {string} event
 * @param {function(*)} callback
 * @return {stream}
 */
exports.on = function (event, callback) {
	var s = exports.pass()
	s.on(event, callback)
	return s
}

/**
 * sortFunc is a helper function that generates a function to sort by.
 *
 * @param value
 * @return {undefined}
 */
exports.sortFunc = function (value) {
	var fn = value
	if (_.isString(value))
		fn = function (d) { return d[value] }
	else if (_.isBoolean(value) || _.isUndefined(value))
		fn = function (d) { return d }
	return fn
}

/**
 * sort sorts an array
 *
 * @param value
 * @param {boolean} reverse
 * @return {stream}
 */
exports.sort = function (value, reverse) {
	return stream(function (chunk) {
		chunk = _.sortBy(chunk, value)
		if (reverse)
			chunk = chunk.reverse()
		this.push(chunk)
	})
}

/**
 * limit an array to a certain length.
 *
 * @param {number} length
 * @return {stream}
 */
exports.limit = function (length) {
	return stream(function (chunk) {
		if (chunk.length > length)
			chunk = chunk.slice(0, length)
		this.push(chunk)
	})
}

/**
 * each runs a function on each item in an array.
 *
 * @param {function} fn
 * @return {stream}
 */
exports.each = function (fn) {
	// create an anonymous function here so that partials aren't passed the index
	return exports.func(_.partialRight(_.each, function (chunk) { fn(chunk) }))
}
