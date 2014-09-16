nio.models.Stat = Backbone.Model.extend({

	defaults: {
		id          : 0,
		id_value    : 1,
		time        : 0,
		seconds_ago : 0,
		type        : 'blank',
		name        : '',
		source_type : '',
		count       : 0,
		percent     : 0
	}

});

nio.collections.Stats = Backbone.Collection.extend({

	model: nio.models.Stat

});
