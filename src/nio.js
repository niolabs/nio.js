!function () {

	function json(host) {
		var pollRate = 30 * 1000
		var interval = null
		function fetch(path) {
			function poll() {
				d3.json(host + '/' + path, function (error, json) {
					fetch.trigger(path, json[path])
				})
			}
			poll()
			interval = setInterval(poll, pollRate)
			return this
		}
		fetch.host = function (value) {
			if (!arguments.length) return host
			host = value
			return this
		}
		fetch.stop = function () {
			clearInterval(interval)
			return this
		}
		fetch.pollRate = function (value) {
			if (!arguments.length) return pollRate
			pollRate = value
			return this
		}
		return _.assign(fetch, MicroEvent.prototype)
	}

	function socketio(host) {
		var ws = null
		var sock = null
		function fetch(type) {
			ws = io.connect(host, {'force new connection': true})
			sock = ws.socket
			sock.on('connect', function () {
				ws.emit('ready', type == 'posts' ? 'default' : path)
			})
			sock.on('connect_failed', function () {
				console.error('connection failed')
			})
			sock.on('error', function () {
				console.error('connection error')
			})
			ws.on('recvData', function (data) {
				fetch.trigger(type, JSON.parse(data))
			})
			return this
		}
		fetch.host = function (value) {
			if (!arguments.length) return host
			host = value
			return this
		}
		fetch.stop = function (value) {
			if (!ws) return
			ws.disconnect()
		}
		return _.assign(fetch, MicroEvent.prototype)
	}

	// mux is a multiplexer that aggregates signals sent from streams
	function mux() {
		var streams = []
		function fetch(type) {
			streams.forEach(function (stream) {
				stream.bind(type, function (data) {
					fetch.trigger(type, data)
				})
				stream(type)
			})
			return this
		}
		fetch.stream = function (stream) {
			streams.push(stream)
			return this
		}
		fetch.stop = function () {
			streams.forEach(function (stream) {
				stream.stop()
			})
			return this
		}
		return _.assign(fetch, MicroEvent.prototype)
	}

	// tiles visualizes posts as tiles.
	function tiles(selector) {
		var template = tmpl(htmlTemplates['tiles.html'])
		var el = d3.select(selector).selectAll('div')
		var stream = null
		var posts = []
		var filters = []

		function update(data) {
			if (_.isArray(data))
				data.forEach(function (post) {
					if (!_.contains(posts, post))
						posts.push(post)
				})
			else if (!_.contains(posts, post))
				posts.push(post)

			if (filters.length)
				posts = _.compose(filters[0])(posts)

			el = el.data(posts)

			el.enter().append('div')
				.style('opacity', 0)

			el
				.attr('class', function (p) {
					return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '')
				})
				.html(function (p) { return template(new Post(p)) })
				.transition()
				.duration(1000)
				.style('opacity', 1)

			el.exit().transition()
				.duration(750)
				.style('opacity', 0)
				.remove()
			return this
		}

		update.stream = function (value) {
			if (!arguments.length) return stream
			stream = value
			stream('posts')
			stream.bind('posts', function (data) {
				if (_.isArray(data))
					posts = data
				else if (!_.contains(posts, data))
					posts.push(data)
				update(posts)
			})
			return update
		}

		update.posts = function (value) {
			if (!arguments.length) return posts
			posts = value
			return this
		}

		update.filter = function (fn) {
			filters.push(fn)
			update(posts)
		}

		update.sort = function (prop, reverse) {
			update.filter(function (posts) {
				posts = _.sortBy(posts, prop)
				return reverse ? posts.reverse() : posts
			})
		}

		return update
	}

	function Post(opts) {
		_.assign(this, Post.defaults, opts)
	}

	Post.defaults = {
		profile_image_url: null,
		media_url: null
	}

	function linkify(str) {
		str = str.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1'>$1</a>")
		str = str.replace(/(^|\s)@(\w+)/g, "$1<a href=\"http://www.twitter.com/$2\">@$2</a>")
		return str.replace(/(^|\s)#(\w+)/g, "$1<a href=\"http://search.twitter.com/search?q=%23$2\">#$2</a>")
	}

	this.nio = {
		json: json,
		socketio: socketio,
		mux: mux,
		tiles: tiles
	}

}()
