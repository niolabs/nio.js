NIO.models.Stat = Backbone.Model.extend({
	
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

NIO.collections.Stats = Backbone.Collection.extend({
	
	model: NIO.models.Stat
	
});
