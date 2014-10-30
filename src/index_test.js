/* global suite,test,assert,nio */
suite('index.js', function () {

	test('should have expected modules', function (done) {
		var expected = [
			'd3',
			'_',
			'stream',
			'utils',
			'posts',
			'graphs',
			'instance',
			'model',
			'json', // look for sources
			'pass' // look for streams
		]
		expected.forEach(function (name) {
			assert.property(nio, name)
		})
		done()
	})

})
