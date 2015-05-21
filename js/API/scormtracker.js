
/**
 * Determines the Protocol and gets the API or AICC Information
 * @param {Object} API the API to communicate with
 * @param {string} name of the ScormTracker
 * @constructor
 */
jp.ScormTracker = function(API, name) {
  jp.base(this, name);
  
  /**
   * The real scorm API
   * @type {Object}
   */
    this.API_ = API;

  /**
   * The API Data
   * @type {Object}
   */
    this.APIData_ = {};

    /*
    * The default status for complete
    * @type {string}
    */
    this.defaultExitStatusForComplete_ = '';

    /*
    * The default status for incomplete
    * @type {string}
    */
    this.defaultExitStatusForInComplete_ = '';
};
jp.inherits(jp.ScormTracker, jp.Base);
jp.addSingleton('ScormTracker');


/**
 * Gets the retrievable values from the API
 * @return {Array} the retrievable values from the API
 */
jp.ScormTracker.prototype.getRetrievableValues = function() {
    return [];
};



/**
 * Returns a object detailing the API function signals used to communicate with the API
 * @return {object} the function names with key and values
 */
jp.ScormTracker.prototype.getFunctionNames = function() {
  return {}
};


/**
 * Gets initial values from the API
 */
jp.ScormTracker.prototype.getValues = function() {
  var items = this.getRetrievableValues(),
      totalItems = items.length,
      key,
      value,
      i = 0;

  for (i; i < totalItems; i++) {
    key = items[i];
    value = this.getValue(key);
    this.APIData_[key] = value;
    if (value === '') {
      value = 'Empty String';
    }
    this.addLog('Retrieved Values with ' + key, value);
  }

  this.dispatch('apiValuesRetreived', this.APIData_);
};



/**
 * Gets all values from the API as a single data object
 * @return {Object} the data from the API
 */
jp.ScormTracker.prototype.getData = function() {
  return this.APIData_;
};

/**
 * Initializes the API
 * @return {boolean} did it initialize?
 */
jp.ScormTracker.prototype.initialize = function() {
  var init = this.getApiFunction('INIT')('');
  if (!init) {
    //this.addError('Failed to initialize', true);
    // return false;
    // for now
    this.getValues();
  } else {
    this.getValues();
  }

  this.dispatch('protocolReady');
  return true;
};


/**
 * Finishes the API
 * @param {Function} callback the callback when the API is finished
 */
jp.ScormTracker.prototype.getApiFunction = function(name) {
  return this.API_[this.getFunctionNames()[name]];
};


/**
 * Finishes the API
 * @param {Function} callback the callback when the API is finished
 */
jp.ScormTracker.prototype.finish = function(callback) {
  var closed = this.getApiFunction('END')('');
  if (!closed) {
    this.addError('Failed to close', true);
  }

  if (callback) {
    callback();
  }
};


/**
 * Gets values from the API
 * @param {string} key the data key to get
 * @return {string} the value from the API
 */
jp.ScormTracker.prototype.getValue = function(key) {
  myt = this;
  return this.getApiFunction('GET')(key);
};


/**
 * Sets values to the API
 * @param {string} key the data key to set
 * @param {string} value the data value to set
 */
jp.ScormTracker.prototype.setValue = function(key, value) {
  this.addLog('Setting: ' + key + ' to: ', value);
  this.getApiFunction('SET')(key, value);
  this.APIData_[key] = value;
};


/**
 * Sets and then commits values to the API
 * @param {Array[key, value]} data the data to commit
 */
jp.ScormTracker.prototype.commit = function(data) {
  var key,
      value,
      dataChange = false,
      i = 0;

  // Set each key and value pair
  for (key in data) {
    value = data[key];
    if (this.APIData_[key] !== value) {
      dataChange = true;
      this.setValue(key, value);
    }
  }

  // Commit if data was changed
  if (dataChange) {
    this.addLog('Committing');
    this.getApiFunction('COMMIT')('');
    this.getValues();
  }
};


/**
 * Gets an error from the API
 * @param {string} key the data key to set
 */
jp.ScormTracker.prototype.getError = function(key, value) {
  var error = this.getApiFunction('ERROR')(''),
      errorString = this.getApiFunction('ERROR_STRING')(error);

  if (error > 0) {
    this.addLog('Error String: ' + errorString);
    this.addError('API reported an error of: ' + error, true);
  }
};
