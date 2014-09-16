nio.models.Tile = Backbone.Model.extend({

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

});

nio.collections.Tiles = Backbone.Collection.extend({

    model: nio.models.Tile

});
