var nio = require('./api'),
    service = require('./service')

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
	    var child = this.getChild(service.Status)
	    child.makeRequest('services/' + serviceName + '/' + status)
	    return child
	}
    }
})
