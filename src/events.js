var EventEmitter = (function () {
    function EventEmitter() {
    }
    EventEmitter.prototype.on = function (event, fn) {
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fn);
    };

    EventEmitter.prototype.off = function (event, fn) {
        this._events = this._events || {};
        if (event in this._events === false)
            return;
        this._events[event].splice(this._events[event].indexOf(fn), 1);
    };

    EventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        this._events = this._events || {};
        if (event in this._events === false)
            return;
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, args);
        }
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
