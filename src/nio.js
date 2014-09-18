!function () {

	function observe(obj, prop, cb) {
		function observeProp() {
			Object.observe(obj[prop], function (changes) {
				changes.forEach(function (change) {
					cb(change.object)
				})
			})
		}

		observeProp()

		Object.observe(obj, function (changes) {
			changes.forEach(function(change) {
				console.log(change)
				if (change.name === prop) {
					observeProp()
					cb(change.object[prop])
				}
			})
		})
	}

	function tiles(selector) {
		var template = tmpl(htmlTemplates['views-tiles.html'])
		var el = d3.select(selector).selectAll('div')
		var source = null

		function visual(posts) {
			//console.log('got posts', posts)
			el = el.data(posts)
			el.enter().append('div')
				.style('opacity', 0)
			el
				.attr('class', function (p) {
					return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '')
				})
				.html(function (p) { return template(normalizePost(p)) })
				.transition()
				.duration(1000)
				.style('opacity', 1)
			el.exit().remove()
			return this
		}

		visual.source = function (value) {
			if (!arguments.length) return source
			source = value
			observe(source, 'posts', visual)
			return visual
		}

		return visual
	}

	// Returns an HTTP source
	function json(host) {
		this.posts = []
		d3.json(host + '/posts', function (error, json) {
			this.posts = json.posts
		}.bind(this))
		console.log(this)
		return this
	}

	function socketio(host) {
		this.posts = []
		var posts = []
		var ws = io.connect(host, {'force new connection': true})
		var sock = ws.socket
		sock.on('connect', function () {
			ws.emit('ready', 'default')
			console.log('ready')
		})
		sock.on('connect_failed', function () {
			console.error('connection failed')
		})
		sock.on('error', function () {
			console.error('connection error')
		})
		ws.on('recvData', function (data) {
			var post = JSON.parse(data)
			if (posts.length < 20 || post.flag == 'new')
				posts.push(post)
		}.bind(this))
		// periodically update the posts
		setInterval(function () {
			if (this.posts != posts)
				this.posts = posts
		}.bind(this), 500)
		return this
	}

	function normalizePost(post) {
		post.profile_image_url = post.profile_image_url || null;
		post.media_url = post.media_url || null;
		return post
	}

	this.nio = {
		json: json,
		tiles: tiles,
		socketio: socketio,
	}

}()
