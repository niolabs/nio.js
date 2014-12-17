'use strict';

var _ = require('lodash')
var d3 = require('d3')
var Stream = require('../stream')
var world = require('./world')

function Map(opts) {
	Stream.call(this)
	if (_.isString(opts)) {
		this.selector = opts
	} else {
		_.assign(this, opts)
	}

	if (this.defaults)
		_.defaults(this, this.defaults)

	this.mapSvg = null
	this.projection = null
	this.setUp()
}
Map.prototype = Object.create(Stream.prototype, {
	defaults: {
		'static': true,
		value: {
			height: 500,
			width: 960,
			scale: 1000,
			radius: 10, // the base for the dot radius (px)
			radiusScaleExponent: 0.5, // the exponential scaling factor radius size
			animationDuration: 500,
			centerLng: 0,
			centerLat: 0,
			rotateLng: 0,
			rotateLat: 0
		}
	},
	setUp: {
		value: function () {
			this.projection = d3.geo.mercator()
				.scale(this.scale)
				.rotate([this.rotateLng, this.rotateLat])
				.center([this.centerLng, this.centerLat])

			var path = d3.geo.path()
				.projection(this.projection);

			this.mapSvg = d3.select(this.selector).append("svg")
				.attr("width", this.width)
				.attr("height", this.height);

			var g = this.mapSvg.append('g')

			g.insert("path", ".graticule")
				.datum(topojson.feature(world, world.objects.land))
				.attr("class", "land")
				.attr("d", path);

			g.insert("path", ".graticule")
				.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
				.attr("class", "boundary")
				.attr("d", path);

			// Zoom and pan
			var zoom = d3.behavior.zoom()
				.on("zoom", function() {
					g.attr("transform","translate("+ 
						d3.event.translate.join(",")+")scale("+d3.event.scale+")");
				  });

			this.mapSvg.call(zoom)
		}
	},

	drawDots: {
		value: function(data) {
			var me = this
			var dotData = this.mapSvg.select('g')
				.selectAll('circle')
				.data(data, function(d) {return d['city']})

			dotData.enter().append('svg:circle')
				.classed('dots', true)
				.attr('r', 0)
				.attr('cx', function(d) { 
					return me.projection([d['lng'], d['lat']])[0]
				})
				.attr('cy', function(d) { 
					return me.projection([d['lng'], d['lat']])[1]
				})
				
			dotData
				.transition()
				.duration(me.animationDuration)
				.attr('r', function(d) {
					var size = 1
					if ('size' in d) { size = d['size'] }
					return Math.pow(size, me.radiusScaleExponent) * me.radius
				})

			dotData.exit()
				.transition()
				.duration(me.animationDuration)
				.attr('r', 0)
				.remove()
		}
	},

	write: {
		value: function (chunk) {
			// Expecting chunks to look like the following:
			//
			// {
			//	 city: [{
			//	   lat: 39.99999,
			//	   lng: -100.00000,
			//	   size: 2
			//	 }],
			//	 city2: [{
			//	   lat: 35.99999,
			//	   lng: -105.00000,
			//	   size: 1
			//	 }]
			// }
			//
			// Will output the following to send to drawDots:
			//
			// [{
			//	 city: 'city'
			//	 lat: 39.99999,
			//	 lng: -100.00000,
			//	 size: 2
			// },{
			//	 city: 'city2'
			//	 lat: 35.99999,
			//	 lng: -105.00000,
			//	 size: 1
			// }]
			//
			this.drawDots(_.map(chunk, function(geoData, city) {
				return _.assign(geoData[0], {city: city})
			}))
		}
	}
})

module.exports = function (opts) {
	return new Map(opts)
}
