/* global suite,test,assert,nio */
suite('models.js', function () {

	suite('Model()', function () {

		suite('#constructor()', function () {

			test('should be able to create without args', function (done) {
				assert.doesNotThrow(nio.model)
				done()
			})

			test('should assign properties passed to it', function (done) {
				var model = nio.model({hello: 'world'})
				assert.propertyVal(model, 'hello', 'world')
				done()
			})

			test('should assign defaults if they are defined', function (done) {
				function TestModel() {nio.model.call(this)}
				nio.utils.inherits(TestModel, nio.model)
				TestModel.prototype.DEFAULTS = {hello: 'world'}
				var model = new TestModel()
				assert.propertyVal(model, 'hello', 'world')
				done()
			})

		})

	})

})
