'use strict';

var _ = require('lodash')
var core = require('./core')
var tiles = require('./tiles')
var streams = require('./streams')

exports.tiles = function (opts) {
	var json = core.json('http://54.85.159.254')
	var socketio = core.socketio('http://54.85.159.254:443')

	var max = opts.max
	if (!max && opts.columns && opts.rows)
		max = opts.columns * opts.rows

	var collect = streams.collect(_.defaults(opts, {
		sort: 'time',
		sortDesc: true,
		min: 0,
		max: max || 9
	}))

	// a permissive filter by default
	var filter = streams.filter(function () { return true })

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
		.pipe(streams.unique('id'))
		// instead of passing each object 1 by 1, put them in an array so we can sort them
		.pipe(collect)
		// only update tiles once every second
		.pipe(streams.throttle(1000))
		.pipe(streams.wait({
			fn: function (chunk) { return chunk.length === 9 },
			timeout: 2000
		}))
		.pipe(filter)
		// send them to the tiles
		.pipe(tiles(opts))

	stream.isStopped = false

	stream.start = function () {
		if (!stream.isStopped) return
		stream.isStopped = false
		filter = streams.filter(function () { return true })
		json.start()
		socketio.start()
	}

	stream.stop = function () {
		if (stream.isStopped) return
		stream.isStopped = true
		filter = streams.filter(function () { return false })
		json.stop()
		socketio.stop()
	}

	stream.filter = function (params) {
		collect.clear()
		stream.clear()
		if (params && _.keys(params).length) {
			json.start('posts', params)
			if (socketio.ws && socketio.ws.socket.connected) {
				socketio.stop()
			}
		} else {
			// reset
			json.start('posts', {})
			socketio.start('default')
		}
		// TODO: filter the socket.io posts instead of pausing
		//filter = nio.filter(function (d) { })
	}

	stream.filter(opts.params)

	return stream
}
