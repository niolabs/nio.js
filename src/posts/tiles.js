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
		.attr('layout', true)
		.attr('horizontal', true)

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

	// var elCols = []
	// for (var i=numCols; i--;)
	// elCols[i] = elMain.append('div').style('float', 'left')

	// caching these functions for performance
	function getNested(d) { return d }
	function getHTML(d) { return template(d) }
	function getID(d) { return d.id }
	function getColID(d, i) { return d.length ? d[0].id : i }
	function tileClicked(d) {
		var elThis = d3.select(this).select('.tile')
		var isExpanded = elThis.classed('-expanded')
		if (!isExpanded) {
			elMain.selectAll('.tile').classed('-expanded', false)
			elMain.selectAll('iframe').remove()
			// embed youtube player on expand
			if (d.type === 'youtube') {
				replaceVideo(el, 'https://www.youtube.com/embed/' + d.id + '?autoplay=1')
			} else if (d.type === 'original') {
				// redirect to the original post
				window.location.href = d.link
				return
			} else if (d.type === 'original-video') {
				replaceVideo(el, d.video_url + '?autoplay=1')
			}

			var tileWidth = parseInt(elThis.style('width'))
			var mainWidth = parseInt(elMain.style('width'))
			// only expand if we have enough room
			if (mainWidth > tileWidth * 2) {
				elThis.classed('-expanded', !isExpanded)
			}
		} else if (isExpanded) {
			elThis.classed('-expanded', false)
		} else if (d.type === 'youtube' || d.type === 'original-video') {
			elThis.select('iframe').remove()
		}
	}

	function replaceVideo(el, video_url) {
		el.select('.tile-media')
			.append('iframe')
			.attr({
				src: video_url,
				frameborder: 0,
				allowfullscreen: true,
				fit: true,
				full: true,
				block: true
			})
	}

	function render() {
		var cols = elMain.selectAll('.col')
			.data(data, getColID)

		cols.enter().append('div')
			.classed('col', true)
			.attr('layout', true)
			.attr('vertical', true)

		var tile = cols
			.selectAll('.tile-wrapper')
			.data(getNested, getID)

		// tile.order()

		var tileEnter = tile.enter().insert('div', ':first-child')
			.classed('tile-wrapper', true)
			.attr('relative', true)
			.attr('space-half', true)
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

	return stream
}

module.exports.template = template
