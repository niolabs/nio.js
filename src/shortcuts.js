'use strict';

var _ = require('lodash')
var util = require('util')
var core = require('./core')
var sources = require('./sources')
var tiles = require('./tiles')
var streams = require('./streams')

// tests if a post matches params
function isMatch(post, params) {
	// They specified types and it didnt match
	if (params.types && !_.contains(params.types, post.type))
		return false

	// They specified search keywords and they didnt match
	if (params.search && !post.text.match(new RegExp(params.search, 'ig')))
		return false

	// They specified usernames and it didn't match
	if (params.names && !_.contains(params.names, post.name))
		return false

	return true
}

var propmap = {
	author: function (d) { return d.name },
	authorLink: '#',
	avatar: function (d) { return d.profile_image_url },
	media: function (d) { return d.media_url },
	time: function (d) { return new Date(d.time) },
	seconds_ago: function (d) {
		if (d.seconds_ago) return d.seconds_ago
		var now = new Date()
		var ms = now.getTime() - d.time.getTime()
		return ms / 1000
	}
}

function TilesShortcut(opts) {
	if (!(this instanceof TilesShortcut))
		return new TilesShortcut(opts)
	core.Stream.call(this)
	if (_.isString(opts))
		opts = {el: opts}
	this.json = sources.json('http://54.85.159.254/posts')
	this.socketio = sources.socketio({
		host: 'http://54.85.159.254:443',
		rooms: ['default']
	})

	this.tilesDisplay = tiles(opts)
	this.tilesDisplay
		.pipe(streams.pass(function (chunk) {
			if (_.isArray(chunk))
				this.latest = chunk[0]
			else
				this.latest = chunk
		}.bind(this)))

	var sortFunc = streams.sortFunc('seconds_ago')

	//this
	this
		.pipe(this.json)
		.pipe(streams.log())
		.pipe(streams.pick('posts'))
		.pipe(streams.sort(sortFunc))
		.pipe(streams.each(_.partialRight(streams.setProps, propmap)))
		.pipe(streams.limit(9))
		.pipe(this.tilesDisplay)
		.on('init', function () {
			console.log('init')
			this.socketio.start('default')
		}.bind(this))

	this
		.pipe(this.socketio)
		.pipe(streams.unique('id'))
		.pipe(streams.props(propmap))
		// check if newer
		.pipe(streams.filter(function (d) {
			return sortFunc(d) < sortFunc(this.latest)
		}))
		.pipe(streams.pass(function (chunk) {
			this.propogate('new post', chunk)
		}))
		.pipe(streams.filter(function (d) {
			if (this.isPaused) return false
			return isMatch(d, this.params)
		}.bind(this)))
		.pipe(streams.on('new post', function (chunk) {
			console.log('new post', chunk)
		}))
		.pipe(this.tilesDisplay)
}

util.inherits(TilesShortcut, core.Stream)

TilesShortcut.prototype._flush = function () {
	this.isPaused = false
	this.latest = null
}

TilesShortcut.prototype.filter = function (params) {
	this.controller.flush()
	if (params && _.keys(params).length)
		this.json.start(params)
	else
		this.json.start()
}

exports.tiles = TilesShortcut
