/* global suite,test,assert,nio */
'use strict';

suite('generate()', function () {

	[
		{
			name: 'should push a default message',
			expected: 'Hello world'
		}, {
			name: 'should be able to customize messages',
			msg: 'Testing',
			expected: 'Testing'
		}, {
			name: 'should send arbitrary objects',
			msg: {hello: 'world'},
			expected: {hello: 'world'}
		}, {
			name: 'should run functions',
			msg: function () { return 'Excellent' },
			expected: 'Excellent'
		}
	].forEach(function (opts) {
		test(opts.name, function (done) {
			nio.generate(opts.msg, 1)
				.pipe(nio.once())
				.pipe(nio.stream(function (chunk) {
					assert.deepEqual(chunk, opts.expected)
					done()
				}))
		})
	})

})
