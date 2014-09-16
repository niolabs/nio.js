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

    // TODO: should go into App.utils
    launchPlayer: function(playerDiv) {
        var self = this;
        var videoId = playerDiv.attr('id');

        player = new YT.Player(videoId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            events: {
                'onReady': function(e) {
                    if (! self.isMobileBrowser()) {
                        e.target.playVideo();
                    }
                }
            }
        });
    },

    // TODO: should go into App.utils
    isMobileBrowser: function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
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
        var self = this;
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
