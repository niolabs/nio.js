var _ = require('lodash')
var utils = require('../utils')
var Stream = require('../stream')
var streams = require('../streams')
var sources = require('../sources')
var Model = require('../model')

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
	seconds_ago: '',
	wide: false,
	expanded: false,
	avatar: false
}

/**
 * Choices for the model factory to choose from. Used for tests.
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
	if (params.types) {
		if (_.isString(params.types))
			params.types = params.types.split(',')
		if (!_.contains(params.types, post.type))
			return false
	}

	// They specified usernames and it didn't match
	if (params.names) {
		if (_.isString(params.names))
			params.names = params.names.split(',')
		if (!_.contains(params.names, post.name))
			return false
	}

	// They specified search keywords and they didnt match
	if (params.search && !post.text.match(new RegExp(params.search, 'ig')))
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
		var utc = utils.utc()
		var time = utils.utc(d.time)
		var ms = utc.getTime() - time.getTime()
		return ms / 1000
	}
}

function PostsStream(opts) {
	if (!(this instanceof PostsStream))
		return new PostsStream(opts)
	Stream.call(this)
	this.opts = opts

	var socketio = sources.socketio({
		host: opts.socketio,
		rooms: ['default']
	})

	var json = sources.json(opts.json)

	this.reset(false)

	var self = this

	// get the historical data
	this.pipe(
		json,
		streams.log(),
		streams.pass(function (chunk) {
			if (!chunk.total) this.broadcast('noresults')
		}),
		streams.get('posts'),
		streams.sort(this.sortFunc),
		streams.pass(function (chunk) {
			self.latest = _.first(chunk)
		}),
		streams.each(_.partialRight(streams.setProps, propmap)),
		streams.limit(9),
		this.out,
		streams.once(),
		streams.on('init', socketio.resume)
	)


	// listen for new posts
	this.pipe(
		socketio,
		streams.unique('id'),
		streams.set(propmap),
		streams.filter(this.sortCmpFunc),
		streams.filter(function (chunk) {
			var matched = isMatch(chunk, self.params)
			if (!matched) this.broadcast('new_filtered', chunk)
			return matched
		}),
		streams.on('pauseddata', function (chunk) {
			var matched = isMatch(chunk, self.params)
			if (matched) this.broadcast('new_filtered', chunk)
		}),
		this.out
	)

	if (!_.isEmpty(this.params))
		this.filter(this.params)

	json.resume()
}

utils.inherits(PostsStream, Stream)

PostsStream.prototype.onreset = function () {
	this.params = this.opts.params || {}
	this.latest = null
	this.sort()
	this.out = this.opts.out || streams.pass()
}

PostsStream.prototype.filter = function (params) {
	this.broadcast('filter', params)
}

PostsStream.prototype.sort = function (property, reverse) {
	if (!property)
		property = this.opts.sort || 'seconds_ago'
	this.sortFunc = streams.sortFunc(property)
	if (reverse)
		this.sortCmpFunc = function (d) {
			return this.sortFunc(d) > this.sortFunc(this.latest)
		}.bind(this)
	else
		this.sortCmpFunc = function (d) {
			return this.sortFunc(d) < this.sortFunc(this.latest)
		}.bind(this)
}

module.exports = PostsStream
module.exports.Post = Post
module.exports.post = Post
module.exports.isMatch = isMatch

var tiles = require('./tiles')
PostsStream.prototype.tiles = function (opts) {
	this.out.pipe(tiles(opts))
	return this
}
module.exports.tiles = tiles
