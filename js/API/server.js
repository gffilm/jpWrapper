
/**
 * Backend handler
 * @constructor
 */
jp.Server = function() {
    jp.base(this, 'Server');
    
    /**
     * The sender type
     * @type {string}
     */
    this.sender_ = null;

    /**
     * Has the swfproxy been loaded
     * @type {boolean}
     */
    this.swfLoaded_ = false;

    /**
     * Are we in middle of requesting?
     * @type {boolean}
     */
    this.requesting_ = false;

    /**
     * Have we attempted flash?
     * @type {boolean}
     */
    this.attemptedFlash_ = false;

    /**
     * Have we attempted ajax?
     * @type {boolean}
     */
    this.attemptedAjax_ = false;

    /**
     * Have we submitted a critical error?
     * @type {boolean}
     */
    this.addedCriticalError_ = false;


    this.initialized();
};
jp.inherits(jp.Server, jp.Base);



/**
 * Adds event listeners
 */
jp.Server.prototype.addListeners = function() {
    this.listen('serverRequest', this.handleRequest_);
    // Flash Events
    window['onSwfProxyResponse'] = jp.bind(this.handleSwfProxyResponse, this);
    window['onSwfProxyLoaded'] = jp.bind(this.verifySWFLoaded, this);
};


/**
 * Communicates with the server via swfproxy to get/set values from the API
 * @param {event} evt the request to send
 */
jp.Server.prototype.handleRequest_ = function(evt) {
    this.request_ = evt.target;
    this.loadSWFObject();
    this.sendRequest_();
};


/**
 * Communicates with the server via swfproxy to get/set values from the API
 */
jp.Server.prototype.sendRequest_ = function() {
    if (this.requesting_) {
        return;
    }

    if (this.swfLoaded_ && !this.attemptedFlash_) {
        this.sendFlashRequest_();
    } else if (!this.attemptedAjax_) {
        this.sendAjaxRequest_();
    }

    if (this.attemptedFlash_ && this.attemptedAjax_) {
        if (!this.addedCriticalError_) {
            this.addedCriticalError_ = true;
            this.addError('Communication Failure', true);    
        }
        
    }
};


/**
 * Communicates with the server via swfproxy to get/set values from the API
 * @param {Object} request the request to send
 */
jp.Server.prototype.sendFlashRequest_ = function() {
    var request = this.request_;
    this.requesting_ = true;
    this.sendFlash(request);
};


/**
 * Communicates with the server via swfproxy to get/set values from the API
 * @param {Object} request the request to send
 */
jp.Server.prototype.sendAjaxRequest_ = function() {
    var successCallback = function(response) {
            this.addLog('success', response);
            this.requesting_ = false;
            this.attemptedAjax_ = true;
            this.dispatch('serverResponse', response);
        },
        failureCallback = function() {
            this.addLog('Failed to communicate via Ajax');
            this.requesting_ = false;
            this.attemptedAjax_ = true;
            this.sendRequest_();
        },
        request = this.request_,
        url = request.url,
        data = request.data,
        success = jp.bind(successCallback, this),
        failure = jp.bind(failureCallback, this);

    this.requesting_ = true;
    this.sendAjax(url, data, success, failure);
};


/*
 * Sends a data object to the server as a POST
 *@param {Object} request the request to send
 *@param {?Function} successCallback the function to call on successfull response
 *@param {?Function} failureCallback the function to call on failure response
 *
*/
jp.Server.prototype.sendFlash = function(request) {
    var swf = this.getSWFComponent();

    request.id = 'goog_123456789';
    swf.sendSwfProxyRequest(request.id, request.url, request.method, request.data, request.headers);
};


/*
 * Handles the swfproxy response
 * @param {Event} evt the data response
*/
jp.Server.prototype.handleSwfProxyResponse = function(evt) {
    var response = evt.responseText,
        status = evt.status;

    this.requesting_ = false;
    this.attemptedFlash_ = true;

    if (!status || !response) {
        this.addLog('SWF Response Failure', status);
        this.sendRequest_();
    } else {
        this.dispatch('serverResponse', response);
    }
};


/*
 * Sends a data object to the server as a POST
 *@param {string} url the url to send to
 *@param {Object} data the data to send with
 *@param {?Function} successCallback the function to call on successfull response
 *@param {?Function} failureCallback the function to call on failure response
 *
*/
jp.Server.prototype.sendAjax = function(url, data, successCallback, failureCallback) {
    $.post(url, data,
        function(responseText) {
            successCallback(responseText);
     })
    .fail(function(evt) {
        failureCallback();
    })
};


/**
 * Loads the swf object
 * @return {object} the form data for initialization
 */
jp.Server.prototype.loadSWFObject = function() {
    this.addLog('Loading swf object');
    this.loadScript('lib/swfobject.js', jp.bind(this.loadSWFProxy, this));
};


/**
 * Loads the swf proxy
 * @return {object} the form data for initialization
 */
jp.Server.prototype.loadSWFProxy = function() {
    var path = 'lib/swfproxy-0.1.1.swf',
            express = 'lib/expressInstall.swf',
            elementId = 'swfElement',
            height = 550,
            width = 400,
            version = '1',
            params = {allowScriptAccess: 'always'},
            attributes = {},
            loadedHandler = jp.bind(this.swfLoadedVerification, this);

    if (!document.getElementById(elementId)) {
        this.addLog('Missing Element to place SWF on');
    } else if(swfobject.hasFlashPlayerVersion('1')) {
        this.swfElement_ = elementId;
        swfobject.embedSWF(path, elementId, height, width, version, express, version, params, attributes, loadedHandler);
    }
};


/**
 * Ensures the swf is loaded
 * @param {Event} evt the swfobject event handler
 */
jp.Server.prototype.swfLoadedVerification = function(evt) {
    var status = evt.success;
    if (!status) {
        this.addLog('SwfProxy failed to load', false);
    }
};


/*
 * Verifies the swf file is loaded
*/
jp.Server.prototype.verifySWFLoaded = function() {
    var swf = this.getSWFComponent();
    
    if (swf.PercentLoaded && swf.PercentLoaded() === 100) {
        this.addLog('Loaded SWF Proxy Successfully');
        this.swfLoaded_ = true;
    } else {
        this.addLog('SWF Proxy Failed to Load', false);
    }
    this.sendRequest_();
};


/**
 * Gets the swf object
 * @return {object} the swf object
 */
jp.Server.prototype.getSwfObject = function() {
    return swfobject;
};


/*
 * Gets the flash component
 *@return {FlashObject} the flash object handling requests
 *
*/
jp.Server.prototype.getSWFComponent = function() {
    return window[this.swfElement_];
};
