var htmlTemplates = htmlTemplates || {};htmlTemplates['tiles/tiles.html'] = '<header class=tile-header>\n' +
    '	<a class=tile-author>\n' +
    '		<% if (profile_image_url) { %>\n' +
    '			<img class=tile-author-avatar src="<%=profile_image_url%>" alt="<%=name%>\'s avatar">\n' +
    '		<% } %>\n' +
    '		<strong class=tile-author-name><%=name%></strong>\n' +
    '	</a>\n' +
    '	<span class=tile-actions>\n' +
    '		<span class="icon icon-<%=type%>"></span>\n' +
    '	</span>\n' +
    '</header>\n' +
    '<div class=tile-content>\n' +
    '	<% if (media_url) { %>\n' +
    '		<img class=tile-media src="<%=media_url%>" alt="<%=text%>" title="<%=text%>">\n' +
    '	<% } else { %>\n' +
    '		<%=linkify(truncate(text, 150))%>\n' +
    '	<% } %>\n' +
    '</div>\n' +
    '<footer class=tile-footer>\n' +
    '	<p class="tile-share float-left">\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-twitter"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-facebook"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-pinterest"></span>\n' +
    '		</a>\n' +
    '		<a href=#>\n' +
    '			<span class="icon icon-mini icon-envelope"></span>\n' +
    '		</a>\n' +
    '	<p class=float-right>\n' +
    '		<time is=relative-time datetime="<%=time%>">\n' +
    '			<%=time%>\n' +
    '		</time>\n' +
    '		<!--<a target=_blank href="<%=link%>">view post</a>-->\n' +
    '</footer>\n' +
    '';

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EventEmitter = (function () {
    function EventEmitter() {
    }
    EventEmitter.prototype.on = function (event, fn) {
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fn);
    };

    EventEmitter.prototype.off = function (event, fn) {
        this._events = this._events || {};
        if (event in this._events === false)
            return;
        this._events[event].splice(this._events[event].indexOf(fn), 1);
    };

    EventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        this._events = this._events || {};
        if (event in this._events === false)
            return;
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, args);
        }
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;

},{}],2:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../typings/socket.io/socket.io.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
var models = require('./models');
var stream = require('./stream');
var tiles = require('./tiles/tiles');

var JSONSource = (function (_super) {
    __extends(JSONSource, _super);
    function JSONSource(host, pollRate) {
        if (typeof pollRate === "undefined") { pollRate = 20 * 1000; }
        this.host = host;
        this.pollRate = pollRate;
        _super.call(this);
    }
    JSONSource.prototype.fetch = function (path) {
        var _this = this;
        this.path = path;
        d3.json(this.host + '/' + path, function (error, json) {
            var data = json[path];
            if (data && _.isArray(data))
                for (var i = data.length; i--;)
                    _this.push(data[i]);
            else
                _this.push(data);
        });
    };

    JSONSource.prototype.start = function (path) {
        var _this = this;
        this.fetch(path);
        this.interval = setInterval(function () {
            return _this.fetch(path);
        }, this.pollRate);
        return this;
    };

    JSONSource.prototype.pause = function () {
        clearTimeout(this.interval);
    };

    JSONSource.prototype.resume = function () {
        this.start(this.path);
    };
    return JSONSource;
})(stream.Stream);

var SocketIOSource = (function (_super) {
    __extends(SocketIOSource, _super);
    function SocketIOSource(host) {
        this.host = host;
        _super.call(this);
    }
    SocketIOSource.prototype.start = function (path) {
        var ws = this.ws = io.connect(this.host);
        var sock = ws.socket;
        path = path == 'posts' ? 'default' : path;
        sock.on('connect', function () {
            return ws.emit('ready', path);
        });
        sock.on('connect_failed', function () {
            return console.error('connection failed');
        });
        sock.on('error', function () {
            return console.error('connection error');
        });
        this.resume();
        return this;
    };
    SocketIOSource.prototype.pause = function () {
        this.ws.on('recvData', function (data) {
            return null;
        });
    };
    SocketIOSource.prototype.resume = function () {
        var _this = this;
        this.ws.on('recvData', function (data) {
            return _this.push(JSON.parse(data));
        });
    };
    return SocketIOSource;
})(stream.Stream);

var MuxSource = (function (_super) {
    __extends(MuxSource, _super);
    function MuxSource() {
        var sources = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            sources[_i] = arguments[_i + 0];
        }
        this.sources = sources;
        _super.call(this);
    }
    MuxSource.prototype.start = function (path) {
        this.sources.forEach(function (src) {
            return src.start(path);
        });
        return this;
    };
    MuxSource.prototype.pause = function () {
        this.sources.forEach(function (src) {
            return src.pause();
        });
    };
    MuxSource.prototype.resume = function () {
        this.sources.forEach(function (src) {
            return src.resume();
        });
    };
    return MuxSource;
})(stream.Stream);

var TestStream = (function (_super) {
    __extends(TestStream, _super);
    function TestStream(message, rate) {
        if (typeof message === "undefined") { message = 'hello world'; }
        if (typeof rate === "undefined") { rate = 1000; }
        var _this = this;
        setInterval(function () {
            return _this.push(message);
        }, rate);
        _super.call(this);
    }
    return TestStream;
})(stream.Stream);

