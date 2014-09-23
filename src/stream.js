/* A naive, barebones implementation of node's Stream API. */
module.exports = Stream

var EventEmitter = require('./events').EventEmitter
var util = require('./util')

function Stream() {
	EventEmitter.call(this)
}

util.inherits(Stream, EventEmitter)

Stream.prototype.push = function (chunk) {
	this.emit('data', chunk)
}

Stream.prototype.write = function (chunk) {
	this.emit('error', new Error('not implemented'))
}

Stream.prototype.pipe = function (dest) {
	this.on('data', dest.write.bind(dest))
	return dest
}

Stream.make = function (writeFunc) {
	var stream = new Stream()
	stream.write = writeFunc.bind(stream)
	return stream
}
