nio.js
======

nio.js is a Javascript library for interfacing with nio services.

Usage
-----

To begin, include `nio.min.js` and `nio.min.css`:

```html
<script src=nio.min.js></script>
<link rel=stylesheet href=nio.min.css>
```

### Tiles

Display tiles (as seen on [gobuffs.io](//gobuffs.io)):

```html
<div id=tiles></div>
<script>
	NIO.tiles({
		el: '#tiles',
		socketHost: '54.85.159.254:443',
		serviceHost: '54.85.159.254'
	})
</script>
```

### Stats

Coming soon

### Graphs

Coming soon

Development
-----------

To get started, clone the repository and run make:

```bash
git clone git@github.com:neutralio/nio.js.git && cd nio.js && make
```

If you already have the dependencies installed and just want to auto-rebuild
whenever there are changes, run `make build`.
