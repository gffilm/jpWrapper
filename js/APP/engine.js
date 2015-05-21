
/**
 * Startup Class
 * This class starts up all processes
 * @constructor
 */
jp.Engine = function() {
  jp.base(this, 'Engine');

  this.logger_ = new jp.Logger();

  this.wrapper_ = new jp.Wrapper();

  this.storage_ = new jp.Storage();

  this.scormAPI_ = new jp.Scorm_API();

  this.server_ = new jp.Server();

  this.protocol_ = new jp.Protocol();


  //this.protocol_ = this.getProtocol();

  //this.protocol_.startUp();

  //this.createAPI();

  //this.wrapper_.createiFrame();

  this.initialized();
};
jp.inherits(jp.Engine, jp.Base);
jp.addSingleton('engine');


/**
 * Gets an API's data
 * @return {object} the API data
 */
jp.Engine.prototype.getProtocolData = function() {
  return this.protocol_.getData();
};



/**
 * Get stored data
 * @return {object} the stored data
 */
jp.Engine.prototype.getStorageData = function() {
    return this.storage_.getData();
};


/**
 * Get stored data
 * @return {object} the stored data
 */
jp.Engine.prototype.finish = function() {
    this.protocol_.finish();
};


/*
 * Once all scripts are loaded, this function is called 
*/
jp.start = function() {
  jp.getInstance('engine');
  if (CONFIG['PRODUCTION']) {
    jp.addFinish();
  }
};


/*
 * The finish handler
*/
jp.finish = function() {
  var engine = jp.getInstance('engine', CONFIG);
  engine.finish();
};


/**
 * Add unload listeners when in production mode
 */
jp.addFinish = function() {
    window.onunload = function() {
      jp.finish();
      return 'Saving Data...';
    };

    window.onbeforeunload = function() {
      jp.finish();
      return 'Saving Data...';
    };
};