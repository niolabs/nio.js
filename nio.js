var htmlTemplates = htmlTemplates || {};htmlTemplates['_tile-footer.html'] = '<div class="tile-footer">\n' +
    '	<ul class="tile-share">\n' +
    '		<li class="twitter">\n' +
    '			<a href="https://twitter.com/intent/tweet?url={{urlEscape link}}&amp;text={{urlEscape text}} - via @gobuffsio" title="Share on Twitter" target="_blank">\n' +
    '				Share on Twitter\n' +
    '			</a>\n' +
    '		<li class="facebook">\n' +
    '			<a href="http://www.facebook.com/sharer/sharer.php?s=100&amp;p[url]={{urlEscape link}}&amp;p[images][0]={{HERE}}&amp;p[title]={{HERE}}" title="Share on Facebook" target="_blank">\n' +
    '				Share on Facebook\n' +
    '			</a>\n' +
    '		<li class="pinterest">\n' +
    '			<a href="https://www.pinterest.com/pin/create/button/?url={{urlEscape link}}&amp;media={{HERE}}&amp;description={{text}}" title="Pin It" target="_blank">\n' +
    '				Pin It\n' +
    '			</a>\n' +
    '		<li class="email">\n' +
    '			<a href="mailto:?subject=Check out this post from gobuffs.io&amp;body={{text}} -- {{urlEscape link}} -- via http://gobuffs.io" title="Email It" target="_blank">\n' +
    '				Share via Email\n' +
    '			</a>\n' +
    '	</ul>\n' +
    '	<a href="{{link}}" title="View Post" target="_blank" class="post-link original-post">\n' +
    '		view post\n' +
    '	</a>\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['blank.html'] = '<div class="tile-content"></div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['facebook.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['gplus.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{alt_text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['instagram.html'] = '<div class="tile-content">\n' +
    '	<img src="{{media_url}}" alt="{{text}}" onError="this.onerror=null;this.parentNode.removeChild(this);" />\n' +
    '	{{#if text}}\n' +
    '	{{text}}\n' +
    '	{{/if}}\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="image-content">\n' +
    '		<div class="full-image" style="background-image: url(\'{{media_url}}\')"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['linkedin.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['rss.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		<span class="headline">{{{linkUrl text}}}</span>\n' +
    '		<br/><br/>\n' +
    '		{{{linkUrl alt_text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['share_flip.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="tile-content">\n' +
    '		<ul class="tile-share clearfix">\n' +
    '\n' +
    '			<li class="twitter">\n' +
    '				<a href="https://twitter.com/intent/tweet?url={{urlEscape link}}&amp;text={{text}}" title="Share on Twitter" target="_blank">\n' +
    '					Share on Twitter</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="facebook">\n' +
    '				<a href="http://www.facebook.com/sharer/sharer.php?s=100&amp;p[url]={{urlEscape link}}&amp;p[images][0]={{HERE}}&amp;p[title]={{HERE}}" title="Share on Facebook" target="_blank">\n' +
    '					Share on Facebook</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="gplus">\n' +
    '				<a href="https://plus.google.com/share?url={{urlEscape link}}" title="Share on Google Plus" target="_blank">\n' +
    '					Share on Google Plus</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="pinterest">\n' +
    '				<a href="https://www.pinterest.com/pin/create/button/?url={{urlEscape link}}&amp;media={{HERE}}&amp;description={{text}}" title="Pin It" target="_blank">\n' +
    '					Pin It</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="linkedin">\n' +
    '				<a href="https://www.linkedin.com/shareArticle?summary={{text}}&amp;url={{urlEscape link}}&amp;title={{HERE}}&amp;mini=true&amp;source=" title="Share on LinkedIn" target="_blank">\n' +
    '					Share on LinkedIn</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="pocket">\n' +
    '				<a href="https://getpocket.com/save?url={{urlEscape link}}" data-lang="en" data-save-url="{{link}}"  title="Save to Pocket" target="_blank">\n' +
    '					Save to Pocket</a>\n' +
    '			</li>\n' +
    '\n' +
    '		</ul>\n' +
    '	</div>\n' +
    '	<!-- /.tile-content -->\n' +
    '\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">\n' +
    '			Share This</div>\n' +
    '		<div class="close"><a href="#" title="Close">Close</a></div>\n' +
    '	</div><!-- /.tile-info -->\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['sponsored.html'] = '<div class="sponsored-flag"><p>Sponsored</p></div>\n' +
    '<div class="tile-content"><a href="#" title="{{name}}" ><img src="{{media_url}}" alt="{{text}}" /></a></div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['stat-count.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="pinned"><p>Pinned</p></div>\n' +
    '	<div class="tile-content">\n' +
    '		<div class="number">{{roundNumber (numberLocale count) 0}}</div>\n' +
    '	</div>\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">{{maxLength name 25}}</div>\n' +
    '	</div>\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['stat-percent.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="pinned"><p>Pinned</p></div>\n' +
    '	<div class="tile-content">\n' +
    '		<div class="percentage">{{roundNumber percent 0}}<sup>%</sup></div>\n' +
    '	</div>\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">{{maxLength name 25}}</div>\n' +
    '	</div>\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['stat-time.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="pinned"><p>Pinned</p></div>\n' +
    '	<div class="tile-content">\n' +
    '		<div class="time-stamp">{{dateFormat time \'h\'}}:{{dateFormat time \'mm\'}}<span class="ampm">{{dateFormat time \'A\'}}</span></div>\n' +
    '		<div class="duration-passed">( {{timeDiff seconds_ago}} )</div>\n' +
    '	</div>\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">{{maxLength name 25}}</div>\n' +
    '	</div>\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['twitter-photo.html'] = '<div class="tile-content">\n' +
    '	<img src="{{media_url}}" alt="{{text}}" onError="this.onerror=null;this.parentNode.removeChild(this);" />\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="image-content">\n' +
    '		<div class="full-image" style="background-image: url(\'{{media_url}}\')"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['twitter.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['youtube.html'] = '<div class="tile-content">\n' +
    '\n' +
    '	<div class="video-cover-image" style="background-image: url(\'http://img.youtube.com/vi/{{id}}/mqdefault.jpg\');">\n' +
    '		<div class="play-button"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '		<div class="close-tile"><p>Close</p></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="youtube-player" id="{{id}}"></div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.$ = jQuery
window.compiledTemplates = {}

_.forEach([
	'blank',
	'facebook',
	'gplus',
	'instagram',
	'linkedin',
	'rss',
	'share_flip',
	'sponsored',
	'stat-count',
	'stat-percent',
	'stat-time',
	'twitter',
	'twitter-photo',
	'youtube'
], function (name) {
	var template = htmlTemplates[name + '.html']
	compiledTemplates[name] = Handlebars.compile(template)
})

Handlebars.registerPartial('tile-footer', htmlTemplates['_tile-footer.html'])

Handlebars.registerHelper('urlEscape', function(obj, options) {
	return encodeURIComponent(obj)
})

Handlebars.registerHelper('numberLocale', function(obj, options) {
	var num = parseFloat(obj)
	if(isNaN(num) || !isFinite(num)) {
		return obj
	} else {
		return num.toLocaleString()
	}
})

Handlebars.registerHelper('stripSlashes', function(obj) {
	return obj.replace(/\\/g, '')
})

Handlebars.registerHelper('linkUrl', function(obj) {
	obj = obj.replace(/^\s*/, '')
	obj = obj.replace(/\n/g, '<br>\n')
	return obj.replace(/(http\S+)/gi, '<a href="$1" target="_blank">$1</a>')
})

// USAGE: {{#ifCond v1 '==' v2}} something to do {{/ifCond}}
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
	switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this)
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this)
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this)
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this)
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this)
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this)
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this)
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this)
		default:
			return options.inverse(this)
	}
})

