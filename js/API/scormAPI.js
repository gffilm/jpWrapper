/**
 * Creates a API for the course to communicate with
 * @constructor
 */
jp.Scorm_API = function() {
	jp.base(this, 'Scorm_API');

	/**
	 * The queue to send upon commit
	 * @type {!Object}
	 * @private
	 */
	this.commitQueue_ = {};

	/**
	 * The object types supported by this API
	 * @type {!Array}
	 * @private
	 */
	this.objectTypes_ = [];

	/**
	 * The stored values
	 * @type {!Object}
	 * @private
	 */
	this.storedValues_ = {};


	/**
	 * The retreived values
	 * @type {!Object}
	 * @private
	 */
	this.retreivedValues_ = {};

	/**
	 * The API
	 * @type {!Object}
	 * @private
	 */
	this.API_ = {};

	this.setScormObject();

	this.createScormAPI();

	this.initialized();
};
jp.inherits(jp.Scorm_API, jp.Base);
jp.addSingleton('Scorm_API');


/**
 * Initializes the API creation
 */
jp.Scorm_API.prototype.setScormObject = function() {
		this.objectTypes_ = [
			'cmi',
			'cmi.core',
			'cmi.core.lesson_status',
			'cmi.suspend_data',
			'cmi.core.lesson_location',
			'cmi.core.student_name',
			'cmi.core.score.raw',
			'cmi.core.exit'
		];
};


/**
 * Adds event listeners
 * @override
 */
jp.Scorm_API.prototype.addListeners = function() {
  jp.events.listen(this, 'apiValuesRetreived', this.setRetreivedValues);
}


/**
 * Sets the retreived values from the real API
 * @param {Event} evt the event dispatched
 */
jp.Scorm_API.prototype.setRetreivedValues = function(evt) {
	var data = evt.target;
	this.retreivedValues_ = data;
	this.LMSInitialize('');
};


/**
 * Gets the retreived value from the real API from a key
 * @param {string} key the data key.
 * @return {string} the data
 */
jp.Scorm_API.prototype.getProtocolData = function(key) {
	return this.retreivedValues_[key] || '';
};




/**
 * Gets the value based on a key
 * @param {string} key the name
 * @return {?string} the value
 */
jp.Scorm_API.prototype.getValueByKey = function(key) {
	return this.isDefinedKey(key) ? this.storedValues_[key] : null;
};


/**
 * Determines if a key isdefined
 * @param {string} key the name
 * @return {boolean} the value
 */
jp.Scorm_API.prototype.isDefinedKey = function(key) {
	var objectTypes = this.objectTypes_,
			objectType,
			object;

	for (objectType in objectTypes) {
			object = this.objectTypes_[objectType];
			if (object === key) {
				return true;
			}
	}
	return false;
};


/**
 * The scorm initialize API function
 * @param {string} param an empty string
 */
jp.Scorm_API.prototype.LMSInitialize = function(param) {
	this.setAPIValues();
};


/**
 * The scorm initialize API function
 * @param {string} param an empty string
 */
jp.Scorm_API.prototype.setAPIValues = function() {
	var objectType,
			object;

	// Get the value from the cookie for each object type
	for (objectType in this.objectTypes_) {
		object = this.objectTypes_[objectType];
		this.storedValues_[object] = this.getProtocolData(object);
	}
};


/**
 * The scorm get value API function
 * @param {string} key the name of the item to get
 */
jp.Scorm_API.prototype.LMSGetValue = function(key) {
	// Get the value from the matching object type
	if (!this.isDefinedKey(key)) {
		jp.addError('LMSGetValue was called to get an unkwown item ' + key, true);
		return '';
	}
	return this.storedValues_[key];
};


/**
 * The scorm set value API function
 * @param {string} key the name of the item to get
 * @return {boolean} return true regardless of success to handle our own errors
 */
jp.Scorm_API.prototype.LMSSetValue = function(key, value) {
	var key;

	if (!this.isDefinedKey(key)) {
		jp.addError('LMSSetValue was called to set an unkwown item ' + key, true);
		return true;
	}

	this.storedValues_[key] = value;
	this.commitQueue_[key] = value;
	return true;
};


/**
 * Commits the queue
 * @param {string} param an empty string
 * @return {boolean} return true regardless of success to handle our own errors
 */
jp.Scorm_API.prototype.LMSCommit = function(param) {
	this.dispatch('commit', this.commitQueue_);
	// reset the commit queue
	this.commitQueue_ = {};
	return true;
};


/**
 * The scorm finish API function
 * @param {string} param an empty string
 * @return {boolean} return true regardless of success to handle our own errors
 */
jp.Scorm_API.prototype.LMSFinish = function(param) {
	return true;
};


/**
 * The scorm finish API function
 * @param {string} param an empty string
 * @return {number} return 0 regardless of success to handle our own errors
 */
jp.Scorm_API.prototype.LMSGetLastError = function(param) {
	return 0;
};


/**
 * The scorm finish API function
 * @param {string} param an empty string
 * @return {string} return empty string regardless of success to handle our own errors
 */
jp.Scorm_API.prototype.LMSGetErrorString = function(code) {
	return '';
};


/**
 * The scorm finish API function
 * @param {string} param an empty string
 * @return {string} return empty string regardless of success to handle our own errors
 */
jp.Scorm_API.prototype.LMSGetDiagnostic = function(param) {
	return '';
};


/**
 * Creates a scorm API
 */
jp.Scorm_API.prototype.createScormAPI = function() {

	// Initialize the API
	this.API_.LMSInitialize = jp.bind(this.LMSInitialize, this);

	// Get the value of the API based on the key name
	this.API_.LMSGetValue = jp.bind(this.LMSGetValue, this);

	// Set the value to the API based on the key name
	this.API_.LMSSetValue = jp.bind(this.LMSSetValue, this);

	// Commit the last batch
	this.API_.LMSCommit =  jp.bind(this.LMSCommit, this);

	// Finish the session
	this.API_.LMSFinish = jp.bind(this.LMSFinish, this);

	// Get the error codes
	this.API_.LMSGetLastError = jp.bind(this.LMSGetLastError, this);

	// Get the error string
	this.API_.LMSGetErrorString = jp.bind(this.LMSGetErrorString, this);

	// Get the error diagnostic
	this.API_.LMSGetDiagnostic = jp.bind(this.LMSGetDiagnostic, this);

	// Sets the API with initial string values
	this.setAPIValues();


	window['API'] = this.API_;
};


/**
 * Gets the Scorm API
 * @return {Object} The Scorm Compliant API
*/
jp.Scorm_API.prototype.getAPI = function() {
	return this.API_;
};
