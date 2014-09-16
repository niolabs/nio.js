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

	extendGlobal('NIO.utils', {
		extendGlobal: extendGlobal
	});


	NIO.utils.extendGlobal('NIO.staticData', {});
	NIO.utils.extendGlobal('NIO.constants', {});
	NIO.utils.extendGlobal('NIO.settings', {});
	NIO.utils.extendGlobal('NIO.routers', {});
	NIO.utils.extendGlobal('NIO.collections', {});
	NIO.utils.extendGlobal('NIO.models', {});
	NIO.utils.extendGlobal('NIO.templates', {});
	NIO.utils.extendGlobal('NIO.views', {
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

	NIO.tiles = function (opts) {
		// TODO: These are done here rather than in the App object because of dependencies.
		// Could this be fixed by implementing require?
		var stream = new NIO.views.RandomStream(opts)
	}

}())
