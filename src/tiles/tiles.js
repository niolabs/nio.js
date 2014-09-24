var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: nio.utils
})

nio.tiles = function(selector) {
	var el = d3.select(selector),
		posts = [],
		lazyRender = _.debounce(render, 1000)

	function render() {
		var elTiles = el.selectAll('div').data(posts)
		elTiles.enter().append('div')
		elTiles.attr('class', function(p) {
			return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '')
		}).html(function(p) {
			return template(p)
		});
		elTiles.exit()
	}

	lazyRender()

	return _.assign({}, nio._streamer, {
		write: function (data) {
			posts = data
			lazyRender()
			this.push(posts)
		}
	})
}
