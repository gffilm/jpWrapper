/**
 * Logger handler
 * @constructor
 */
jp.Logger = function() {
   jp.base(this, 'Logger');

   /**
   * The logs arrray
   * @type {Array}
   */
   this.logs_ = [];

   /**
   * The logging element
   * @type {Element}
   */
   this.loggingElement_ = null;

   /**
   * Did it fail to create a window
   * @type {boolean}
   */
   this.failedToCreateWindow_ = false;

   if (this.getConfig('createInput')) {
      this.createInput();
   }
};
jp.inherits(jp.Logger, jp.Base);
jp.addSingleton('logger');


/**
 * Adds an error, throws an error & alert if critical
 * @param {string} name the name of the log
 * @param {*} info the info of the log
 * @param {*} detail the info of the log
 */
jp.Logger.prototype.addLog = function(name, info, detail) {
    var autoLogging = this.getConfig('autoLog');
    this.logs_.push({'name': name, 'info': info, 'detail': detail});

    if (autoLogging) {
      this.displayLogs(true);
    }
};


/**
 * Displays logs
 */
jp.Logger.prototype.displayLogs = function() {
    var logs = this.getLogs(),
        totalLogs = logs.length,
        log,
        name,
        info,
        detail,
        isVisible,
        i = 0;

    for (i; i < totalLogs; i++) {
        log = logs[i];
        name = log['name'];
        info = log['info'];
        detail = log['detail'];
        isVisible = log['visible'];
        
        if (isVisible) {
            continue;
        }
        log['visible'] = true;
        this.showLog(name, info, detail);
    }
};



/**
 * Displays logs to the console or DOM
 * @param {string} name the name of the log
 * @param {*} info the info of the log
 * @param {*} detail the info of the log
 */
jp.Logger.prototype.showLog = function(name, info, detail) {
    var mode = this.getConfig('logMode');

    if (!mode || mode === 'console') {
        if (!detail) {
            detail = ' ';
        }
        console.log('[ ' + name + ' ]', info, detail);    
    } else {
        this.logToDom(name, info, detail);
    }
};


/**
 * Gets the logging element
 * @return {Element} the logging element
 */
jp.Logger.prototype.getLoggingElement = function() {
    if (this.loggingElement_ || this.failedToCreateWindow_) {
        return this.loggingElement_;
    }
    try {
        var logWindow = window.open('', 'logger', 'width=300, height=200, scrollbars=yes, resizable=yes, titlebar=yes');
        this.loggingElement_ = logWindow.document.body;
        loggerWindow = logWindow;
    } catch (e) {
        console.log('Failed to open window');
        this.failedToCreateWindow_ = true;
    }

    return this.loggingElement_;
};


/**
 * Create an input
 */
jp.Logger.prototype.createInput = function() {
  var input = document.createElement('input'),
      element = document.getElementById('loggerContainer');

  if (!element) {
    return;
  }

  input.type = 'text';
  element.appendChild(input);
  $(input).on('keypress', function(evt) {
    var value = evt.target.value;
     if (evt.which === 13) {
      try {
        eval(value);
      } catch (e) {
        jp.addLog('Logger', 'Failed to Evaluate <br />' + value, e);
      }
      evt.target.value = '';
    }
  })
}


/**
 * Log the message by appending the string to the innerHTML of the logging element.
 * @param {!string} name the name of the message being sent.
 * @param {string|Object|Array} info the message to log.
 * @param {string|Object|Array} detail the message to log.
 */
jp.Logger.prototype.logToDom = function(name, info, detail) {
  var element = this.getLoggingElement(),
      html = '',
      convertedMessage = '',
      br = '<br />',
      space = '&nbsp;',
      newLine = '<hr>',
      time = new Date().toLocaleTimeString(),
      timeString = '[' + time + '] ';

  if (info) {
    convertedMessage = this.convertMessageToString(info, 0);
  }

  if (detail) {
    convertedMessage += this.convertMessageToString(detail, 0);
  }

  if (element) {
    // append the existing html to the message
    html = convertedMessage + br + element.innerHTML;
    this.messageLogged_ = true;
    element.innerHTML = newLine + timeString + space + name + newLine + html;
  }
};


/**
 * Converts a message object to a string recursively
 * @param {string|Object|Array} message the message to convert.
 * @param {!number} recursion the current recursion number.
 * @return {!string} the converted message.
 */
jp.Logger.prototype.convertMessageToString = function(message, recursion) {
  var messageString = '',
      messageLength,
      i,
      br = '<br />',
      object;

  // Convert the message from an object into a string (recursively if needed)
  if (typeof message === 'object') {
    for (object in message) {
      // Verify if the sub-object is an object
      if (typeof message[object] === 'object') {
        recursion++;
        if (recursion <= this.recursionMax_) {
          // If the current level of recursion is less than the max, convert the object
          messageString += br + this.convertMessageToString(message[object], recursion);
        }
      }
      messageString += object + ' : ' + message[object] + br;
    }
  } else {
    // The message was simply a string or number
    messageString = message;
  }

  return messageString + br;
};


/**
 * Clears the log by removing all html
 */
jp.Logger.prototype.clearLogs = function() {
  var   element = this.getLoggingElement(),
        logs = this.getLogs(),
        totalLogs = logs.length,
        log,
        i = 0;

    element.innerHTML = '';

    for (i; i < totalLogs; i++) {
        log = logs[i];
        log['visible'] = false;
    }
};


/**
 * Deletes all logs
 */
jp.Logger.prototype.deleteLogs = function() {
    this.logs_ = [];
    this.clearLogs();
};



/**
 * Determines if there are logs
 * @return {boolean} are there logs?
 */
jp.Logger.prototype.hasLog = function() {
    return this.logs_.length > 0;
};


/**
 * Gets the logs
 * @return {array} the logs
 */
jp.Logger.prototype.getLogs = function() {
    return this.logs_;
};


/**
 * Convinient way to add a log
 * @param {string} name the log string
 * @param {*} info the log info
 * @param {*} detail further log info
 */
jp.addLog = function(name, info, detail) {
    var logger = jp.getInstance('logger');
    logger.addLog(name, info, detail);
};



/**
 * Convinient way to display all logs
 */
jp.displayLogs = function() {
    var logger = jp.getInstance('logger');
    logger.displayLogs();
};


/**
 * Convinient way to clear all logs
 */
jp.clearLogs = function() {
    var logger = jp.getInstance('logger');
    logger.clearLogs();
};


/**
 * Convinient way to clear all logs
 */
jp.deleteLogs = function() {
    var logger = jp.getInstance('logger');
    logger.deleteLogs();
};
