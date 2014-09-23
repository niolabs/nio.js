var Stream = require('../stream')
var util = require('../util')
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: { 'linkify': linkify }
})

function linkify(str) {
	str = str.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a target=_blank href='$1'>$1</a>")
	str = str.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>")
	return str.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>")
}

function TileView(selector) {
	if (!(this instanceof TileView))
		return new TileView(selector)
	this.el = d3.select(selector)
	this.posts = []
	this.lazyUpdate = _.debounce(this.update.bind(this), 1000)
}

util.inherits(TileView, Stream)

TileView.prototype.update = function () {
	var elTiles = this.el.selectAll('div').data(this.posts)

	elTiles.enter().append('div')

	elTiles
		.attr('class', function (p) {
			return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '')
		})
		.html(function (p) { return template(p) })

	elTiles.exit()

	return this
}

TileView.prototype.write = function (chunk) {
	this.posts = chunk
	this.lazyUpdate()
	this.push(chunk)
}

module.exports = TileView
