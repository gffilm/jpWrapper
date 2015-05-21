
/**
 * Course Wrapper
 * @constructor
 */
jp.Wrapper = function() {
  jp.base(this, 'Wrapper');

  /**
   * The iFrame
   * @type {document}
   */
    this.frame_ = null;

    this.initialized();
};
jp.inherits(jp.Wrapper, jp.Base);
jp.addSingleton('wrapper');


/**
 * Gets the course URL
 * @return {stirng} the url.
 */
jp.Wrapper.prototype.getCourseURL = function() {
    var path = this.getConfig('path'),
        courseID = this.getConfig('courseId'),
        params = this.getConfig('params'),
        local = this.getConfig('isLocal');

    return path + courseID + '?' + params;
};


/**
 * Creates the iFrame to run the course
 */
jp.Wrapper.prototype.createiFrame = function() {
    var iFrame = document.createElement('iFrame'),
        container = document.getElementById('iFrameContainer'),
        url = this.getCourseURL(),
        width = this.getConfig('width'),
        height = this.getConfig('height');

    if (!url) {
        jp.addError('URL Missing to create iFrame', true);
        return;
    }

    // Add the iFrame properties
    iFrame.src = url;
    iFrame.width = width;
    iFrame.height = height;
    iFrame.frameBorder = 0;
    container.appendChild(iFrame);

    $(iFrame).load(jp.bind(function() {
      this.courseLoaded();
    }, this));

    this.frame_ = iFrame;
};


/**
 * Handler for when the course is loaded
 */
jp.Wrapper.prototype.courseLoaded = function() {
  // Set the title
  this.setTitle();
  this.clearUnload();
};


/**
 * Gets the errors
 * @return {array} the errors
 */
jp.Wrapper.prototype.getFrame = function() {
  return this.frame_ ? this.frame_.contentWindow : null;
};


/**
 * Gets the title from the course and sets it
 */
jp.Wrapper.prototype.setTitle = function() {
  try {
    document.title = this.getFrame().document.title;
  } catch (e) {
    console.log('XSS permission issue', e);
  }
};



/**
 * Clears the unload handler for the course
 */
jp.Wrapper.prototype.clearUnload = function() {
  try {
    var frame = this.getFrame();
    frame.onunload = function() {};
    frame.onbeforeunload = function() {};
  } catch (e) {
    console.log('XSS permission issue', e);
  }
};