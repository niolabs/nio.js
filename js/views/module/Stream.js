NIO.views.Stream = Backbone.View.extend({

	// tagName: 'div',
	// className: 'nio-stream js-packery entry-content clearfix',
	// id: 'nio_stream_div',
	// attributes: {
		// 'data-packery-options' : '{"itemSelector":".tile"}'
	// },
	model: new NIO.models.PostDictionary(),

    initialize: function(args) {
        _.bindAll(this);

		this.types = [];
		this.names = [];

        this.contentModel = NIO.models.Post;

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
        if (!('default' in App.sockets)) {
            App.sockets['default'] = App.utils.connectToWebSocket('default');
        }
        App.sockets['default'].on('recvData', this.handleMsg);
        App.sockets['default'].socket.on('error', this.showFetchError);
        App.sockets['default'].socket.on('connect_failed', this.showFetchError);
    },

    killEvents: function() {
        var self = this;
        //TODO: this interval only needs to be cleared in the SearchStream.
        window.clearInterval(self.interval);
        App.sockets['default'].removeAllListeners('recvData');
    },

    getNumRows: function() {
        /** Returns the number of rows based on the available space **/
        //var height = jQuery('.main-content-wrap').height();
		//TODO: revert this
		var height = 1000
        var numRows = Math.ceil(height/App.settings.tileHeight);

        return Math.min(11, numRows);
    },

    getNumCols: function() {
        /** Returns the number of columns for tiles based on the available space **/
        //var width = this.$el.width();
		//TODO: revert this
		var width = 1000
        var numCols = Math.floor(width/App.settings.tileWidth);

        return numCols;
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

            var tile = App.utils.generateTile(self, {}, post);
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
