/**
 * Set up the major namespaces.
 * The following function uses _.extend internally but also creates each
 * piece of the namespace if it doesn't already exist.
 */
(function(){

	function extendGlobal(namespace, obj){
		var ctx = window;
		_(namespace.split('.')).each(function(name){
			ctx[name] = ctx[name] || {};
			ctx = ctx[name];
		});
		if (obj) { _.extend(ctx, obj); }
		return ctx;
	}

	extendGlobal('nio.utils', {
		extendGlobal: extendGlobal
	});


	nio.utils.extendGlobal('nio.staticData', {});
	nio.utils.extendGlobal('nio.constants', {});
	nio.utils.extendGlobal('nio.settings', {});
	nio.utils.extendGlobal('nio.routers', {});
	nio.utils.extendGlobal('nio.collections', {});
	nio.utils.extendGlobal('nio.models', {});
	nio.utils.extendGlobal('nio.templates', {});
	nio.utils.extendGlobal('nio.views', {
		'modules': {},
		'pages': {}
	});

	require('./content.js');
	require('./constants.js');
	require('./settings.js');
	require('./utils.js');
	require('./models/Post.js');
	require('./models/Stat.js');
	require('./models/Tile.js');
	require('./views/Tile.js');
	require('./views/LookBack.js');
	require('./views/Stream.js');
	require('./views/RandomStream.js');
	require('./views/SearchStream.js');

	nio.tiles = function (opts) {
		// TODO: These are done here rather than in the App object because of dependencies.
		// Could this be fixed by implementing require?
		var stream = new nio.views.SearchStream(opts)
	}

}())
