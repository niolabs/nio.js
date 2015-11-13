/* jshint jasmine: true */
describe("nio.streams", function() {

	var nio = require('../src/index');

	beforeEach(function() {
		// Set up a sample stream for the tests to use
		this.stream = nio.Stream();
	});

	describe("pass()", function() {

		it("should call before emitting", function(done) {
			var firstPassCalled = false;
			var secondPassCalled = false;

			this.stream.pipe(nio.pass(function(d) {
				firstPassCalled = true;
				expect(secondPassCalled).toBe(false);
			})).pipe(nio.pass(function(d) {
				secondPassCalled = true;
				expect(firstPassCalled).toBe(true);
			})).pipe(nio.pass(function() {
				// Before we call our test done, make sure the other two
				// pass functions have been called
				// This ensures we don't roll up our pass functions from the
				// bottom
				expect(firstPassCalled).toBe(true);
				expect(secondPassCalled).toBe(true);
				done();
			}));

			this.stream.push({ num: 1 });

		});

		it("should not pass changed data", function(done) {
			this.stream.pipe(nio.pass(function(d) {
				// Changing data in this pass should not affect the next one
				d.num += 5;
				expect(d.num).toBe(6);
			})).pipe(nio.pass(function(d) {
				// Make sure we got the original data
				expect(d.num).toBe(1);
			})).pipe(nio.pass(done));

			this.stream.push({ num: 1 });
		});

		it("should not pass returned data", function(done) {
			this.stream.pipe(nio.pass(function(d) {
				// Returning data from this pass should not pass it to the next one
				d.num += 5;
				expect(d.num).toBe(6);
				return d;
			})).pipe(nio.pass(function(d) {
				// Make sure we got the original data
				expect(d.num).toBe(1);
			})).pipe(nio.pass(done));

			this.stream.push({ num: 1 });
		});
	});

	describe("func()", function() {

		it("should call before emitting", function(done) {
			var firstFuncCalled = false;
			var secondFuncCalled = false;

			this.stream.pipe(nio.func(function(d) {
				firstFuncCalled = true;
				expect(secondFuncCalled).toBe(false);
				return d;
			})).pipe(nio.func(function(d) {
				secondFuncCalled = true;
				expect(firstFuncCalled).toBe(true);
				return d;
			})).pipe(nio.func(function() {
				// Before we call our test done, make sure the other two
				// func functions have been called
				// This ensures we don't roll up our func functions from the
				// bottom
				expect(firstFuncCalled).toBe(true);
				expect(secondFuncCalled).toBe(true);
				done();
			}));

			this.stream.push({ num: 1 });

		});

		it("should pass returned data", function(done) {
			this.stream.pipe(nio.func(function(d) {
				// Returning data from this function should make it to the next one
				d.num += 5;
				expect(d.num).toBe(6);
				return d;
			})).pipe(nio.pass(function(d) {
				// Make sure we got the new data
				expect(d.num).toBe(6);
			})).pipe(nio.pass(done));

			this.stream.push({ num: 1 });
		});

		it("should not continue if nothing returned", function(done) {
			this.stream.pipe(nio.func(function(d) {
				// does not return anything
			})).pipe(nio.pass(function() {
				// if we get here, let's fail
				fail('Should not continue stream if nothing returned');
			}));

			// give our test a little while to run before calling it done
			this.stream.pipe(nio.pass(function() {
				setTimeout(done, 200);
			}));

			this.stream.push({ num: 1 });
		});

		it("should not continue if empty returned", function(done) {
			this.stream.pipe(nio.func(function(d) {
				// return without a value
				return;
			})).pipe(nio.pass(function() {
				// if we get here, let's fail
				fail('Should not continue stream if empty returned');
			}));

			// give our test a little while to run before calling it done
			this.stream.pipe(nio.pass(function() {
				setTimeout(done, 200);
			}));

			this.stream.push({ num: 1 });
		});

		it("should continue if falsey returned", function(done) {
			this.stream.pipe(nio.func(function(d) {
				// return a falsey value
				return false;
			})).pipe(nio.pass(function(d) {
				// we expect to get the falsey value here
				expect(d).toBe(false);
				done();
			}));

			this.stream.push({ num: 1 });
		});
	});
});
