var nio = require('./api'),
    service = require('./service'),
    block = require('./block')

exports.instance = function(ip, opts) {
    var header = "Basic " + btoa(opts.user + ":" + opts.pass),
	instance = new Instance()
	
    instance.setInstance(ip, header)
    return instance
}

function Instance() {
    nio.API.call(this)
}
Instance.prototype = Object.create(nio.API.prototype, {
    service: {
	value: function(serviceName) {
	    var child = this.getChild(service.Service)
	    child.makeRequest('services/' + serviceName)
	    return child
	}
    },

    services: {
	value: function() {
	    var child = this.getChild(service.Collection)
	    child.makeRequest('services')
	    return child
	}
    },

    serviceStatus: {
	value: function(serviceName, status) {
		if (status) {
			// they are setting a status
			var child = this.getChild(service.Status)
			child.makeRequest('services/' + serviceName + '/' + status)
			return child
		} else {
			// they are getting a status
			var child = this.getChild(service.Service)
			child.makeRequest('services/' + serviceName + '/status')
			return child
		}
	}
    },

    blockUpdate: {
	value: function(blockName, blockParams) {
	    var child = this.getChild(block.Updater)
	    child.makeRequest('blocks/' + blockName, 'PUT', JSON.stringify(blockParams))
	    return child
	}
    }, 

    block: {
	value: function(blockName) {
	    var child = this.getChild(block.Block)
	    child.makeRequest('blocks/' + blockName)
	    return child
	}
    },
})
