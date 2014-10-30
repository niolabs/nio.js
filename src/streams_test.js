/* global suite,test,assert,nio */
'use strict';

suite('func()', function () {

	test('should push whatever is returned', function (done) {
		var fn = function (chunk) { return chunk.toUpperCase() }
		var stream = nio.stream()
		stream
			.pipe(nio.func(fn))
			.pipe(nio.stream(function (chunk) {
				assert.equal(chunk, 'HELLO')
				done()
			}))
		stream.push('hello')
	})

})

suite('pass()', function () {

	test('should let chunks pass through it', function (done) {
		var stream = nio.stream()
		stream
			.pipe(nio.pass(function (chunk) {
				assert.equal(chunk, 'hello')
			}))
			.pipe(nio.pass(function (chunk) {
				assert.equal(chunk, 'hello')
				done()
			}))
		stream.push('hello')
	})

})

suite('times()', function () {

	test('should block stream after max is reached', function (done) {
		var count = 0
		var max = 5
		var stream = nio.stream()
		stream
			.pipe(nio.times(max))
			.pipe(nio.pass(function () { count++ }))
		for (var i = max * 3; i--;)
			stream.push('hello')
		assert.equal(count, max)
		done()
	})

})

suite('once()', function () {

	test('should block stream after one chunk', function (done) {
		var count = 0
		var stream = nio.stream()
		stream
			.pipe(nio.once())
			.pipe(nio.pass(function () { count++ }))
		for (var i = 5; i--;)
			stream.push('hello')
		assert.equal(count, 1)
		done()
	})

})

suite('set()', function () {

	[
		{
			name: 'should be able to reassign property names',
			value: 'bar',
			expected: 'bar'
		}, {
			name: 'should be able to reassign property names with functions',
			value: function (d) { return d.hello },
			expected: 'world'
		}
	].forEach(function (opts) {
		test(opts.name, function (done) {
			nio.generate({hello: 'world'}, 1)
				.pipe(nio.once())
				.pipe(nio.set({foo: opts.value}))
				.pipe(nio.stream(function (data) {
					assert.propertyVal(data, 'foo', opts.expected)
					done()
				}))
		})
	})

})

suite('collect()', function () {

	test('should put chunks into an array', function (done) {
		nio.generate(null, 1)
			.pipe(nio.collect())
			.pipe(nio.once())
			.pipe(nio.stream(function (chunk) {
				assert.instanceOf(chunk, Array)
				done()
			}))
	})

	test('should obey size', function (done) {
		var size = 5
		nio.generate(null, 1)
			.pipe(nio.collect({size: size}))
			.pipe(nio.wait(150))
			.pipe(nio.once())
			.pipe(nio.stream(function (chunk) {
				assert.lengthOf(chunk, size)
				done()
			}))
	})

	test('should be able to sort with a size', function (done) {
		var size = 10
		nio.generate(function () {return Math.floor(Math.random() * 100 / 1)}, 1)
			.pipe(nio.collect({size: size, sort: true}))
			.pipe(nio.wait(150))
			.pipe(nio.once())
			.pipe(nio.stream(function (chunk) {
				assert.lengthOf(chunk, size)
				done()
			}))
	});

	[
		{
			name: 'should be able to sort by value w/ boolean',
			sort: true,
			generate: function () {return Math.floor(Math.random() * 100 / 1)}
		}, {
			name: 'should be able to sort by property w/ string',
			sort: 'value',
			generate: function () {return {value: Math.floor(Math.random() * 100 / 1)}}
		}, {
			name: 'should be able to sort by property w/ function',
			sort: function (d) {return d.value},
			generate: function () {return {value: Math.floor(Math.random() * 100 / 1)}}
		}
	].forEach(function (opts) {
		test(opts.name, function (done) {
			var size = 10
			var collect = nio.collect({size: size, sort: opts.sort})
			var getVal = collect.sort()
			var cmpFn = function (a, b) {return getVal(a) >= getVal(b)}
			nio.generate(opts.generate, 1)
				.pipe(collect)
				.pipe(nio.wait(150))
				.pipe(nio.once())
				.pipe(nio.stream(function (chunk) {
					assert.lengthOf(chunk, size)
					var l = chunk.length - 1
					var i = 0
					while (i < l) {
						var a = chunk[i]
						var b = chunk[i + 1]
						assert.isTrue(cmpFn(a, b), getVal(a) + ' is less than ' + (getVal(b)))
						i++
					}
					done()
				}))
		})
	})
})

suite('changed()', function () {

	[
		{
			name: 'should only push new chunks',
			values: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
			count: 4
		}, {
			name: 'should work with objects',
			values: [{foo: 'bar'}, {foo: 'bar'}, {hello: 'world'}, {foo: 'bar'}],
			count: 3
		}, {
			name: 'should work with arrays of objects',
			values: [
				[{test: 1}, {test: 2}],
				[{test: 1}, {test: 2}, {test: 3}],
				[{test: 1}, {test: 2}, {test: 3}],
				[{test: 1}, {test: 2}, {test: 3}, {test: 4}],
				[{test: 4}, {test: 3}, {test: 2}, {test: 1}]
			],
			count: 4
		}
	].forEach(function (opts) {
		test(opts.name, function (done) {
			var count = 0
			var stream = nio.stream()
			stream
				.pipe(nio.changed())
				.pipe(nio.stream(function (chunk, previous) {
					assert.notDeepEqual(chunk, previous)
					count++
				}))
			opts.values.forEach(function (value) {
				stream.push(value)
			})
			setTimeout(function () {
				assert.equal(count, opts.count)
				done()
			}, 50)
		})
	})

})
