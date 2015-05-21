
/*
 * The application's configurations
*/
var CONFIG = {};


CONFIG['APPNAME'] = 'jp';

CONFIG['PRODUCTION'] = false;

CONFIG['LOGGING_ENABLED'] = false;

CONFIG['LOADER_SCRIPTS'] = [
      'js/BASE/utility.js',
      'js/BASE/bind.js',
      'js/BASE/events.js',
      'js/APP/base.js',
      'js/APP/error.js',
      'js/APP/logger.js',
      'js/APP/wrapper.js',
      'js/API/server.js',
      'js/API/storage.js',
      'js/API/scormAPI.js',
      'js/API/protocol.js',
      'js/API/aicctracker.js',
      'js/API/scormtracker.js',
      'js/API/scorm12Tracker.js',
      'js/API/scorm2004v3Tracker.js',
      'js/APP/engine.js',
      'course/config.js'
];

CONFIG['LOADER_SCRIPTS_PROD'] = [
      'js/compiled.js',
      'course/config.js'
];


CONFIG['ENGINE'] = {
      'createAPI': true
};


CONFIG['WRAPPER'] = {
    'courseId': '45748',
    'log': false,
    'path': '../',
    'params': 'brand=columbia&protocol=scorm 1.2',
    'width': 788,
    'height': 480
};


CONFIG['PROTOCOL'] = {
      'type': 'aicc',
      'log': false,
      'fallback': true,
      'fail': false
};


CONFIG['SERVER'] = {
    'log': true
};


CONFIG['AICC_TRACKER'] = {
      'log': false
};


CONFIG['SCORMTRACKER'] = {
      'log': false
};


CONFIG['SCORM2004V3TRACKER'] = {
      'log': false
};


CONFIG['SCORM_API'] = {
    'createAPI': true,
    'log': false
};


CONFIG['STORAGE'] = {
    'storage': 'cookies',
    'store': false,
    'log': false
};


CONFIG['ERROR'] = {
    'log': true
};


CONFIG['LOGGER'] = {
    'logMode': 'console',
    'createInput': false,
    'autoLog': true
};