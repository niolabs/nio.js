"use strict";

var has_require = typeof require !== 'undefined';

// Check for global lodash, otherwise require it
if (typeof _ === "undefined") {
	if (has_require) {
		var _ = require('lodash');
	} else {
		throw new Error('nio.js requires lodash');
	}
}

module.exports = {
	_: _,
	eventemitter3: require('eventemitter3'),
	inherits: require('inherits')
};
