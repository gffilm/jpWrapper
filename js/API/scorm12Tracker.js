
/**
 * Determines the Protocol and gets the API or AICC Information
 * @param {Object} API the API to communicate with
 * @param {string} name of the tracker
 * @constructor for the Scorm2004v3 tracker
 */
jp.Scorm12Tracker = function(API) {
  jp.base(this, API, 'ScormTracker');
  
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
    this.defaultExitStatusForInComplete_ = 'suspend';

    this.initialized();
};
jp.inherits(jp.Scorm12Tracker, jp.ScormTracker);
jp.addSingleton('Scorm12Tracker');



/**
 * Gets the retrievable values from the API
 * @return {Array} the retrievable values from the API
 */
jp.Scorm12Tracker.prototype.getRetrievableValues = function() {
    return [
      'cmi.core.lesson_status',
      'cmi.suspend_data',
      'cmi.core.lesson_location',
      'cmi.core.student_name',
      'cmi.core.score.raw',
      'cmi.core.exit'
    ];
};



/**
 * Returns a object detailing the API function signals used to communicate with the API
 * @return {object} the function names with key and values
 */
jp.Scorm12Tracker.prototype.getFunctionNames = function() {
  return {
    'INIT': 'LMSInitialize',
    'SET': 'LMSSetValue',
    'GET': 'LMSGetValue',
    'COMMIT': 'LMSCommit',
    'END': 'LMSFinish',
    'ERROR': 'LMSGetLastError',
    'ERROR_STRING': 'LMSGetErrorString',
    'DIAGNOSTIC': 'LMSGetDiagnostic'
  };
};

