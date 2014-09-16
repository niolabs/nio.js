NIO.views.FrontPage = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this);
		var self = this;

		this.args = {};
		this.streamView = 'RandomStream';

		this.initializeViews();
		this.initializeListeners();
	},

	initializeListeners: function() {
		// $(window).on('resize', this.refreshViews);
		this.Stream.on('filterByUser', this.filterByUser);
	},

	filterByUser: function(args) {
		// console.log('triggered filterByUser in Page');
		this.Header.filterByUser(args);
	},

	switchViews: function(args) {
		args = args || this.args;
		this.args = args;
		// console.log(args);
		// this.Stream.remove();
		// TODO: I would like to use remove() here but it gets rid of the view's el as well.
		this.Stream.$el.html('');
		this.Stream.killEvents();
		this.Stream.stopListening();
		this.Stream.undelegateEvents();
		this.Stream = new NIO.views[args.view]({
			el: '#nio_stream_div'
		});
	},

	refreshViews: function(args) {
		// console.log('refreshViews args: ', args);
		if (args.originalEvent) { args = {}; }
		args = args || this.args;
		this.args = args;
		this.Stream.renderTiles(args);
	},

	initializeViews: function() {
		this.Stream = new NIO.views[this.streamView]({
			el: '#nio_stream_div'
		});
	},

    getStartOfToday: function() {
        return moment().hours(0).minutes(0).seconds(0).utc();
    }

});
