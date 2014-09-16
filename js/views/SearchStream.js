NIO.views.SearchStream = NIO.views.Stream.extend({

    handlePost: function(post) {
        var msgTime = moment(post.time);
		if (this.names.length === 0 || _.indexOf(this.names, post.name) != -1) {
			if (this.types.length === 0 || _.indexOf(this.types, post.type) != -1) {
				if (post.flag == 'new') {
					if (msgTime.isSame(this.latestTime)) {
						// compare the ids.  if they don't match, then display it.
						// there will need to be some logic to make sure we don't have a string
						// of posts with the exact same moment.  Maybe we should keep a simple
						// array of all the ids.  Otherwise we could repeat the second-to-last
						// post, USW.
					} else if (msgTime.isAfter(this.latestTime)) {
						this.tileCount++;
						this.latestTime = msgTime;
						var tile = NIO.utils.generateTile(this, {}, post);
						this.tiles.push(tile);
						this.$el.prepend(tile.el);
						// this.$el.closest('.js-packery').data('packery').layout();
					}
				}
			}
        }
    },

    initializeTiles: function(args) {
        var self  = this,
            xhr = this.fetchTiles(args);

        xhr.done(function(oResponse) {
            self.setupSocket();

            // every second, change the seconds_ago property on
            // the content, forcing the tile to re-render.
            /* TO DISABLE TIME-AGO UPDATING, COMMENT FROM HERE */
            self.interval = setInterval(function() {
                // console.log(self.tiles);
                _.each(self.tiles, function(tile, index) {
                    var content = tile.model.get('content');
                    // console.log('foo: ', content.get('time'));
                    content.set('seconds_ago', moment().diff(moment(content.get('time')), 'seconds'));
                    tile.model.trigger('change:content');
                });
            }, 1000);
            /* TO HERE */
        });
    }

});