// USAGE: {{strReplace 'TEST STRING' 'TEST' 'BETTER'}} --> 'BETTER STRING'
Handlebars.registerHelper('strReplace', function (str, search, replace) {
	return str.replace(search, replace)
})


// USAGE: {{dateFormat '2014-05-28 17:20:38.544346' 'HH'}}
Handlebars.registerHelper('dateFormat', function(dateString, dateFormat) {
	dateString = dateString.replace('T',' ')
	dateString = dateString.replace('Z','')
	var d = moment(dateString + ' +0000', 'YYYY-MM-DD HH:mm:ss.SSS Z')
	if (!(d && d.isValid())) {
		// cant parse
		return dateString
	}

	// for formatting options, see http://momentjs.com/docs/#/displaying/format/
	return d.format(dateFormat)
})

// USAGE: {{timeDiff number_of_seconds}} -> 3 min ago
Handlebars.registerHelper('timeDiff', function(num_seconds) {
	function numberEnding (number) {
		// return (number > 1) ? 's ago' : ' ago'
		return ' ago'
	}
	if (num_seconds <= 0) {
		return 'just now!'
	}
	var years = Math.floor(num_seconds / 31536000)
	if (years) {
		return years + 'y' + numberEnding(years)
	}
	var days = Math.floor((num_seconds %= 31536000) / 86400)
	if (days) {
		return days + 'd' + numberEnding(days)
	}
	var hours = Math.floor((num_seconds %= 86400) / 3600)
	if (hours) {
		return hours + 'h' + numberEnding(hours)
	}
	var minutes = Math.floor((num_seconds %= 3600) / 60)
	if (minutes) {
		return minutes + 'm' + numberEnding(minutes)
	}
	// var seconds = num_seconds % 60
	// if (seconds && seconds > 30) {
	if (num_seconds < 60) {
		// return seconds + 's' + numberEnding(seconds)
		return num_seconds + 's' + numberEnding(num_seconds)
	}
	return 'just now!' //'just now' //or other string you like
})

