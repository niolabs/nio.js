/* global suite,test,assert,nio */
var _ = nio._

suite('stream.js', function () {

	suite('stream()', function () {

		suite('#constructor()', function () {

			test('should work without "new" operator', function (done) {
				var stream = nio.stream()
				assert.instanceOf(stream, nio.stream)
				done()
			})

			test('should be an event emitter', function (done) {
				var stream = nio.stream()
				assert.instanceOf(stream, nio.utils.EventEmitter)
				done()
			})

			test('should be able to assign onwrite function', function (done) {
				var onwrite = function () {}
				var stream = nio.stream(onwrite)
				assert.equal(stream.onwrite, onwrite)
				done()
			})

			test('should be able to pass an object of properties', function (done) {
				var properties = {
					onwrite: function () {},
					onreset: function () {}
				}
				var stream = nio.stream(properties)
				assert.equal(stream.onwrite, properties.onwrite)
				assert.equal(stream.onreset, properties.onreset)
				done()
			})

		})

		suite('#emit()', function () {

			test('should call onevent functions if they exist', function (done) {
				var tester = 'hello'
				function TestStream() { nio.stream.call(this) }
				nio.utils.inherits(TestStream, nio.stream)
				TestStream.prototype.oninit = function () { tester = 'world' }
				new TestStream()
				assert.equal(tester, 'world')
				done()
			})

		})

		suite('#push()', function () {

			test('should emit "data" event on chunk', function (done) {
				var stream = nio.stream()
				stream.ondata = function (data) {
					assert.equal(data, 'hello')
					done()
				}
				stream.push('hello')
			})

			test('should not emit an event if chunk is undefined', function (done) {
				var stream = nio.stream()
				stream.ondata = function (data) {
					assert.fail(data, undefined, 'should not have reached here')
				}
				stream.push(null)
				setTimeout(done, 50)
			})

		})

		suite('#write()', function () {

			test('should call #onwrite()', function (done) {
				var stream = nio.stream(done)
				stream.write()
			})

			test('should pass chunks #onwrite()', function (done) {
				var stream = nio.stream(function (chunk) {
					assert.equal(chunk, 'hello')
				})
				stream.write('hello')
				done()
			})

			test('should not fail if #onwrite() is undefined', function (done) {
				var stream = nio.stream()
				stream.onwrite = null
				assert.doesNotThrow(stream.write)
				done()
			})

			test('should pass chunks through by default', function (done) {
				var stream = nio.stream()
				var tester = null
				stream.onwrite = function (data) { tester = data }
				stream.write('hello')
				assert.equal(tester, 'hello')
				done()
			})

		})

		suite('#pipe()', function () {

			test('should pipe streams together', function (done) {
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

		suite('#broadcast()', function () {

			test('should emit events for all streams in a pipeline', function (done) {
				var counter = 0
				var increment = function () { counter++ }
				var stream1 = nio.stream()
				var stream2 = nio.stream()
				var stream3 = nio.stream()
				stream1.pipe(stream2, stream3)
				stream1.ontesting = increment
				stream2.ontesting = increment
				stream3.ontesting = increment
				stream1.broadcast('testing')
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
				stream1.ontesting = increment
				stream2.ontesting = increment
				stream3.ontesting = increment
				stream1.broadcast('testing', 5)
				assert.equal(counter, 15)
				done()
			})

			test('should call broadcasting functions', function (done) {
				var counter = 0
				var increment = function (data) { counter += data }
				var stream1 = nio.stream()
				var stream2 = nio.stream()
				var stream3 = nio.stream()
				stream1.pipe(stream2, stream3)
				stream1.ontesting = increment
				stream2.ontesting = increment
				stream3.ontesting = increment
				stream1.broadcast('testing', 5)
				assert.equal(counter, 15)
				done()
			})

			test('should call broadcasting functions with arguments', function (done) {
				var counter = 0
				var increment = function (data) { counter += data }
				var stream1 = nio.stream()
				var stream2 = nio.stream()
				var stream3 = nio.stream()
				stream1.pipe(stream2, stream3)
				stream1.ontesting = increment
				stream2.ontesting = increment
				stream3.ontesting = increment
				stream1.broadcast('testing', 5)
				assert.equal(counter, 15)
				done()
			})

			test('should call on(event) functions', function (done) {
				var counter = 0
				var increment = function () { counter++ }
				var stream1 = nio.stream()
				var stream2 = nio.stream()
				var stream3 = nio.stream()
				stream1.pipe(stream2, stream3)
				stream1.ontesting = increment
				stream2.ontesting = increment
				stream3.ontesting = increment
				stream1.broadcast('testing')
				assert.equal(counter, 3)
				done()
			})

			test('should call on(event) functions with arguments', function (done) {
				var counter = 0
				var increment = function (data) { counter += data }
				var stream1 = nio.stream()
				var stream2 = nio.stream()
				var stream3 = nio.stream()
				stream1.pipe(stream2, stream3)
				stream1.ontesting = increment
				stream2.ontesting = increment
				stream3.ontesting = increment
				stream1.broadcast('testing', 5)
				assert.equal(counter, 15)
				done()
			})

		})

		suite('#reset()', function () {

		})

		_.each(nio.stream.STATES, function (value, name) {
			var nameLower = name.toLowerCase()

			suite('#' + nameLower + '()', function () {

				test('should change the state', function (done) {
					var stream = nio.stream()
					stream[nameLower]()
					assert.equal(stream.state, value)
					done()
				})

				test('should change the state of child streams', function (done) {
					var stream1 = nio.stream()
					var stream2 = nio.stream()
					var stream3 = nio.stream()
					stream1.pipe(stream2, stream3)
					stream1[nameLower]()
					assert.equal(stream1.state, value)
					assert.equal(stream2.state, value)
					assert.equal(stream3.state, value)
					done()
				})

				// the next function only applies to nio.stream.STATES.PAUSE
				if (name !== 'PAUSE') return

				test('should prevent chunks from passing through', function (done) {
					var stream1 = nio.stream()
					var stream2 = nio.stream()
					var stream3 = nio.stream(function () {
						assert.fail(null, null, 'pushed chunk through')
					})
					stream1.pipe(stream2, stream3)
					stream1[nameLower]()
					stream1.push('hello')
					setTimeout(done(), 20)
				})

			})

		})

	})

})
