
/**
 * Determines the Protocol and gets the API or AICC Information
 * @param {string} url the url to communicate with
 * @param {string} sid the session id
 * @constructor
 */
jp.AiccTracker = function(url, sid) {
	jp.base(this, 'AICC_Tracker');
	
	/**
	 * The url
	 * @type {string}
	 */
	this.URL_ = url;

		/**
	 * The session id
	 * @type {string}
	 */
	this.SID_ = sid;

	/**
	 * The API Data
	 * @type {Object}
	 */
	this.APIData_ = {};

	/**
	 * The SWF Component
	 * @type {FlashObject}
	 */
	this.swfElement_ = null;

	/*
	* The default status for complete
	* @type {string}
	*/
	this.defaultExitStatusForComplete_ = '';

	/*
	* The default status for incomplete
	* @type {string}
	*/
	this.defaultExitStatusForInComplete_ = 'suspend';

	this.initialized();
};
jp.inherits(jp.AiccTracker, jp.Base);
jp.addSingleton('AiccTracker');


/**
 * Adds event listeners
 */
jp.AiccTracker.prototype.addListeners = function() {
	this.listen('serverResponse', this.handleServerResponse);
};


/**
 * Gets the retrievable values from the API
 * @return {Array} the retrievable values from the API
 */
jp.AiccTracker.prototype.getRetrievableValues = function() {
		return [];
};


/**
 * Returns a object detailing the API function signals used to communicate with the API
 * @return {object} the function names with key and values
 */
jp.AiccTracker.prototype.getFunctionNames = function() {
	return {};
};


/**
 * Gets the form data
 * @return {object} the form data for initialization
 */
jp.AiccTracker.prototype.getFormData = function() {
	return {
		'version': '2.0',
		'session_id': this.SID_,
		'command': 'getparam',
		'aicc_data': '',
		'exit': this.defaultExitStatusForInComplete_,
	}
};


/*
 * Handles the server response
 * @param {Event} evt the event response
*/
jp.AiccTracker.prototype.handleServerResponse = function(evt) {
	var response = evt.target,
		success = this.checkForAICCErrors(response);

	if (success) {
		this.dispatch('apiValuesRetreived', response);
	}
};


/*
 * Checks for AICC errors
 * @param {string} response the response
 * @return {boolean} true if no errors
*/
jp.AiccTracker.prototype.checkForAICCErrors = function(response) {
	var regex = new RegExp('(error=[1-9])'),
		noWhiteSpaceResponse = response.replace(/ /g, ''),
		status = evt.status,
		success = true;

	if (regex.test(noWhiteSpaceResponse)) {
		this.addLog('swfProxy reported an error');
		success = false;
	}

	return success;
};


/**
 * Gets all values from the API as a single data object
 * @return {Object} the data from the API
 */
jp.AiccTracker.prototype.getData = function() {
	return this.APIData_;
};

/**
 * Initializes the AICC Session
 * @return {boolean} did it initialize?
 */
jp.AiccTracker.prototype.initialize = function() {
	var request = {};

	request.data = this.getFormData();
	request.url = this.URL_;
	request.method = 'POST';
	this.dispatch('serverRequest', request);
	return true;
};


/**
 * Finishes the API
 * @param {Function} callback the callback when the API is finished
 */
jp.AiccTracker.prototype.getApiFunction = function(name) {
	return this.API_[this.getFunctionNames()[name]];
};


/**
 * Finishes the API
 * @param {Function} callback the callback when the API is finished
 */
jp.AiccTracker.prototype.finish = function(callback) {
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
jp.AiccTracker.prototype.getValue = function(key) {
	return this.getApiFunction('GET')(key);
};


/**
 * Sets values to the API
 * @param {string} key the data key to set
 * @param {string} value the data value to set
 */
jp.AiccTracker.prototype.setValue = function(key, value) {
	this.addLog('Setting: ' + key + ' to: ', value);
	this.getApiFunction('SET')(key, value);
	this.APIData_[key] = value;
};


/**
 * Sets and then commits values to the API
 * @param {Array[key, value]} data the data to commit
 */
jp.AiccTracker.prototype.commit = function(data) {
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
		this.communicateWithServer();
	}
};


/**
 * Gets an error from the API
 * @param {string} key the data key to set
 */
jp.AiccTracker.prototype.getError = function(key, value) {
	var error = this.getApiFunction('ERROR')(''),
			errorString = this.getApiFunction('ERROR_STRING')(error);

	if (error > 0) {
		this.addLog('Error String: ' + errorString);
		this.addError('API reported an error of: ' + error, true);
	}
};
