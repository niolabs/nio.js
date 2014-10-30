/* global suite,test,assert,nio */
suite('posts/index.js', function () {

	test('should have expected modules', function (done) {
		assert.instanceOf(nio.posts, Function)
		var expected = [
			'tiles',
			'Post',
			'post'
		]
		expected.forEach(function (name) {
			assert.property(nio.posts, name)
		})
		done()
	})

	suite('Post()', function () {

		suite('#contructor()', function () {

			test('should have default values', function (done) {
				var post = nio.posts.post()
				assert.property(post, 'type')
				assert.property(post, 'typeDisplay')
				assert.property(post, 'author')
				assert.property(post, 'authorLink')
				assert.property(post, 'link')
				done()
			})

		})

	})

})
