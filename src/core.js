var stream = require('./stream')
var src = require('./src')
var utils = require('./utils')

var nio = window.nio = {
	stream: stream,
	utils: utils,
	src: src,
	socketio: src.socketio,
	json: src.json,
	generate: src.generate,
	tiles: require('./tiles/tiles').tiles,
	graphs: require('./graphs/graphs')
}

nio.array = function (opts) {
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
	return stream.transform(function (chunk) {
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
	return stream.transform(function (chunk) {
		if (!(name in chunk)) return
		var data = chunk[name]
		if (_.isArray(data))
			for (var i=data.length; i--;)
				this.push(data[i])
		else
			this.push(data)
	})
}

// Sets defaults on the chunk
nio.defaults = function (opts) {
	return stream.transform(function (chunk) {
		this.push(_.defaults(chunk, opts))
	})
}

// Logs output to the console.
nio.log = function (prefix) {
	return stream.passthrough(function (chunk) {
		prefix ?
			console.log(prefix, chunk) :
			console.log(chunk)
	})
}

// Combines multiple streams into one.
nio.join = function () {
	var river = new stream.PassThrough()
	var sources = [].slice.call(arguments)
	for (var i=sources.length; i--;)
		sources[i].pipe(river)
	return river
}

// Will only push a chunk if the function it's passed to returns true.
nio.filter = function (fn) {
	return stream.transform(function (chunk) {
		if (fn(chunk)) this.push(chunk)
	})
}

// Renames/calculates property values on the chunk
nio.map = function (map) {
	return stream.transform(function (chunk) {
		for (var name in map) {
			var value = map[name]
			if (_.isFunction(value))
				value = value(chunk)
			chunk[name] = value
		}
		this.push(chunk)
	})
}
