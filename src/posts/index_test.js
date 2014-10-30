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

	suite('isMatch()', function () {

		test('should filter by types', function (done) {
			var post = nio.model.generate(nio.posts.post, {type: 'testing'})
			assert.isFalse(nio.posts.isMatch(post, {types: ['twitter']}))
			assert.isTrue(nio.posts.isMatch(post, {types: ['testing']}))
			done()
		})

		test('should filter by names', function (done) {
			var post = nio.model.generate(nio.posts.post, {name: 'testing'})
			assert.isFalse(nio.posts.isMatch(post, {names: ['twitter']}))
			assert.isTrue(nio.posts.isMatch(post, {names: ['testing']}))
			done()
		})

		test('should filter by search', function (done) {
			var post = nio.model.generate(nio.posts.post, {text: 'testing'})
			assert.isFalse(nio.posts.isMatch(post, {search: 'twitter'}))
			assert.isTrue(nio.posts.isMatch(post, {search: 'testing'}))
			done()
		})

		test('should convert some fields to arrays to avoid partial matches', function (done) {
			var post = nio.model.generate(nio.posts.post, {type: 'twitter'})
			assert.isFalse(nio.posts.isMatch(post, {types: 'twitter-photo,instagram'}))
			assert.isTrue(nio.posts.isMatch(post, {types: 'twitter,rss'}))
			done()
		})

	})

})
