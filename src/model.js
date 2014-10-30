var _ = require('lodash')

/**
 * Model reperesents an object that could theoretically be persisted to a DB.
 *
 * @constructor
 * @param {object} opts properties to set on the model.
 */
function Model(opts) {
	if (!(this instanceof Model))
		return new Model(opts)
	if (!opts)
		opts = {}
	if (this.DEFAULTS)
		_.defaults(opts, this.DEFAULTS)
	_.assign(this, opts)
}

// TODO
Model.prototype.validate = function () {}

/**
 * generate creates a mock object based on a classes CHOICES definition.
 * Useful for testing/debugging.
 *
 * @param {function} Cls
 * @param {object} opts
 * @return {Model}
 */
exports.generate = function (Cls, opts) {
	if (!Cls.CHOICES)
		console.warn('generate() called on a model without CHOICES')
	_.each(Cls.CHOICES, function (key, values) {
		if (key in opts) return
		opts[key] = exports.choose(values)
	})
	return new (Cls)(opts)
}

module.exports = Model
