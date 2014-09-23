/// <reference path="../typings/lodash/lodash.d.ts" />

var Post = (function () {
    function Post(opts) {
        this.name = null;
        this.text = null;
        this.type = null;
        this.id = null;
        this.link = null;
        this.time = null;
        this.alt_text = null;
        this.priority = "0";
        this.sensitive = false;
        this.profile_image_url = null;
        this.media_url = null;
        _.assign(this, opts);
    }
    Post.prototype.getID = function () {
        return this.id;
    };
    return Post;
})();
exports.Post = Post;
