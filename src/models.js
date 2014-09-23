function Post(opts) {
	_.assign(this, Post.defaults, opts)
}

Post.prototype.getID = function () {
	return this.id
}

Post.defaults = {
	profile_image_url: null,
	media_url: null
}

module.exports = {
	Post: Post,
}
