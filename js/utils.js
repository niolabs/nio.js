var $ = jQuery

window.nio.utils = {

	truncate: function (str, len) {
		var txt = str.substr(0, len)
		if (txt !== str)
			txt = txt.trim() + '&hellip; (more)'
		return txt
	},

	getCurrentTime: function() {
		if (Date.now) {
			return Math.round(Date.now() / 1000)
		}
		return Math.round(new Date().getTime() / 1000)
	},

	connectToWebSocket: function(host, room) {
		var namespace = null
		var socket = null

		try {
			// TODO: Settle on a good IE-safe console.log and console.error.  Uncomment these when done.
			// console.log('connecting...')

			var room = room || 'default'

			namespace = io.connect('http://' + host, {'force new connection': true})
			socket = namespace.socket
			socket.on('connect', function(data) {
				// console.log("connected to room " + room)
				namespace.emit('ready', room)
			})
			socket.on('connect_failed', function(data) {
				// console.log('connection failed')
			})
			socket.on('error', function(data) {
				// console.log('connection error')
			})

		} catch(e) {
			// console.error("Unable to connect to stream")
			// console.error(e)
		}

		return namespace
	},

	/**
	* This will generate the HTML for a tile with a default 'blank' content.
	* It will also create the tile model, add the tile to the calling object's
	* array of tiles, and display it on the page.
	*/
	generateTile: function(ctx, tileArgs, contentArgs) {

		var contentModel = ctx.contentModel || nio.models.Post,
			tileContent = new contentModel(contentArgs)

		tileContent.set('seconds_ago', moment().diff(tileContent.get('time')), 'seconds')

		tileArgs = tileArgs || {}

		$.extend(tileArgs, {content : tileContent})

		return new nio.views.Tile({
			model: new nio.models.Tile(tileArgs)
		})

	},

	/***
	* Check that myPriority meets the priority spec.
	* maxPriority is true if the prioritySpec represents the "max priority"
	*/
	checkPriority: function(prioritySpec, myPriority, maxPriority) {
		if (maxPriority) {
			return myPriority <= prioritySpec || prioritySpec <= 0
		} else {
			return myPriority >= prioritySpec
		}
	},

	/***
		* Returns whether or not type is contained in the types list
		* Specify return_on_empty with what to return if the list is empty
		*/
	typesContains: function(types, type, return_on_empty) {
		if (types.length == 0) {
			return return_on_empty == true
		}
		return jQuery.inArray(type, types) >= 0
	},

	/***
		* Return an array tuple of the minDuration and maxDuration for the given tile
		*
		* A flag (old, new, vip) can also be passed to adjust the minimums
		*/

	getTileDurations: function(tile, flag) {
		var theMin = 0,
			theMax = tile.get('maxDuration')

		if (flag == 'new') {
			theMin = tile.get('minNewDuration')
		} else if (flag == 'vip') {
			theMin = 0
		} else {
			theMin = tile.get('minOldDuration')
		}

		return [theMin, theMax]
	},

	findAvailableTile: function(tiles, content) {

		var availableTiles = [],
			currentScore = {
				afterMax: -1, //number of seconds after the max
				minMaxPct: 0.0 //percent of the way into the range
			}

		// console.log("Finding an available tile for " + type + " - " + priority)
		for (var i=0; i<tiles.length; i++) {
			var tile = tiles[i],
				tileModel = tile.model,
				tileDiv = tile.$el

			var tileLocked = (tileDiv.hasClass("locked-click") ||
								tileDiv.hasClass("locked-mouse") ||
								tileDiv.hasClass("flipped")) ||
								tileDiv.hasClass("tile-full")

			if (tileDiv.find('.blank').length) {
				// blank tiles can't be locked
				tileLocked = false
			}

			var tileDuration = nio.utils.getCurrentTime() - tileModel.get('time'),
				priorityDurations = nio.utils.getTileDurations(tileModel, content.get('flag')),
				tileDurationAfterMin = tileDuration - priorityDurations[0],
				tileDurationAfterMax = tileDuration - priorityDurations[1],
				myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax)

			// console.log(tileModel.get('time'))

			var setTile = function() {
				availableTiles = [tile]
				currentScore = {
					afterMax: tileDurationAfterMax,
					minMaxPct: myDurationPct
				}
			}

			// console.log("Checking tile...")

			// Check if the tile already exists here
			if (tileModel.get('content').get('id') == content.get('id')) {

				if (tileModel.get('content').get('id_value') == content.get('id_value') || tileLocked) {
					// It has the same ID and has the same data, we aren't going to replace ANY tile
					// OR
					// The tile is locked, but it is our best bet

					// TODO: does this mean that if a tile is Pinned, it won't update even
					// if the original post updates?
					return false
				} else {
					// It has the same ID but has new data, return this tile for updating
					return tile
				}

			} else { // We know it's not our original tile.

				if (tileLocked) {
					// The tile is locked, move along
					continue
				}

				// Check the priority matches the spec for this tile
				if ((! nio.utils.checkPriority(tileModel.get('minPriority'), content.get('priority'), false)) ||
					(! nio.utils.checkPriority(tileModel.get('maxPriority'), content.get('priority'), true))) {
					// console.log("Priority doesn't match")
					continue
				}

				// Check if the tile type is not in the available types
				if (! nio.utils.typesContains(tileModel.get('availableTypes'), content.get('type'), true)) {
					// console.log("Tile type not included")
					continue
				}

				// Check if the tile type is in the excluded types
				if (nio.utils.typesContains(tileModel.get('excludedTypes'), content.get('type'), false)) {
					// console.log("Tile type excluded")
					continue
				}

				if (tileDurationAfterMin < 0) {
					// We haven't had the minimum time yet on this tile
					// console.log("Tile hasn't hit minimum")
					continue
				}

				if (currentScore.afterMax > 0) {
					// The current one is after the max, we better be too then
					if (tileDurationAfterMax > currentScore.afterMax) {
						// This tile is more after the max than the previous tile, so it's useable
						setTile()
					} else if (tileDurationAfterMax == currentScore.afterMax) {
						// we have an after max tie, join the party!
						availableTiles.push(tile)
					} else {
						// we are after max, but not as much so as the best option(s)
					}
					continue
				}

				if (tileDurationAfterMax > 0) {
					// we are after the max and no one else is, use this tile
					setTile()
					continue
				}

				// If we are here, that means we are after the min but before the max

				// Nothing available yet, I guess that's me!
				if (availableTiles.length == 0) {
					setTile()
					continue
				}

			}

			// Find out if we are more replaceable than the current one
			// by comparing how far into the range [minDuration, maxDuration] we are
			var myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax),
				availableDurationPct = currentScore.minMaxPct

			if (myDurationPct > availableDurationPct) {
				setTile()
			} else if (myDurationPct == availableDurationPct) {
				availableTiles.push(tile)
			}
		}

		if (availableTiles.length == 0) {
			// no available tiles? oh no!
			// console.log('no available tiles')
			return false
		} else {
			// console.log('random tile')
			// return a random tile from the list of possibles
			return availableTiles[Math.floor(Math.random() * availableTiles.length)]
		}
	},

	handleTileContent: function(tiles, oMsg, model) {

		var content = new model(oMsg)
		// console.log('content: ', content)

		var tileToReplace = nio.utils.findAvailableTile(tiles, content)

		if (!tileToReplace) {
			// console.log("No available tile for " + oMsg)
			return
		}

		var tile = tileToReplace.model
		// console.log('tile: ', tile)

		// Define what swap function we want to use
		// var swapFunc = App.utils.swapTile
		// if (tile.get('content').get('id') == content.get('id')) {
			// // we are updating a tile, not swapping in a new one
			// swapFunc = App.utils.updateTile
		// }

		tile.set({
			'time': nio.utils.getCurrentTime(),
			'content': content
		})
		//tile.resetDurations()

		return tileToReplace
	},

	isMobileBrowser: function() {
		var check = false
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera)
		return check
	}

}
