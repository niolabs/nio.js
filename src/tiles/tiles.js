var core = require('../core')
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: require('../utils')
})

exports.tiles = function(opts) {
	var selector = _.isString(opts) ? opts : opts.selector
	var numCols = opts.numCols || 3
	var animSpeed = opts.hasOwnProperty('animSpeed') ? opts.animSpeed : 750

	var elMain = d3.select(selector)
	//var elCols = []
	//for (var i=numCols; i--;)
	//	elCols[i] = elMain.append('div').style('float', 'left')

	// caching these functions
	var getHTML = function (d) { return template(d) }
	var getID = function (d) { return d ? d.id : console.log(d) }

	return nio.passthrough(function (posts) {
		var tile = elMain.selectAll('.tile-wrapper').data(posts, getID)
		var tileJoin = tile.order()

		tileJoin.on('click', function (d, i) {
			var el = d3.select(this).select('.tile')
			el.classed('is-expanded', !el.classed('is-expanded'))
		})

		var tileEnter = tile.enter().append('div')
			.attr('class', 'tile-wrapper')
			.html(getHTML)
		var tileExit = tile.exit()

		// animations will be disabled if animSpeed = 0
		if (animSpeed) {
			tileEnter
				.style('opacity', 0)
				.transition()
					.duration(animSpeed)
					.style('opacity', 1)
			tileExit.transition()
				.duration(animSpeed)
				.style('opacity', 0)
				.remove()
		} else {
			tileExit.remove()
		}
	})
}
