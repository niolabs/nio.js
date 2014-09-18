(function(){

	/*
	var nio = window.nio = {
		views: {},
		models: {},
		collections: {}
	}

	require('./content.js')
	require('./utils.js')
	require('./models/Post.js')
	require('./models/Tile.js')
	require('./views/Tile.js')
	require('./views/LookBack.js')
	require('./views/Stream.js')
	require('./views/RandomStream.js')
	require('./views/SearchStream.js')
	*/

	var nio = this.nio = {}
	var tileTmpl = tmpl(htmlTemplates['tile.html'])
	nio.tiles = function (opts) {
		var el = d3.select(opts.el)
		d3.json('http://' + opts.serviceHost + '/posts', function (error, json) {
			if (error)
				return console.warn(error)
			console.log(json)

			var tiles = el.selectAll('div')
				.data(json.posts)

			console.log(tiles)

			tiles.enter().append('div')

			tiles
				.attr('class', 'tile')
				.html(function (post) { return tileTmpl(post) })

			tiles.exit().remove()
		})
		//return new nio.views.RandomStream(opts)
	}

}())
