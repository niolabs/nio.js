'use strict';

var core = require('./core')
var tiles = require('./tiles')
var streams = require('./streams')

exports.tiles = function (selector) {
	// TODO: make this more customizable
	var json = core.json('http://54.85.159.254')
		// start polling the /posts URL
		.start('posts')

	// connect to a socketio server
	var socketio = core.socketio('http://54.85.159.254:443')
		// join the "default" room
		.start('default')

	var collect = streams.collect({
		sort: 'time',
		dupes: 'id',
		min: 9,
		max: 9
	})

	var throttle = streams.throttle(1000)

	// a permissive filter by default
	var filter = nio.filter(function (d) { return true })

	// combine the streams
	var stream = streams.join(
			// pick out the "posts" attribute of the returned JSON
			json.pipe(streams.pick('posts')),
			socketio
		)
		.pipe(streams.props({
			avatar: function (d) { return d.profile_image_url },
			media: function (d) { return d.media_url },
			author: function (d) { return d.name },
			authorLink: '#'
		}))
		// instead of passing each object 1 by 1, put them in an array so we can sort them
		.pipe(collect)
		// only update tiles once every second
		.pipe(throttle)
		.pipe(filter)
		// send them to the tiles
		.pipe(tiles(selector))

	stream.filter = function (params) {
		collect.clear()
		stream.clear()
		if (params) {
			json.start('posts', params)
			socketio.pause()
		} else {
			json.start('posts')
			socketio.start('default')
		}
		// TODO: filter the socket.io posts
		//filter = nio.filter(function (d) { })
	}

	return stream
}
