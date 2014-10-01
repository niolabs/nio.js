var stream = require('../stream')
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: require('../utils')
})

exports.tiles = function(opts) {
	var selector = _.isString(opts) ? opts : opts.selector
	var animSpeed = opts.hasOwnProperty('animSpeed') ? opts.animSpeed : 750
	var numCols = opts.numCols || 3

	var elMain = d3.select(selector)
	//var elCols = []
	//for (var i=numCols; i--;)
	//	elCols[i] = elMain.append('div').style('float', 'left')

	// caching these functions
	var getHTML = function (d) { return template(d) }
	var getID = function (d) { return d ? d.id : console.log(d) }
	var getClass = function (d) {
		return 'tile tile-' + d.type + (d.media_url ? ' tile-has-media' : '')
	}

	function render(posts) {
		var elTile = elMain.selectAll('.tile').data(posts, getID)
		var elTileJoin = elTile.order()
		var elTileEnter = elTile.enter().append('div')
			.attr('class', getClass)
			.html(getHTML)
		var elTileExit = elTile.exit()
		if (animSpeed) {
			elTileEnter
				.style('opacity', 0)
				.transition()
					.duration(animSpeed)
					.style('opacity', 1)
			elTileExit.transition()
				.duration(animSpeed)
				.style('opacity', 0)
				.remove()
		} else {
			elTileExit.remove()
		}
	}

	return stream.passthrough(_.throttle(render, 1000))
}
