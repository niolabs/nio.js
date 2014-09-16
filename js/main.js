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

})();

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
require('./custom.js');
require('./constants.js');
require('./settings.js');
require('./utils.js');
require('./custom.js');
require('./models/Post.js');
require('./models/Stat.js');
require('./models/Tile.js');
require('./views/module/Tile.js');
require('./views/module/LookBack.js');
require('./views/module/Stream.js');
require('./views/module/RandomStream.js');
require('./views/module/SearchStream.js');
require('./views/module/Monitoring.js');
require('./views/page/FrontPage.js');
require('./views/page/SinglePage.js');
require('./views/page/CategoryPage.js');

window.onload = function () {
	var app = require('./app');
	window.App = new app();

	// Add 'dev', 'test' or 'prod' as a class on the body tag.
	// TODO: should this be on the html tag or in a data attribute?
	jQuery('body').addClass(App.constants.environment);

	// TODO: These are done here rather than in the App object because of dependencies.
	// Could this be fixed by implementing require?
	App.getViews();
	App.views.Page = App.getPageView();
	App.initializeTooltips();

	Backbone.history.start({pushState: false, root: '/'});
}
