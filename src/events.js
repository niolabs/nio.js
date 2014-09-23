module.exports.EventEmitter = EventEmitter

function EventEmitter() {}

EventEmitter.prototype.on = function (event, fct) {
	this._events = this._events || {}
	this._events[event] = this._events[event]	|| []
	this._events[event].push(fct)
}

EventEmitter.prototype.off = function (event, fct) {
	this._events = this._events || {}
	if (event in this._events === false) return
	this._events[event].splice(this._events[event].indexOf(fct), 1)
}

EventEmitter.prototype.emit = function (event) {
	this._events = this._events || {}
	if (event in this._events === false) return
	for (var i=0; i<this._events[event].length; i++) {
		this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
	}
}
