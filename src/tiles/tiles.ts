/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
import stream = require('../stream')
import models = require('../models')
import utils = require('../utils')

declare var htmlTemplates: { [path: string]: string }

var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: {
		'linkify': utils.linkify,
		'truncate': utils.truncate
	}
})

export class TileView extends stream.Stream {
	private el: D3.Selection
	private posts: models.Post[]
	private lazyRender: () => void

	constructor(selector: string) {
		this.el = d3.select(selector)
		this.posts = []
		this.lazyRender = _.debounce(this.render.bind(this), 1000)
		super()
	}

	render(): void {
		var elTiles = this.el.selectAll('div').data(this.posts)
		elTiles.enter().append('div')
		elTiles
			.attr('class', (p) => {
				return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '')
			})
			.html(p => template(p))
		elTiles.exit()
	}

	write(posts: models.Post[]): void {
		this.posts = posts
		this.lazyRender()
		this.push(this.posts)
	}
}
