var $ = jQuery;

NIO.utils.extendGlobal('NIO.utils', {

	log: function(message) {
        if (window.console) {
        	console.log(message);
        };
	},

    getCurrentPath: function() {
        return window.location.pathname;
    },

	navigate: function(uri){
		if ( (uri.charAt(0)==='/' || uri.charAt(0)==='#') && uri.length > 1) {uri = uri.substring(1);}
		if (location.hash.substring(1) === uri || location.pathname.substring(1) === uri){
			Backbone.history.loadUrl();
		} else {
			Backbone.history.navigate(uri, {trigger:true});
		}
	},

    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    useStaticData: function() {
        var testData = NIO.utils.getParameterByName('testdata');
        if ('on' === testData && ('local' === App.constants.environment || 'dev' === App.constants.environment)) {
            return true;
        }
        return false;
    },

    validateEmail: function(email) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return reg.test(email);
    },

    htmlDecode: function(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    },


    /**
     * Return a clone of the USStates array.  
     * This is so that the resulting array may be modified without affecting the original.
     * @returns {Array}
     */
    getUSStates: function() {
        var returnArr = [];
        _.each(App.constants.USStates, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    /**
     * See above comment
     * @returns {Array}
     */
    getCAProvinces: function() {
        var returnArr = [];
        _.each(App.constants.CAProvinces, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    /**
     * See above comment
     * @returns {Array}
     */
    getCountries: function() {
        var returnArr = [];
        _.each(App.constants.countries, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    /**
     * See above comment
     * @returns {Array}
     */
    getISDCodes: function() {
        var returnArr = [];
        _.each(App.constants.ISDCodes, function(item, index) {
            returnArr.push(_.clone(item));
        });
        return returnArr;
    },

    getCurrentTime: function() {
        if (Date.now) {
            return Math.round(Date.now() / 1000);
       	}
        return Math.round(new Date().getTime() / 1000);
    },

    connectToWebSocket: function(room) {
    	var namespace = null;
    	var socket = null;

        try {
			// TODO: Settle on a good IE-safe console.log and console.error.  Uncomment these when done.
            // console.log('connecting...');

            var room = room || 'default';

            namespace = io.connect('http://' + App.settings.socketHost, {'force new connection': true});
			socket = namespace.socket;
            socket.on('connect', function(data) {
                // console.log("connected to room " + room);
                namespace.emit('ready', room);
            });
            socket.on('connect_failed', function(data) {
            	// console.log('connection failed');
            });
            socket.on('error', function(data) {
            	// console.log('connection error');
            });

        } catch(e) {
            // console.error("Unable to connect to stream");
            // console.error(e);
        }

        return namespace;
    },

    /**
    * This will generate the HTML for a tile with a default 'blank' content.
    * It will also create the tile model, add the tile to the calling object's
    * array of tiles, and display it on the page.  
    */
    generateTile: function(ctx, tileArgs, contentArgs) {

        var contentModel = ctx.contentModel || NIO.models.Post,
            tileContent = new contentModel(contentArgs);
        
        tileContent.set('seconds_ago', moment().diff(tileContent.get('time')), 'seconds');

        tileArgs = tileArgs || {};

        $.extend(tileArgs, {content : tileContent});

        return new NIO.views.Tile({
            model: new NIO.models.Tile(tileArgs)
        });

    },

    /***
    * Check that myPriority meets the priority spec.
    * maxPriority is true if the prioritySpec represents the "max priority"
    */
    checkPriority: function(prioritySpec, myPriority, maxPriority) {
        if (maxPriority) {
            return myPriority <= prioritySpec || prioritySpec <= 0;
        } else {
            return myPriority >= prioritySpec;
        }
    },
	
    /***
     * Returns whether or not type is contained in the types list
     * Specify return_on_empty with what to return if the list is empty
     */
    typesContains: function(types, type, return_on_empty) {
        if (types.length == 0) {
            return return_on_empty == true;
        }
        return jQuery.inArray(type, types) >= 0;
    },

    /***
     * Return an array tuple of the minDuration and maxDuration for the given tile
     *
     * A flag (old, new, vip) can also be passed to adjust the minimums
     */

    getTileDurations: function(tile, flag) {
        var theMin = 0,
            theMax = tile.get('maxDuration');

        if (flag == 'new') {
            theMin = tile.get('minNewDuration');
        } else if (flag == 'vip') {
            theMin = 0;
        } else {
            theMin = tile.get('minOldDuration');
        }

        return [theMin, theMax];
    },
	    
    findAvailableTile: function(tiles, content) {
    	
        var availableTiles = [],
            currentScore = {
                afterMax: -1, //number of seconds after the max
                minMaxPct: 0.0 //percent of the way into the range
            };
        
        // console.log("Finding an available tile for " + type + " - " + priority);
        for (var i=0; i<tiles.length; i++) {
            var tile = tiles[i],
            	tileModel = tile.model,
                tileDiv = tile.$el;
            
            var tileLocked = (tileDiv.hasClass("locked-click") || 
                                tileDiv.hasClass("locked-mouse") || 
                                tileDiv.hasClass("flipped")) ||
                                tileDiv.hasClass("tile-full");

            if (tileDiv.find('.blank').length) {
                // blank tiles can't be locked
                tileLocked = false;
            }
                                
	        var tileDuration = App.utils.getCurrentTime() - tileModel.get('time'),
	            priorityDurations = App.utils.getTileDurations(tileModel, content.get('flag')),
	            tileDurationAfterMin = tileDuration - priorityDurations[0],
	            tileDurationAfterMax = tileDuration - priorityDurations[1],
	            myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax);

		    // console.log(tileModel.get('time'));

	        var setTile = function() {
	            availableTiles = [tile];
	            currentScore = {
	                afterMax: tileDurationAfterMax,
	                minMaxPct: myDurationPct
	            };
	        };
	
            // console.log("Checking tile...");

            // Check if the tile already exists here
            if (tileModel.get('content').get('id') == content.get('id')) {
            	
                if (tileModel.get('content').get('id_value') == content.get('id_value') || tileLocked) {
                    // It has the same ID and has the same data, we aren't going to replace ANY tile
                    // OR
                    // The tile is locked, but it is our best bet

                    // TODO: does this mean that if a tile is Pinned, it won't update even
                    // if the original post updates?
                    return false;
                } else {
                    // It has the same ID but has new data, return this tile for updating
                    return tile;
                }
                
            } else { // We know it's not our original tile.
            	
            	if (tileLocked) {
	                // The tile is locked, move along
	                continue;
	            }

	            // Check the priority matches the spec for this tile
	            if ((! App.utils.checkPriority(tileModel.get('minPriority'), content.get('priority'), false)) ||
	                (! App.utils.checkPriority(tileModel.get('maxPriority'), content.get('priority'), true))) {
	                // console.log("Priority doesn't match");
	                continue;
	            }
	
	            // Check if the tile type is not in the available types
	            if (! App.utils.typesContains(tileModel.get('availableTypes'), content.get('type'), true)) {
	                // console.log("Tile type not included");
	                continue;
	            }
	
	            // Check if the tile type is in the excluded types
	            if (App.utils.typesContains(tileModel.get('excludedTypes'), content.get('type'), false)) {
	                // console.log("Tile type excluded");
	                continue;
	            }

	            if (tileDurationAfterMin < 0) {
	                // We haven't had the minimum time yet on this tile
	                // console.log("Tile hasn't hit minimum");
	                continue;
	            }

	            if (currentScore.afterMax > 0) {
	                // The current one is after the max, we better be too then
	                if (tileDurationAfterMax > currentScore.afterMax) {
	                    // This tile is more after the max than the previous tile, so it's useable
	                    setTile();
	                } else if (tileDurationAfterMax == currentScore.afterMax) {
	                    // we have an after max tie, join the party!
	                    availableTiles.push(tile);
	                } else {
	                    // we are after max, but not as much so as the best option(s)
	                }
	                continue;
	            }

	            if (tileDurationAfterMax > 0) {
	                // we are after the max and no one else is, use this tile
	                setTile();
	                continue;
	            }

	            // If we are here, that means we are after the min but before the max
	            
	            // Nothing available yet, I guess that's me!
	            if (availableTiles.length == 0) {
	                setTile();
	                continue;
	            }

			}
			
            // Find out if we are more replaceable than the current one
            // by comparing how far into the range [minDuration, maxDuration] we are
            var myDurationPct = tileDurationAfterMin / (tileDurationAfterMin - tileDurationAfterMax),
                availableDurationPct = currentScore.minMaxPct;

            if (myDurationPct > availableDurationPct) {
                setTile();
            } else if (myDurationPct == availableDurationPct) {
                availableTiles.push(tile);
            }
        }

        if (availableTiles.length == 0) {
            // no available tiles? oh no!
            // console.log('no available tiles');
            return false;
        } else {
        	// console.log('random tile');
            // return a random tile from the list of possibles
            return availableTiles[Math.floor(Math.random() * availableTiles.length)];
        }
    },

    handleTileContent: function(tiles, oMsg, model) {

		var content = new model(oMsg);
		// console.log('content: ', content);
        
        var tileToReplace = App.utils.findAvailableTile(tiles, content);

        if (!tileToReplace) {
            // console.log("No available tile for " + oMsg);
            return;
        }

		var tile = tileToReplace.model;
		// console.log('tile: ', tile);		

        // Define what swap function we want to use
        // var swapFunc = App.utils.swapTile;
        // if (tile.get('content').get('id') == content.get('id')) {
            // // we are updating a tile, not swapping in a new one
            // swapFunc = App.utils.updateTile;
        // }

        tile.set({
            'time': App.utils.getCurrentTime(),
            'content': content
        });
        tile.resetDurations();
            
        return tileToReplace;
    }

});
