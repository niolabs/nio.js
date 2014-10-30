/* global suite,test,assert,nio */
suite('utils.js', function () {

	suite('argsOrArray()', function () {

		test('should convert an array to arguments', function (done) {
			var fn = nio.utils.argsOrArray(function () {
				assert.lengthOf(arguments, 3)
				done()
			})
			fn([1, 2, 3])
		})

		test('should accept multiple arguments', function (done) {
			var fn = nio.utils.argsOrArray(function () {
				assert.lengthOf(arguments, 3)
				done()
			})
			fn(1, 2, 3)
		})

	})

	suite('cycle()', function () {

		test('should cycle through numbers', function (done) {
			var fn = nio.utils.cycle(3)
			assert.equal(fn(), 1)
			assert.equal(fn(), 2)
			assert.equal(fn(), 3)
			assert.equal(fn(), 1)
			done()
		})

		test('should cycle through an array', function (done) {
			var fn = nio.utils.cycle(['one', 'two', 'three'])
			assert.equal(fn(), 'one')
			assert.equal(fn(), 'two')
			assert.equal(fn(), 'three')
			assert.equal(fn(), 'one')
			done()
		})

	})

	suite('truncate()', function () {

		var text = 'The quick brown fox jumps over the lazy dog'

		test('should cut off a long line', function (done) {
			var len = Math.floor(text.length / 2)
			var result = nio.utils.truncate(text, len)
			assert.lengthOf(result, len)
			done()
		})

		test('should add an ellipsis to long lines', function (done) {
			var result = nio.utils.truncate(text, text.length / 2)
			var end = result.substring(result.length - 3)
			assert.equal(end, '...')
			done()
		})

		test('should leave short lines alone', function (done) {
			var result = nio.utils.truncate(text, text.length * 2)
			assert.lengthOf(result, text.length)

			var end = result.substring(text.length - 3)
			assert.notEqual(end, '...')

			done()
		})

	})

	suite('choose()', function () {

		test('should pick a random item in an array', function (done) {
			var values = ['one', 'two', 'three', 'four']
			assert.include(values, nio.utils.choose(values))
			assert.include(values, nio.utils.choose(values))
			assert.include(values, nio.utils.choose(values))
			done()
		})

	})

})
