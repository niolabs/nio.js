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
