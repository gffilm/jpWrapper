
/*
* The events handler
* @type {Object}
*/
jp.events = {};

/*
* Stores the listeners
* @type {array}
*/
jp.events.listeners_ = [];


/**
 * Adds a custom event listener by adding the listener to an array.
 * We only store one listener per name, to make sure we don't add duplicate listeners.
 * @param {Object} object the object being listened to.
 * @param {string} eventName the event to listen for.
 * @param {Function} callback the callback function to active once dispatched.
 */
jp.events.listen = function(object, eventName, callback) {
  if (!eventName) {
    jp.addError('Missing Event Name to listen for', true);
  }

  jp.events.listeners_.push({'event': eventName, 'callback': jp.bind(callback, object)});
};


/**
 * Activates a callback based on all objects that have matching events.
 * @param {string} eventName the event name to dispatch.
 * @param {Object=} optionalParams optional parameters to add to the callback.
 */
jp.events.dispatch = function(eventName, optionalParams) {
  var params = optionalParams ? optionalParams : {},
      callbackParameters = {'name': eventName, 'target': params},
      listeners = this.listeners_,
      totalListeners = listeners.length,
      listener,
      called = false;
      i = 0;

  for (i; i < totalListeners; i++) {
    listener = this.listeners_[i];
    if (listener['event'] === eventName) {
      called = true;
      // For each listener that matches the event, call that function with the params
      listener['callback'](callbackParameters);
    }
  }

  if (!called) {
    console.log('Dispatched ' + eventName + ' but no one was listening for it');
  }
};


/*
 * Unlistens to all listeners
*/
jp.events.unlisten = function() {
  var listeners = jp.events.listeners_,
      total = listeners.length,
      i = 0;
  for (i in listeners) {
    $(listeners[i]).unbind();
  }
  jp.events.listeners_ = [];
};
