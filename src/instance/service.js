var nio = require('./api')

exports.Service = Service
exports.Collection = ServiceCollection
exports.Status = ServiceStatus

function Service() {
    nio.API.call(this)
}
Service.prototype = Object.create(nio.API.prototype, {})

function ServiceCollection() {
    nio.API.call(this)
}
ServiceCollection.prototype = Object.create(nio.API.prototype, {})

function ServiceStatus() {
    nio.API.call(this)
}
ServiceStatus.prototype = Object.create(nio.API.prototype, {})
