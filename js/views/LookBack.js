nio.views.LookBack = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this);
		var self = this;

		this.contentModel = nio.models.Post;

		this.initializeTiles(args);
	},

	initializeTiles: function(args) {
		args = args || {};
		var self = this;
			numTiles = args.numTiles || 16,
			maxDate = args.maxDate || moment().utc(),
			daysLookBack = args.daysLookBack || 1;

		this.tiles = [];
		this.numTiles = numTiles;
		this.maxDate = maxDate;
        this.minDate = moment(maxDate).subtract('days', daysLookBack);

		this.xhr = this.model.fetch({
			data: {
				limit: this.numTiles,
				minDate: this.minDate.format('YYYY-MM-DD HH:mm:ss'),
				maxDate: this.maxDate.format('YYYY-MM-DD HH:mm:ss'),
				order: 'random'
			}
		});
		this.xhr.done(self.populateTiles);

	},

	events: {},

	populateTiles: function(oResponse) {

		var self = this;

		jQuery('.body', this.$el).html(''); // clear current tiles

		var posts = oResponse.posts;

		if (posts.length == 0) {
			$('.body', this.$el).append([
				'<div class="no-results">',
				'    No results found',
				'</div>'
			].join('\n'));
			return;
		}

		_.each(posts, function(post, index) {

			var tile = nio.utils.generateTile(this, {}, post);

			$('.body', self.$el).append(tile.el);

		});

		// console.log('CUSearch tiles:', this.tiles);
	}

});
