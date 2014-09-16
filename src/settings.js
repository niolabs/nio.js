NIO.utils.extendGlobal('NIO.settings', {

    socketHost: '54.85.159.254:443',
    
    serviceHost: '54.85.159.254',
    
    tileHeight: 226,
    
    tileWidth: 248,
    
    tileDurations: {
        
        // Minimum duration when being replaced by an old tile
        min: 13,

        // Minimum duration when being replaced by a new tile
        minn: 2,

        // +/- number of seconds to add to the minimum duration on each replacement
        randomOffset: 5,

        // How much to multiply the minimum by to obtain the maximum
        minMultiplier: 3
    }

});
