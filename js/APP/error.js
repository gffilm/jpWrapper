/**
 * Error handler
 */
jp.Error = function() {
   jp.base(this, 'Error');
   this.errors_ = [];
};
jp.inherits(jp.Error, jp.Base);
jp.addSingleton('error');

/**
 * Adds an error, throws an error & alert if critical
 * @param {string} error the error string
 * @param {boolean} critical is the error criticil?
 */
jp.Error.prototype.addError = function(error, critical) {
    if (error) {
        this.errors_.push(error);
    }

    if (critical) {
        this.throwError();
    }

    critical = critical ? 'Critical Error': ' ';
    this.addLog(error, critical);
};


/**
 * Determines if there are errors
 * @return {boolean} are there errors?
 */
jp.Error.prototype.throwError = function() {
    alert('A Course Communication Error Occurred');
    throw new Error('Critical Error');
};



/**
 * Determines if there are errors
 * @return {boolean} are there errors?
 */
jp.Error.prototype.hasError = function() {
    return this.errors_.length > 0;
};


/**
 * Gets the errors
 * @return {array} the errors
 */
jp.Error.prototype.getErrors = function() {
    return this.errors_;
};


/**
 * Convinient way to add an error
 * @param {string} info the error string
 * @param {boolean} critical is the error criticil?
 */
jp.addError = function(info, critical) {
    var error = jp.getInstance('error');
    error.addError(info, critical);
};


/**
 * Convinient way to get errors
 * @return {Array} errors
 */
jp.getErrors = function() {
    var error = jp.getInstance('error');
    return error.getErrors();
};
