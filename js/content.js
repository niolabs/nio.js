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
