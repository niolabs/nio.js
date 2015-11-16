'use strict';

var _ = require('./deps')._;
var stream = require('./stream');

/**
 * getPropertyFunc creates a function that gets a property on an object.
 *
 * @param {(string|function)=} value
 * @return {function}
 */
function getPropertyFunc(value) {
	if (_.isUndefined(value)) {
		return function (chunk) { return chunk; }
	} else if (_.isString(value)) {
		return function (chunk) { return chunk[value]; }
	} else if (_.isFunction(value)) {
		return value;
	} else {
		throw new Error('value must be a string or function');
	}
}

/**
 * func pushes the returned chunk down the pipeline.
 *
 * @param {function} fn
 * @return {stream}
 */
exports.func = function (fn) {
	return stream(function (chunk) {
		var results = fn.call(this, chunk);
		this.push(results);
	})
}

/**
 * pass creates a stream observes chunks passed through it.
 *
 * @param {function} fn
 * @return {stream}
 */
exports.pass = function (fn) {
	return stream(function (chunk) {
		if (fn) fn.call(this, _.clone(chunk));
		this.push(chunk);
	})
};

// will only push a chunk if the function it's passed to returns true
exports.filter = function (fn) {
	return stream(function (chunk) {
		if (fn.call(this, chunk)) {
			this.push(chunk);
		}
	})
};

/**
 * filter to push chunk if property's value is value.
 *
 * @param property
 * @param value
 * @return {stream}
 */
exports.is = function (property, value) {
    return exports.filter(function(d) {
        var fn = getPropertyFunc(property);
        return fn(d) == value;
    })
};

/**
 * filter to push chunk if it has a property.
 *
 * @param property
 * @return {stream}
 */
exports.has = function (property) {
    return exports.filter(function(d) {
        return property in d ;
    });
};

/**
 * get pushes a property on the chunks passed to it.
 *
 * @param {(string|function)=} value The property getter for the chunk ID.
 * @return {stream}
 */
exports.get = function (value) {
	var fn = getPropertyFunc(value);
	return exports.func(fn);
};

/**
 * single pushes each item in an array.
 *
 * @return {stream}
 */
exports.single = function () {
	return stream(function (chunk) {
		if (_.isArray(chunk)) {
			_.each(chunk, this.push, this);
		} else {
			this.push(chunk);
		}
	});
};

/**
 * defaults assigns defaults to chunks.
 *
 * @param {object} opts Default property values.
 * @return {stream}
 */
exports.defaults = function (opts) {
	return exports.func(_.partialRight(_.defaults, opts))
}

/**
 * log logs chunks passed through it.
 *
 * @param {string=} prefix Prefix log output.
 * @return stream
 */
exports.log = function (prefix) {
	return exports.pass(function (chunk) {
		if (prefix) {
			console.log(prefix, chunk);
		} else {
			console.log(chunk);
		}
	});
};
