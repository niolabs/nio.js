NIO.views.FrontPage = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this);
		var self = this;

		this.args = {};
		this.streamView = 'RandomStream';

		this.initializeViews();
		this.initializeListeners();
		this.$el.html('please work')
		this.$el.remove()
		console.log(this.$el)
	},

	initializeListeners: function() {
		var self = this;

		// $(window).on('resize', this.refreshViews);

		/*this.Header.on('search', this.refreshViews);

		this.Footer.on('switch', this.switchViews);*/

		this.Stream.on('filterByUser', this.filterByUser);
		// this.Content.on('refreshStreamTiles', function(args) {
			// self.RandomStream.refreshTiles(args);
		// });

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

		/*
		this.Header = new NIO.views.Header({
			el: 'header'
		});

		this.Footer = new NIO.views.Footer({
			el: 'footer'
		});

		this.Content = new NIO.views.Content({
			el: '#content'
		});
	   */

		this.Stream = new NIO.views[this.streamView]({
			el: '#nio_stream_div'
		});

        // this.SearchStream = new NIO.views.SearchStream({
                // el: '#nio_stream_div',
                // model: new NIO.models.PostDictionary()
        // });

		// this.Yesterday = new NIO.views.LookBack({
			// el: '.time-frame.yesterday',
			// model: new NIO.models.PostDictionary(),
                        // maxDate: this.getStartOfToday(),
                        // daysLookBack: 1
		// });
		// this.TwoDaysAgo = new NIO.views.LookBack({
			// el: '.time-frame.2-days-ago',
			// model: new NIO.models.PostDictionary(),
                        // maxDate: this.getStartOfToday().subtract('days', 1),
                        // daysLookBack: 1
		// });
		// this.LastWeek = new NIO.views.LookBack({
			// el: '.time-frame.last-week',
			// model: new NIO.models.PostDictionary(),
                        // maxDate: this.getStartOfToday().subtract('days', 2),
                        // daysLookBack: 7,
                        // numTiles: 32
		// });

		// this.Monitoring = new NIO.views.Monitoring({
			// el: '#monitor-stream'
		// });

	},

    getStartOfToday: function() {
        return moment().hours(0).minutes(0).seconds(0).utc();
    }

});
