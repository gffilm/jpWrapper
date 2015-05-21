// Create a closure for the deps, for security
(function() {
/*
 * The Global app object
 */
var deps = {};

/*
 * Defines the app name
*/
var APPNAME = CONFIG['APPNAME'];

/*
 * Creates the application object
*/
window[APPNAME] = {};

/*
 * Define if production mode
 * @define Production mode
 */
deps.PRODUCTION_MODE = CONFIG['PRODUCTION'];


/*
 * Define if logging mode for just this process
 * @define Log mode
 */
deps.LOG = CONFIG['LOGGING_ENABLED'];

/*
 * The currently load scripts
 * @type {number}
 */
deps.loadedScripts = 0;

/*
 * The interval used for ensuring a script is loaded
 * @type {window.interval}
 */
deps.interval = [];


/*
 * Is the window closing?
 * @type {boolean}
 */
deps.finishing = false;


/*
 * Avoids errors if there is not a console when logging
*/
if (!window.console) {
  console = {};
  console.log = function() {};
}


/*
 * The startup function called from the index file
 * @public
 * @return {array} scripts to load
*/
deps.getScripts = function() {
  // Set the scripts
  if (deps.PRODUCTION_MODE) {
    // Override
    CONFIG['LOADER_SCRIPTS'] = CONFIG['LOADER_SCRIPTS_PROD']
  }

  return CONFIG['LOADER_SCRIPTS'];
};


/*
 * Gets the current script to load
 * @return {string} the script to load
*/
deps.getCurrentScript = function() {
  return deps.getScripts()[deps.loadedScripts];
};

/**
 * Loads the scripts
 * @public
 */
deps.loadScripts = function() {
  var script = deps.getCurrentScript();
  if (script) {
    deps.loadScript(script);
  } else {
    if (deps.LOG) {
      console.log('Finished loading all scripts, starting engine');
    }
    window[APPNAME].start();
  }
}


/**
 * Creates the header script required for the scripts to load
 * {string} scriptName the script to load
 */
deps.loadScript = function(scriptFileName) {
  $.getScript(scriptFileName)
    .done(deps.loadScriptSuccess)
    .fail(deps.loadScriptFailure);
};


/**
 * Handles a succesful loaded script
 */
deps.loadScriptSuccess = function() {
  if (deps.LOG) {
    console.log('successfully loaded', deps.getCurrentScript());
  }
  deps.loadedScripts++;
  deps.loadScripts();
}


/**
 * Handles a failed loaded script
 * @param {Object} error the detailed error
 * @param {string} cause the cause of the error
 * @param {string} errorDetail the detailed error
 */
deps.loadScriptFailure = function(error, cause, errorDetail) {
  if (!deps.finishing) {
    console.log(deps.getCurrentScript());
    console.log(errorDetail);
    alert('Failed to load required scripts');
  }
}

/**
 * Handler if the window unloads before scripts are fully loaded
 */
window.onunload = function() {
      deps.finishing = true;
};

window.onbeforeunload = function() {
      deps.finishing = true;
};

/**
 * Starts loading scripts
 */
$(document).ready(function() {
  deps.loadScripts();
});
})();