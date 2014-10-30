'use strict'

var Stream = require('../stream')

function nioAPI() {
    Stream.call(this)
}
nioAPI.prototype = Object.create(Stream.prototype, {
    makeRequest : {
	value: function(endpoint, method, postData) {
		var xhr = d3.json('http://' + this.ip + '/' + endpoint)
			.header("Authorization", this.authHeader)

		if (typeof method === 'undefined') {
		method = 'GET'
		}

		// They want a post request
		xhr.send(method, postData, function(err, data) {
		this.push(data)
		}.bind(this))
	}
    },

    setInstance: {
	value: function(ip, authHeader) {
		this.ip = ip
		this.authHeader = authHeader
	}
    },

    getChild: {
	value: function(type) {
		var newType = new type()
		newType.setInstance(this.ip, this.authHeader)
		return newType
	}
    }
})
exports.API = nioAPI
