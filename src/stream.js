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
