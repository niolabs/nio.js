'use strict'

var nio = require('./api')

exports.Block = Block
exports.Updater = Updater

function Block() {
    nio.API.call(this)
}
Block.prototype = Object.create(nio.API.prototype, {})

function Updater() {
    nio.API.call(this)
}
Updater.prototype = Object.create(nio.API.prototype, {})
