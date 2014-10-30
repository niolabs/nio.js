var _ = require('lodash')
var utils = require('../utils')
var Stream = require('../stream')
var streams = require('../streams')
var sources = require('../sources')
var Model = require('../model')
var tiles = require('./tiles')

/**
 * Post is a entry on Twitter, Instagram, Facebook, Google+, etc.
 *
 * @constructor
 * @extends {Model}
 * @param {object} opts
 */
function Post(opts) {
	if (!(this instanceof Post))
		return new Post(opts)
	Model.call(this, opts)
	this.typeDisplay = Post.TYPE_DISPLAYS[this.type] || this.type
}

utils.inherits(Post, Model)

Post.TYPE_DISPLAYS = {
	'twitter': 'Twitter',
	'twitter-photo': 'Twitter',
	'facebook': 'Facebook',
	'gplus': 'Google+',
	'linkedin': 'LinkedIn',
	'rss': 'RSS'
}

/**
 * Default properties for posts.
 */
Post.prototype.DEFAULTS = {
	type: '',
	author: '',
	authorLink: '',
	link: '',
	media: '',
	source: '',
	text: '',
	time: '',
	secondsAgo: '',
	wide: false,
	expanded: false,
	avatar: false
}

/**
 * Choices for the model factory to choose from
 */
Post.CHOICES = {
	author: ['John', 'Jane', 'Jill'],
	authorLink: [
		'http://www.twitter.com/john',
		'http://www.twitter.com/jane',
		'http://www.twitter.com/jill'
	],
	avatar: [
		null,
		'http://www.twitter.com/john.jpg',
		'http://www.twitter.com/jane.jpg',
		'http://www.twitter.com/jill.jpg'
	],
	media: [
		null,
		'http://www.twitter.com/media1.jpg',
		'http://www.twitter.com/media2.jpg',
		'http://www.twitter.com/media3.jpg'
	],
	type: [
		'facebook',
		'gplus',
		'instagram',
		'rss',
		'twitter',
		'twitter-photo'
	]
}

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

function PostsStream(opts) {
	if (!(this instanceof PostsStream))
		return new PostsStream(opts)
	Stream.call(this)

	var socketio = sources.socketio({
		host: opts.socketio,
		rooms: ['default']
	})

	//var sortFunc = streams.sortFunc('seconds_ago')
	var sortFunc = streams.sortFunc('priority')

	this.out = opts.out || streams.pass()

	this.pipe(
		sources.json(opts.json),
		streams.log(),
		streams.get('posts'),
		streams.sort(sortFunc),
		streams.each(_.partialRight(streams.setProps, propmap)),
		streams.limit(9),
		this.out,
		streams.once(),
		streams.on('init', socketio.resume())
	)

	this.pipe(
		socketio,
		streams.unique('id'),
		streams.set(propmap),
		streams.filter(function (d) {
			// check if newer
			return sortFunc(d) < sortFunc(this.latest)
		}.bind(this)),
		streams.log(),
		streams.filter(function (chunk) {
			var filtered = isMatch(chunk, this.params)
			if (filtered) this.broadcast('new_filtered', chunk)
			return filtered
		}.bind(this)),
		streams.on('new_filtered', function (chunk) {
			console.log('new filtered post', chunk)
		}),
		this.out
	)

}

utils.inherits(PostsStream, Stream)

PostsStream.prototype.onreset = function () {
	this.latest = null
}

PostsStream.prototype.filter = function (params) {
	this.pause()
	this.reset()
	this.broadcast('filter', params)
	this.resume()
}

PostsStream.prototype.tiles = function (opts) {
	this.out.pipe(tiles(opts))
	return this
}

module.exports = PostsStream
module.exports.tiles = tiles
module.exports.Post = Post
module.exports.post = Post
