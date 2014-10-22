'use strict';

var core = require('./core')
var tiles = require('./tiles')
var streams = require('./streams')

exports.tiles = function (selector) {
	var json = core.json('http://54.85.159.254')
		// start polling the /posts URL
		.start('posts')
		// pick out the "posts" attribute of the returned JSON
		.pipe(streams.pick('posts'))

	// connect to a socketio server
	var socketio = core.socketio('http://54.85.159.254:443')
		// join the "default" room
		.start('default')

	// combine the streams
	streams.join(json, socketio)
		// instead of passing each object 1 by 1, put them in an array so we can sort them
		.pipe(streams.collect({
			sort: 'time',
			dupes: 'id',
			min: 9,
			max: 9
		}))
		// only update tiles once every second
		.pipe(streams.throttle(1000))
		// send them to the tiles
		.pipe(tiles(selector))
}
