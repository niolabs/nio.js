export class EventEmitter {
	private _events: { [event: string]: Function[] }

	on(event: string, fn : Function): void {
		this._events = this._events || {}
		this._events[event] = this._events[event] || []
		this._events[event].push(fn)
	}

	off(event: string, fn : Function): void {
		this._events = this._events || {}
		if (event in this._events === false) return
		this._events[event].splice(this._events[event].indexOf(fn), 1)
	}

	emit(event: string, ...args: any[]): void {
		this._events = this._events || {}
		if (event in this._events === false) return
		for (var i=0; i<this._events[event].length; i++) {
			this._events[event][i].apply(this, args)
		}
	}
}
