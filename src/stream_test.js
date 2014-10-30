/* global suite,test,assert,nio */
'use strict';

suite('stream()', function () {

	suite('#constructor()', function () {

		test('should work without "new" operator', function (done) {
			var stream = nio.stream()
			assert.instanceOf(stream, nio.stream)
			done()
		})

		test('should be an event emitter', function (done) {
			var stream = nio.stream()
			assert.instanceOf(stream, nio.events.EventEmitter)
			done()
		})

		test('should be able to assign _write function', function (done) {
			var _write = function () {}
			var stream = nio.stream(_write)
			assert.equal(stream._write, _write)
			done()
		})

		test('should call this._init if it exists', function (done) {
			var tester = 'hello'
			function TestStream() { nio.stream.call(this) }
			nio.utils.inherits(TestStream, nio.stream)
			TestStream.prototype._init = function () { tester = 'world' }
			new TestStream()
			assert.equal(tester, 'world')
			done()
		})

	})

	suite('#push()', function () {

		test('should emit "data" event on chunk', function (done) {
			var stream = nio.stream()
			stream.on('data', function (data) {
				assert.equal(data, 'hello')
				done()
			})
			stream.push('hello')
		})

		test('should not emit an event if chunk is undefined', function (done) {
			var stream = nio.stream()
			stream.on('data', function (data) {
				assert.fail(data, undefined, 'should not have reached here')
			})
			stream.push(null)
			setTimeout(done, 50)
		})

	})

	suite('#write()', function () {

		test('should call #_write()', function (done) {
			var stream = nio.stream(done)
			stream.write()
		})

		test('should pass chunks #_write()', function (done) {
			var stream = nio.stream(function (chunk) {
				assert.equal(chunk, 'hello')
			})
			stream.write('hello')
			done()
		})

		test('should not fail if #_write() is undefined', function (done) {
			var stream = nio.stream()
			stream._write = null
			assert.doesNotThrow(stream.write)
			done()
		})

		test('should pass chunks through by default', function (done) {
			var stream = nio.stream()
			var tester = null
			stream.on('data', function (data) {
				tester = data
			})
			stream.write('hello')
			assert.equal(tester, 'hello')
			done()
		})

	})

	suite('#pipe()', function () {

		test('should pipe streams together', function (done) {
			var tester = null
			var stream1 = nio.stream()
			var stream2 = nio.stream(function (chunk) {
				tester = chunk
			})
			stream1.pipe(stream2)
			stream1.push('hello')
			assert.equal(tester, 'hello')
			done()
		})

		test('should be able to pass multiple arguments', function (done) {
			var tester = null
			var stream1 = nio.stream()
			var stream2 = nio.stream()
			var stream3 = nio.stream(function (chunk) {
				tester = chunk
			})
			stream1.pipe(stream2, stream3)
			stream1.push('hello')
			assert.equal(tester, 'hello')
			done()
		})

		test('should be able to pass an array of streams', function (done) {
			var tester = null
			var stream1 = nio.stream()
			var stream2 = nio.stream()
			var stream3 = nio.stream(function (chunk) {
				tester = chunk
			})
			stream1.pipe([stream2, stream3])
			stream1.push('hello')
			assert.equal(tester, 'hello')
			done()
		})

	})

	suite('#propogate()', function () {

		test('should emit events for all streams in a pipeline', function (done) {
			var counter = 0
			var increment = function () { counter++ }
			var stream1 = nio.stream()
			var stream2 = nio.stream()
			var stream3 = nio.stream()
			stream1.pipe(stream2, stream3)
			stream1.on('testing', increment)
			stream2.on('testing', increment)
			stream3.on('testing', increment)
			stream1.propogate('testing')
			assert.equal(counter, 3)
			done()
		})

		test('should be able to pass arbitrary data', function (done) {
			var counter = 0
			var increment = function (data) { counter += data }
			var stream1 = nio.stream()
			var stream2 = nio.stream()
			var stream3 = nio.stream()
			stream1.pipe(stream2, stream3)
			stream1.on('testing', increment)
			stream2.on('testing', increment)
			stream3.on('testing', increment)
			stream1.propogate('testing', 5)
			assert.equal(counter, 15)
			done()
		})

		test('should call underscored functions', function (done) {
			var counter = 0
			var increment = function () { counter++ }
			var stream1 = nio.stream()
			var stream2 = nio.stream()
			var stream3 = nio.stream()
			stream1.pipe(stream2, stream3)
			stream1._testing = increment
			stream2._testing = increment
			stream3._testing = increment
			stream1.propogate('testing')
			assert.equal(counter, 3)
			done()
		})

		test('should have native propogating functions', function (done) {
			var counter = 0
			var increment = function () { counter++ }
			var stream1 = nio.stream()
			var stream2 = nio.stream()
			var stream3 = nio.stream()
			stream1.pipe(stream2, stream3)
			nio.stream.NATIVE_PROPOGATING.forEach(function (name) {
				var _name = '_' + name
				stream1[_name] = increment
				stream2[_name] = increment
				stream3[_name] = increment
				stream1.propogate(name)
			})
			assert.equal(counter, nio.stream.NATIVE_PROPOGATING.length * 3)
			done()
		})

	})

})
