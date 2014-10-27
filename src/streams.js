'use strict';

var _ = require('lodash')
var d3 = require('d3')
var core = require('./core')

function getPropertyFunc(opts) {
	if (_.isUndefined(opts))
		return function (chunk) { return chunk }
	else if (_.isString(opts))
		return function (chunk) { return chunk[opts] }
	else if (_.isFunction(opts))
		return opts
	else
		throw new Error('opts must be a string or function')
}

// only pushes unique chunks
exports.unique = function (opts) {
	var fn = getPropertyFunc(opts)
	var seen = []
	var stream = core.transform(function (chunk) {
		var id = fn(chunk)
		if (_.contains(seen, id))
			return
		seen.push(id)
		this.push(chunk)
	})
	stream.clear = function () {
		seen = []
	}
	return stream
}

// waits until the passed function returns true, or a timeout is reached
exports.wait = function (opts) {
	if (_.isFunction(opts))
		opts = {fn: opts}
	var waiting = true
	var lastChunk = null
	var stream = core.transform(function (chunk) {
		if (opts.fn(chunk))
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

	var stream = core.transform(function (chunk) {
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

	stream.clear = function () {
		data = []
		return this
	}

	stream.clear()

	return stream
}

// pushes down a select property
exports.pick = function (name) {
	return core.transform(function (chunk) {
		if (!(name in chunk)) return
		var data = chunk[name]
		if (_.isArray(data)) {
			for (var i = data.length; i--;)
				this.push(data[i])
		} else {
			this.push(data)
		}
	})
}

// sets defaults on the chunk
exports.defaults = function (opts) {
	return core.transform(function (chunk) {
		this.push(_.defaults(chunk, opts))
	})
}

// logs output to the console
exports.log = function (prefix) {
	return core.passthrough(function (chunk) {
		if (prefix) {
			console.log(prefix, chunk)
		} else {
			console.log(chunk)
		}
	})
}

// combines multiple streams into one
exports.join = function () {
	var river = new core.passthrough()
	var sources = [].slice.call(arguments)
	for (var i = sources.length; i--;)
		sources[i].pipe(river)
	return river
}

// will only push a chunk if the function it's passed to returns true
exports.filter = function (fn) {
	return core.transform(function (chunk) {
		if (fn(chunk)) this.push(chunk)
	})
}

// renames/calculates property values on the chunk
exports.props = exports.map = function (map) {
	return core.transform(function (chunk) {
		_.forEach(map, function (value, name) {
			if (_.isFunction(value))
				value = value(chunk)
			chunk[name] = value
		})
		this.push(chunk)
	})
}

// delays sending chunks down the pipe
exports.throttle = function (delay) {
	var throttled = _.throttle(function (chunk) {this.push(chunk)}, delay)
	return core.transform(throttled)
}

exports.debounce = function (delay) {
	var debounced = _.debounce(function (chunk) {this.push(chunk)}, delay)
	return core.transform(debounced)
}

// outputs the chunk to an element
exports.display = function (selector, property) {
	var el = d3.select(selector)
	var getDisplay = property
	if (_.isString(getDisplay))
		getDisplay = function (d) { return d[property] }
	return core.passthrough(function (chunk) {
		el.html(getDisplay ? getDisplay(chunk) : chunk)
	})
}
