nio.js
======

nio.js is a Javascript library for visualizing nio services.

Usage
-----

## Requirements

- d3.js
- lodash

Additionally, if you want to use Socket.IO as a source you will need to include
the script on the page.

## Install

To install, just include `nio.min.css` and `nio.min.js`.

```html
<link rel=stylesheet href=nio.min.css>
<script src=nio.min.js></script>
```

Full example
------------

This will display a single tweet. It uses a plain old Javascript object as the
source for posts.

```html
<!doctype>
<meta charset=utf-8>
<title>nio.js - Full Example</title>
<link rel=stylesheet href=nio.min.css>
<script src=components/lodash/dist/lodash.min.js></script>
<script src=components/d3/d3.min.js></script>
<script src=nio.min.js></script>
<script>
	nio.tiles('body')([{
		name: "GoBuffsio",
		text: "RT @peterlacis: Very cool listening to @MJohnson850KOA about how he got
		into voice &amp; broadcast work #verycool #gobuffs Thanks for this @GoBuffsio",
		type: "twitter",
		id: "512634643641016320",
		link: "http://twitter.com/statuses/512634643641016320",
		media_url: null,
		time: "2014-09-18T16:10:00.065Z",
		profile_image_url: "http://pbs.twimg.com/profile_images/502951937185021952/Us3rsjrS_normal.png",
		alt_text: "Your World in Real-Time - University of Colorado #GoBuffsio
		http://Instagram.com/gobuffsio http://Facebook.com/gobuffsio",
		priority: "0",
		sensitive: false
	}])
</script>
```

This uses a JSON API as a source for posts:

```javascript
nio.tiles('body').source(nio.json('http://54.85.159.254'))
```

This uses a Socket.IO server as a source for posts:

```javascript
nio.tiles('body').source(nio.socketio('http://54.85.159.254:443'))
```

This uses posts from multiple sources:

```javascript
nio.tiles('body').source([
	nio.json('http://54.85.159.254'),
	nio.socketio('http://54.85.159.254:443')
])
```

This uses multiple sources, adds a filter, and limits the number of posts:

```javascript
var mux = nio.mux()
	.source(nio.json('http://54.85.159.254'))
	.source(nio.socketio('http://54.85.159.254:443'))
	.limit(30)
	.filter(function (obj) { return obj.name === 'GoBuffsio' })
nio.tiles('body').source(mux)
```

See `index.html` for a working example.

Development
-----------

To get started, clone the repository and run make:

```bash
git clone git@github.com:neutralio/nio.js.git && cd nio.js && make
```

If you already have the dependencies installed and just want to auto-rebuild
whenever there are changes, run `make build`.
