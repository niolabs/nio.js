var _ = require('lodash')
var utils = require('./utils')

/**
 * Model reperesents an object that could theoretically be persisted to a DB.
 *
 * @constructor
 * @param {object} opts properties to set on the model.
 */
function Model(opts) {
	if (!(this instanceof Model))
		return new Model(opts)
	if (this.DEFAULTS)
		_.defaults(opts, this.DEFAULTS)
	_.assign(this, opts)
}

/**
 * generate creates a mock object based on a classes CHOICES definition.
 * Useful for testing/debugging.
 *
 * @param {function} Cls
 * @param {object} opts
 * @return {Model}
 */
exports.generate = function (Cls, opts) {
	if (!Cls.CHOICES)
		console.warn('generate() called on a model without CHOICES')
	_.each(Cls.CHOICES, function (key, values) {
		if (key in opts) return
		opts[key] = exports.choose(values)
	})
	return new (Cls)(opts)
}

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
	this.typeDisplay = Post.TYPE_DISPLAYS[opts.type] || opts.type
}

utils.inherit(Post, Model)

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
Post.DEFAULTS = {
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

module.exports = {
	Model: Model,
	model: Model,
	Post: Post,
	post: Post
}
