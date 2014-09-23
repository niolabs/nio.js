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
