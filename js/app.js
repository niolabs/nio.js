module.exports = Backbone.Router.extend({

	routes: {
		'' : 'home'
	},

	initialize: function () {
        // _.bindAll(this);
		this.isTransition = false; // will only be false on page load
        this.isDirty = false;
        this.constants = NIO.constants;
        this.settings = NIO.settings;
        this.utils = NIO.utils;
        this.sockets = {};
    },

    initializeTooltips: function() {
        jQuery('[tooltip-text!=""]').qtip({
            content: {
                attr: 'tooltip-text'
            },
            style: {
                classes: 'qtip-dark qtip-tooltip'
            },
            position: {
                my: 'top center',
                at: 'bottom center',
                viewport: jQuery(window)
            },
            hide: {
                inactive: 2000,
                delay: 200,
                fixed: true
            }
        });
    },

    getViews: function() {
        this.views = {
            Page: {}
        };
        if (this.views.Overlay) {
            this.showLoader = _.bind(this.views.Overlay.showLoader, this.views.Overlay);
            this.hideLoader = _.bind(this.views.Overlay.hideLoader, this.views.Overlay);
        }
    },

    getPageView: function() {
		return new NIO.views.FrontPage({el: '#content'})
    }

});
