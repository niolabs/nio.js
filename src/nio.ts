/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/socket.io/socket.io.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
import models = require('./models')
import stream = require('./stream')
import tiles = require('./tiles/tiles')
import utils = require('./utils')

interface Source extends stream.Stream {
	start(path: string): Source
	pause(): void
	resume(): void
}

class JSONSource extends stream.Stream implements Source {
	private host: string
	private path: string
	private pollRate: number
	private interval: number

	constructor(host: string, pollRate: number = 20 * 1000) {
		this.host = host
		this.pollRate = pollRate
		super()
	}

	fetch(path: string): void {
		this.path = path
		d3.json(this.host + '/' + path, (error, json) => {
			var data = json[path]
			if (data && _.isArray(data))
				for (var i=data.length; i--;)
					this.push(data[i])
			else
				this.push(data)
		})
	}

	start(path: string): JSONSource {
		this.fetch(path)
		this.interval = setInterval(() => this.fetch(path), this.pollRate)
		return this
	}

	pause(): void {
		clearTimeout(this.interval)
	}

	resume(): void {
		this.start(this.path)
	}
}

class SocketIOSource extends stream.Stream implements Source {
	ws: Socket
	host: string
	constructor(host: string) {
		this.host = host
		super()
	}
	start(path: string): SocketIOSource {
		var ws = this.ws = io.connect(this.host)
		var sock = ws.socket
		path = path == 'posts' ? 'default' : path
		sock.on('connect', () => ws.emit('ready', path))
		sock.on('connect_failed', () => console.error('connection failed'))
		sock.on('error', () => console.error('connection error'))
		this.resume()
		return this
	}
	pause(): void {
		this.ws.on('recvData', (data) => null)
	}
	resume(): void {
		this.ws.on('recvData', (data) => this.push(JSON.parse(data)))
	}
}

class MuxSource extends stream.Stream implements Source {
	sources: Source[]
	constructor(...sources: Source[]) {
		this.sources = sources
		super()
	}
	start(path: string): MuxSource {
		this.sources.forEach(src => src.start(path))
		return this
	}
	pause(): void {
		this.sources.forEach(src => src.pause())
	}
	resume(): void {
		this.sources.forEach(src => src.resume())
	}
}

class TestStream extends stream.Stream {
	constructor(message: string = 'hello world', rate: number = 1000) {
		setInterval(() => this.push(message), rate)
		super()
	}
}

class Collection extends stream.Stream {
	modelFn: Function
	private data: any[]
	private transforms: Function[]
	private transformFn: Function

	constructor(modelFn: Function) {
		this.modelFn = modelFn
		this.data = []
		this.transforms = []
		this.transformFn = null
		super()
	}

	write(chunk: any): void {
		var model = new this.modelFn(chunk)
		if (!_.any(this.data, m => model.getID() == m.getID())) {
			this.data.push(model)
			if (this.transformFn)
				this.data = this.transformFn(this.data)
			this.push(this.data)
		}
	}

	transform(fn: Function): Collection {
		this.transforms.push(fn)
		this.transformFn = this.transforms[0]
		return this
	}

	sort(prop: string, reverse: boolean): Collection {
		this.transform((data) => {
			var sorted = _.sortBy(data, d => d[prop])
			return reverse ? sorted.reverse() : sorted
		})
		return this
	}
}

function logStream(): stream.Stream {
	return stream.make(function (chunk) {
		console.log(chunk)
		this.push(chunk)
	})
}

module nio {
	export function json(host: string, pollRate?: number): JSONSource {
		return new JSONSource(host, pollRate)
	}
	export function socketio(host: string): SocketIOSource {
		return new SocketIOSource(host)
	}
	export function collection(modelFn): Collection {
		return new Collection(modelFn)
	}
	export function showTiles(selector: string, src: Source): tiles.TileView {
		var tileView = new tiles.TileView(selector)
		var collect = new Collection(models.Post)
		collect.sort('time', true)
		src.start('posts')
			.pipe(collect)
			.pipe(logStream())
			.pipe(tileView)
		return tileView
	}
}

window['nio'] = nio
