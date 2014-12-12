'use strict';

var _ = require('lodash')
var d3 = require('d3')
var Stream = require('../stream')
var us = require('./us_states')

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
			radius: 10 // the base for the dot radius (px)
		}
	},
	setUp: {
		value: function () {
			this.projection = d3.geo.albersUsa()
				.scale(this.scale)
				.translate([this.width / 2, this.height / 2]);

			var path = d3.geo.path()
				.projection(this.projection);

			this.mapSvg = d3.select(this.selector).append("svg")
				.attr("width", this.width)
				.attr("height", this.height);

		  this.mapSvg.insert("path", ".graticule")
			  .datum(topojson.feature(us, us.objects.land))
			  .attr("class", "land")
			  .attr("d", path);

		  this.mapSvg.insert("path", ".graticule")
			  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
			  .attr("class", "state-boundary")
			  .attr("d", path);
		}
	},

	drawDots: {
		value: function(data) {
			var me = this
			var dotData = this.mapSvg
				.selectAll('circle')
				.data(data, function(d) {return d['city']})

			dotData.enter().append('svg:circle')
				.classed('dots', true)
				
			dotData
				.attr('r', function(d) { return d['size'] * me.radius})
				.attr('cx', function(d) { 
					return me.projection([d['lng'], d['lat']])[0]
				})
				.attr('cy', function(d) { 
					return me.projection([d['lng'], d['lat']])[1]
				})

			dotData.exit().remove()
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
