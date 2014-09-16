nio.utils.extendGlobal('nio.constants', {

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
});
