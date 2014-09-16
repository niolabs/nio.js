NIO.models.Tile = Backbone.Model.extend({

    defaults: {
        time           : 0,
        rows           : 1,
        cols           : 1,
        minPriority    : 1,
        maxPriority    : 5,

        // Minimum duration when being replaced by an old tile
        minOldDuration: 10,

        // Minimum duration when being replaced by a new tile
        minNewDuration: 2,

        maxDuration: 30,

        availableTypes : [],
        excludedTypes  : [],
        content        : null
    },

    initialize: function(options) {
        this.resetDurations();
    },

    resetDurations: function() {
        this.set('minNewDuration', NIO.settings.tileDurations.minn);
        var randOffset = NIO.settings.tileDurations['randomOffset'],
            configuredMin = NIO.settings.tileDurations['min'],
            minOld = configuredMin + (1.0 - 2 * Math.random()) * randOffset;

        this.set('minOldDuration', minOld);
        this.set('maxDuration', this.get('minOldDuration') * NIO.settings.tileDurations['minMultiplier']);
    }

});

NIO.collections.Tiles = Backbone.Collection.extend({

    model: NIO.models.Tile

});
