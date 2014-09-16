(

function($) {

},

function($){
    
var $img_ratio = 1;
var $tile_width = 248;
var $tile_height = 226;

	$.et_simple_slider = function(el, options) {
		var settings = $.extend( {
			slide         			: '.et-slide',				 	// slide class
			arrows					: '.et-slider-arrows',			// arrows container class
			prev_arrow				: '.et-arrow-prev',				// left arrow class
			next_arrow				: '.et-arrow-next',				// right arrow class
			controls 				: '.et-controllers a',			// control selector
			control_active_class	: 'et-active-control',			// active control class name
			previous_text			: 'Previous',					// previous arrow text
			next_text				: 'Next',						// next arrow text
			fade_speed				: 500,							// fade effect speed
			use_arrows				: true,							// use arrows?
			use_controls			: true,							// use controls?
			manual_arrows			: '',							// html code for custom arrows
			append_controls_to		: '',							// controls are appended to the slider element by default, here you can specify the element it should append to
			controls_class			: 'et-controllers',				// controls container class name
			slideshow				: false,						// automattic animation?
			slideshow_speed			: 7000,							// automattic animation speed
			show_progress_bar		: true,							// show progress bar if automattic animation is active
			tabs_animation			: false
		}, options );

		var $et_slider 			= $(el),
			$et_slide			= $et_slider.find( settings.slide ),
			et_slides_number	= $et_slide.length,
			et_fade_speed		= settings.fade_speed,
			et_active_slide		= 0,
			$et_slider_arrows,
			$et_slider_prev,
			$et_slider_next,
			$et_slider_controls,
			et_slider_timer,
			controls_html = '',
			$progress_bar = null,
			progress_timer_count = 0;

			$et_slider.et_animation_running = false;

			$.data(el, "et_simple_slider", $et_slider);

			$et_slide.eq(0).addClass( 'et-active-slide' );

			if ( settings.use_arrows && et_slides_number > 1 ) {
				if ( settings.manual_arrows == '' )
					$et_slider.append( '<div class="et-slider-arrows"><a class="et-arrow-prev" href="#">' + settings.previous_text + '</a><a class="et-arrow-next" href="#">' + settings.next_text + '</a></div>' );
				else
					$et_slider.append( settings.manual_arrows );

				$et_slider_arrows 	= $( settings.arrows );
				$et_slider_prev 	= $et_slider.find( settings.prev_arrow );
				$et_slider_next 	= $et_slider.find( settings.next_arrow );

				$et_slider_next.click( function(){
					if ( $et_slider.et_animation_running )	return false;

					$et_slider.et_slider_move_to( 'next' );

					return false;
				} );

				$et_slider_prev.click( function(){
					if ( $et_slider.et_animation_running )	return false;

					$et_slider.et_slider_move_to( 'previous' );

					return false;
				} );
			}

			if ( settings.use_controls && et_slides_number > 1 ) {
				for ( var i = 1; i <= et_slides_number; i++ ) {
					controls_html += '<a href="#"' + ( i == 1 ? ' class="' + settings.control_active_class + '"' : '' ) + '>' + i + '</a>';
				}

				controls_html =
					'<div class="' + settings.controls_class + '">' +
						controls_html +
					'</div>';

				if ( settings.append_controls_to == '' )
					$et_slider.append( controls_html );
				else
					$( settings.append_controls_to ).append( controls_html );

				$et_slider_controls	= $et_slider.find( settings.controls ),

				$et_slider_controls.click( function(){
					if ( $et_slider.et_animation_running )	return false;

					$et_slider.et_slider_move_to( $(this).index() );

					return false;
				} );
			}

			if ( settings.slideshow && et_slides_number > 1 && settings.show_progress_bar ) {
				$et_slider.append( '<div id="featured-progress-bar"><div id="progress-time"></div></div>' );
				$progress_bar = $( '#progress-time' );

				$et_slider.hover( function() {
					$et_slider.addClass( 'et_slider_hovered' );
				}, function() {
					$et_slider.removeClass( 'et_slider_hovered' );
					$progress_bar.animate( { 'width' : '100%' }, parseInt( settings.slideshow_speed - progress_timer_count ) );
				} );
			}

			et_slider_auto_rotate();

			function et_slider_auto_rotate(){
				if ( settings.slideshow && et_slides_number > 1 ) {
					$progress_bar.css( 'width', '0%' ).animate( { 'width' : '100%' }, parseInt( settings.slideshow_speed - progress_timer_count ) );

					if ( $et_slider.hasClass( 'et_slider_hovered' ) && $progress_bar.length && settings.slideshow && et_slides_number > 1 )
						$progress_bar.stop();

					et_slider_timer = setInterval( function() {
						if ( ! $et_slider.hasClass( 'et_slider_hovered' ) ) progress_timer_count += 100;

						if ( $et_slider.hasClass( 'et_slider_hovered' ) && $progress_bar.length && settings.slideshow && et_slides_number > 1 )
						$progress_bar.stop();

						if ( progress_timer_count >= parseInt( settings.slideshow_speed ) ) {
							progress_timer_count = 0;
							clearInterval( et_slider_timer );

							$et_slider.et_slider_move_to( 'next' );
						}
					}, 100 );
				}
			}

			$et_slider.et_slider_move_to = function ( direction ) {
				var $active_slide = $et_slide.eq( et_active_slide ),
					$next_slide;

				$et_slider.et_animation_running = true;

				if ( direction == 'next' || direction == 'previous' ){

					if ( direction == 'next' )
						et_active_slide = ( et_active_slide + 1 ) < et_slides_number ? et_active_slide + 1 : 0;
					else
						et_active_slide = ( et_active_slide - 1 ) >= 0 ? et_active_slide - 1 : et_slides_number - 1;

				} else {

					if ( et_active_slide == direction ) {
						$et_slider.et_animation_running = false;
						return;
					}

					et_active_slide = direction;

				}

				if ( typeof et_slider_timer != 'undefined' )
					clearInterval( et_slider_timer );

				if ( $progress_bar !== null && $progress_bar.length != 0 ) {
					progress_timer_count = 0;
					$progress_bar.stop( true ).css( 'width', '0%' );
				}

				$next_slide	= $et_slide.eq( et_active_slide );

				$et_slide.each( function(){
					$(this).css( 'zIndex', 1 );
				} );
				$active_slide.css( 'zIndex', 2 ).removeClass( 'et-active-slide' );
				$next_slide.css( { 'display' : 'block', opacity : 0 } ).addClass( 'et-active-slide' );

				if ( settings.use_controls )
					$et_slider_controls.removeClass( settings.control_active_class ).eq( et_active_slide ).addClass( settings.control_active_class );

				if ( ! settings.tabs_animation ) {
					$next_slide.delay(400).animate( { opacity : 1 }, et_fade_speed );
					$active_slide.addClass( 'et_slide_transition' ).css( { 'display' : 'block', 'opacity' : 1 } ).delay(400).animate( { opacity : 0 }, et_fade_speed, function(){
						$(this).css('display', 'none').removeClass( 'et_slide_transition' );
						$et_slider.et_animation_running = false;
					} );
				} else {
					$next_slide.css( { 'display' : 'none', opacity : 0 } );

					$active_slide.addClass( 'et_slide_transition' ).css( { 'display' : 'block', 'opacity' : 1 } ).animate( { opacity : 0 }, et_fade_speed, function(){
								$(this).css('display', 'none').removeClass( 'et_slide_transition' );

								$next_slide.css( { 'display' : 'block', 'opacity' : 0 } ).animate( { opacity : 1 }, et_fade_speed, function() {
									$et_slider.et_animation_running = false;
								} );
							} );
				}

				et_slider_auto_rotate();
			}
	}

	$.fn.et_simple_slider = function( options ) {
		return this.each(function() {
			new $.et_simple_slider(this, options);
		});
	}

	$(document).ready( function(){
		var $et_top_menu              = $( 'ul.nav' ),
			$comment_form             = $( '#commentform' ),
			$home_popular_slider      = $( '.popular-posts-wrap' ),
			$home_popular_slider_tabs = $home_popular_slider.find( '.popular-tabs li' ),
			$categories_tabs_module   = $( '.categories-tabs-module' ),
			$categories_tabs          = $categories_tabs_module.find( '.categories-tabs li' ),
			$tabs_widget              = $( '.widget_ettabbedwidget' ),
			$tabs_widget_li           = $tabs_widget.find( '.categories-tabs li' ),
			$recent_videos            = $( '.widget_etrecentvideoswidget' ),
			$recent_videos_tabs       = $recent_videos.find( '.et-recent-videos-wrap li' ),
			$et_container             = $( '.container' ),
			et_container_width;

		et_container_width = $et_container.width();

		$et_top_menu.superfish({
			delay		: 500, 										// one second delay on mouseout
			animation	: { opacity : 'show', height : 'show' },	// fade-in and slide-down animation
			speed		: 'fast', 									// faster animation speed
			autoArrows	: true, 									// disable generation of arrow mark-up
			dropShadows	: false										// disable drop shadows
		});

		if ( $('ul.et_disable_top_tier').length ) $("ul.et_disable_top_tier > li > ul").prev('a').attr('href','#');

		$('#et-social-icons a').hover(
			function(){
				$(this).find('.et-social-normal').css( { 'opacity' : 1 } ).stop(true,true).animate( { 'top' : '-59px', 'opacity' : 0 }, 300 );
				$(this).find('.et-social-hover').stop(true,true).animate( { 'top' : '-62px' }, 300 );
			}, function(){
				$(this).find('.et-social-normal').stop(true,true).animate( { 'top' : '0', opacity : 1 }, 300 );
				$(this).find('.et-social-hover').stop(true,true).animate( { 'top' : '0' }, 300 );
			}
		);

		(function et_search_bar(){
			var $searchform = $('.et-search-form'),
				$searchinput = $searchform.find(".search_input"),
				searchvalue = $searchinput.val();

			$searchinput.focus(function(){
				if (jQuery(this).val() === searchvalue) jQuery(this).val("");
			}).blur(function(){
				if (jQuery(this).val() === "") jQuery(this).val(searchvalue);
			});
		})();

		et_duplicate_menu( $('#main-header ul.nav'), $('#top-navigation .mobile_nav'), 'mobile_menu', 'et_mobile_menu' );

		function et_duplicate_menu( menu, append_to, menu_id, menu_class ){
			var $cloned_nav;

			menu.clone().attr('id',menu_id).removeClass().attr('class',menu_class).appendTo( append_to );
			$cloned_nav = append_to.find('> ul');
			$cloned_nav.find('.menu_slide').remove();
			$cloned_nav.find('li:first').addClass('et_first_mobile_item');

			append_to.click( function(){
				if ( $(this).hasClass('closed') ){
					$(this).removeClass( 'closed' ).addClass( 'opened' );
					$cloned_nav.slideDown( 500 );
				} else {
					$(this).removeClass( 'opened' ).addClass( 'closed' );
					$cloned_nav.slideUp( 500 );
				}
				return false;
			} );

			append_to.find('a').click( function(event){
				event.stopPropagation();
			} );
		}

		$( '.recent-module .load-more a' ).click( function() {
			var $this_link = $(this);

			$.ajax( {
				type: "POST",
				url: et_custom.ajaxurl,
				data:
				{
					action      : 'et_recent_module_add_posts',
					et_hb_nonce : et_custom.et_hb_nonce,
					category    : $this_link.data('category'),
					number      : $this_link.data('number'),
					offset      : $this_link.closest('.recent-module').find('.recent-post').length
				},
				success: function( data ){
					if ( '' == data )
						$this_link.remove();
					else
						$this_link.closest('.recent-module').find('.module-content').append( data );
				}
			} );

			return false;
		} );

		$( '.recent-reviews .load-more a' ).click( function() {
			var $this_link = $(this);

			$.ajax( {
				type: "POST",
				url: et_custom.ajaxurl,
				data:
				{
					action      : 'et_reviews_module_add_posts',
					et_hb_nonce : et_custom.et_hb_nonce,
					category    : $this_link.data('category'),
					number      : $this_link.data('number'),
					offset      : $this_link.closest('.recent-reviews').find('.review-post').length
				},
				success: function( data ){
					if ( '' == data )
						$this_link.remove();
					else
						$this_link.closest('.recent-reviews').find('.reviews-content').append( data );
				}
			} );

			return false;
		} );

		$( '.et-tabs .load-more a' ).click( function() {
			var $this_link = $(this);

			$.ajax( {
				type: "POST",
				url: et_custom.ajaxurl,
				data:
				{
					action      : 'et_recent_module_add_posts',
					et_hb_nonce : et_custom.et_hb_nonce,
					category    : $this_link.data('category'),
					number      : $this_link.data('number'),
					offset      : $this_link.closest('.et-tabs').find('.et-tabs-wrap .recent-post').length
				},
				success: function( data ){
					if ( '' == data )
						$this_link.remove();
					else
						$this_link.closest('.et-tabs').find('.et-tabs-wrap').append( data );
				}
			} );

			return false;
		} );

		if ( $categories_tabs_module.length ) {
			$categories_tabs_module.et_simple_slider( {
				use_controls   : false,
				use_arrows     : false,
				slide          : '.et-tabs',
				tabs_animation : true
			} );

			$categories_tabs.click( function() {
				var $this_el         = $(this),
					$home_tabs       = $this_el.closest( '.categories-tabs-module' ).data('et_simple_slider');

				if ( $home_tabs.et_animation_running ) return;

				$this_el.addClass( 'home-tab-active' ).siblings().removeClass( 'home-tab-active' );

				$home_tabs.data('et_simple_slider').et_slider_move_to( $this_el.index() );
			} );

			var $et_categories_mobile_arrows;

			$et_categories_mobile_arrows = $categories_tabs_module.append( '<span class="et-popular-mobile-arrow et-popular-mobile-arrow-previous"></span>' + '<span class="et-popular-mobile-arrow et-popular-mobile-arrow-next"></span>' );

			$categories_tabs_module.find( '.et-popular-mobile-arrow' ).click( function() {
				var $this_el     = $(this),
					direction    = $this_el.hasClass( 'et-popular-mobile-arrow-next' ) ? 'next' : 'previous',
					$slider      = $this_el.closest( '.categories-tabs-module' ).data('et_simple_slider'),
					$slider_tabs = $slider.find( '.categories-tabs li' ),
					tabs_number  = $slider_tabs.length,
					current_tab  = $slider.find( '.home-tab-active' ).index();

				if ( $slider.et_animation_running ) return false;

				if ( direction == 'next' ) {
					next_tab = ( current_tab + 1 ) < tabs_number ? current_tab + 1 : 0;

					$slider_tabs.eq( next_tab ).addClass( 'home-tab-active' ).siblings().removeClass( 'home-tab-active' );
				}

				if ( direction == 'previous' ) {
					next_tab = current_tab - 1;

					if ( next_tab === -1 ) next_tab = tabs_number - 1;

					$slider_tabs.eq( next_tab ).addClass( 'home-tab-active' ).siblings().removeClass( 'home-tab-active' );
				}

				$slider.data('et_simple_slider').et_slider_move_to( next_tab );
			} );
		}

		if ( $recent_videos.length ) {
			$recent_videos.et_simple_slider( {
				use_controls   : false,
				use_arrows     : false,
				slide          : '.et-recent-video',
				tabs_animation : true
			} );

			$recent_videos_tabs.click( function() {
				var $this_el         = $(this),
					$home_tabs       = $this_el.closest( '.widget_etrecentvideoswidget' ).data('et_simple_slider');

				if ( $home_tabs.et_animation_running ) return;

				$this_el.addClass( 'et-video-active' ).siblings().removeClass( 'et-video-active' );

				$home_tabs.data('et_simple_slider').et_slider_move_to( $this_el.index() );
			} );

			$recent_videos.find( '.et-recent-video-scroll a' ).click( function() {
				var $this_el    = $(this),
					direction   = $this_el.hasClass( 'et-scroll-video-top' ) ? 'previous' : 'next',
					$slider     = $this_el.closest( '.widget_etrecentvideoswidget' ).data('et_simple_slider'),
					$active_tab = $slider.find( '.et-recent-videos-wrap .et-video-active' ),
					tabs_number = $slider.find( '.et-recent-videos-wrap li' ).length;

				if ( $slider.et_animation_running ) return false;

				if ( direction === 'next' ) {
					next = $active_tab.index() + 1;

					if ( next >= tabs_number ) next = 0;
				} else {
					next = $active_tab.index() - 1;

					if ( next < 0 ) next = tabs_number - 1;
				}

				$slider.find( '.et-recent-videos-wrap li' ).eq(next).addClass( 'et-video-active' ).siblings().removeClass( 'et-video-active' );
				$slider.data('et_simple_slider').et_slider_move_to( next );

				return false;
			} );
		}

		if ( $tabs_widget.length ) {
			$tabs_widget.et_simple_slider( {
				use_controls   : false,
				use_arrows     : false,
				slide          : '.et-tabbed-all-tabs > div',
				tabs_animation : true
			} );

			$tabs_widget_li.click( function() {
				var $this_el         = $(this),
					$home_tabs       = $this_el.closest( '.widget_ettabbedwidget' ).data('et_simple_slider');

				if ( $home_tabs.et_animation_running ) return false;

				$this_el.addClass( 'home-tab-active' ).siblings().removeClass( 'home-tab-active' );

				$home_tabs.data('et_simple_slider').et_slider_move_to( $this_el.index() );

				return false;
			} );
		}

		if ( $home_popular_slider.length ) {
			$home_popular_slider.et_simple_slider( {
				use_controls   : false,
				use_arrows     : false,
				slide          : '.popular-post',
				tabs_animation : true
			} );

			$home_popular_slider_tabs.click( function() {
				var $this_el         = $(this),
					$home_tabs       = $this_el.closest( '.popular-posts-wrap' ).data('et_simple_slider'),
					$tabs_container  = $home_tabs.find( '.popular-tabs ul' ),
					active_tab_index = $home_tabs.find( '.popular-active' ).index(),
					tabs_margin      = parseInt( $tabs_container.css( 'marginTop' ) ),
					tabs_height      = 0;

				if ( $home_tabs.et_animation_running ) return;

				if ( $this_el.index() < 4 ) {
					$tabs_container.css( 'marginTop', 0 );
				} else {
					$tabs_container.find( 'li' ).slice( $this_el.index() + 1, active_tab_index + 1 ).each( function() {
						tabs_height += $( this ).innerHeight();
					} );
					$tabs_container.css( 'marginTop', tabs_margin + tabs_height );
				}

				$this_el.addClass( 'popular-active' ).siblings().removeClass( 'popular-active' );

				$home_tabs.data('et_simple_slider').et_slider_move_to( $this_el.index() );
			} );

			$( '.et-scroll-arrows a' ).click( function() {
				var $slider          = $(this).closest( '.popular-posts-wrap' ).data('et_simple_slider'),
					$slider_tabs     = $slider.find( '.popular-tabs li' ),
					tabs_number      = $slider_tabs.length,
					current_tab      = $slider.find( '.popular-active' ).index(),
					$tabs_container  = $slider.find( '.popular-tabs ul' ),
					$tabs_top_margin = parseInt( $tabs_container.css( 'marginTop' ) ),
					direction        = $(this).hasClass( 'et-scroll-arrows-bottom' ) ? 'next' : 'previous',
					next_tab;

				if ( $slider.et_animation_running ) return false;

				if ( direction == 'next' ) {
					next_tab = ( current_tab + 1 ) < tabs_number ? current_tab + 1 : 0;

					$slider_tabs.eq( next_tab ).addClass( 'popular-active' ).siblings().removeClass( 'popular-active' );

					if ( next_tab > 3 ) {
						$tabs_container.css( 'marginTop', $tabs_top_margin - $slider_tabs.eq( next_tab ).innerHeight() );
					} else if ( next_tab == 0 ) {
						$tabs_container.css( 'marginTop', 0 );
					}
				}

				if ( direction == 'previous' ) {
					next_tab = current_tab - 1;

					if ( next_tab === -1 ) return false;

					$slider_tabs.eq( next_tab ).addClass( 'popular-active' ).siblings().removeClass( 'popular-active' );

					if ( next_tab > 2 ) {
						$tabs_container.css( 'marginTop', $tabs_top_margin + $slider_tabs.eq( current_tab ).innerHeight() );
					}
				}

				$slider.data('et_simple_slider').et_slider_move_to( next_tab );

				return false;
			} );

			var $et_popular_mobile_arrows;

			$et_popular_mobile_arrows = $home_popular_slider.siblings( '.module-title' ).append( '<span class="et-popular-mobile-arrow et-popular-mobile-arrow-previous"></span>' + '<span class="et-popular-mobile-arrow et-popular-mobile-arrow-next"></span>' );

			$et_popular_mobile_arrows.parent().find( '.et-popular-mobile-arrow' ).click( function() {
				var $this_el     = $(this),
					direction    = $this_el.hasClass( 'et-popular-mobile-arrow-next' ) ? 'next' : 'previous',
					$slider      = $this_el.closest( '.popular-module' ).find( '.popular-posts-wrap' ).data('et_simple_slider'),
					$slider_tabs = $slider.find( '.popular-tabs li' ),
					tabs_number  = $slider_tabs.length,
					current_tab  = $slider.find( '.popular-active' ).index();

				if ( $slider.et_animation_running ) return false;

				if ( direction == 'next' ) {
					next_tab = ( current_tab + 1 ) < tabs_number ? current_tab + 1 : 0;

					$slider_tabs.eq( next_tab ).addClass( 'popular-active' ).siblings().removeClass( 'popular-active' );
				}

				if ( direction == 'previous' ) {
					next_tab = current_tab - 1;

					if ( next_tab === -1 ) next_tab = tabs_number - 1;

					$slider_tabs.eq( next_tab ).addClass( 'popular-active' ).siblings().removeClass( 'popular-active' );
				}

				$slider.data('et_simple_slider').et_slider_move_to( next_tab );
			} );
		}

		function et_breadcrumbs_css() {
			if ( $( '#breadcrumbs' ).hasClass( 'bcn_breadcrumbs' ) ) {
				return;
			}

			$('.et_breadcrumbs_title').css( 'maxWidth', $('#breadcrumbs').width() - $('.et_breadcrumbs_content').width() - 3 );

			setTimeout( function() {
				var et_breadcrumbs_height = $('.et_breadcrumbs_title').height();
				$('#breadcrumbs a, #breadcrumbs .raquo').css( 'minHeight', et_breadcrumbs_height );
			}, 100 );
		}

		et_breadcrumbs_css();

		et_popular_tabs_height_calculate();

		function et_popular_tabs_height_calculate() {
			if ( ! $home_popular_slider.length ) return;

			$home_popular_slider.each( function() {
				var $this_el      = $(this),
					$tabs         = $this_el.find( '.popular-tabs' ),
					$content      = $this_el.find( '.popular-posts' ),
					$tabs_wrapper = $this_el.find( '.et-popular-tabs-wrap' );

				if ( $tabs.find( 'li' ).length > 4 ) {
					$tabs_wrapper.height( $tabs.find( 'li' ).eq(0).innerHeight() + $tabs.find( 'li' ).eq(1).innerHeight() + $tabs.find( 'li' ).eq(2).innerHeight() + $tabs.find( 'li' ).eq(3).innerHeight() );
				}

				$content.css( 'minHeight', $tabs_wrapper.innerHeight() + parseInt( $tabs.css( 'paddingTop' ) ) + parseInt( $tabs.css( 'paddingBottom' ) ) - 80 )
			} );
		}
	
		/* Shrink header when scrolling */
                $(window).scroll(function() {
                    if ($(document).scrollTop() > 0) {
                        $('body').addClass('small-header');
                    } else {
                        $('body').removeClass('small-header');
                    }
                });
	
		resize_function = function() {
                        et_popular_tabs_height_calculate();

                        /* Resize featured content */
                        if ($("body").hasClass("home") || $("body").hasClass("single")) {
                            if ($("#sidebar").css("float") != "none" && $("#sidebar").css("display") != "none") {
                                $("#content").width($(".main-content-wrap").width() - $("#sidebar").width() - 1);
                            } else {
                                $("#content").css("width", "");
                            }
                        }

                        /* Resize featured article images, keeping ratio */
                        var $post_width = $(".et-featured-post").width();
                        var $post_height = $(".et-featured-post").height();
                        var $post_ratio = $post_height/$post_width;

                        if ($post_ratio > $img_ratio) {
                            $(".et-featured-post img").height($post_height);
                            $(".et-featured-post img").width(Math.floor($post_height / $img_ratio));
                        } else {
                            $(".et-featured-post img").width($post_width);
                            $(".et-featured-post img").height(Math.floor($post_width * $img_ratio));
                        }
                       
                        if ( et_container_width != $et_container.width() ) {
                                et_breadcrumbs_css();

                                et_container_width = $et_container.width();
                        }

			/* Remove padding-top when category list goes under social icons */
			if ($('#left-area .entry-content').width() < ($('.share-box').outerWidth() + $('.see-more').outerWidth())) {
				$('.see-more').css('padding', '0 0 20px 0');
			} else {
				$('.see-more').css('padding', '');
			}
                };
	
		$(document).ready( function() {
			$("#logo").attr("alt", $("#logo").width());
                        
                        /* Get some original values before resizing */
                        var $img_width = $(".et-featured-post img").width();
                        var $img_height = $(".et-featured-post img").height();
                        $img_ratio = $img_height/$img_width;
			

                        resize_function();
		} );
	
		$(window).resize( function() {
                    resize_function();
                });

		$(".et-featured-post").click( function() {
			window.open($(this).find("a").attr("href"), "_self");
                });

		$comment_form.find('input:text, textarea').each(function(index,domEle){
			var $et_current_input = jQuery(domEle),
				$et_comment_label = $et_current_input.siblings('label'),
				et_comment_label_value = $et_current_input.siblings('label').text();
			if ( $et_comment_label.length ) {
				$et_comment_label.hide();
				if ( $et_current_input.siblings('span.required') ) {
					et_comment_label_value += $et_current_input.siblings('span.required').text();
					$et_current_input.siblings('span.required').hide();
				}
				$et_current_input.val(et_comment_label_value);
			}
		}).bind('focus',function(){
			var et_label_text = jQuery(this).siblings('label').text();
			if ( jQuery(this).siblings('span.required').length ) et_label_text += jQuery(this).siblings('span.required').text();
			if (jQuery(this).val() === et_label_text) jQuery(this).val("");
		}).bind('blur',function(){
			var et_label_text = jQuery(this).siblings('label').text();
			if ( jQuery(this).siblings('span.required').length ) et_label_text += jQuery(this).siblings('span.required').text();
			if (jQuery(this).val() === "") jQuery(this).val( et_label_text );
		});

		// remove placeholder text before form submission
		$comment_form.submit(function(){
			$comment_form.find('input:text, textarea').each(function(index,domEle){
				var $et_current_input = jQuery(domEle),
					$et_comment_label = $et_current_input.siblings('label'),
					et_comment_label_value = $et_current_input.siblings('label').text();

				if ( $et_comment_label.length && $et_comment_label.is(':hidden') ) {
					if ( $et_comment_label.text() == $et_current_input.val() )
						$et_current_input.val( '' );
				}
			});
		});
	});
})(jQuery)
