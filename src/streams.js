'use strict';

var _ = require('lodash')
var d3 = require('d3')
var core = require('./core')

// collects chunks into an array for sorting/manipulating sets of data
exports.collect = function (opts) {
	opts = opts || {}
	var transforms = opts.transforms || []
	var size = opts.size || 9
	var max = opts.max || size
	var min = opts.min || 0

	var getID = opts.dupes || false
	if (getID) {
		if (_.isString(getID)) {
			getID = function (d) { return d[opts.dupes] }
		} else if (_.isBoolean(getID)) {
			getID = function (d) { return d }
		}
	}

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
		if (getID) {
			var id = getID(chunk)
			var isDupe = function (d) { return id === getID(d) }
			if (_.any(data, isDupe)) return
		}

		data.push(chunk)
		for (var i = 0, l = transforms.length; i < l; i++)
			data = transforms[i](data)

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
	var throttled = _.throttle(function (chunk) {
		this.push(chunk)
	}, delay)
	return core.transform(throttled)
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
