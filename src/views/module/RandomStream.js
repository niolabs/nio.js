NIO.views.RandomStream = NIO.views.Stream.extend({

    handlePost: function(post) {
        if (this.names.length === 0 || _.indexOf(this.names, post.name) != -1) {
            if (this.types.length === 0 || _.indexOf(this.types, post.type) != -1) {
                var tile = App.utils.handleTileContent(this.tiles, post, NIO.models.Post);
                if (tile) {
					// console.log(tile);
					tile.on('filterByUser', this.filterByUser);
				}
            }
        }
    },

    initializeTiles: function(args) {
		console.log('initializing tiles')
        var self = this;

		this.$el.css('background', 'red')
		this.$el.html('<div>hello world</div>')
		console.log('init', this.el, this.$el, this.$el.html())
        // If we have filters, fetch the tiles then do the socket
        if (this.types.length || this.names.length) {

            var xhr = this.fetchTiles(args);

            xhr.done(function(oResponse) {
                self.setupSocket();
            });

        // Otherwise, start off with some blank tiles, then do the socket
        } else {

			var rows = this.getNumRows()
			var cols = this.getNumCols()
			console.log('looping', rows, cols)
            for (var row=0; row<rows; row++) {
                for (var col=0; col<cols; col++) {
                    var tileArgs = {
                        excludedTypes: ['stat-count', 'stat-time', 'stat-percent']
                    };

                    if (row >= 8) {
                        tileArgs['minPriority'] = 1;
                        tileArgs['maxPriority'] = 2;
                    } else {
                        tileArgs['minPriority'] = 5 - Math.ceil(row / 2);
                        tileArgs['maxPriority'] = 5 - Math.floor(row / 2);
                    }

                    var tile = App.utils.generateTile(this, tileArgs, {});
					this.$el.append('hello world')
                    this.$el.append(tile.el);
                    this.tiles.push(tile);
					//console.log('push tile', tile, tile.el, this.$el)
                }
            }

            this.setupSocket();

        }
    }

});
