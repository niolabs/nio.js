nio.views.RandomStream = nio.views.Stream.extend({

	handlePost: function(post) {
		if (this.names.length === 0 || _.indexOf(this.names, post.name) != -1) {
			if (this.types.length === 0 || _.indexOf(this.types, post.type) != -1) {
				var tile = nio.utils.handleTileContent(this.tiles, post, nio.models.Post)
				if (tile) {
					// console.log(tile)
					tile.on('filterByUser', this.filterByUser)
				}
			}
		}
	},

	initializeTiles: function(args) {
		var self = this

		// If we have filters, fetch the tiles then do the socket
		if (this.types.length || this.names.length) {

			var xhr = this.fetchTiles(args)

			xhr.done(function(oResponse) {
				self.setupSocket()
			})

		// Otherwise, start off with some blank tiles, then do the socket
		} else {

			var rows = this.getNumRows()
			var cols = this.getNumCols()
			for (var row=0; row<rows; row++) {
				for (var col=0; col<cols; col++) {
					var tileArgs = {
						excludedTypes: ['stat-count', 'stat-time', 'stat-percent']
					}

					if (row >= 8) {
						tileArgs['minPriority'] = 1
						tileArgs['maxPriority'] = 2
					} else {
						tileArgs['minPriority'] = 5 - Math.ceil(row / 2)
						tileArgs['maxPriority'] = 5 - Math.floor(row / 2)
					}

					var tile = nio.utils.generateTile(this, tileArgs, {})
					this.$el.append(tile.el)
					this.tiles.push(tile)
				}
			}
			this.setupSocket()
		}
	}

})
