// base functions for an event emitter
function EventEmitter() {}
EventEmitter.prototype = Object.create(Object.prototype, {
	on: {
		value: function (event, fn) {
			this._events = this._events || {}
			this._events[event] = this._events[event] || []
			this._events[event].push(fn)
		}
	},
	off: {
		value: function (event, fn) {
			this._events = this._events || {}
			if (event in this._events === false) return
			this._events[event].splice(this._events[event].indexOf(fn), 1)
		}
	},
	emit: {
		value: function (event) {
			this._events = this._events || {}
			if (event in this._events === false) return
			var args = Array.prototype.slice.call(arguments, 1)
			for (var i=0, l=this._events[event].length; i < l; i++)
				this._events[event][i].apply(this, args)
		}
	}
})
exports.EventEmitter = EventEmitter

function mustImplement(name) {
	return function () {
		if (!this[name])
			this.emit('error', new Error(name + ' has not been implemented'))
		else
			this[name].apply(this, arguments)
	}
}
exports.mustImplement = mustImplement

function Readable() {
	EventEmitter.call(this)
}
Readable.prototype = Object.create(EventEmitter.prototype, {
	push: {
		value: function (chunk) { if (chunk) this.emit('data', chunk) }
	},
	pipe: {
		value: function (dest) {
			this.on('data', dest.write.bind(dest))
			return dest
		}
	},
	split: {
		value: function () {
			var dests = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
			for (var i=dests.length; i--;)
				this.pipe(dests[i])
			return this
		}
	},
	pull: {
		value: function () {
			var sources = _.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
			for (var i=sources.length; i--;)
				sources[i].pipe(this)
			return this
		}
	}
})
exports.Readable = Readable

function Transform(_write) {
	Readable.call(this)
	this._write = _write
}
Transform.prototype = Object.create(Readable.prototype, {
	write: {
		value: mustImplement('_write')
	}
})
exports.Transform = Transform
exports.transform = function (fn) {
	return new Transform(fn)
}

function PassThrough(_write) {
	Readable.call(this)
	this._write = _write
}
PassThrough.prototype = Object.create(Readable.prototype, {
	write: {
		value: function (chunk) {
			this.push(chunk)
			if (this._write) this._write(chunk)
		}
	}
})
exports.PassThrough = PassThrough
exports.passthrough = function (fn) {
	return new PassThrough(fn)
}
