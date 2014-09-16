nio.views.Stream = Backbone.View.extend({

	// tagName: 'div',
	// className: 'nio-stream js-packery entry-content clearfix',
	// id: 'nio_stream_div',
	// attributes: {
		// 'data-packery-options' : '{"itemSelector":".tile"}'
	// },
	initialize: function(args) {
		_.bindAll(this);

		this.types = [];
		this.names = [];
		this.socketHost = args.socketHost
		this.serviceHost = args.serviceHost
		this.model = new nio.models.PostDictionary(this.serviceHost)

		this.contentModel = nio.models.Post;

		this.renderTiles(args);
	},

	renderTiles: function(args) {
		args = args || {};
		args.types = args.types || this.types || [];
		args.names = args.names || this.names || [];

		// console.log('renderTiles args: ', args);

		this.types = _.compact(args.types);
		this.names = _.compact(args.names);

		this.latestTime = moment(0);
		this.tileCount = 0;
		this.$el.html('');
		this.tiles = [];
		this.tileCount = this.getNumRows() * this.getNumCols();

		this.initializeTiles(args);
	},

	setupSocket: function() {
		// Connect to the socket.  Force a new connection only if
		// there's not an existing connection.
		// console.log(bNewConnection, App.sockets);
		if (!this.ws)
			this.ws = nio.utils.connectToWebSocket(this.socketHost, 'default');
		this.ws.on('recvData', this.handleMsg);
		this.ws.socket.on('error', this.showFetchError);
		this.ws.socket.on('connect_failed', this.showFetchError);
	},

	killEvents: function() {
		//TODO: this interval only needs to be cleared in the SearchStream.
		window.clearInterval(this.interval)
		this.ws.removeAllListeners('recvData')
	},

	getNumRows: function() {
		/** Returns the number of rows based on the available space **/
		//TODO: revert this
		//var height = jQuery('.main-content-wrap').height();
		//var numRows = Math.ceil(height/App.settings.tileHeight);
		//return Math.min(11, numRows);
		return 5
	},

	getNumCols: function() {
		/** Returns the number of columns for tiles based on the available space **/
		//TODO: revert this
		console.log(this.$el.width())
		//var width = this.$el.width();
		//var numCols = Math.floor(width/App.settings.tileWidth);
		//return numCols;
		return 3
	},

	fetchTiles: function(args) {
		var self  = this;

		args.names = args.names.join(',');
		args.types = args.types.join(',');

		if (this.postXHR) {
			this.postXHR.abort();
		}
		this.postXHR = this.model.fetch({
			data: _.extend(args, {limit: this.tileCount})
		});
		this.postXHR
			.done(this.populateSearchTiles)
			.fail(this.showFetchError);
		return this.postXHR;
	},

	showFetchError: function (xhr, errMsg) {
		this.$el.html([
			'<div class="fetch-error">',
			'    <div class="text">Oops!  Something broke.</div>',
			'    <div class="subtext">Don\'t worry, we\'re on it.  Please refresh the page in a few minutes.</div>',
			'</div>'
		].join('\n'));
	},

	populateSearchTiles: function(oResponse) {
		var self = this;

		var posts = _.sortBy(oResponse.posts, function(post) {
			return parseFloat(moment(post.time).format('X.SSS'));
		});

		if (posts.length === 0) {
			this.$el.html([
				'<div class="no-results">',
				'    <div class="text">No results found.</div>',
				'    <div class="subtext">Please try a different filter.</div>',
				'</div>'
			].join('\n'));
		}

		_.each(posts, function(post, index) {

			var tile = nio.utils.generateTile(self, {}, post);
			var content = tile.model.get('content');
			var contentTime = moment(content.get('time'));
			if (contentTime.isAfter(self.latestTime)) {
				self.latestTime = contentTime;
			}

			tile.on('filterByUser', self.filterByUser);

			self.$el.prepend(tile.el);
			self.tiles.push(tile);

		});

	},

	jumpToTiles: function() {
		// Jump to tiles
		var $offset = $("#sidebar").offset().top - $("#main-header").height();
		$('html, body').animate({ scrollTop: $offset }, 1000);
	},

	filterByUser: function(args) {
		// console.log('triggered filterByUser in Stream');
		this.trigger('filterByUser', args);
		this.renderTiles(args);
		this.jumpToTiles();
	},

	handleMsg: function(msg) {
		oMsg = $.parseJSON(msg);
		oMsg.time = oMsg.time + ' UTC';
		this.handlePost(oMsg);
	}

});
