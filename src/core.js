var nio = nio || {}

// base functions for an event emitter
nio._emitter = {
	on: function (event, fn) {
		this._events = this._events || {}
		this._events[event] = this._events[event] || []
		this._events[event].push(fn)
	},
	off: function (event, fn) {
		this._events = this._events || {}
		if (event in this._events === false) return
		this._events[event].splice(this._events[event].indexOf(fn), 1)
	},
	emit: function (event) {
		this._events = this._events || {}
		if (event in this._events === false) return
		var args = Array.prototype.slice.call(arguments, 1)
		for (var i=0, l=this._events[event].length; i < l; i++)
			this._events[event][i].apply(this, args)
	}
}

nio._mustImplement = function () {
	this.emit('error', new Error('not implemented'))
}

// base functions for a streamer
nio._streamer = _.assign({}, nio._emitter, {
	write: nio._mustImplement,
	push: function (chunk) { if (chunk) this.emit('data', chunk) },
	pipe: function (dest) {
		this.on('data', dest.write.bind(dest))
		return dest
	}
})

function makeTransform(fn) {
	return _.assign(function () {}, nio._streamer, {write: fn})
}

// base functions for a source
nio._source = _.assign({}, nio._streamer, {
	pause: nio._mustImplement,
	resume: nio._mustImplement
})

// sources emit new data
nio.src = {}

// a json source polls an http resource at regular intervals
nio.src.json = function(host, pollRate) {
	var interval = null,
		lastPath = null
	pollRate = pollRate || 20 * 1000

	function source(path) {
		source.fetch(path)
		interval = setInterval(function() {
			return source.fetch(path)
		}, pollRate)
		return source
	}

	return _.assign(source, nio._source, {
		fetch: function (path) {
			lastPath = path
			d3.json(host + '/' + path, function(error, json) {
				var data = json[path]
				if (data && _.isArray(data))
					for (var i = data.length; i--;)
						source.push(data[i])
					else
						source.push(data)
			})
		},
		pause: function() { clearTimeout(interval) },
		resume: function() { source.start(lastPath) }
	})
}

// a socketio source emits data from websockets
nio.src.socketio = function(host) {
	var ws = null

	function source(path) {
		ws = io.connect(host)
		path = path === 'posts' ? 'default' : path

		var sock = ws.socket
		sock.on('connect', function() {
			return ws.emit('ready', path)
		})
		sock.on('connect_failed', function() {
			return console.error('connection failed')
		})
		sock.on('error', function() {
			return console.error('connection error')
		})
		source.resume()
		return source
	}

	return _.assign(source, nio._source, {
		pause: function() {
			ws.on('recvData', function(data) {
				return null
			})
		},
		resume: function() {
			ws.on('recvData', function(data) {
				return source.push(JSON.parse(data))
			})
		}
	})
}

// a mux allows combining multiple sources into one
nio.src.mux = function() {
	var sources = [].slice.call(arguments)

	function source(path) {
		sources.forEach(function (src) {
			return src(path)
		})
		return source
	}

	return _.assign(source, nio._source, {
		pause: function () {
			sources.forEach(function (src) {
				return src.pause()
			})
		},
		resume: function () {
			sources.forEach(function(src) {
				return src.resume()
			})
		}
	})
}

// a test source emits preset messages at regular intervals
nio.src.test = function (msg, rate) {
	var interval = null
	var source = _.assign({}, nio._source, {
		pause: function () { clearInterval(interval) },
		resume: function () {
			interval = setInterval(function () {
				source.push(_.isFunction(msg) ? msg() : msg)
			}, rate || 1000)
		}
	})
	source.resume()
	return source
}

// collect puts everything it receives into an array and makes it filterable
nio.collect = function () {
	var transforms = [],
		filters = [],
		data = [],
		dupeFn = null

	return _.assign({}, nio._streamer, {
		write: function (chunk) {
			var id = dupeFn ? dupeFn(chunk) : null
			if (dupeFn && _.any(data, function (d) { return id === dupeFn(d) }))
				return
			data.push(chunk)
			transforms.forEach(function (t) { data = t(data) })
			this.push(data)
		},
		transform: function (fn) {
			transforms.push(fn)
			return this
		},
		sort: function (fn, reverse) {
			return this.transform(function (data) {
				var sorted = _.sortBy(data, fn)
				return reverse ? sorted.reverse() : sorted
			})
		},
		dupes: function (fn) {
			if (!fn) fn = function (d) { return d }
			dupeFn = fn
			data = _.unique(data, fn)
			return this
		}
	})
}

nio.transform = function (fn) {
	return makeTransform(function (chunk) {
		this.push(fn(chunk))
	})
}

nio.defaults = function (opts) {
	return nio.transform(function (chunk) {
		return _.defaults(chunk, opts)
	})
}

// log outputs everything it gets to the console
nio.log = function () {
	return makeTransform(function (chunk) {
		console.log(chunk)
		this.push(chunk)
	})
}

nio.filter = function (fn) {
	return nio.transform(function (chunk) {
		return fn(chunk) ? chunk : null
	})
}

nio.utils = {}

// turns urls and twitter handles/hashtags into links
nio.utils.linkify = function (text) {
    text = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a target=_blank href='$1'>$1</a>")
    text = text.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>")
    return text.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>")
}

nio.utils.truncate = function (text, len) {
    if (text.length > len) return text.substring(0, len - 3) + '...'
    return text
}

window.nio = nio

require('./tiles/tiles')
require('./graphs/graphs')
