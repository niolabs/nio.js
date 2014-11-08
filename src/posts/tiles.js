var fs = require('fs')
var _ = require('lodash')
var d3 = require('d3')
var utils = require('../utils')
var streams = require('../streams')
var posts = require('../posts')

var html = fs.readFileSync(__dirname + '/tiles.html', 'utf8')
var template = _.template(html, null, {imports: utils})

// TODO
//require('../vendor/CustomElements')
//require('../vendor/time-elements')

module.exports = function (opts) {
	if (_.isString(opts))
		opts = {el: opts}
	var numRows = opts.rows || 3
	var numCols = opts.cols || 3

	var elMain = d3.select(opts.el)

	function handleChunk(chunk) {
		if (_.isArray(chunk)) {
			_.forEach(chunk, handleChunk)
		} else {
			var post = posts.post(chunk)
			var col = getCol()
			data[col].unshift(post)
		}
	}

	function trimColumns() {
		for (var x = data.length; x--;)
			if (data[x].length >= numRows)
				data[x] = data[x].slice(0, numRows)
	}

	// IDs of posts we've seen already
	var stream = streams.pass(function (chunk) {
		handleChunk(chunk)
		trimColumns()
		render()
		checkExpandable()
	})

	var getCol, isInitialized, data

	stream.onreset = function () {
		elMain.html('')
		data = d3.range(numCols).map(function () { return [] })
		isInitialized = false
		getCol = utils.cycle(_.range(numCols))
	}

	stream.reset(false)

	stream.columns = function (value) {
		if (!value) return numCols
		numCols = value
	}

	stream.onnoresults = function () {
		// TODO: new posts may come in that match the filter. we should handle
		// that scenario
		elMain.append('div').text('No results found')
	}

	stream.onfilter = stream.onreset

	// caching these functions for performance
	function getNested(d) { return d }
	function getHTML(d) { return template(d) }
	function getID(d) { return d.id }
	function getColID(d, i) { return d.length ? d[0].id : i }
	function tileClicked(d) {
		var elThis = d3.select(this).select('.tile')
		var target = d3.select(d3.event.target)

		if (target.classed('dropdown-toggle')) {
			d3.event.preventDefault()
			target.classed('toggled', !target.classed('toggled'))
		} else if (target.classed('favorite')) {
			d3.event.preventDefault()
			stream.broadcast('toggle-favorited', d)
			elThis.classed('-favorited', !elThis.classed('-favorited'))
		} else {
			elMain.selectAll('.toggled').classed('toggled', false)
		}

		// don't expand when we click links
		if (target.node().tagName === 'A') return

		var isExpanded = elThis.classed('-expanded')
		var isExpandable = elThis.classed('-expandable')
		if (!isExpanded) {
			// close any other expanded tiles
			elMain.selectAll('.tile').classed('-expanded', false)

			// embed youtube player on expand
			if (d.type === 'youtube') {
				replaceVideo(elThis, 'https://www.youtube.com/embed/' + d.id + '?autoplay=1')
				// don't expand
				return;
			} else if (d.type === 'original') {
				// redirect to the original post
				window.location.href = d.link
				return
			} else if (d.type === 'original-video') {
				if (! elThis.classed('-playing')) {
					replaceVideo(elThis, d.video_url + '?autoplay=1')
				}
				// don't expand
				return;
			}

			// only expand if we have enough room and it is expandable
			var tileWidth = parseInt(elThis.style('width'))
			var mainWidth = parseInt(elMain.style('width'))
			if (isExpandable && mainWidth > tileWidth * 2) {
				elThis.classed('-expanded', true)
			}
		} else {
			elThis.classed('-expanded', false)
			if (d.type === 'youtube') {
				elThis.select('iframe').remove()
			}
		}
	}

	function replaceVideo(el, video_url) {
		el.select('.tile-media')
			.append('iframe')
			.attr({
				src: video_url,
				frameborder: 0,
				allowfullscreen: true,
				class: 'fit full block'
			})
		el.classed('-playing', true)
	}

	function render() {
		var cols = elMain.selectAll('.col')
			.data(data, getColID)

		cols.enter().append('div').classed('col', true)

		var tile = cols
			.selectAll('.tile-wrapper')
			.data(getNested, getID)

		// tile.order()

		var tileEnter = tile.enter().insert('div', ':first-child')
			.classed('tile-wrapper', true)
			.classed('-wide', function (d) { return d.wide })
			.html(getHTML)
			.on('click', tileClicked)

		// only start sliding tiles down after the initial load
		if (isInitialized) {
			tileEnter.classed('slide-down', true)
		} else {
			isInitialized = true
			stream.broadcast('init')
		}
		tile.exit().remove()
	}

	function checkExpandable() {
		// determine which tiles are expandable
		var tiles = elMain.selectAll('.tile-wrapper .tile')
		tiles.classed('-expandable', function() {
			var tile = d3.select(this),
				tileContentEl = tile.select('.tile-content')[0][0],
				clientHeight = tileContentEl.clientHeight,
				scrollHeight = tileContentEl.scrollHeight,
				isMedia = tile.classed('-media')

			// expandable if it is media or if the
			// content overflows the containter
			return isMedia || scrollHeight > clientHeight
		})
	}

	return stream
}

module.exports.template = template
