NIO.views.Tile = Backbone.View.extend({

	tagName: 'div',
	className: 'tile',
	id: function() {
		return 'tile-' + this.model.cid;
	},

    initialize: function(args) {
        _.bindAll(this);
        var self = this;
        // console.log(args);

		this.$el
			.addClass('h' + this.model.get('rows'))
			.addClass('w' + this.model.get('cols'));

		this.content = this.model.get('content');

		// store the content ID so that when content changes, we know whether it's an update
		// or a replacement, and thus how to handle the transition.
		this.model.set('contentId', this.content.get('id'));

		// Generate the initial content.
		this.render();

		// Anytime the model changes, generate the content again.
		this.model.on('change:content', function() {
			self.render();
		});
    },

    events: {
        'mouseenter' : 'lockTile',
        'mouseleave' : 'unlockTile',
        'touchend' : 'unlockTile',
        'click .originator-link': 'filterByUser',
        'click .pinned': 'togglePin',
        'click .close-tile': 'closeTile',
        'click .full-text, .full-image': 'openContent',
        'click a': 'killFunc',
        'click' : 'expandTile'
    },


	filterByUser: function(ev) {
		var el = $(ev.currentTarget).parent();
		var username = el.attr('title');
		// console.log('triggered filterByUser in Tile');
		this.trigger('filterByUser', {names: [username]});
		ev.stopPropagation();
	},

    render: function() {
        var self = this;
        var content = this.model.get('content'),
            type = content.get('type');

        if (!(type in compiledTemplates)) {
			// TODO: need an IE-safe console.log.  Uncomment when implemented
            // console.error('No template built for content type ' + type + ', using blank');
            type = 'blank';
        }

        if (this.model.get('contentId') === content.get('id')) {
            // IDs are the same.  This is a straight update.
            this.$el
                .html(this.getTileContainer(type, content))
                .attr(
                    'data-timestamp',
                    moment(this.model.get('content').get('time')).format('X.SSS'));
        } else {
            // IDs differ.  Animate the replacement and update the ID.

            var oldDiv = this.$el.find('div').first(),
                newDiv = this.getTileContainer(type, content).css('display', 'none');

            // add the new (hidden) div
            this.$el.prepend(newDiv);

            this.model.set('contentId', content.get('id'));

            // Update the div's timestamp attribute
            this.$el.attr(
                'data-timestamp',
                moment(self.model.get('content').get('time')).format('X.SSS'));

            oldDiv.fadeOut('slow', function() {
                // Once the old div is faded out, remove it
                oldDiv.remove();
            });
            newDiv.fadeIn('slow');
        }
    },

    getTileContainer: function(tileType, tileContent) {
        return $('<div/>')
            .addClass('tile-container')
            .addClass(tileType)
            .html(compiledTemplates[tileType](tileContent.toJSON()));
    },

    killFunc: function(ev) {
        ev.stopPropagation();
    },

    openContent: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        if (this.$el.hasClass('tile-full')) {
            // open the original post
            window.open(this.$el.find('a.post-link').attr("href"));
        }
    },

    closeTile: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        // Close tile
        this.$el.removeClass('tile-full', 300, function() {

            // Remove video iframe as applicable
            var $iframe = $(this).find('.youtube-player');
            if ($iframe) {
                var $videoId = $iframe.attr('id');
                $iframe.after('<div class="youtube-player" id="' + $videoId+ '"></div>');
                $iframe.remove();
                $(this).find('.video-cover-image').show();
            }

            // Redo packery layout
            $(this).closest('.js-packery').data('packery').layout();
        });
    },

    togglePin: function(ev) {
        this.$el.toggleClass("locked-click");
        ev.preventDefault();
        ev.stopPropagation();
    },

    expandTile: function(ev) {
        var self = this;
        ev.preventDefault();
        ev.stopPropagation();

        if (this.$el.find('.blank').length) {
            return;
        }

        if (!this.$el.hasClass('tile-full')) {
            // we are expanding the tile
            this.$el.addClass('tile-full', 300, function() {
                self.$el.closest('.js-packery').data('packery').fit(self.$el.get(0));
            });

            // Start video in youtube tiles
            var $iframe = $(this).find('.youtube-player');
            if ($iframe) {
                this.launchPlayer(this.$el.find('.youtube-player'));
                this.$el.find('.video-cover-image').hide();
            }
        } else {
            this.closeTile(ev);
        }

    },

    lockTile: function(ev) {
        this.$el.addClass('locked-mouse');
    },

    unlockTile: function(ev) {
        this.$el.removeClass('locked-mouse');
    }

});
