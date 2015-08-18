var _ = require('./deps')._
var inherits = require('./deps').inherits
var Stream = require('./stream')
var utils = require('./utils')

function SocketIOStream(host, rooms) {
	if (!(this instanceof SocketIOStream))
		return new SocketIOStream(host, rooms)
	this.host = host
	this.rooms = rooms
	Stream.call(this)
}

inherits(SocketIOStream, Stream)

SocketIOStream.prototype.oninit = function () {
	/* global io */
	if (!window.io) {
		var s = utils.script(this.host + '/socket.io/socket.io.js')
		s.onload = function () { this.oninit() }.bind(this)
		return this
	}

	var sock = io.connect(this.host, {'force new connection': true});

	sock.on('connect', function () {
		_.each(this.rooms, function (room) {
			sock.emit('ready', room)
		}, this)
	}.bind(this))
	sock.on('connect_failed', function (e) {
		console.error('connection failed');
		console.error(e);
	})
	sock.on('error', function (e) {
		console.error('connection error');
		console.error(e);
	})
	sock.on('recvData', function (data) {
		//if (this.state === Stream.STATES.PAUSE) return
		this.push(JSON.parse(data))
	}.bind(this))
	return this
}

SocketIOStream.prototype.onresume = function () { }

SocketIOStream.prototype.onreset = function () { }

module.exports = {
	socketio: SocketIOStream
}
