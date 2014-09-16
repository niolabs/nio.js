nio.models.Post = Backbone.Model.extend({

	initialize: function(args) {
		args = args || {};

		if (args.id) {
			if (args.profile_image_url) {
				// check the img load
				// this.testImage(args.profile_image_url);
			} else {
				// console.log('type: ', args.type);
				switch (args.type) {
					case 'twitter-photo':
					case 'instagram':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-instagram.png');
					break;
					case 'facebook':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-facebook.png');
					break;
					case 'twitter':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-twitter.png');
					break;
					// default:
						// this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default.png');
				}
			}
		}

		var shortenedTextLength = 145;
		var shortenedText = this.get('text').substr(0, shortenedTextLength);
		if (shortenedText !== this.get('text')) {
			shortenedText = shortenedText.substr(0, Math.min(shortenedText.length, shortenedText.lastIndexOf(" ")));
			shortenedText += '&hellip; (more)';
		}
		this.set('shortenedText', shortenedText);
	},

	defaults: {
		id                : 0,
		id_value          : 1,
		time              : 0,
		priority          : 1,
		type              : 'blank',
		name              : '',
		link              : '',
		text              : '',
		alt_text          : '',
		media_url         : '',
		profile_image_url : '',
		flag              : 'old',
		status_flag       : '',
		seconds_ago       : 360000
	},

	testImage: function(url) {
		var self = this;
		var img = new Image();
		img.onload = function() {
			self.set('profile_image_url', url);
		};
		img.onerror = function() {
			switch (self.get('type')) {
				case 'twitter-photo':
				case 'instagram':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-instagram.png');
				break;
				case 'facebook':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-facebook.png');
				break;
				case 'twitter':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-twitter.png');
				break;
				default:
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default.png');
			}
		};
		img.src = url;
	}

});

nio.collections.Posts = Backbone.Collection.extend({

	model: nio.models.Post,

});

nio.models.PostDictionary = Backbone.Model.extend({

	initialize: function(serviceHost) {
		this.posts = new nio.collections.Posts();
		this.serviceHost = serviceHost
	},

	url: function() {
		return 'http://' + this.serviceHost + '/posts';
		// return 'http://127.0.0.1:8123/posts';
	},

	defaults: {
		count: 0,
		offset: 0,
		next_offset: 0,
		total: 0,
		posts: new nio.collections.Posts()
	}

});

