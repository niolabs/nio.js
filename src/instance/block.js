var nio = require('./api')

exports.Updater = Updater

function Updater() {
    nio.API.call(this)
}
Updater.prototype = Object.create(nio.API.prototype, {})
