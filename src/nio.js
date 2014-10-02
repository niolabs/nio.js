var nio = window.nio = require('./core')
nio.utils = require('./utils')

// collects chunks into an array for sorting/manipulating sets of data
nio.collect = function (opts) {
	var transforms = opts.transforms || []
	var max = opts.max || 9
	var min = opts.min || 0

	var getID = opts.dupes || false
	if (getID)
		if (_.isString(getID))
			getID = function (d) { return d[opts.dupes] }
		else if (_.isBoolean(getID))
			getID = function (d) { return d }

	var sortDesc = opts.sortDesc || true
	var sortBy = opts.sort || false
	if (sortBy)
		if (_.isString(sortBy))
			sortBy = function (d) { return d[opts.sort] }
		else if (_.isBoolean(sortBy))
			sortBy = function (d) { return d }

	var data = []
	return nio.transform(function (chunk) {
		if (getID) {
			var id = getID(chunk)
			var isDupe = function (d) { return id === getID(d) }
			if (_.any(data, isDupe)) return
		}

		data.push(chunk)
		for (var i=0, l=transforms.length; i<l; i++)
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
}

// pushes down a select property
nio.pick = function (name) {
	return nio.transform(function (chunk) {
		if (!(name in chunk)) return
		var data = chunk[name]
		if (_.isArray(data))
			for (var i=data.length; i--;)
				this.push(data[i])
		else
			this.push(data)
	})
}

// sets defaults on the chunk
nio.defaults = function (opts) {
	return nio.transform(function (chunk) {
		this.push(_.defaults(chunk, opts))
	})
}

// logs output to the console
nio.log = function (prefix) {
	return nio.passthrough(function (chunk) {
		prefix ?
			console.log(prefix, chunk) :
			console.log(chunk)
	})
}

// combines multiple streams into one
nio.join = function () {
	var river = new nio.PassThrough()
	var sources = [].slice.call(arguments)
	for (var i=sources.length; i--;)
		sources[i].pipe(river)
	return river
}

// will only push a chunk if the function it's passed to returns true
nio.filter = function (fn) {
	return nio.transform(function (chunk) {
		if (fn(chunk)) this.push(chunk)
	})
}

// renames/calculates property values on the chunk
nio.map = function (map) {
	return nio.transform(function (chunk) {
		for (var name in map) {
			var value = map[name]
			if (_.isFunction(value))
				value = value(chunk)
			chunk[name] = value
		}
		this.push(chunk)
	})
}

// delays sending chunks down the pipe
nio.throttle = function (delay) {
	var throttled = _.throttle(function (chunk) {
		this.push(chunk)
	}, delay)
	return nio.transform(throttled)
}

// outputs the chunk to an element
nio.display = function (selector, property) {
	var el = d3.select(selector)
	var getDisplay = property
	if (_.isString(getDisplay))
		getDisplay = function (d) { return d[property] }
	return nio.passthrough(function (chunk) {
		el.html(getDisplay ? getDisplay(chunk) : chunk)
	})
}

// visualizations
nio.tiles = require('./tiles/tiles').tiles
nio.graphs = require('./graphs/graphs')
