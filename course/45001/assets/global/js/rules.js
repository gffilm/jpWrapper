	/*
	* CASCADE DEM0
	* -----------------------------------------------------------------------------
	*/



// Remove the following for demo 1:
cpda.cjs.addRule('#c45001x005, #c45001x006, #c45001x007, #c45001x009, #c45001x010, #c45001x013, #c45001x014, #c45001x015, #c45001x018, #c45001x019, c45001x020, #c45001x021, #c45001x022, #c45001x031, #c45001x086, #c45001x084, #c45001x030, #c45001x009b, #c45001x023, #c45001x024, #c45001x045, #c45001x050, #c45001x051, #c45001x009m', {
		includeContent: false,
		required: false
});



// Include the following for demo 2:
cpda.cjs.addRule('#c45001x005, #c45001x006, #c45001x007, #c45001x009, #c45001x010, #c45001x013, #c45001x014, #c45001x015, #c45001x018, #c45001x019, c45001x020, #c45001x021, #c45001x022', {
		includeContent: true,
		required: true
});




/* Packman Added Merged Files */

if (!cpda.browser.Features.PLAY_MEDIA_WITHOUT_CLICK) {
  cpda.cjs.addRule('#c45001x008 .cpda-content, #c45001x012 .cpda-content', {
    'audioUrl': null
  });

  cpda.cjs.addRule('.cpda-page', {
    'contentDelay': null,
    'showFx': null
  });

  cpda.cjs.addRule('#c45001x008', {
    'backgroundAudioAssetKey': 'c45001x008'
  });

  cpda.cjs.addRule('#c45001x012', {
    'backgroundAudioAssetKey': 'c45001x012'
  });

}
