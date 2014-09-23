import events = require('./events')

export class Stream extends events.EventEmitter {
	push(chunk: any): void {
		this.emit('data', chunk)
	}

	write(chunk: any): void {
		this.emit('error', new Error('not implemented'))
	}

	pipe(dest: Stream): Stream {
		this.on('data', dest.write.bind(dest))
		return dest
	}
}

export function make(writeFunc) {
	var stream = new Stream()
	stream.write = writeFunc.bind(stream)
	return stream
}
