var deps = require('./deps');
var _ = deps._;

// turns urls and twitter handles/hashtags into links
exports.linkify = function (text) {
	// urls
	text = text.replace(
		/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
		'<a class="linkify-link" target=_blank href="$1">$1</a>'
	);
	// usernames
	text = text.replace(
		/(^|\s)@(\w+)/g,
		'$1<a class="linkify-username" data-username="$2" target=_blank href="http://twitter.com/$2">'
		+ '@$2' +
		'</a>'
	);
	// hashtags
	text = text.replace(
		/(^|\s)#(\w+)/g,
		'$1<a class="linkify-hashtag" data-hashtag="$2" target=_blank href="http://twitter.com/search?q=%23$2">'
			+ '#$2' +
		'</a>'
	);
	return text;
};

exports.truncate = function (text, len) {
	if (text.length > len) {
		return text.substring(0, len - 3) + '...';
	}
	return text;
};

exports.cycle = function (value) {
	if (_.isNumber(value)) {
		value = _.range(1, value + 1);
	}
	var current = -1; // so the first call will get the first value
	return function () {
		current = current === value.length - 1 ? 0 : current + 1;
		var target = value[current];
		return _.isFunction(target) ? target() : target;
	}
};

exports.script = function (url) {
	var script = document.createElement('script');
	script.src = url;
	document.body.appendChild(script);
	return script;
};

exports.argsOrArray = function (fn) {
	return function () {
		if (_.isArray(arguments[0])) {
			return fn.apply(fn, arguments[0]);
		}
		return fn.apply(fn, arguments);
	};
};

/**
 * utc creates/converts a date to UTC
 *
 * @param date
 * @return {undefined}
 */
exports.utc = function (date) {
	if (!date) {
		date = new Date();
	} else if (_.isString(date)) {
		date = new Date(date);
	}
    return new Date(Date.UTC(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	));
};

exports.windowSize = function () {
	var w = window;
	var e = document.documentElement;
	var g = document.getElementsByTagName('body')[0];
	var width = w.innerWidth || e.clientWidth || g.clientWidth;
	var height = w.innerHeight || e.clientHeight || g.clientHeight;
	return {
		width: width, 
		height: height
	};
};

module.exports = exports;
