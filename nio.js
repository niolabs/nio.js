var htmlTemplates = htmlTemplates || {};htmlTemplates['_tile-footer.html'] = '<div class="tile-footer">\n' +
    '	<ul class="tile-share">\n' +
    '		<li class="twitter">\n' +
    '			<a href="https://twitter.com/intent/tweet?url={{urlEscape link}}&amp;text={{urlEscape text}} - via @gobuffsio" title="Share on Twitter" target="_blank">\n' +
    '				Share on Twitter\n' +
    '			</a>\n' +
    '		<li class="facebook">\n' +
    '			<a href="http://www.facebook.com/sharer/sharer.php?s=100&amp;p[url]={{urlEscape link}}&amp;p[images][0]={{HERE}}&amp;p[title]={{HERE}}" title="Share on Facebook" target="_blank">\n' +
    '				Share on Facebook\n' +
    '			</a>\n' +
    '		<li class="pinterest">\n' +
    '			<a href="https://www.pinterest.com/pin/create/button/?url={{urlEscape link}}&amp;media={{HERE}}&amp;description={{text}}" title="Pin It" target="_blank">\n' +
    '				Pin It\n' +
    '			</a>\n' +
    '		<li class="email">\n' +
    '			<a href="mailto:?subject=Check out this post from gobuffs.io&amp;body={{text}} -- {{urlEscape link}} -- via http://gobuffs.io" title="Email It" target="_blank">\n' +
    '				Share via Email\n' +
    '			</a>\n' +
    '	</ul>\n' +
    '	<a href="{{link}}" title="View Post" target="_blank" class="post-link original-post">\n' +
    '		view post\n' +
    '	</a>\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['blank.html'] = '<div class="tile-content"></div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['facebook.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['gplus.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{alt_text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['instagram.html'] = '<div class="tile-content">\n' +
    '	<img src="{{media_url}}" alt="{{text}}" onError="this.onerror=null;this.parentNode.removeChild(this);" />\n' +
    '	{{#if text}}\n' +
    '	{{text}}\n' +
    '	{{/if}}\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="image-content">\n' +
    '		<div class="full-image" style="background-image: url(\'{{media_url}}\')"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['linkedin.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['rss.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl shortenedText}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		<span class="headline">{{{linkUrl text}}}</span>\n' +
    '		<br/><br/>\n' +
    '		{{{linkUrl alt_text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['share_flip.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="tile-content">\n' +
    '		<ul class="tile-share clearfix">\n' +
    '\n' +
    '			<li class="twitter">\n' +
    '				<a href="https://twitter.com/intent/tweet?url={{urlEscape link}}&amp;text={{text}}" title="Share on Twitter" target="_blank">\n' +
    '					Share on Twitter</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="facebook">\n' +
    '				<a href="http://www.facebook.com/sharer/sharer.php?s=100&amp;p[url]={{urlEscape link}}&amp;p[images][0]={{HERE}}&amp;p[title]={{HERE}}" title="Share on Facebook" target="_blank">\n' +
    '					Share on Facebook</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="gplus">\n' +
    '				<a href="https://plus.google.com/share?url={{urlEscape link}}" title="Share on Google Plus" target="_blank">\n' +
    '					Share on Google Plus</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="pinterest">\n' +
    '				<a href="https://www.pinterest.com/pin/create/button/?url={{urlEscape link}}&amp;media={{HERE}}&amp;description={{text}}" title="Pin It" target="_blank">\n' +
    '					Pin It</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="linkedin">\n' +
    '				<a href="https://www.linkedin.com/shareArticle?summary={{text}}&amp;url={{urlEscape link}}&amp;title={{HERE}}&amp;mini=true&amp;source=" title="Share on LinkedIn" target="_blank">\n' +
    '					Share on LinkedIn</a>\n' +
    '			</li>\n' +
    '\n' +
    '			<li class="pocket">\n' +
    '				<a href="https://getpocket.com/save?url={{urlEscape link}}" data-lang="en" data-save-url="{{link}}"  title="Save to Pocket" target="_blank">\n' +
    '					Save to Pocket</a>\n' +
    '			</li>\n' +
    '\n' +
    '		</ul>\n' +
    '	</div>\n' +
    '	<!-- /.tile-content -->\n' +
    '\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">\n' +
    '			Share This</div>\n' +
    '		<div class="close"><a href="#" title="Close">Close</a></div>\n' +
    '	</div><!-- /.tile-info -->\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['sponsored.html'] = '<div class="sponsored-flag"><p>Sponsored</p></div>\n' +
    '<div class="tile-content"><a href="#" title="{{name}}" ><img src="{{media_url}}" alt="{{text}}" /></a></div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['stat-count.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="pinned"><p>Pinned</p></div>\n' +
    '	<div class="tile-content">\n' +
    '		<div class="number">{{roundNumber (numberLocale count) 0}}</div>\n' +
    '	</div>\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">{{maxLength name 25}}</div>\n' +
    '	</div>\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['stat-percent.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="pinned"><p>Pinned</p></div>\n' +
    '	<div class="tile-content">\n' +
    '		<div class="percentage">{{roundNumber percent 0}}<sup>%</sup></div>\n' +
    '	</div>\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">{{maxLength name 25}}</div>\n' +
    '	</div>\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['stat-time.html'] = '<div class="source-wrapper {{source_type}}">\n' +
    '	<div class="pinned"><p>Pinned</p></div>\n' +
    '	<div class="tile-content">\n' +
    '		<div class="time-stamp">{{dateFormat time \'h\'}}:{{dateFormat time \'mm\'}}<span class="ampm">{{dateFormat time \'A\'}}</span></div>\n' +
    '		<div class="duration-passed">( {{timeDiff seconds_ago}} )</div>\n' +
    '	</div>\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name">{{maxLength name 25}}</div>\n' +
    '	</div>\n' +
    '</div><!-- /.source-wrapper -->\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['twitter-photo.html'] = '<div class="tile-content">\n' +
    '	<img src="{{media_url}}" alt="{{text}}" onError="this.onerror=null;this.parentNode.removeChild(this);" />\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="image-content">\n' +
    '		<div class="full-image" style="background-image: url(\'{{media_url}}\')"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['twitter.html'] = '<div class="tile-content">\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="profile-pic" style="background-image: url(\'{{profile_image_url}}?type=normal\');"></div>\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="shortContent">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="content">\n' +
    '		{{{linkUrl text}}}\n' +
    '	</div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

var htmlTemplates = htmlTemplates || {};htmlTemplates['youtube.html'] = '<div class="tile-content">\n' +
    '\n' +
    '	<div class="video-cover-image" style="background-image: url(\'http://img.youtube.com/vi/{{id}}/mqdefault.jpg\');">\n' +
    '		<div class="play-button"></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="tile-info clearfix">\n' +
    '		<div class="originator-name" title="{{name}}"><a class="originator-link">{{name}}</a></div>\n' +
    '		<div class="pinned"><p>Pinned</p></div>\n' +
    '		<div class="tile-logo"></div>\n' +
    '		<div class="close-tile"><p>Close</p></div>\n' +
    '	</div>\n' +
    '\n' +
    '	<div class="youtube-player" id="{{id}}"></div>\n' +
    '\n' +
    '	{{#ifCond seconds_ago "<" 3600}}\n' +
    '		<div class="time-since-flag {{#ifCond seconds_ago \'<\' 60}}is-new{{/ifCond}}">{{timeDiff seconds_ago}}</div>\n' +
    '	{{/ifCond}}\n' +
    '\n' +
    '	{{> tile-footer}}\n' +
    '</div>\n' +
    '';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
NIO.utils.extendGlobal('NIO.constants', {
	
    environment: (function() {
        var environments = {
            local: ['127.0.0.1', 'localhost', 'test'],
            dev: [''],
            stage: ['']
        };

        for (var key in environments) {
            for (iterator = 0; iterator < environments[key].length; iterator++) {
                if (window.location.href.match(environments[key][iterator])) {
                    return key;
                }
            }
        }

        return 'prod';
    })(),

    scrollBarWidth: (function () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild (inner);

        // TODO: remove this conditional when all of the js is loaded at the end of the DOM
        if (!document.body) {
            return false;
        }

        document.body.appendChild (outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild (outer);

        return (w1 - w2);
    })(),

    currentHost: (function() {
        return window.location.host.replace('www.','');
    })(),

    CAProvinces: [
        {value: 'ON', label: 'Ontario'},
        {value: 'QC', label: 'Quebec'},
        {value: 'NS', label: 'Nova Scotia'},
        {value: 'NB', label: 'New Brunswick'},
        {value: 'MB', label: 'Manitoba'},
        {value: 'BC', label: 'British Columbia'},
        {value: 'PE', label: 'Prince Edward Island'},
        {value: 'SK', label: 'Saskatchewan'},
        {value: 'AB', label: 'Alberta'},
        {value: 'NL', label: 'Newfoundland and Labrador'}
    ],

    USStates: [
        {value: 'AL', label: 'Alabama'},
        {value: 'AK', label: 'Alaska'},
        {value: 'AZ', label: 'Arizona'},
        {value: 'AR', label: 'Arkansas'},
        {value: 'CA', label: 'California'},
        {value: 'CO', label: 'Colorado'},
        {value: 'CT', label: 'Connecticut'},
        {value: 'DC', label: 'District of Columbia'},
        {value: 'DE', label: 'Delaware'},
        {value: 'FL', label: 'Florida'},
        {value: 'GA', label: 'Georgia'},
        {value: 'HI', label: 'Hawaii'},
        {value: 'ID', label: 'Idaho'},
        {value: 'IL', label: 'Illinois'},
        {value: 'IN', label: 'Indiana'},
        {value: 'IA', label: 'Iowa'},
        {value: 'KS', label: 'Kansas'},
        {value: 'KY', label: 'Kentucky'},
        {value: 'LA', label: 'Louisiana'},
        {value: 'ME', label: 'Maine'},
        {value: 'MD', label: 'Maryland'},
        {value: 'MA', label: 'Massachusetts'},
        {value: 'MI', label: 'Michigan'},
        {value: 'MN', label: 'Minnesota'},
        {value: 'MS', label: 'Mississippi'},
        {value: 'MO', label: 'Missouri'},
        {value: 'MT', label: 'Montana'},
        {value: 'NE', label: 'Nebraska'},
        {value: 'NV', label: 'Nevada'},
        {value: 'NH', label: 'New Hampshire'},
        {value: 'NJ', label: 'New Jersey'},
        {value: 'NM', label: 'New Mexico'},
        {value: 'NY', label: 'New York'},
        {value: 'NC', label: 'North Carolina'},
        {value: 'ND', label: 'North Dakota'},
        {value: 'OH', label: 'Ohio'},
        {value: 'OK', label: 'Oklahoma'},
        {value: 'OR', label: 'Oregon'},
        {value: 'PA', label: 'Pennsylvania'},
        {value: 'RI', label: 'Rhode Island'},
        {value: 'SC', label: 'South Carolina'},
        {value: 'SD', label: 'South Dakota'},
        {value: 'TN', label: 'Tennessee'},
        {value: 'TX', label: 'Texas'},
        {value: 'UT', label: 'Utah'},
        {value: 'VT', label: 'Vermont'},
        {value: 'VA', label: 'Virginia'},
        {value: 'WA', label: 'Washington'},
        {value: 'WV', label: 'West Virginia'},
        {value: 'WI', label: 'Wisconsin'},
        {value: 'WY', label: 'Wyoming'}
    ],

    ISDCodes: [
        {value: '001', label: 'United States'},
        {value: '027', label: 'South Africa'},
        {value: '033', label: 'France'},
        {value: '039', label: 'Italy'},
        {value: '041', label: 'Switzerland'},
        {value: '044', label: 'Great Britain'},
        {value: '049', label: 'Germany'},
        {value: '052', label: 'Mexico'},
        {value: '055', label: 'Brazil'},
        {value: '061', label: 'Australia'},
        {value: '086', label: 'China'},
        {value: '000', label: 'Other'}
    ]

});

},{}],3:[function(require,module,exports){
window.$ = jQuery;
window.compiledTemplates = {};

_.forEach([
	'blank',
	'facebook',
	'gplus',
	'instagram',
	'linkedin',
	'rss',
	'share_flip',
	'sponsored',
	'stat-count',
	'stat-percent',
	'stat-time',
	'twitter',
	'twitter-photo',
	'youtube'
], function (name) {
	var template = htmlTemplates[name + '.html']
    compiledTemplates[name] = Handlebars.compile(template)
})

Handlebars.registerPartial('tile-footer', htmlTemplates['_tile-footer.html'])

Handlebars.registerHelper('urlEscape', function(obj, options) {
    return encodeURIComponent(obj);
});

Handlebars.registerHelper('numberLocale', function(obj, options) {
    var num = parseFloat(obj);
    if(isNaN(num) || !isFinite(num)) {
		return obj;
    } else {
        return num.toLocaleString();
    }
});

Handlebars.registerHelper('stripSlashes', function(obj) {
    return obj.replace(/\\/g, '');
});

Handlebars.registerHelper('linkUrl', function(obj) {
    obj = obj.replace(/^\s*/, '');
    obj = obj.replace(/\n/g, '<br>\n');
    return obj.replace(/(http\S+)/gi, '<a href="$1" target="_blank">$1</a>');
});

// USAGE: {{#ifCond v1 '==' v2}} something to do {{/ifCond}}
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

// USAGE: {{strReplace 'TEST STRING' 'TEST' 'BETTER'}} --> 'BETTER STRING'
Handlebars.registerHelper('strReplace', function (str, search, replace) {
    return str.replace(search, replace);
});


// USAGE: {{dateFormat '2014-05-28 17:20:38.544346' 'HH'}}
Handlebars.registerHelper('dateFormat', function(dateString, dateFormat) {
	dateString = dateString.replace('T',' ');
	dateString = dateString.replace('Z','');
    var d = moment(dateString + ' +0000', 'YYYY-MM-DD HH:mm:ss.SSS Z');
    if (!(d && d.isValid())) {
        // cant parse
        return dateString;
    }

    // for formatting options, see http://momentjs.com/docs/#/displaying/format/
    return d.format(dateFormat);
});

// USAGE: {{timeDiff number_of_seconds}} -> 3 min ago
Handlebars.registerHelper('timeDiff', function(num_seconds) {
    function numberEnding (number) {
        // return (number > 1) ? 's ago' : ' ago';
        return ' ago';
    }
	if (num_seconds <= 0) {
		return 'just now!';
	}
    var years = Math.floor(num_seconds / 31536000);
    if (years) {
        return years + 'y' + numberEnding(years);
    }
    var days = Math.floor((num_seconds %= 31536000) / 86400);
    if (days) {
        return days + 'd' + numberEnding(days);
    }
    var hours = Math.floor((num_seconds %= 86400) / 3600);
    if (hours) {
        return hours + 'h' + numberEnding(hours);
    }
    var minutes = Math.floor((num_seconds %= 3600) / 60);
    if (minutes) {
        return minutes + 'm' + numberEnding(minutes);
    }
    // var seconds = num_seconds % 60;
    // if (seconds && seconds > 30) {
	if (num_seconds < 60) {
        // return seconds + 's' + numberEnding(seconds);
        return num_seconds + 's' + numberEnding(num_seconds);
    }
    return 'just now!'; //'just now' //or other string you like;
});

// USAGE: {{roundNumber number places}}
Handlebars.registerHelper('roundNumber', function(number, places) {
    return parseFloat(number).toFixed(places);
});

// USAGE: {{maxLength text len}}
Handlebars.registerHelper('maxLength', function(text, len) {
    if (text.length > len) {
        return text.substring(0, len - 3) + "...";
    }
    return text;
});

function makeTile(tileType, rows, cols, data) {
    /***
     * This function creates the HTML for a tile based on its type and data
     */
    if (!(tileType in compiledTemplates)) {
		// TODO: need an IE-safe console.log
        // console.error("No template built for tile type " + tileType);
        return;
    }

    return jQuery("<div/>")
        .addClass("tile-container")
        .addClass(tileType)
        .data('tileData', data)
        .html(compiledTemplates[tileType](data));
}

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

(function () {

	NIO.tiles = function (selector) {
		var app = require('./app');
		window.App = new app();

		// Add 'dev', 'test' or 'prod' as a class on the body tag.
		// TODO: should this be on the html tag or in a data attribute?
		jQuery('body').addClass(App.constants.environment);

		// TODO: These are done here rather than in the App object because of dependencies.
		// Could this be fixed by implementing require?
		App.getViews();
		//App.views.Page = App.getPageView();
		App.views.Page = new NIO.views.FrontPage({el: selector})
		App.initializeTooltips();

		Backbone.history.start({pushState: false, root: '/'});
	}

}())

},{"./app":1,"./constants.js":2,"./content.js":3,"./custom.js":4,"./models/Post.js":6,"./models/Stat.js":7,"./models/Tile.js":8,"./settings.js":9,"./utils.js":10,"./views/module/LookBack.js":11,"./views/module/Monitoring.js":12,"./views/module/RandomStream.js":13,"./views/module/SearchStream.js":14,"./views/module/Stream.js":15,"./views/module/Tile.js":16,"./views/page/CategoryPage.js":17,"./views/page/FrontPage.js":18,"./views/page/SinglePage.js":19}],6:[function(require,module,exports){
NIO.models.Post = Backbone.Model.extend({
	
	initialize: function(args) {
		args = args || {};

		if (args.id) {
			if (args.profile_image_url) {
				// check the img load
				// this.testImage(args.profile_image_url);
			} else {
				// console.log('type: ', args.type);
				switch (args.type) {
					case 'twitter-photo':
					case 'instagram':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-instagram.png');
					break;
					case 'facebook':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-facebook.png');
					break;
					case 'twitter':
						this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-twitter.png');
					break;
					// default:
						// this.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default.png');
				}
			}
		}
		
		var shortenedTextLength = 145;
		var shortenedText = this.get('text').substr(0, shortenedTextLength);
	    if (shortenedText !== this.get('text')) {
		    shortenedText = shortenedText.substr(0, Math.min(shortenedText.length, shortenedText.lastIndexOf(" ")));
	    	shortenedText += '&hellip; (more)';
	    }
		this.set('shortenedText', shortenedText);
	},
	
	defaults: {
		id                : 0,
		id_value          : 1,
		time              : 0,
		priority          : 1,
		type              : 'blank',
		name              : '',
		link              : '',
		text              : '',
		alt_text          : '',
		media_url         : '',
		profile_image_url : '',
		flag              : 'old',
		status_flag       : '',
		seconds_ago       : 360000
	},
	
	testImage: function(url) {
	var self = this;
    var img = new Image();
	    img.onload = function() {
	    	self.set('profile_image_url', url);
	    };
	    img.onerror = function() {
			switch (self.get('type')) {
				case 'twitter-photo':
				case 'instagram':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-instagram.png');
				break;
				case 'facebook':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-facebook.png');
				break;
				case 'twitter':
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default-twitter.png');
				break;
				default:
					self.set('profile_image_url', '/wp-content/themes/wp-theme/images/profile-default.png');
			}
	    };
	    img.src = url;
	}
	
});

NIO.collections.Posts = Backbone.Collection.extend({
	
	model: NIO.models.Post,
	
});

NIO.models.PostDictionary = Backbone.Model.extend({
	
	initialize: function() {
		this.posts = new NIO.collections.Posts();
	},
	
	url: function() {
		return 'http://' + App.settings.serviceHost + '/posts';
		// return 'http://127.0.0.1:8123/posts';
	},
	
	defaults: {
		count: 0,
		offset: 0,
		next_offset: 0,
		total: 0,
		posts: new NIO.collections.Posts()
	}
	
});


},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
NIO.models.Tile = Backbone.Model.extend({

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

    initialize: function(options) {
        this.resetDurations();
    },

    resetDurations: function() {
        this.set('minNewDuration', App.settings.tileDurations.minn);
        var randOffset = App.settings.tileDurations['randomOffset'],
            configuredMin = App.settings.tileDurations['min'],
            minOld = configuredMin + (1.0 - 2 * Math.random()) * randOffset;
    
        this.set('minOldDuration', minOld);
        this.set('maxDuration', this.get('minOldDuration') * App.settings.tileDurations['minMultiplier']);
    }

});

NIO.collections.Tiles = Backbone.Collection.extend({

    model: NIO.models.Tile

});

},{}],9:[function(require,module,exports){
NIO.utils.extendGlobal('NIO.settings', {

    socketHost: '54.85.159.254:443',
    
    serviceHost: '54.85.159.254',
    
    tileHeight: 226,
    
    tileWidth: 248,
    
    tileDurations: {
        
        // Minimum duration when being replaced by an old tile
        min: 13,

        // Minimum duration when being replaced by a new tile
        minn: 2,

        // +/- number of seconds to add to the minimum duration on each replacement
        randomOffset: 5,

        // How much to multiply the minimum by to obtain the maximum
        minMultiplier: 3
    }

});

},{}],10:[function(require,module,exports){
var $ = jQuery;

NIO.utils.extendGlobal('NIO.utils', {

	log: function(message) {
        if (window.console) {
        	console.log(message);
        };
	},

    getCurrentPath: function() {
        return window.location.pathname;
    },

	navigate: function(uri){
		if ( (uri.charAt(0)==='/' || uri.charAt(0)==='#') && uri.length > 1) {uri = uri.substring(1);}
		if (location.hash.substring(1) === uri || location.pathname.substring(1) === uri){
			Backbone.history.loadUrl();
		} else {
			Backbone.history.navigate(uri, {trigger:true});
		}
	},

    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    useStaticData: function() {
        var testData = NIO.utils.getParameterByName('testdata');
        if ('on' === testData && ('local' === App.constants.environment || 'dev' === App.constants.environment)) {
            return true;
        }
        return false;
    },

    validateEmail: function(email) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(email);
    },

    htmlDecode: function(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    },


    /**
     * Return a clone of the USStates array.  
     * This is so that the resulting array may be modified without affecting the original.
     * @returns {Array}
     */
    getUSStates: function() {
        var returnArr = [];
        _.each(App.constants.USStates, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    /**
     * See above comment
     * @returns {Array}
     */
    getCAProvinces: function() {
        var returnArr = [];
        _.each(App.constants.CAProvinces, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    /**
     * See above comment
     * @returns {Array}
     */
    getCountries: function() {
        var returnArr = [];
        _.each(App.constants.countries, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    /**
     * See above comment
     * @returns {Array}
     */
    getISDCodes: function() {
        var returnArr = [];
        _.each(App.constants.ISDCodes, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    getCurrentTime: function() {
        if (Date.now) {
            return Math.round(Date.now() / 1000);
       	}
        return Math.round(new Date().getTime() / 1000);
    },

    connectToWebSocket: function(room) {
    	var namespace = null;
    	var socket = null;

        try {
			// TODO: Settle on a good IE-safe console.log and console.error.  Uncomment these when done.
            // console.log('connecting...');

            var room = room || 'default';

            namespace = io.connect('http://' + App.settings.socketHost, {'force new connection': true});
			socket = namespace.socket;
            socket.on('connect', function(data) {
                // console.log("connected to room " + room);
                namespace.emit('ready', room);
            });
            socket.on('connect_failed', function(data) {
            	// console.log('connection failed');
            });
            socket.on('error', function(data) {
            	// console.log('connection error');
            });

        } catch(e) {
            // console.error("Unable to connect to stream");
            // console.error(e);
        }

        return namespace;
    },

    /**
    * This will generate the HTML for a tile with a default 'blank' content.
    * It will also create the tile model, add the tile to the calling object's
    * array of tiles, and display it on the page.  
    */
    generateTile: function(ctx, tileArgs, contentArgs) {

        var contentModel = ctx.contentModel || NIO.models.Post,
            tileContent = new contentModel(contentArgs);
        
        tileContent.set('seconds_ago', moment().diff(tileContent.get('time')), 'seconds');

        tileArgs = tileArgs || {};

        $.extend(tileArgs, {content : tileContent});

        return new NIO.views.Tile({
            model: new NIO.models.Tile(tileArgs)
        });

    },

    /***
    * Check that myPriority meets the priority spec.
    * maxPriority is true if the prioritySpec represents the "max priority"
    */
    checkPriority: function(prioritySpec, myPriority, maxPriority) {
        if (maxPriority) {
            return myPriority <= prioritySpec || prioritySpec <= 0;
        } else {
            return myPriority >= prioritySpec;
        }
    },
	
    /***
     * Returns whether or not type is contained in the types list
     * Specify return_on_empty with what to return if the list is empty
     */
    typesContains: function(types, type, return_on_empty) {
        if (types.length == 0) {
            return return_on_empty == true;
        }
        return jQuery.inArray(type, types) >= 0;
    },

    /***
     * Return an array tuple of the minDuration and maxDuration for the given tile
     *
     * A flag (old, new, vip) can also be passed to adjust the minimums
     */

    getTileDurations: function(tile, flag) {
        var theMin = 0,
            theMax = tile.get('maxDuration');

        if (flag == 'new') {
            theMin = tile.get('minNewDuration');
        } else if (flag == 'vip') {
            theMin = 0;
        } else {
            theMin = tile.get('minOldDuration');
        }

        return [theMin, theMax];
    },
	    
    findAvailableTile: function(tiles, content) {
    	
        var availableTiles = [],
            currentScore = {
                afterMax: -1, //number of seconds after the max
                minMaxPct: 0.0 //percent of the way into the range
            };
        
        // console.log("Finding an available tile for " + type + " - " + priority);
        for (var i=0; i<tiles.length; i++) {
            var tile = tiles[i],
            	tileModel = tile.model,
                tileDiv = tile.$el;
            
            var tileLocked = (tileDiv.hasClass("locked-click") || 
                                tileDiv.hasClass("locked-mouse") || 
                                tileDiv.hasClass("flipped")) ||
                                tileDiv.hasClass("tile-full");

            if (tileDiv.find('.blank').length) {
                // blank tiles can't be locked
                tileLocked = false;
            }
                                
	        var tileDuration = App.utils.getCurrentTime() - tileModel.get('time'),
	            priorityDurations = App.utils.getTileDurations(tileModel, content.get('flag')),
	            tileDurationAfterMin = tileDuration - priorityDurations[0],
	            tileDurationAfterMax = tileDuration - priorityDurations[1],
	            myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax);

		    // console.log(tileModel.get('time'));

	        var setTile = function() {
	            availableTiles = [tile];
	            currentScore = {
	                afterMax: tileDurationAfterMax,
	                minMaxPct: myDurationPct
	            };
	        };
	
            // console.log("Checking tile...");

            // Check if the tile already exists here
            if (tileModel.get('content').get('id') == content.get('id')) {
            	
                if (tileModel.get('content').get('id_value') == content.get('id_value') || tileLocked) {
                    // It has the same ID and has the same data, we aren't going to replace ANY tile
                    // OR
                    // The tile is locked, but it is our best bet

                    // TODO: does this mean that if a tile is Pinned, it won't update even
                    // if the original post updates?
                    return false;
                } else {
                    // It has the same ID but has new data, return this tile for updating
                    return tile;
                }
                
            } else { // We know it's not our original tile.
            	
            	if (tileLocked) {
	                // The tile is locked, move along
	                continue;
	            }

	            // Check the priority matches the spec for this tile
	            if ((! App.utils.checkPriority(tileModel.get('minPriority'), content.get('priority'), false)) ||
	                (! App.utils.checkPriority(tileModel.get('maxPriority'), content.get('priority'), true))) {
	                // console.log("Priority doesn't match");
	                continue;
	            }
	
	            // Check if the tile type is not in the available types
	            if (! App.utils.typesContains(tileModel.get('availableTypes'), content.get('type'), true)) {
	                // console.log("Tile type not included");
	                continue;
	            }
	
	            // Check if the tile type is in the excluded types
	            if (App.utils.typesContains(tileModel.get('excludedTypes'), content.get('type'), false)) {
	                // console.log("Tile type excluded");
	                continue;
	            }

	            if (tileDurationAfterMin < 0) {
	                // We haven't had the minimum time yet on this tile
	                // console.log("Tile hasn't hit minimum");
	                continue;
	            }

	            if (currentScore.afterMax > 0) {
	                // The current one is after the max, we better be too then
	                if (tileDurationAfterMax > currentScore.afterMax) {
	                    // This tile is more after the max than the previous tile, so it's useable
	                    setTile();
	                } else if (tileDurationAfterMax == currentScore.afterMax) {
	                    // we have an after max tie, join the party!
	                    availableTiles.push(tile);
	                } else {
	                    // we are after max, but not as much so as the best option(s)
	                }
	                continue;
	            }

	            if (tileDurationAfterMax > 0) {
	                // we are after the max and no one else is, use this tile
	                setTile();
	                continue;
	            }

	            // If we are here, that means we are after the min but before the max
	            
	            // Nothing available yet, I guess that's me!
	            if (availableTiles.length == 0) {
	                setTile();
	                continue;
	            }

			}
			
            // Find out if we are more replaceable than the current one
            // by comparing how far into the range [minDuration, maxDuration] we are
            var myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax),
                availableDurationPct = currentScore.minMaxPct;

            if (myDurationPct > availableDurationPct) {
                setTile();
            } else if (myDurationPct == availableDurationPct) {
                availableTiles.push(tile);
            }
        }

        if (availableTiles.length == 0) {
            // no available tiles? oh no!
            // console.log('no available tiles');
            return false;
        } else {
        	// console.log('random tile');
            // return a random tile from the list of possibles
            return availableTiles[Math.floor(Math.random() * availableTiles.length)];
        }
    },

    handleTileContent: function(tiles, oMsg, model) {

		var content = new model(oMsg);
		// console.log('content: ', content);
        
        var tileToReplace = App.utils.findAvailableTile(tiles, content);

        if (!tileToReplace) {
            // console.log("No available tile for " + oMsg);
            return;
        }

		var tile = tileToReplace.model;
		// console.log('tile: ', tile);		

        // Define what swap function we want to use
        // var swapFunc = App.utils.swapTile;
        // if (tile.get('content').get('id') == content.get('id')) {
            // // we are updating a tile, not swapping in a new one
            // swapFunc = App.utils.updateTile;
        // }

        tile.set({
            'time': App.utils.getCurrentTime(),
            'content': content
        });
        tile.resetDurations();
            
        return tileToReplace;
    }

});

},{}],11:[function(require,module,exports){
NIO.views.LookBack = Backbone.View.extend({
	
	initialize: function(args) {
		_.bindAll(this);
		var self = this;

		this.contentModel = NIO.models.Post;
		
		this.initializeTiles(args);		
	},

	initializeTiles: function(args) {
		args = args || {};
		var self = this;
			numTiles = args.numTiles || 16,
			maxDate = args.maxDate || moment().utc(),
			daysLookBack = args.daysLookBack || 1;
		
		this.tiles = [];
		this.numTiles = numTiles;
		this.maxDate = maxDate;
        this.minDate = moment(maxDate).subtract('days', daysLookBack);
		
		this.xhr = this.model.fetch({
			data: {
				limit: this.numTiles,
				minDate: this.minDate.format('YYYY-MM-DD HH:mm:ss'),
				maxDate: this.maxDate.format('YYYY-MM-DD HH:mm:ss'),
				order: 'random'
			}
		});
		this.xhr.done(self.populateTiles);

	},
	
	events: {},
	
	populateTiles: function(oResponse) {

		var self = this;

		jQuery('.body', this.$el).html(''); // clear current tiles
		
		var posts = oResponse.posts;
		
		if (posts.length == 0) {
			$('.body', this.$el).append([
				'<div class="no-results">',
				'    No results found',
				'</div>'
			].join('\n'));
			return;
		}
		
		_.each(posts, function(post, index) {
			
			var tile = App.utils.generateTile(this, {}, post);
			
			$('.body', self.$el).append(tile.el);
			
		});

		// console.log('CUSearch tiles:', this.tiles);
	}
	
});

},{}],12:[function(require,module,exports){
NIO.views.Monitoring = Backbone.View.extend({
	
	initialize: function(args) {
		_.bindAll(this);
		var self = this;
		
		this.contentModel = NIO.models.Stat;
		
		this.tiles = [];
		
		this.numTiles = 18;
		
		var contentConfig = [
			{ id: 'time- twitter'         },
			{ id: 'counts- twitter'       },
			{ id: 'time- twitter-photo'   },
			{ id: 'counts- twitter-photo' },
			{ id: 'time- linkedin'        },
			{ id: 'counts- linkedin'      },
			{ id: 'time- gplus'           },
			{ id: 'counts- gplus'         },
			{ id: 'time- youtube'         },
			{ id: 'counts- youtube'       },
			{ id: 'time- facebook'        },
			{ id: 'counts- facebook'      },
			{ id: 'time- instagram'       },
			{ id: 'counts- instagram'     },
			{ id: 'time- rss'             },
			{ id: 'counts- rss'           },
			{ id: 'disk'                  },
			{ id: 'cpu'                   }
		];
		
		_.each(contentConfig, jQuery.proxy(function(config, index) {
			
			// console.log(this.$el);
			
			var tile = App.utils.generateTile(this, {
				availableTypes: ['stat-count', 'stat-time', 'stat-percent']
			}, config)
			
			this.$el.append(tile.el);
						
			this.tiles.push(tile);
			
		}), this);
		
		var bNewConnection = !App.sockets['monitoring'];
		if (bNewConnection) {
			App.sockets['monitoring'] = App.utils.connectToWebSocket('monitoring', bNewConnection);
		}
		App.sockets['monitoring'].on('recvData', function(msg) {
			App.utils.handleTileContent(self.tiles, msg, NIO.models.Stat);
		});
		
	}
	
});

},{}],13:[function(require,module,exports){
NIO.views.RandomStream = NIO.views.Stream.extend({

    handlePost: function(post) {
        if (this.names.length === 0 || _.indexOf(this.names, post.name) != -1) {
            if (this.types.length === 0 || _.indexOf(this.types, post.type) != -1) {
                var tile = App.utils.handleTileContent(this.tiles, post, NIO.models.Post);
                if (tile) {
					// console.log(tile);
					tile.on('filterByUser', this.filterByUser);
				}
            }
        }
    },

    initializeTiles: function(args) {
        var self = this;

        // If we have filters, fetch the tiles then do the socket
        if (this.types.length || this.names.length) {

            var xhr = this.fetchTiles(args);

            xhr.done(function(oResponse) {
                self.setupSocket();
            });

        // Otherwise, start off with some blank tiles, then do the socket
        } else {

			var rows = this.getNumRows()
			var cols = this.getNumCols()
			console.log('looping', rows, cols)
            for (var row=0; row<rows; row++) {
                for (var col=0; col<cols; col++) {
                    var tileArgs = {
                        excludedTypes: ['stat-count', 'stat-time', 'stat-percent']
                    };

                    if (row >= 8) {
                        tileArgs['minPriority'] = 1;
                        tileArgs['maxPriority'] = 2;
                    } else {
                        tileArgs['minPriority'] = 5 - Math.ceil(row / 2);
                        tileArgs['maxPriority'] = 5 - Math.floor(row / 2);
                    }

                    var tile = App.utils.generateTile(this, tileArgs, {});
                    this.$el.append(tile.el);
                    this.tiles.push(tile);
					//console.log('push tile', tile, tile.el, this.$el)
                }
            }

            this.setupSocket();

        }
    }

});

},{}],14:[function(require,module,exports){
NIO.views.SearchStream = NIO.views.Stream.extend({

    handlePost: function(post) {
        var msgTime = moment(post.time);
		if (this.names.length === 0 || _.indexOf(this.names, post.name) != -1) {
	        if (this.types.length === 0 || _.indexOf(this.types, post.type) != -1) {
	            if (post.flag == 'new') {
	                if (msgTime.isSame(this.latestTime)) {
	                    // compare the ids.  if they don't match, then display it.
	                    // there will need to be some logic to make sure we don't have a string 
	                    // of posts with the exact same moment.  Maybe we should keep a simple 
	                    // array of all the ids.  Otherwise we could repeat the second-to-last 
	                    // post, USW.
	                } else if (msgTime.isAfter(this.latestTime)) {
	                    this.tileCount++;
	                    this.latestTime = msgTime;
	                    var tile = App.utils.generateTile(this, {}, post);
	                    this.tiles.push(tile);
	                    this.$el.prepend(tile.el);
	                    // this.$el.closest('.js-packery').data('packery').layout();
	                }
	            }
	        }
        }
    },

    initializeTiles: function(args) {
        var self  = this,
            xhr = this.fetchTiles(args);

        xhr.done(function(oResponse) {
            self.setupSocket();
            
            // every second, change the seconds_ago property on 
            // the content, forcing the tile to re-render.
            /* TO DISABLE TIME-AGO UPDATING, COMMENT FROM HERE */
            self.interval = setInterval(function() {
                // console.log(self.tiles);
                _.each(self.tiles, function(tile, index) {
                    var content = tile.model.get('content');
                    // console.log('foo: ', content.get('time'));
                    content.set('seconds_ago', moment().diff(moment(content.get('time')), 'seconds'));
                    tile.model.trigger('change:content');
                });
            }, 1000);
            /* TO HERE */
        });
    }

});

},{}],15:[function(require,module,exports){
NIO.views.Stream = Backbone.View.extend({

	// tagName: 'div',
	// className: 'nio-stream js-packery entry-content clearfix',
	// id: 'nio_stream_div',
	// attributes: {
		// 'data-packery-options' : '{"itemSelector":".tile"}'
	// },
	model: new NIO.models.PostDictionary(),

    initialize: function(args) {
        _.bindAll(this);

		this.types = [];
		this.names = [];

        this.contentModel = NIO.models.Post;

        this.renderTiles(args);
    },

    renderTiles: function(args) {
        args = args || {};
        args.types = args.types || this.types || [];
        args.names = args.names || this.names || [];

		// console.log('renderTiles args: ', args);

        this.types = _.compact(args.types);
        this.names = _.compact(args.names);

        this.latestTime = moment(0);
        this.tileCount = 0;
        this.$el.html('');
        this.tiles = [];
        this.tileCount = this.getNumRows() * this.getNumCols();

        this.initializeTiles(args);
    },

    setupSocket: function() {
        // Connect to the socket.  Force a new connection only if
        // there's not an existing connection.
        // console.log(bNewConnection, App.sockets);
        if (!('default' in App.sockets)) {
            App.sockets['default'] = App.utils.connectToWebSocket('default');
        }
        App.sockets['default'].on('recvData', this.handleMsg);
        App.sockets['default'].socket.on('error', this.showFetchError);
        App.sockets['default'].socket.on('connect_failed', this.showFetchError);
    },

    killEvents: function() {
        var self = this;
        //TODO: this interval only needs to be cleared in the SearchStream.
        window.clearInterval(self.interval);
        App.sockets['default'].removeAllListeners('recvData');
    },

    getNumRows: function() {
        /** Returns the number of rows based on the available space **/
        //var height = jQuery('.main-content-wrap').height();
		//TODO: revert this
		var height = 1000
        var numRows = Math.ceil(height/App.settings.tileHeight);

        return Math.min(11, numRows);
    },

    getNumCols: function() {
        /** Returns the number of columns for tiles based on the available space **/
        //var width = this.$el.width();
		//TODO: revert this
		var width = 1000
        var numCols = Math.floor(width/App.settings.tileWidth);

        return numCols;
    },

    fetchTiles: function(args) {
        var self  = this;

		args.names = args.names.join(',');
		args.types = args.types.join(',');

        if (this.postXHR) {
            this.postXHR.abort();
        }
        this.postXHR = this.model.fetch({
            data: _.extend(args, {limit: this.tileCount})
        });
        this.postXHR
			.done(this.populateSearchTiles)
			.fail(this.showFetchError);
        return this.postXHR;
    },

	showFetchError: function (xhr, errMsg) {
		this.$el.html([
			'<div class="fetch-error">',
			'    <div class="text">Oops!  Something broke.</div>',
			'    <div class="subtext">Don\'t worry, we\'re on it.  Please refresh the page in a few minutes.</div>',
			'</div>'
		].join('\n'));
	},

    populateSearchTiles: function(oResponse) {
        var self = this;

        var posts = _.sortBy(oResponse.posts, function(post) {
            return parseFloat(moment(post.time).format('X.SSS'));
        });

		if (posts.length === 0) {
			this.$el.html([
				'<div class="no-results">',
				'    <div class="text">No results found.</div>',
				'    <div class="subtext">Please try a different filter.</div>',
				'</div>'
			].join('\n'));
		}

        _.each(posts, function(post, index) {

            var tile = App.utils.generateTile(self, {}, post);
            var content = tile.model.get('content');
            var contentTime = moment(content.get('time'));
            if (contentTime.isAfter(self.latestTime)) {
                self.latestTime = contentTime;
            }

            tile.on('filterByUser', self.filterByUser);

            self.$el.prepend(tile.el);
            self.tiles.push(tile);

        });

    },

    jumpToTiles: function() {
	// Jump to tiles
	var $offset = $("#sidebar").offset().top - $("#main-header").height();
	$('html, body').animate({ scrollTop: $offset }, 1000);
    },

	filterByUser: function(args) {
		// console.log('triggered filterByUser in Stream');
		this.trigger('filterByUser', args);
		this.renderTiles(args);
		this.jumpToTiles();
	},

    handleMsg: function(msg) {
        oMsg = $.parseJSON(msg);
        oMsg.time = oMsg.time + ' UTC';
        this.handlePost(oMsg);
    }

});

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
NIO.views.CategoryPage = Backbone.View.extend({
	
	initialize: function(args) {
		_.bindAll(this);
		var self = this;
		
		this.args = {};
	}
	
});

},{}],18:[function(require,module,exports){
NIO.views.FrontPage = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this);
		var self = this;

		this.args = {};
		this.streamView = 'RandomStream';

		this.initializeViews();
		this.initializeListeners();
	},

	initializeListeners: function() {
		// $(window).on('resize', this.refreshViews);
		this.Stream.on('filterByUser', this.filterByUser);
	},

	filterByUser: function(args) {
		// console.log('triggered filterByUser in Page');
		this.Header.filterByUser(args);
	},

	switchViews: function(args) {
		args = args || this.args;
		this.args = args;
		// console.log(args);
		// this.Stream.remove();
		// TODO: I would like to use remove() here but it gets rid of the view's el as well.
		this.Stream.$el.html('');
		this.Stream.killEvents();
		this.Stream.stopListening();
		this.Stream.undelegateEvents();
		this.Stream = new NIO.views[args.view]({
			el: '#nio_stream_div'
		});
	},

	refreshViews: function(args) {
		// console.log('refreshViews args: ', args);
		if (args.originalEvent) { args = {}; }
		args = args || this.args;
		this.args = args;
		this.Stream.renderTiles(args);
	},

	initializeViews: function() {
		this.Stream = new NIO.views[this.streamView]({
			el: '#nio_stream_div'
		});
	},

    getStartOfToday: function() {
        return moment().hours(0).minutes(0).seconds(0).utc();
    }

});

},{}],19:[function(require,module,exports){
NIO.views.SinglePage = Backbone.View.extend({

	initialize: function(args) {
		_.bindAll(this);
		this.args = {};
		this.initializeViews();
		this.initializeListeners();
	},

	initializeListeners: function() {
		var self = this;

		this.Stream.on('filterByUser', this.filterByUser);
	},

	filterByUser: function(args) {
		// console.log('triggered filterByUser in Page');
		//this.Header.filterByUser(args);
	},

	switchViews: function(args) {
		args = args || this.args;
		this.args = args;
		// console.log(args);
		// this.Stream.remove();
		// TODO: I would like to use remove() here but it gets rid of the view's el as well.
		this.Stream.$el.html('');
		this.Stream.killEvents();
		this.Stream.stopListening();
		this.Stream.undelegateEvents();
		this.Stream = new NIO.views[args.view]({
			el: '#nio_stream_div'
		});
	},

	refreshViews: function(args) {
		// console.log('refreshViews args: ', args);
		if (args.originalEvent) { args = {}; }
		args = args || this.args;
		this.args = args;
		this.Stream.renderTiles(args);
	},

	initializeViews: function() {

		this.Stream = new NIO.views.RandomStream({
			el: '#nio_stream_div'
		});
	},

    getStartOfToday: function() {
        return moment().hours(0).minutes(0).seconds(0).utc();
    }

});

},{}]},{},[5])