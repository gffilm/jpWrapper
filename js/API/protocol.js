
/**
 * Determines the Protocol and gets the API or AICC Information
 * @constructor
 */
jp.Protocol = function() {
  jp.base(this, 'Protocol');
  /**
   * Error Collector
   * @type {array}
   */
   this.errors_ = [];

  /**
   * Is the protocol active?
   * @type {boolean}
   */
   this.isActive_ = false;

  /**
   * The protocol
   * @type {?string}
   */
   this.protocol_ = this.findProtocol();


   this.startUp();

   this.initialized();
};
jp.inherits(jp.Protocol, jp.Base);


/**
 * Adds event listeners
 * @override
 */
jp.Protocol.prototype.addListeners = function() {
  this.listen('commit', this.commitHandler);
  this.listen('protocolReady', this.isReady);
}


/**
 * Handler for when the course called a commit
 * @param {Object} evt the custom event
 */
jp.Protocol.prototype.commitHandler = function(evt) {
  if (this.protocol_) {
    this.protocol_.commit(evt.target);  
  }
};



/**
 * Gets the protocol's data
 * @return {Object} the data
 */
jp.Protocol.prototype.getData = function() {
  var data = null;
  if (this.isActive_) {
    data = this.protocol_.getData();
  }
  return data;
}


/**
 * Starts the protocol
 */
jp.Protocol.prototype.startUp = function() {
  var fail = this.getConfig('fail');

  if (!this.protocol_) {
    jp.addError('Unable to Find Protocol', fail);
    return;
  }

  this.protocol_.initialize();
};


/**
 * The ready event for the protocol
 */
jp.Protocol.prototype.isReady = function() {
  this.addLog('Protocol is ready');
  this.isActive_ = true;
};


/**
 * Ends the protocol
 */
jp.Protocol.prototype.finish = function() {
  this.addLog('Finish called');
  if (this.isActive_) {
    this.setIMCConditions();
    this.protocol_.finish(this.isFinished);
  }
}

/**
 * Sets the protcol as finished
 */
jp.Protocol.prototype.isFinished = function() {
  this.isActive_ = false;
};


/**
 * Sets IMC specific conditions
 */
jp.Protocol.prototype.setIMCConditions = function() {
  var isIMC = /(lms.corpedia.com)|(lmsdemo.corpedia.com)/.test(window.location.href),
      win = isIMc ? this.findWindowVariable('closeWindowOnLMSFinish') : null;

  if (isIMC) {
    if (!win) {
      this.addLog('Missing closeWindowOnLMSFinish variable');
    } else {
      win['closeWindowOnLMSFinish'] = false;  
    }
  }
};


/**
 * Gets the protocol
 * @return {?{object} the protocol
 */
jp.Protocol.prototype.getProtocol = function() {
    return this.protocol_;
};


/**
 * Gets the protocol
 */
jp.Protocol.prototype.findProtocol = function(param) {
  var type = this.getConfig('type'),
      API = null,
      protocol = null,
      sid,
      url;

  switch(type) {
    case 'scorm':
      API = this.getScormAPI('API');
      if (API) {
        protocol = new jp.Scorm12Tracker(API);
      }
      break;
    case 'aicc':
      url = getUrlParams('aicc_url');
      sid = getUrlParams('aicc_sid');
      if (!url || !sid) {
        this.addError('Missing AICC information');
      } else {
        protocol = new jp.AiccTracker(url, sid);  
      }
      break;
    case 'scorm2004v3':
      API = this.getScormAPI('API_1484_11');
      if (API) {
        protocol = new jp.Scorm2004v3Tracker(API);
      }
      break;
    default:
      break;
  }

  return protocol;
};


/**
 * Find the SCORM API in multiple windows.
 * @param {string} apiName The name of the api to look for on the Window.
 * @return {?Object} The SCORM API.
 */
jp.Protocol.prototype.getScormAPI = function(apiName) {
  var scormApi = null;
  // Check the window for the scorm API
  scormApi = this.findScormAPI(window, apiName);
  // Check the window's opener for the scorm API
  if (!scormApi && window.opener) {
    scormApi = this.findScormAPI(window.opener, apiName);
  }
  // Check window's opener's opener for the scorm API
  if (!scormApi && window.opener && window.opener.opener) {
    scormApi = this.findScormAPI(window.opener.opener, apiName);
  }
  return scormApi;
};


/**
 * Recursively find the SCORM API.
 * @param {Window} win Window or frame object.
 * @param {string} apiName The name of the api to look for on the Window.
 * @return {?Object} The SCORM API.
 */
jp.Protocol.prototype.findScormAPI = function(win, apiName) {
  if (!win) {
    return null;
  }
  var api;

  try {
    // We need to wrap this in a try catch in event of permission denied issue
    api = win[apiName];
  } catch (e) {
    //Protocol.sendAlert('trk - 002f');
    return null;
  }

  while (!api && win.parent && win != win.parent) {
    win = win.parent;
    try {
      // We need to wrap this in a try catch in event of permission denied issue
      api = win[apiName];
    } catch (e) {
      //Protocol.sendAlert('trk - 002g');
      return null;
    }
  }
  return api || null;
};


/**
 * Find a variable in multiple windows.
 * @param {string} variable The name of the variable to look for on the Window.
 * @return {?Window} The Window containing the variable.
 */
jp.Protocol.prototype.findWindowVariable = function(variable) {
  var foundWindow = null;
  // Check the window for the variable
  foundWindow = this.searchWindow(window, variable);
  // Check the window's opener for the variable
  if (!foundWindow && window.opener) {
    foundWindow = this.searchWindow(window.opener, variable);
  }
  // Check window's opener's opener for the variable
  if (!foundWindow && window.opener && window.opener.opener) {
    foundWindow = this.searchWindow(window.opener.opener, variable);
  }
  return foundWindow;
};


/**
 * Recursively find a variable defined in the window.
 * @param {Window} win Window or frame object.
 * @param {string} variable The name of the varaible to look for.
 * @return {?Window} The Window containing the variable.
 */
jp.Protocol.prototype.searchWindow = function(win, variable) {
  if (!win) {
    return null;
  }
  var found;

  try {
    // We need to wrap this in a try catch in event of permission denied issue
    found = win[variable];
  } catch (e) {
    return null;
  }

  while (!found && win.parent && win != win.parent) {
    win = win.parent;
    try {
      // We need to wrap this in a try catch in event of permission denied issue
      found = win[variable];
    } catch (e) {
      return null;
    }
  }
  // If the variable is found, return the window
  if (found) {
    return win;
  } else {
    return null;
  }
};
