'use strict';

var _ = require('lodash')
var d3 = require('d3')
var core = require('./core')

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

exports.func = function (fn) {
	return core.stream(function (chunk) {
		this.push(fn(chunk))
	})
}

exports.pass = function (fn) {
	return core.stream(function (chunk) {
		this.push(chunk)
		if (fn) fn(chunk)
	})
}

// only pushes unique chunks
exports.unique = function (opts) {
	var fn = getPropertyFunc(opts)
	var seen = []
	var stream = exports.func(function (chunk) {
		var id = fn(chunk)
		if (_.contains(seen, id))
			return
		seen.push(id)
		return chunk
	})
	stream._flush = function () {
		seen = []
	}
	return stream
}

// waits until the passed function returns true, or a timeout is reached
exports.wait = function (opts) {
	if (_.isFunction(opts))
		opts = {fn: opts}
	if (_.isNumber(opts))
		opts = {timeout: opts}

	var waiting = true
	var lastChunk = null
	var stream = core.stream(function (chunk) {
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
			stream.push(lastChunk)
		}, opts.timeout)

	return stream
}

// collects chunks into an array for sorting/manipulating sets of data
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

	var stream = core.stream(function (chunk) {
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

	stream.sort = function (value) {
		if (!value) return sortBy
		sortBy = value
		return this
	}

	stream.size = function (value) {
		if (!value) return size
		size = min = max = value
		return this
	}

	stream._flush = function () {
		data = []
	}

	stream.flush()

	return stream
}

// pushes down a select property
exports.pick = function (name) {
	return exports.func(function (chunk) {
		return chunk[name]
	})
}

// pushes individual items of an array down the pipe
exports.single = function () {
	return core.stream(function (chunk) {
		if (_.isArray(chunk))
			_.forEach(chunk, this.push.bind(this))
		else
			this.push(chunk)
	})
}

// sets defaults on the chunk
exports.defaults = function (opts) {
	return exports.func(function (chunk) {
		return _.defaults(chunk, opts)
	})
}

// logs output to the console
exports.log = function (prefix) {
	return exports.pass(function (chunk) {
		if (prefix) {
			console.log(prefix, chunk)
		} else {
			console.log(chunk)
		}
	})
}

// combines multiple streams into one
exports.join = function () {
	var river = new exports.pass()
	_.each(arguments, function (source) {source.pipe(river)})
	return river
}

// will only push a chunk if the function it's passed to returns true
exports.filter = function (fn) {
	return core.stream(function (chunk) {
		if (fn(chunk))
			this.push(chunk)
		else
			this.propogate('filtered', chunk)
	})
}

exports.setProps = function (chunk, map) {
	_.each(map, function (value, name) {
		if (_.isFunction(value))
			value = value(chunk)
		chunk[name] = value
	})
	return chunk
}

// renames/calculates property values on the chunk
exports.props = exports.map = function (map) {
	return core.stream(function (chunk) {
		this.push(exports.setProps(chunk, map))
	})
}

// delays sending chunks down the pipe
exports.throttle = function (delay) {
	var pass = function (chunk) {this.push(chunk)}
	var stream = core.stream()
	stream._flush = function () {
		this._write = _.throttle(pass, delay)
	}
	stream._flush()
	return stream
}

exports.debounce = function (delay) {
	var debounced = _.debounce(function (chunk) {this.push(chunk)}, delay)
	return core.stream(debounced)
}

// outputs the chunk to an element
exports.display = function (selector, property) {
	var el = d3.select(selector)
	var getDisplay = property
	if (_.isString(getDisplay))
		getDisplay = function (d) { return d[property] }
	return exports.pass(function (chunk) {
		el.html(getDisplay ? getDisplay(chunk) : chunk)
	})
}

exports.times = function (max) {
	var count = 0
	var stream = core.stream(function (chunk) {
		if (count === max) return
		this.push(chunk)
		count++
	})
	stream._flush = function () {count = 0}
	return stream
}

exports.once = _.partial(exports.times, 1)

// will only send chunks if they are different from the last
exports.changed = function () {
	var previous = null
	var stream = core.stream(function (chunk) {
		if (_.isEqual(chunk, previous)) return
		this.push(chunk)
		previous = chunk
		this.propogate('changed', chunk, previous, _.difference(chunk, previous))
	})
	stream._flush = function () {previous = null}
	return stream
}

// counts chunks that match a function
exports.count = function (opts) {
	// TODO: incomplete
	if (_.isFunction(opts))
		opts = [{id: 'count', fn: opts}]
	var counter = getPropertyFunc(value)
	var counts = {}
	var stream = exports.pass(function (chunk) {

	})
	stream._flush = function () {counts = {}}
	return stream
}

// listens to an event on the pipeline
exports.on = function (event, callback) {
	var stream = exports.pass()
	stream.on(event, callback)
	return stream
}

exports.sortFunc = function (value) {
	var fn = value
	if (_.isString(value))
		fn = function (d) { return d[value] }
	else if (_.isBoolean(value) || _.isUndefined(value))
		fn = function (d) { return d }
	return fn
}

// sorts an array
exports.sort = function (value, reverse) {
	return core.stream(function (chunk) {
		chunk = _.sortBy(chunk, value)
		if (reverse)
			chunk = chunk.reverse()
		this.push(chunk)
	})
}

// limits an array to a certain length
exports.limit = function (length) {
	return core.stream(function (chunk) {
		if (chunk.length > length)
			chunk = chunk.slice(0, length)
		this.push(chunk)
	})
}

exports.each = function (fn) {
	// create an anonymous function here so that partials aren't passed the index
	return exports.func(_.partialRight(_.each, function (chunk) { fn(chunk) }))
}
