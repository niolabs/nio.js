var deps = require('../deps');
var _ = deps._;
var inherits = deps.inherits;
var Stream = require('../stream');
var utils = require('../utils');

function SocketIOStream(host, rooms, maxLookback) {
	if (!(this instanceof SocketIOStream)) {
		return new SocketIOStream(host, rooms, maxLookback);
	}
	this.host = host;
	this.rooms = rooms;
	this.maxLookback = maxLookback;
	this.sock = null;
	Stream.call(this);
}

inherits(SocketIOStream, Stream);

SocketIOStream.prototype.oninit = function () {
	/* global io */
	if (!window.io) {
		var s = utils.script(this.host + '/socket.io/socket.io.js');
		s.onload = function () { this.oninit() }.bind(this);
		return this;
	}

	return this.connectToSocket();
};

SocketIOStream.prototype.connectToSocket = function () {

	var sock = this.sock = io.connect(this.host, {'force new connection': true});

	sock.on('connect', function () {
		_.each(this.rooms, function (room) {
			if (typeof this.maxLookback == 'undefined') {
				// use the legacy room joining method
				sock.emit('ready', room);
			} else {
				sock.emit('ready', {
					room: room,
					fromTime: this.maxLookback
				});
			}
		}, this);
	}.bind(this));

	sock.on('connect_failed', function (e) {
		console.error('connection failed');
		console.error(e);
	});

	sock.on('error', function (e) {
		console.error('connection error');
		console.error(e);
	});

	sock.on('recvData', function (data) {
		//if (this.state === Stream.STATES.PAUSE) return
		this.push(JSON.parse(data));
	}.bind(this));

	return this;
};

SocketIOStream.prototype.onpause = function () {
	if (this.sock) {
		this.sock.disconnect();
	}
	this.sock = null;
};

SocketIOStream.prototype.onresume = function () {
	if (this.sock && this.sock.connected) {
		console.error("Resumed a connected socket...call pause first");
		return;
	}
	this.connectToSocket();
};


// Write data back to our socket server when it's piped in
SocketIOStream.prototype.onwrite = function (chunk) {
	if (this.sock && this.sock.connected) {
		this.sock.emit('pub', JSON.stringify(chunk));
	} else {
		console.error("Socket not connected or is paused");
	}
};

module.exports = SocketIOStream;
