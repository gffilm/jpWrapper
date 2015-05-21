

/**
 * Pure-JS implementation of jp.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object
 * @param {...*} var_args Additional arguments
 * @return {!Function} A partially-applied form of the function bind()
 * @private
 */
jp.bindJs = function(fn, selfObj, var_args) {
  var context = selfObj || jp.global,
      newArgs,
      boundArgs;
  if (arguments.length > 2) {
    boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(context, newArgs);
    };

  } else {
    return function() {
      return fn.apply(context, arguments);
    };
  }
};


/**
 * A native implementation of jp.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj the object itself.
 * @param {...*} var_args Additional arguments
 * @return {!Function} the function to bind
 * @private
 */
jp.bindNative = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments);
};


/**
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object
 * @param {...*} var_args Additional arguments
 * @return {!Function} the function bind()
 */
jp.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind &&
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    jp.bind = jp.bindNative;
  } else {
    jp.bind = jp.bindJs;
  }
  return jp.bind.apply(null, arguments);
};


/**
 * Call up to the superclass.
 * @param {!Object} self should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 */
jp.base = function(self, opt_methodName, var_args) {
  var caller = arguments.callee.caller,
      myArguments,
      foundCaller,
      myConstructor;

  if (caller.superClass_) {
    return caller.superClass_.constructor.apply(
        self, Array.prototype.slice.call(arguments, 1));
  }

  myArguments = Array.prototype.slice.call(arguments, 2);
  foundCaller = false;
  
  for (myConstructor = self.constructor; myConstructor;
       myConstructor = myConstructor.superClass_ && myConstructor.superClass_.constructor) {
    // Finds the caller function
    if (myConstructor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return myConstructor.prototype[opt_methodName].apply(self, myArguments);
    }
  }

  if (self[opt_methodName] === caller) {
    return self.constructor.prototype[opt_methodName].apply(self, myArguments);
  } else {
    throw Error('jp.called from a different name than its parent');
  }
};



/**
 * Inherit the prototype methods from one constructor into another.
 * @param {Function} childConstructor Child class.
 * @param {Function} parentConstructor Parent class.
 */
jp.inherits = function(childConstructor, parentConstructor) {
  // Create a temporary constructor
  function temporaryConstructor() {};
  // Set the temporary constructor's prototype to the parent constructor's prototype
  temporaryConstructor.prototype = parentConstructor.prototype;
  // Set the childConstructor constructor's superClass to the parent constructor's prototype
  childConstructor.superClass_ = parentConstructor.prototype;
  // Set the childConstructor prototype's superClass to an instance of the temporary constructor
  childConstructor.prototype = new temporaryConstructor();
  // Set the childConstructor constructor class to its own function
  childConstructor.prototype.constructor = childConstructor;
};


/**
 * Adds an instance for a singleton class
 * @param {string} className the class to add an instance of
 * @return {boolean} did it add the singleton?
 */
jp.addSingleton = function(className) {
  className = className.ucFirst();
  var valid = typeof jp[className] === 'function';

  if (valid) {
    jp[className].isSingleton = true;
  }
   return valid;
};


/**
 * Gets an instance of a singleton class
 * @param {string} className the class to get an instance of
 * @param {*} Optional params to apply
 * @param {boolean} critical is the error criticil?
 */
jp.getInstance = function(className, params) {
  className = className.ucFirst();
  var valid = typeof jp[className] === 'function' && jp[className].isSingleton,
      instance = null;
    if (valid) {
        if (jp[className + 'Instance_']) {
          instance = jp[className + 'Instance_'];
        } else {
          instance = jp[className + 'Instance_'] = new jp[className](params);
        }
        
    }
   return instance;
};
