
/**
 * Determines the Protocol and gets the API or AICC Information
 * @constructor
 */
jp.Storage = function() {
  jp.base(this, 'Storage');

  /**
   * The local data keys saved
   * @type {Array}
   * @private
   */
  this.savedLocalKeys_ = [];

  /**
   * The data stored
   * @type {Object}
   */
  this.data_ = [];

  /**
   * The method of saving
   * @type {?function}
   * @private
   */
  this.savingMethod_ = null;

  /**
   * The method of retrieval
   * @type {?function}
   * @private
   */
  this.retrievingMethod_ = null;


  this.setMethods();

  this.initialized();
};
jp.inherits(jp.Storage, jp.Base);
jp.addSingleton('storage');




/**
 * Adds event listeners
 * @override
 */
jp.Storage.prototype.addListeners = function() {
  if (this.getConfig('store')) {
    this.listen('commit', this.save);
  } else {
    this.addLog('Not storing locally');
  }
}


/**
 * The save data handler
 * @param {Event} evt the event
 */
jp.Storage.prototype.save = function(evt) {
  var data = evt.target,
      key,
      value;

  for (key in data) {
    value = data[key];
    this.saveLocalData(key, value);
    this.data_[key] = value;
  }
  this.addLog('Saving', data);
};


/**
 * Gets stored data
 * @return {object} the stored data
 */
jp.Storage.prototype.getData = function() {
  return this.data_;
};



/**
 * Sets the saving/retrieving methods
 * @return {?Function} the saving method
 */
jp.Storage.prototype.setMethods = function() {
  var storage = this.getConfig('storage');
  
  switch(storage) {
    case 'cookies':
    case 'cookie':
      if (this.verifyCookies()) {
        this.savingMethod_ = this.setCookie;
        this.retrievingMethod_ = this.getCookie;
        this.addLog('Using cookies');
      } else {
        this.addError('Unable to verify cookies');
      }
      break;
    case 'localStorage':
      this.addLog('No localStorage method yet');
      break;
    default:
      if (this.verifyCookies()) {
        this.savingMethod_ = this.setCookie;
        this.retrievingMethod_ = this.getCookie;
        this.addLog('Defaulted to using cookies');
      } else {
        this.addLog('No localStorage method yet');
      }
      break;
  }
};


/**
 * Saves data using the saving method
 * @param {string} key the key to save
 * @param {string} value the values to save
 */
jp.Storage.prototype.saveLocalData = function(key, value) {
  if (this.savingMethod_) {
    this.savingMethod_(key, value);
    this.savedLocalKeys_.push(key);
  }
};



/**
 * Saves data using the saving method
 * @param {string} key the key to save
 * @param {string} value the values to save
 */
jp.Storage.prototype.getLocalData = function(key, value) {
  if (this.retrievingMethod_) {
    this.getMethod_(key, value);
  }
};



/**
 * Deletes all cookies that were saved
 */
jp.Storage.prototype.deleteCookies = function() {
  var items = this.savedLocalKeys_,
      totalItems = items.length,
      item,
      i = 0;

  for (i; i < totalItems; i++) {
    item = items[i];
    this.deleteCookie(item);
  }
};


/**
 * Sets a cookie by encoding the value and setting an expiration date
 * @param {string} name of the cookie.
 * @param {string|Array} value of the cookie.
*/
jp.Storage.prototype.setCookie = function(name, value) {
  if (!setCookie(name, value)) {
    this.addLog('Failed to set cookie: ' + name);
  }
};


/**
 * Gets a cookie
 * @param {string} name of the cookie to get.
 * @return {string|Array} the value of the cookie.
*/
jp.Storage.prototype.getCookie = function(name) {
  return getCookie(name);
};


/**
 * Deletes a cookie by setting an expired date
 * @param {string} name of the cookie.
*/
jp.Storage.prototype.deleteCookie = function(name) {
  deleteCookie(name);
};


/**
 * Determines if cookies are enabled
 * @return {!boolean} are cookies enabled?
*/
jp.Storage.prototype.verifyCookies = function() {
  return verifyCookies();
};
