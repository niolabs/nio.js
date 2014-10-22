'use strict';

var _ = require('lodash')
var d3 = require('d3')
var core = require('../core')
var utils = require('../utils')

/* global htmlTemplates */
var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
	imports: utils
})

var defaults = {
	type: '',
	'profile_image_url': '',
	'media_url': '',
	source: '',
	text: '',
	time: new Date()
}

module.exports = function (opts) {
	var selector = _.isPlainObject(opts) ? opts.selector : opts
	// var animSpeed = opts.hasOwnProperty('animSpeed') ? opts.animSpeed : 0

	var numCols = opts.numCols || 3
	var data = d3.range(numCols).map(function () { return [] })

	var elMain = d3.select(selector)

	// var elCols = []
	// for (var i=numCols; i--;)
	// elCols[i] = elMain.append('div').style('float', 'left')

	// caching these functions for performance
	function getNested(d) { return d }
	function getHTML(d) { return template(d) }
	function getID(d) { return d.id }
	function getColID(d, i) { return d.length ? d[0].id : i }
	function tileClicked() {
		var el = d3.select(this).select('.tile')
		var isExpanded = el.classed('is-expanded')
		if (!isExpanded)
			elMain.selectAll('.tile').classed('is-expanded', false)
		el.classed('is-expanded', !isExpanded)
	}

	var isInitialized = false
	function render() {
		var cols = elMain.selectAll('.col')
			.data(data, getColID)

		cols.enter().append('div')
			.classed('col', true)

		var tile = cols
			.selectAll('.tile-wrapper')
			.data(getNested, getID)

		// tile.order()

		var tileEnter = tile.enter().insert('div', ':first-child')
			.attr('class', 'tile-wrapper')
			.html(getHTML)
			.on('click', tileClicked)

		tileEnter
			.select('.tile')
			.classed('flip-in', true)

		// only start sliding tiles down after the initial load
		if (isInitialized) {
			tileEnter.classed('slide-down', true)
		} else {
			isInitialized = true
		}
		tile.exit().remove()
	}

	var getCol = utils.cycle(numCols)

	// IDs of posts we've seen already
	var seen = []
	var stream = core.passthrough(function (chunk) {
		var colLimit = Math.floor(chunk.length / numCols)
		for (var i = 0, l = chunk.length; i < l; i++) {
			var post = _.defaults(chunk[i], defaults)
			if (seen.indexOf(post.id) === -1) {
				seen.push(post.id)
				var col = getCol()
				data[col].unshift(post)
			}
		}
		// check if the size has changed
		for (var x = data.length; x--;)
			if (data[x].length >= colLimit)
				data[x] = data[x].slice(0, colLimit + 1)
		render()
	})

	stream.clear = function () {
		elMain.selectAll('.col').remove()
		data = d3.range(numCols).map(function () { return [] })
		seen = []
	}

	return stream
}
