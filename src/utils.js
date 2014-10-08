// turns urls and twitter handles/hashtags into links
exports.linkify = function (text) {
    text = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a target=_blank href='$1'>$1</a>")
    text = text.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>")
    return text.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>")
}

exports.truncate = function (text, len) {
    if (text.length > len) return text.substring(0, len - 3) + '...'
    return text
}

exports.isArray = _.isArray
exports.isFunc = _.isFunction
exports.isStr = _.isString

var mediaTypeNames = {
	'twitter': 'Twitter',
	'twitter-photo': 'Twitter',
	'facebook': 'Facebook',
	'gplus': 'Google+',
	'linkedin': 'LinkedIn',
	'rss': 'RSS'
}

exports.mediaTypeName = function (type) {
	return type in mediaTypeNames ? mediaTypeNames[type] : type
}

exports.cycle = function (value) {
	if (_.isNumber(value))
		value = d3.range(value)
	var current = -1 // so the first call will get the first value
	return function () {
		current = current === value.length - 1 ? 0 : current+1
		var target = value[current]
		return _.isFunction(target) ? target() : target
	}
}
