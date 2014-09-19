var htmlTemplates = htmlTemplates || {};htmlTemplates['tiles.html'] = '<header class=tile-header>\n' +
    '	<a class=tile-author>\n' +
    '		<% if (profile_image_url) { %>\n' +
    '			<img class=tile-author-avatar src="<%=profile_image_url%>" alt="<%=name%>\'s avatar">\n' +
    '		<% } %>\n' +
    '		<strong class=tile-author-name><%=name%></strong>\n' +
    '	</a>\n' +
    '	<span class=tile-actions>\n' +
    '		<span class="icon icon-<%=type%>"></span>\n' +
    '	</span>\n' +
    '</header>\n' +
    '<div class=tile-content>\n' +
    '	<% if (media_url) { %>\n' +
    '		<img class=tile-media src="<%=media_url%>" alt="<%=text%>" title="<%=text%>">\n' +
    '	<% } else { %>\n' +
    '		<%=text%>\n' +
    '	<% } %>\n' +
    '</div>\n' +
    '<footer class=tile-footer>\n' +
    '	<p class="tile-share float-left">\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-twitter"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-facebook"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-pinterest"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-envelope"></span>\n' +
    '		</a>\n' +
    '	<p class=float-right>\n' +
    '		<time is=relative-time datetime="<%=time%>">\n' +
    '			<%=time%>\n' +
    '		</time>\n' +
    '		<!--<a target=_blank href="<%=link%>">view post</a>-->\n' +
    '</footer>\n' +
    '';

/**
 * MicroEvent - to make any js object an event emitter (server or browser)
 *
 * - pure javascript - server compatible, browser compatible
 * - dont rely on the browser doms
 * - super simple - you get it immediatly, no mistery, no magic involved
 *
 * - create a MicroEventDebug with goodies to debug
 *   - make it safer to use
*/

var MicroEvent	= function(){};
MicroEvent.prototype	= {
	bind	: function(event, fct){
		this._events = this._events || {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
	},
	unbind	: function(event, fct){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	},
	trigger	: function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	}
};

/**
 * mixin will delegate all MicroEvent.js function in the destination object
 *
 * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
 *
 * @param {Object} the object which will support MicroEvent
*/
MicroEvent.mixin	= function(destObject){
	var props	= ['bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		if( typeof destObject === 'function' ){
			destObject.prototype[props[i]]	= MicroEvent.prototype[props[i]];
		}else{
			destObject[props[i]] = MicroEvent.prototype[props[i]];
		}
	}
}

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= MicroEvent;
}

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

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
