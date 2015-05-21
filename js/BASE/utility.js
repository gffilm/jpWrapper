/*
 * Gets a uri parameter.
 * @param {string} param the uri param to try for.
 * @return {string} the param or null.
*/
getUrlParams = function(param) {
  return decodeURIComponent(
    (new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) ||
      [,""])[1].replace(/\+/g, '%20')) || null;
};


/*
 * Determines if a string has value by converting to a boolean
 * @return {boolean} true or false
*/
String.prototype.toBoolean = function() {
    var string = this.valueOf(),
        falsifiers = ['false', '0', 'NaN', 'undefined', 'null'],
        falsifier,
        i;

  for (i in falsifiers) {
    falsifier = falsifiers[i];
    if (string === falsifier) {
        return false;
    }
  }
  // Anything else with a value is true
  return string ? true : false;
};


/*
 * Extends the string class to upper case fisrt letter
*/
String.prototype.ucFirst = function() {
  return this.charAt(0).toUpperCase() + this.substr(1);
}




// Cookies
var COOKIE_TIME = 1 * 24 * 60 * 60 * 1000, // 1 day
    BASE_TIME = new Date().getTime();


/**
 * Sets a cookie by encoding the value and setting an expiration date
 * @param {string} name of the cookie.
 * @param {string|Array} value of the cookie.
 * @param {boolean} did it set?
*/
setCookie = function(name, value) {
  var cookieTime = COOKIE_TIME,
      baseTime = BASE_TIME,
      cookieString;

  if (!name || !value) {
    return false;
  } else if (typeof value === 'object') {
    value = value.toString();
  }

  cookieString = name + '=' + encodeURIComponent(value) + ';path=/;expires=' +
      (new Date(baseTime + cookieTime)).toUTCString();
  
  document.cookie = cookieString;
  return getCookie(name) ? true : false;
};


/**
 * Gets a cookie
 * @param {string} name of the cookie to get.
 * @return {string|Array} the value of the cookie.
*/
getCookie = function(name) {
  var cookieArray = document.cookie.split(';'),
      cookies = cookieArray.length,
      cookie,
      i,
      c;
  name += '=';

  // Loop through all cookies and decode the current cookie
  for (i = 0; i < cookies; i++) {
    cookie = cookieArray[i];
    // If the first character starts with a space, remove it
    if (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }

    // Check if the cookie matches the name we are getting
    if (cookie.indexOf(name) != -1) {
      return decodeURIComponent(cookie.substring(name.length, cookie.length));
    }
  }

  return null;
};


/**
 * Deletes a cookie by setting an expired date
 * @param {string} name of the cookie.
*/
deleteCookie = function(name) {
  var cookieTime = COOKIE_TIME,
      baseTime = BASE_TIME;

  document.cookie = name + '=deleted;path=/;expires=' +
      (new Date(baseTime - cookieTime)).toUTCString();
};


/**
 * Determines if cookies are enabled
 * @return {!boolean} are cookies enabled?
*/
verifyCookies = function() {
  var cookieEnabled = (navigator.cookieEnabled) ? true : false;
  if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
  }

  return cookieEnabled;
};