var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(modelFn) {
        this.modelFn = modelFn;
        this.data = [];
        this.transforms = [];
        this.transformFn = null;
        _super.call(this);
    }
    Collection.prototype.write = function (chunk) {
        var model = new this.modelFn(chunk);
        if (!_.any(this.data, function (m) {
            return model.getID() == m.getID();
        })) {
            this.data.push(model);
            if (this.transformFn)
                this.data = this.transformFn(this.data);
            this.push(this.data);
        }
    };

    Collection.prototype.transform = function (fn) {
        this.transforms.push(fn);
        this.transformFn = this.transforms[0];
        return this;
    };

    Collection.prototype.sort = function (prop, reverse) {
        this.transform(function (data) {
            var sorted = _.sortBy(data, function (d) {
                return d[prop];
            });
            return reverse ? sorted.reverse() : sorted;
        });
        return this;
    };
    return Collection;
})(stream.Stream);

function logStream() {
    return stream.make(function (chunk) {
        console.log(chunk);
        this.push(chunk);
    });
}

var nio;
(function (nio) {
    function json(host, pollRate) {
        return new JSONSource(host, pollRate);
    }
    nio.json = json;
    function socketio(host) {
        return new SocketIOSource(host);
    }
    nio.socketio = socketio;
    function collection(modelFn) {
        return new Collection(modelFn);
    }
    nio.collection = collection;
    function showTiles(selector, src) {
        var tileView = new tiles.TileView(selector);
        var collect = new Collection(models.Post);
        collect.sort('time', true);
        src.start('posts').pipe(collect).pipe(logStream()).pipe(tileView);
        return tileView;
    }
    nio.showTiles = showTiles;
})(nio || (nio = {}));

window['nio'] = nio;

},{"./models":3,"./stream":4,"./tiles/tiles":5}],3:[function(require,module,exports){
/// <reference path="../typings/lodash/lodash.d.ts" />

var Post = (function () {
    function Post(opts) {
        this.name = null;
        this.text = null;
        this.type = null;
        this.id = null;
        this.link = null;
        this.time = null;
        this.alt_text = null;
        this.priority = "0";
        this.sensitive = false;
        this.profile_image_url = null;
        this.media_url = null;
        _.assign(this, opts);
    }
    Post.prototype.getID = function () {
        return this.id;
    };
    return Post;
})();
exports.Post = Post;

},{}],4:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require('./events');

var Stream = (function (_super) {
    __extends(Stream, _super);
    function Stream() {
        _super.apply(this, arguments);
    }
    Stream.prototype.push = function (chunk) {
        this.emit('data', chunk);
    };

    Stream.prototype.write = function (chunk) {
        this.emit('error', new Error('not implemented'));
    };

    Stream.prototype.pipe = function (dest) {
        this.on('data', dest.write.bind(dest));
        return dest;
    };
    return Stream;
})(events.EventEmitter);
exports.Stream = Stream;

function make(writeFunc) {
    var stream = new Stream();
    stream.write = writeFunc.bind(stream);
    return stream;
}
exports.make = make;

},{"./events":1}],5:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../typings/d3/d3.d.ts" />
/// <reference path="../../typings/lodash/lodash.d.ts" />
var stream = require('../stream');

var utils = require('../utils');

var template = _.template(htmlTemplates['tiles/tiles.html'], null, {
    imports: {
        'linkify': utils.linkify,
        'truncate': utils.truncate
    }
});

var TileView = (function (_super) {
    __extends(TileView, _super);
    function TileView(selector) {
        this.el = d3.select(selector);
        this.posts = [];
        this.lazyRender = _.debounce(this.render.bind(this), 1000);
        _super.call(this);
    }
    TileView.prototype.render = function () {
        var elTiles = this.el.selectAll('div').data(this.posts);

        elTiles.enter().append('div');

        elTiles.attr('class', function (p) {
            return 'tile tile-' + p.type + (p.media_url ? ' tile-has-media' : '');
        }).html(function (p) {
            return template(p);
        });

        elTiles.exit();
    };

    TileView.prototype.write = function (posts) {
        this.posts = posts;
        this.lazyRender();
        this.push(this.posts);
    };
    return TileView;
})(stream.Stream);
exports.TileView = TileView;

},{"../stream":4,"../utils":6}],6:[function(require,module,exports){
function linkify(text) {
    text = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a target=_blank href='$1'>$1</a>");
    text = text.replace(/(^|\s)@(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/$2\">@$2</a>");
    return text.replace(/(^|\s)#(\w+)/g, "$1<a target=_blank href=\"http://twitter.com/search?q=%23$2\">#$2</a>");
}
exports.linkify = linkify;

function json(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400)
            cb(JSON.parse(xhr.responseText), null);
        else
            cb(null, xhr);
    };
    xhr.onerror = function () {
        return cb(null, xhr);
    };
    xhr.send();
}
exports.json = json;

function truncate(text, len) {
    if (text.length > len)
        return text.substring(0, len - 3) + '...';
    return text;
}
exports.truncate = truncate;

},{}]},{},[2])