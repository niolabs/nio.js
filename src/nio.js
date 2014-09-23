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
