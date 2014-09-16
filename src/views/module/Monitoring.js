NIO.views.Monitoring = Backbone.View.extend({
	
	initialize: function(args) {
		_.bindAll(this);
		var self = this;
		
		this.contentModel = NIO.models.Stat;
		
		this.tiles = [];
		
		this.numTiles = 18;
		
		var contentConfig = [
			{ id: 'time- twitter'         },
			{ id: 'counts- twitter'       },
			{ id: 'time- twitter-photo'   },
			{ id: 'counts- twitter-photo' },
			{ id: 'time- linkedin'        },
			{ id: 'counts- linkedin'      },
			{ id: 'time- gplus'           },
			{ id: 'counts- gplus'         },
			{ id: 'time- youtube'         },
			{ id: 'counts- youtube'       },
			{ id: 'time- facebook'        },
			{ id: 'counts- facebook'      },
			{ id: 'time- instagram'       },
			{ id: 'counts- instagram'     },
			{ id: 'time- rss'             },
			{ id: 'counts- rss'           },
			{ id: 'disk'                  },
			{ id: 'cpu'                   }
		];
		
		_.each(contentConfig, jQuery.proxy(function(config, index) {
			
			// console.log(this.$el);
			
			var tile = App.utils.generateTile(this, {
				availableTypes: ['stat-count', 'stat-time', 'stat-percent']
			}, config)
			
			this.$el.append(tile.el);
						
			this.tiles.push(tile);
			
		}), this);
		
		var bNewConnection = !App.sockets['monitoring'];
		if (bNewConnection) {
			App.sockets['monitoring'] = App.utils.connectToWebSocket('monitoring', bNewConnection);
		}
		App.sockets['monitoring'].on('recvData', function(msg) {
			App.utils.handleTileContent(self.tiles, msg, NIO.models.Stat);
		});
		
	}
	
});