// USAGE: {{roundNumber number places}}
Handlebars.registerHelper('roundNumber', function(number, places) {
	return parseFloat(number).toFixed(places)
})

// USAGE: {{maxLength text len}}
Handlebars.registerHelper('maxLength', function(text, len) {
	if (text.length > len) {
		return text.substring(0, len - 3) + "..."
	}
	return text
})

function makeTile(tileType, rows, cols, data) {
	/***
	 * This function creates the HTML for a tile based on its type and data
	 */
	if (!(tileType in compiledTemplates)) {
		// TODO: need an IE-safe console.log
		// console.error("No template built for tile type " + tileType)
		return
	}

	return jQuery("<div/>")
		.addClass("tile-container")
		.addClass(tileType)
		.data('tileData', data)
		.html(compiledTemplates[tileType](data))
}

},{}],2:[function(require,module,exports){
(function(){

	var nio = window.nio = {
		views: {},
		models: {},
		collections: {}
	}

	require('./content.js')
	require('./utils.js')
	require('./models/Post.js')
	require('./models/Tile.js')
	require('./views/Tile.js')
	require('./views/LookBack.js')
	require('./views/Stream.js')
	require('./views/RandomStream.js')
	require('./views/SearchStream.js')

	nio.tiles = function (opts) {
		return new nio.views.SearchStream(opts)
	}

}())

},{"./content.js":1,"./models/Post.js":3,"./models/Tile.js":4,"./utils.js":5,"./views/LookBack.js":6,"./views/RandomStream.js":7,"./views/SearchStream.js":8,"./views/Stream.js":9,"./views/Tile.js":10}],3:[function(require,module,exports){
nio.models.Post = Backbone.Model.extend({

	initialize: function(args) {
		args = args || {}

		if (args.id) {
			if (args.profile_image_url) {
				// check the img load
				// this.testImage(args.profile_image_url)
			} else {
				// console.log('type: ', args.type)
				switch (args.type) {
					case 'twitter-photo':
					case 'instagram':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-instagram.png')
					break
					case 'facebook':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-facebook.png')
					break
					case 'twitter':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-twitter.png')
					break
					// default:
						// this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default.png')
				}
			}
		}

		var shortenedText = nio.utils.truncate(this.get('text'), 145)
		this.set('shortenedText', shortenedText)
	},

	defaults: {
		id                : 0,
		id_value          : 1,
		time              : 0,
		priority          : 1,
		type              : 'blank',
		name              : '',
		link              : '',
		text              : '',
		alt_text          : '',
		media_url         : '',
		profile_image_url : '',
		flag              : 'old',
		status_flag       : '',
		seconds_ago       : 360000
	},

	testImage: function(url) {
		var self = this
		var img = new Image()
		img.onload = function() {
			self.set('profile_image_url', url)
		}
		img.onerror = function() {
			switch (self.get('type')) {
				case 'twitter-photo':
				case 'instagram':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-instagram.png')
				break
				case 'facebook':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-facebook.png')
				break
				case 'twitter':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-twitter.png')
				break
				default:
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default.png')
			}
		}
		img.src = url
	}

})

nio.collections.Posts = Backbone.Collection.extend({

	model: nio.models.Post,

})

nio.models.PostDictionary = Backbone.Model.extend({

	initialize: function(serviceHost) {
		this.posts = new nio.collections.Posts()
		this.serviceHost = serviceHost
	},

	url: function() {
		return 'http://' + this.serviceHost + '/posts'
	},

	defaults: {
		count: 0,
		offset: 0,
		next_offset: 0,
		total: 0,
		posts: new nio.collections.Posts()
	}

})


},{}],4:[function(require,module,exports){
nio.models.Tile = Backbone.Model.extend({

	defaults: {
		time           : 0,
		rows           : 1,
		cols           : 1,
		minPriority    : 1,
		maxPriority    : 5,

		// Minimum duration when being replaced by an old tile
		minOldDuration: 10,

		// Minimum duration when being replaced by a new tile
		minNewDuration: 2,

		maxDuration: 30,

		availableTypes : [],
		excludedTypes  : [],
		content        : null
	},

})

nio.collections.Tiles = Backbone.Collection.extend({

	model: nio.models.Tile

})

},{}],5:[function(require,module,exports){
var $ = jQuery

window.nio.utils = {

	truncate: function (str, len) {
		var txt = str.substr(0, len)
		if (txt !== str)
			txt = txt.trim + '&hellip (more)'
		return txt
	},

	getCurrentTime: function() {
		if (Date.now) {
			return Math.round(Date.now() / 1000)
		}
		return Math.round(new Date().getTime() / 1000)
	},

	connectToWebSocket: function(host, room) {
		var namespace = null
		var socket = null

		try {
			// TODO: Settle on a good IE-safe console.log and console.error.  Uncomment these when done.
			// console.log('connecting...')

			var room = room || 'default'

			namespace = io.connect('http://' + host, {'force new connection': true})
			socket = namespace.socket
			socket.on('connect', function(data) {
				// console.log("connected to room " + room)
				namespace.emit('ready', room)
			})
			socket.on('connect_failed', function(data) {
				// console.log('connection failed')
			})
			socket.on('error', function(data) {
				// console.log('connection error')
			})

		} catch(e) {
			// console.error("Unable to connect to stream")
			// console.error(e)
		}

		return namespace
	},

	/**
	* This will generate the HTML for a tile with a default 'blank' content.
	* It will also create the tile model, add the tile to the calling object's
	* array of tiles, and display it on the page.
	*/
	generateTile: function(ctx, tileArgs, contentArgs) {

		var contentModel = ctx.contentModel || nio.models.Post,
			tileContent = new contentModel(contentArgs)

		tileContent.set('seconds_ago', moment().diff(tileContent.get('time')), 'seconds')

		tileArgs = tileArgs || {}

		$.extend(tileArgs, {content : tileContent})

		return new nio.views.Tile({
			model: new nio.models.Tile(tileArgs)
		})

	},

	/***
	* Check that myPriority meets the priority spec.
	* maxPriority is true if the prioritySpec represents the "max priority"
	*/
	checkPriority: function(prioritySpec, myPriority, maxPriority) {
		if (maxPriority) {
			return myPriority <= prioritySpec || prioritySpec <= 0
		} else {
			return myPriority >= prioritySpec
		}
	},

	/***
		* Returns whether or not type is contained in the types list
		* Specify return_on_empty with what to return if the list is empty
		*/
	typesContains: function(types, type, return_on_empty) {
		if (types.length == 0) {
			return return_on_empty == true
		}
		return jQuery.inArray(type, types) >= 0
	},

	/***
		* Return an array tuple of the minDuration and maxDuration for the given tile
		*
		* A flag (old, new, vip) can also be passed to adjust the minimums
		*/

	getTileDurations: function(tile, flag) {
		var theMin = 0,
			theMax = tile.get('maxDuration')

		if (flag == 'new') {
			theMin = tile.get('minNewDuration')
		} else if (flag == 'vip') {
			theMin = 0
		} else {
			theMin = tile.get('minOldDuration')
		}

		return [theMin, theMax]
	},

	findAvailableTile: function(tiles, content) {

		var availableTiles = [],
			currentScore = {
				afterMax: -1, //number of seconds after the max
				minMaxPct: 0.0 //percent of the way into the range
			}

		// console.log("Finding an available tile for " + type + " - " + priority)
		for (var i=0; i<tiles.length; i++) {
			var tile = tiles[i],
				tileModel = tile.model,
				tileDiv = tile.$el

			var tileLocked = (tileDiv.hasClass("locked-click") ||
								tileDiv.hasClass("locked-mouse") ||
								tileDiv.hasClass("flipped")) ||
								tileDiv.hasClass("tile-full")

			if (tileDiv.find('.blank').length) {
				// blank tiles can't be locked
				tileLocked = false
			}

			var tileDuration = nio.utils.getCurrentTime() - tileModel.get('time'),
				priorityDurations = nio.utils.getTileDurations(tileModel, content.get('flag')),
				tileDurationAfterMin = tileDuration - priorityDurations[0],
				tileDurationAfterMax = tileDuration - priorityDurations[1],
				myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax)

			// console.log(tileModel.get('time'))

			var setTile = function() {
				availableTiles = [tile]
				currentScore = {
					afterMax: tileDurationAfterMax,
					minMaxPct: myDurationPct
				}
			}

			// console.log("Checking tile...")

			// Check if the tile already exists here
			if (tileModel.get('content').get('id') == content.get('id')) {

				if (tileModel.get('content').get('id_value') == content.get('id_value') || tileLocked) {
					// It has the same ID and has the same data, we aren't going to replace ANY tile
					// OR
					// The tile is locked, but it is our best bet

					// TODO: does this mean that if a tile is Pinned, it won't update even
					// if the original post updates?
					return false
				} else {
					// It has the same ID but has new data, return this tile for updating
					return tile
				}

			} else { // We know it's not our original tile.

				if (tileLocked) {
					// The tile is locked, move along
					continue
				}

				// Check the priority matches the spec for this tile
				if ((! nio.utils.checkPriority(tileModel.get('minPriority'), content.get('priority'), false)) ||
					(! nio.utils.checkPriority(tileModel.get('maxPriority'), content.get('priority'), true))) {
					// console.log("Priority doesn't match")
					continue
				}

				// Check if the tile type is not in the available types
				if (! nio.utils.typesContains(tileModel.get('availableTypes'), content.get('type'), true)) {
					// console.log("Tile type not included")
					continue
				}

				// Check if the tile type is in the excluded types
				if (nio.utils.typesContains(tileModel.get('excludedTypes'), content.get('type'), false)) {
					// console.log("Tile type excluded")
					continue
				}

				if (tileDurationAfterMin < 0) {
					// We haven't had the minimum time yet on this tile
					// console.log("Tile hasn't hit minimum")
					continue
				}

				if (currentScore.afterMax > 0) {
					// The current one is after the max, we better be too then
					if (tileDurationAfterMax > currentScore.afterMax) {
						// This tile is more after the max than the previous tile, so it's useable
						setTile()
					} else if (tileDurationAfterMax == currentScore.afterMax) {
						// we have an after max tie, join the party!
						availableTiles.push(tile)
					} else {
						// we are after max, but not as much so as the best option(s)
					}
					continue
				}

				if (tileDurationAfterMax > 0) {
					// we are after the max and no one else is, use this tile
					setTile()
					continue
				}

				// If we are here, that means we are after the min but before the max

				// Nothing available yet, I guess that's me!
				if (availableTiles.length == 0) {
					setTile()
					continue
				}

			}

			// Find out if we are more replaceable than the current one
			// by comparing how far into the range [minDuration, maxDuration] we are
			var myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax),
				availableDurationPct = currentScore.minMaxPct

			if (myDurationPct > availableDurationPct) {
				setTile()
			} else if (myDurationPct == availableDurationPct) {
				availableTiles.push(tile)
			}
		}

		if (availableTiles.length == 0) {
			// no available tiles? oh no!
			// console.log('no available tiles')
			return false
		} else {
			// console.log('random tile')
			// return a random tile from the list of possibles
			return availableTiles[Math.floor(Math.random() * availableTiles.length)]
		}
	},

	handleTileContent: function(tiles, oMsg, model) {

		var content = new model(oMsg)
		// console.log('content: ', content)

		var tileToReplace = nio.utils.findAvailableTile(tiles, content)

		if (!tileToReplace) {
			// console.log("No available tile for " + oMsg)
			return
		}

		var tile = tileToReplace.model
		// console.log('tile: ', tile)

		// Define what swap function we want to use
		// var swapFunc = App.utils.swapTile
		// if (tile.get('content').get('id') == content.get('id')) {
			// // we are updating a tile, not swapping in a new one
			// swapFunc = App.utils.updateTile
		// }

		tile.set({
			'time': nio.utils.getCurrentTime(),
			'content': content
		})
		tile.resetDurations()

		return tileToReplace
	},

	isMobileBrowser: function() {
		var check = false
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera)
		return check
	}

}

},{}],6:[function(require,module,exports){
nio.views.LookBack = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this)
		var self = this

		this.contentModel = nio.models.Post

		this.initializeTiles(args)
	},

	initializeTiles: function(args) {
		args = args || {}
		var self = this
			numTiles = args.numTiles || 16,
			maxDate = args.maxDate || moment().utc(),
			daysLookBack = args.daysLookBack || 1

		this.tiles = []
		this.numTiles = numTiles
		this.maxDate = maxDate
		this.minDate = moment(maxDate).subtract('days', daysLookBack)

		this.xhr = this.model.fetch({
			data: {
				limit: this.numTiles,
				minDate: this.minDate.format('YYYY-MM-DD HH:mm:ss'),
				maxDate: this.maxDate.format('YYYY-MM-DD HH:mm:ss'),
				order: 'random'
			}
		})
		this.xhr.done(self.populateTiles)

	},

	populateTiles: function(oResponse) {

		var self = this

		jQuery('.body', this.$el).html('') // clear current tiles

		var posts = oResponse.posts

		if (posts.length == 0) {
			$('.body', this.$el).append([
				'<div class="no-results">',
				'    No results found',
				'</div>'
			].join('\n'))
			return
		}

		_.each(posts, function(post, index) {

			var tile = nio.utils.generateTile(this, {}, post)

			$('.body', self.$el).append(tile.el)

		})

		// console.log('CUSearch tiles:', this.tiles)
	}

})

},{}],7:[function(require,module,exports){
nio.views.RandomStream = nio.views.Stream.extend({

	handlePost: function(post) {
		if (this.names.length === 0 || _.indexOf(this.names, post.name) != -1) {
			if (this.types.length === 0 || _.indexOf(this.types, post.type) != -1) {
				var tile = nio.utils.handleTileContent(this.tiles, post, nio.models.Post)
				if (tile) {
					// console.log(tile)
					tile.on('filterByUser', this.filterByUser)
				}
			}
		}
	},

	initializeTiles: function(args) {
		var self = this

		// If we have filters, fetch the tiles then do the socket
		if (this.types.length || this.names.length) {

			var xhr = this.fetchTiles(args)

			xhr.done(function(oResponse) {
				self.setupSocket()
			})

		// Otherwise, start off with some blank tiles, then do the socket
		} else {

			var rows = this.getNumRows()
			var cols = this.getNumCols()
			for (var row=0; row<rows; row++) {
				for (var col=0; col<cols; col++) {
					var tileArgs = {
						excludedTypes: ['stat-count', 'stat-time', 'stat-percent']
					}

					if (row >= 8) {
						tileArgs['minPriority'] = 1
						tileArgs['maxPriority'] = 2
					} else {
						tileArgs['minPriority'] = 5 - Math.ceil(row / 2)
						tileArgs['maxPriority'] = 5 - Math.floor(row / 2)
					}

					var tile = nio.utils.generateTile(this, tileArgs, {})
					this.$el.append(tile.el)
					this.tiles.push(tile)
				}
			}
			this.setupSocket()
		}
	}

})

},{}],8:[function(require,module,exports){
nio.views.SearchStream = nio.views.Stream.extend({

	handlePost: function(post) {
		var msgTime = moment(post.time)
		if (this.names.length === 0 || _.indexOf(this.names, post.name) != -1) {
			if (this.types.length === 0 || _.indexOf(this.types, post.type) != -1) {
				if (post.flag == 'new') {
					if (msgTime.isSame(this.latestTime)) {
						// compare the ids.  if they don't match, then display it.
						// there will need to be some logic to make sure we don't have a string
						// of posts with the exact same moment.  Maybe we should keep a simple
						// array of all the ids.  Otherwise we could repeat the second-to-last
						// post, USW.
					} else if (msgTime.isAfter(this.latestTime)) {
						this.tileCount++
						this.latestTime = msgTime
						var tile = nio.utils.generateTile(this, {}, post)
						this.tiles.push(tile)
						this.$el.prepend(tile.el)
						// this.$el.closest('.js-packery').data('packery').layout()
					}
				}
			}
		}
	},

	initializeTiles: function(args) {
		var self  = this,
			xhr = this.fetchTiles(args)

		xhr.done(function(oResponse) {
			self.setupSocket()

			// every second, change the seconds_ago property on
			// the content, forcing the tile to re-render.
			/* TO DISABLE TIME-AGO UPDATING, COMMENT FROM HERE */
			self.interval = setInterval(function() {
				// console.log(self.tiles)
				_.each(self.tiles, function(tile, index) {
					var content = tile.model.get('content')
					// console.log('foo: ', content.get('time'))
					content.set('seconds_ago', moment().diff(moment(content.get('time')), 'seconds'))
					tile.model.trigger('change:content')
				})
			}, 1000)
			/* TO HERE */
		})
	}

})

},{}],9:[function(require,module,exports){
nio.views.Stream = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this)
		this.types = []
		this.names = []
		this.socketHost = args.socketHost
		this.serviceHost = args.serviceHost
		this.model = new nio.models.PostDictionary(this.serviceHost)
		this.contentModel = nio.models.Post
		this.renderTiles(args)
	},

	renderTiles: function(args) {
		args = args || {}
		args.types = args.types || this.types || []
		args.names = args.names || this.names || []

		this.types = _.compact(args.types)
		this.names = _.compact(args.names)

		this.latestTime = moment(0)
		this.tileCount = 0
		this.$el.html('')
		this.tiles = []
		this.tileCount = this.getNumRows() * this.getNumCols()

		this.initializeTiles(args)
	},

	setupSocket: function() {
		// Connect to the socket.  Force a new connection only if
		// there's not an existing connection.
		if (!this.ws)
			this.ws = nio.utils.connectToWebSocket(this.socketHost, 'default')
		this.ws.on('recvData', this.handleMsg)
		this.ws.socket.on('error', this.showFetchError)
		this.ws.socket.on('connect_failed', this.showFetchError)
	},

	killEvents: function() {
		//TODO: this interval only needs to be cleared in the SearchStream.
		window.clearInterval(this.interval)
		this.ws.removeAllListeners('recvData')
	},

	getNumRows: function() {
		/** Returns the number of rows based on the available space **/
		//TODO: revert this
		//var height = jQuery('.main-content-wrap').height()
		//var numRows = Math.ceil(height/App.settings.tileHeight)
		//return Math.min(11, numRows)
		return 5
	},

	getNumCols: function() {
		/** Returns the number of columns for tiles based on the available space **/
		//TODO: revert this
		//var width = this.$el.width()
		//var numCols = Math.floor(width/App.settings.tileWidth)
		//return numCols
		return 3
	},

	fetchTiles: function(args) {
		var self  = this

		args.names = args.names.join(',')
		args.types = args.types.join(',')

		if (this.postXHR) {
			this.postXHR.abort()
		}
		this.postXHR = this.model.fetch({
			data: _.extend(args, {limit: this.tileCount})
		})
		this.postXHR
			.done(this.populateSearchTiles)
			.fail(this.showFetchError)
		return this.postXHR
	},

	showFetchError: function (xhr, errMsg) {
		this.$el.html([
			'<div class="fetch-error">',
			'    <div class="text">Oops!  Something broke.</div>',
			'    <div class="subtext">Don\'t worry, we\'re on it.  Please refresh the page in a few minutes.</div>',
			'</div>'
		].join('\n'))
	},

	populateSearchTiles: function(oResponse) {
		var self = this

		var posts = _.sortBy(oResponse.posts, function(post) {
			return parseFloat(moment(post.time).format('X.SSS'))
		})

		if (posts.length === 0) {
			this.$el.html([
				'<div class="no-results">',
				'    <div class="text">No results found.</div>',
				'    <div class="subtext">Please try a different filter.</div>',
				'</div>'
			].join('\n'))
		}

		_.each(posts, function(post, index) {

			var tile = nio.utils.generateTile(self, {}, post)
			var content = tile.model.get('content')
			var contentTime = moment(content.get('time'))
			if (contentTime.isAfter(self.latestTime)) {
				self.latestTime = contentTime
			}

			tile.on('filterByUser', self.filterByUser)

			self.$el.prepend(tile.el)
			self.tiles.push(tile)

		})

	},

	jumpToTiles: function() {
		// Jump to tiles
		var $offset = $("#sidebar").offset().top - $("#main-header").height()
		$('html, body').animate({ scrollTop: $offset }, 1000)
	},

	filterByUser: function(args) {
		// console.log('triggered filterByUser in Stream')
		this.trigger('filterByUser', args)
		this.renderTiles(args)
		this.jumpToTiles()
	},

	handleMsg: function(msg) {
		oMsg = $.parseJSON(msg)
		oMsg.time = oMsg.time + ' UTC'
		this.handlePost(oMsg)
	}

})

},{}],10:[function(require,module,exports){
nio.views.Tile = Backbone.View.extend({

	tagName: 'div',
	className: 'tile',
	id: function() {
		return 'tile-' + this.model.cid
	},

	initialize: function(args) {
		_.bindAll(this)
		var self = this
		// console.log(args)

		this.$el
			.addClass('h' + this.model.get('rows'))
			.addClass('w' + this.model.get('cols'))

		this.content = this.model.get('content')

		// store the content ID so that when content changes, we know whether it's an update
		// or a replacement, and thus how to handle the transition.
		this.model.set('contentId', this.content.get('id'))

		// Generate the initial content.
		this.render()

		// Anytime the model changes, generate the content again.
		this.model.on('change:content', function() {
			self.render()
		})
	},

	events: {
		'mouseenter' : 'lockTile',
		'mouseleave' : 'unlockTile',
		'touchend' : 'unlockTile',
		'click .originator-link': 'filterByUser',
		'click .pinned': 'togglePin',
		'click .close-tile': 'closeTile',
		'click .full-text, .full-image': 'openContent',
		'click a': 'killFunc',
		'click' : 'expandTile'
	},

	filterByUser: function(ev) {
		var el = $(ev.currentTarget).parent()
		var username = el.attr('title')
		// console.log('triggered filterByUser in Tile')
		this.trigger('filterByUser', {names: [username]})
		ev.stopPropagation()
	},

	render: function() {
		var self = this
		var content = this.model.get('content'),
			type = content.get('type')

		if (!(type in compiledTemplates)) {
			// TODO: need an IE-safe console.log.  Uncomment when implemented
			// console.error('No template built for content type ' + type + ', using blank')
			type = 'blank'
		}

		if (this.model.get('contentId') === content.get('id')) {
			// IDs are the same.  This is a straight update.
			this.$el
				.html(this.getTileContainer(type, content))
				.attr(
					'data-timestamp',
					moment(this.model.get('content').get('time')).format('X.SSS'))
		} else {
			// IDs differ.  Animate the replacement and update the ID.

			var oldDiv = this.$el.find('div').first(),
				newDiv = this.getTileContainer(type, content).css('display', 'none')

			// add the new (hidden) div
			this.$el.prepend(newDiv)

			this.model.set('contentId', content.get('id'))

			// Update the div's timestamp attribute
			this.$el.attr(
				'data-timestamp',
				moment(self.model.get('content').get('time')).format('X.SSS'))

			oldDiv.fadeOut('slow', function() {
				// Once the old div is faded out, remove it
				oldDiv.remove()
			})
			newDiv.fadeIn('slow')
		}
	},

	getTileContainer: function(tileType, tileContent) {
		return $('<div/>')
			.addClass('tile-container')
			.addClass(tileType)
			.html(compiledTemplates[tileType](tileContent.toJSON()))
	},

	killFunc: function(ev) {
		ev.stopPropagation()
	},

	openContent: function(ev) {
		ev.preventDefault()
		ev.stopPropagation()

		if (this.$el.hasClass('tile-full')) {
			// open the original post
			window.open(this.$el.find('a.post-link').attr("href"))
		}
	},

	closeTile: function(ev) {
		ev.preventDefault()
		ev.stopPropagation()

		// Close tile
		this.$el.removeClass('tile-full', 300, function() {

			// Remove video iframe as applicable
			var $iframe = $(this).find('.youtube-player')
			if ($iframe) {
				var $videoId = $iframe.attr('id')
				$iframe.after('<div class="youtube-player" id="' + $videoId+ '"></div>')
				$iframe.remove()
				$(this).find('.video-cover-image').show()
			}

			// Redo packery layout
			$(this).closest('.js-packery').data('packery').layout()
		})
	},

	togglePin: function(ev) {
		this.$el.toggleClass("locked-click")
		ev.preventDefault()
		ev.stopPropagation()
	},

	expandTile: function(ev) {
		var self = this
		ev.preventDefault()
		ev.stopPropagation()

		if (this.$el.find('.blank').length) {
			return
		}

		if (!this.$el.hasClass('tile-full')) {
			// we are expanding the tile
			this.$el.addClass('tile-full', 300, function() {
				self.$el.closest('.js-packery').data('packery').fit(self.$el.get(0))
			})

			// Start video in youtube tiles
			var $iframe = $(this).find('.youtube-player')
			if ($iframe) {
				this.launchPlayer(this.$el.find('.youtube-player'))
				this.$el.find('.video-cover-image').hide()
			}
		} else {
			this.closeTile(ev)
		}

	},

	launchPlayer: function(playerDiv) {
		var videoId = playerDiv.attr('id')
		var player = new YT.Player(videoId, {
			height: '100%',
			width: '100%',
			videoId: videoId,
			events: {
				'onReady': function(e) {
					if (!nio.utils.isMobileBrowser()) {
						e.target.playVideo()
					}
				}
			}
		})
	},

	lockTile: function(ev) {
		this.$el.addClass('locked-mouse')
	},

	unlockTile: function(ev) {
		this.$el.removeClass('locked-mouse')
	}

})

},{}]},{},[2])