
/**
 * Base Class
 * @param {string} className of the class
 * @constructor
 */
jp.Base = function(className) {

  /**
   * The classname
   * @type {string}
   */
  this.className_ = className;

  /**
   * Configuration
   * @type {Object}
   */
  this.config_ = CONFIG[className.toUpperCase()] || {};
};


/**
 * This is called once an object is initialized
 */
jp.Base.prototype.initialized = function() {
  this.addLog('Initialized');
  this.addListeners();
};


/**
 * Adds a log
 * @param {string} info the log info
 * @param {*} detail further log info
 */
jp.Base.prototype.addLog = function(info, detail) {
    if (!this.getConfig('log')) {
      return;
    }

    var logger = jp.getInstance('logger');
    logger.addLog(this.className_, info, detail);
};


/**
 * Adds an error
 * @param {string} info the error info
 * @param {boolean} critical is the error critical?
 */
jp.Base.prototype.addError = function(info, critical) {
    jp.addError(info, critical);
};


/**
 * Determines if a configured param has a value
 * @param {string} param the param name
 * @return {boolean} is this param true?
 */
jp.Base.prototype.hasValue = function(param) {
  var value = this.getConfig(param);
  if (typeof value === 'string') {
    return this.getConfig(param).toBoolean();
  } else {
    return value ? true: false;
  }
};



/**
 * Gets values from the url/config
 * The url value overrides the config
 * @param {string} param the param name
 * @return {?*} whatever the config/url has for that param.
 */
jp.Base.prototype.getConfig = function(param) {
  var configValue = this.config_[param] || null,
      urlValue = getUrlParams(param);
  
  return urlValue ? urlValue : configValue;
};


/**
 * Loads a script
 * {string} scriptName the script to load
 * {Function} success handler for success
 * {Function} failure handler for failure
 */
jp.Base.prototype.loadScript = function(scriptName, success, failure) {
  failure = failure ? failure : function() {
    this.addError('Failed to load script: ' + scriptName);
  };
  $.getScript(scriptName)
    .done(success)
    .fail(failure);
};


/**
 * Adds event listeners
 */
jp.Base.prototype.addListeners = function() {};


/**
 * Call the listener
 * {string} eventName the event to listen for
 * {Function} callback the callback upon dispatch
 */
jp.Base.prototype.listen = function(eventName, callback) {
  jp.events.listen(this, eventName, jp.bind(callback, this));
};


/**
 * Call the listener
 * {string} eventName the event to listen for
 * {Object} params the params to dispatch with
 */
jp.Base.prototype.dispatch = function(eventName, params) {
  jp.events.dispatch(eventName, params);
};
