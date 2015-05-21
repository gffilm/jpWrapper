
/**
 * Determines the Protocol and gets the API or AICC Information
 * @param {Object} API the API to communicate with
 * @implements the tracker
 * @constructor
 */
jp.Scorm2004v3Tracker = function(API) {
  jp.base(this, API, 'Scorm2004v3Tracker');
  
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
    this.defaultExitStatusForComplete_ = 'normal';

    /*
    * The default status for incomplete
    * @type {string}
    */
    this.defaultExitStatusForInComplete_ = 'suspend';

    // initialized
    this.initialized();
};
jp.inherits(jp.Scorm2004v3Tracker, jp.ScormTracker);
jp.addSingleton('ScormTracker2004v3');



/**
 * Gets the retrievable values from the API
 * @return {Array} the retrievable values from the API
 * @override
 */
jp.Scorm2004v3Tracker.prototype.getRetrievableValues = function() {
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
 * @override
 */
jp.Scorm2004v3Tracker.prototype.getFunctionNames = function() {
  return {
    'INIT': 'Initialize',
    'SET': 'SetValue',
    'GET': 'GetValue',
    'COMMIT': 'Commit',
    'END': 'Terminate',
    'ERROR': 'GetLastError',
    'ERROR_STRING': 'GetErrorString',
    'DIAGNOSTIC': 'GetDiagnostic'
  };
};
