var core = require('../core')
var utils = require('../utils')
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: utils
})

var defaults = {
	type: '',
	media_url: '',
	profile_image_url: '',
	media_url: '',
	source: '',
	text: '',
	time: new Date()
}

exports.tiles = function(opts) {
	var selector = _.isPlainObject(opts) ? opts.selector : opts
	var animSpeed = opts.hasOwnProperty('animSpeed') ? opts.animSpeed : 0

	var numCols = opts.numCols || 3
	var data = d3.range(numCols).map(function () { return [] })

	var elMain = d3.select(selector)

	//var elCols = []
	//for (var i=numCols; i--;)
	//	elCols[i] = elMain.append('div').style('float', 'left')

	// caching these functions for performance
	var getNested = function (d) { return d }
	var getHTML = function (d) { return template(d) }
	var getID = function (d) { return d.id }

	var isInitialized = false
	function render() {
		var cols = elMain.selectAll('.col')
			.data(data, function (d, i) { return d.length ? d[0].id : i })

		cols.enter().append('div')
			.classed('col', true)

		var tile = cols
			.selectAll('.tile-wrapper')
			.data(getNested, getID)

		//tile.order()

		var tileEnter = tile.enter().insert('div', ':first-child')
			.attr('class', 'tile-wrapper')
			.html(getHTML)
			.on('click', function (d, i) {
				var el = d3.select(this).select('.tile')
				var isExpanded = el.classed('is-expanded')
				if (!isExpanded)
					elMain.selectAll('.tile').classed('is-expanded', false)
				el.classed('is-expanded', !isExpanded)
			})

		tileEnter
			.select('.tile')
			.classed('flip-in', true)

		// only start sliding tiles down after the initial load
		if (isInitialized)
			tileEnter.classed('slide-down', true)
		else
			isInitialized = true
		tile.exit().remove()
	}

	var getCol = utils.cycle(numCols)

	// IDs of posts we've seen already
	var seen = []
	var stream = nio.passthrough(function (chunk) {
		var colLimit = Math.floor(chunk.length / numCols)
		for (var i=0, l=chunk.length; i<l; i++) {
			var post = _.defaults(chunk[i], defaults)
			if (seen.indexOf(post.id) === -1) {
				seen.push(post.id)
				var col = getCol()
				data[col].unshift(post)
			}
		}
		// check if the size has changed
		for (var i=data.length; i--;)
			if (data[i].length >= colLimit)
				data[i] = data[i].slice(0, colLimit+1)
		render()
	})

	stream.clear = function () {
		elMain.selectAll('.col').remove()
		data = d3.range(numCols).map(function () { return [] })
		seen = []
	}

	return stream
}
