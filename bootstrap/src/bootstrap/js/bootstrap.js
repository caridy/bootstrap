/** 
 * Provides Bootstrap definition based on YUI 2.x.
 *
 * ---
 *
 * @module bootstrap
 */

/**
 * Provides Bootstrap methods.
 *
 * @class Bootstrap
 * @static
 */
(function() {
	
	var _config = null,
		_loaderObj = null,
		_loaderQueue = [];
   	/**
	 * Continue with the loading process, removing the first set from the list, 
	 * and continue with the next in line.
	 * @method _loaderNext
	 * @private
	 * @static
	 * @param {Boolean} notify Whether or not the callback method should be called. 
     * @return void
	 */
	function _loaderNext (notify) {
		var i = _loaderQueue.pop();
		/* we want to speed up the loading process, so, the first thing we do
		   is actually starting the loading process for the next region */
		_loaderDispatch();
		if (notify && i) {
			/* notifying thru the callback function that everything was ok */
			i.callback.call();
		}
	}
	/**
	 * Finishing with the current item int queue, and starting with the next one 
	 * @method _loaderDispatch
	 * @private
	 * @static
	 * @return void
	 */
	function _loaderDispatch () {
		var c;
		if (_loaderQueue.length > 0) {
			c = _loaderQueue[0];
			c.require = c.require || [];	
			_loaderObj.require(c.require);
			_loaderObj.insert({
				onSuccess: function () {
					_loaderNext(true);
					(c.config.onSuccess || function(){}).call();
				},
				onFailure: function(){
					_loaderNext();
					(c.config.onFailure || function(){}).call();
				},
				onTimeout: function () {
					_loaderNext();
					(c.config.onTimeout || function(){}).call();
				}
			}, c.type);
		}
	}
	/**
	 * <p>
	 * execute the internal initialization process for the region
	 * </p>
	 * @method init
	 * @return {Object} region reference to support chaining
	 */
	function _initLoader (l) {
	    /* creating the loader object for this region */
		l = l || {};
		l.combine = (l.hasOwnProperty('combine')?l.combine:true); /* using the Combo Handle */
		l.combine = !this._debug;
	    l.filter = l.filter || 'min';  /* you can switch between YUI branch */
		l.filter = (this._debug?'debug':l.filter);
		
		// more config here ...
		
		_loaderObj = _loaderObj || new YAHOO.util.YUILoader(l);
	}
	
	function _addMods (m) {
		var i;
		if (m && (typeof m === 'object')) {
			for (i in m) {
				if (m.hasOwnProperty(i)) {
					m[i].name = i;
					_loaderObj.addModule (m[i]);
				}
			}
		}	
	}
	
	/**
     * YAHOO_bootstrap function.  If YAHOO_bootstrap is already defined, the
     * existing YAHOO_bootstrap functino will not be overwritten to preserve
     * the state of the bootstrap.
     *
     * @class YAHOO_bootstrap
     * @constructor
     * @global
     * @param o Optional configuration object.  Options:
     * <ul>
     *  <li>------------------------------------------------------------------------</li>
     *  <li>Global:</li>
     *  <li>------------------------------------------------------------------------</li>
     *  <li>debug: Turn debug statements on or off</li>
     *  <li>injected: set to true if the yui seed file was dynamically loaded in
     *  order to bootstrap components relying on the window load event and onDOMReady
     *  (former injecting on YAHOO_config).</li>
     *  <li>locale: default locale</li>
     *  <li>-------------------------------------------------------------------------</li>
     *  <li>For loader:</li>
     *  <li>-------------------------------------------------------------------------</li>
     *  <li>base: The base dir</li>
     *  <li>comboBase: The YUI combo service base dir. Ex: http://yui.yahooapis.com/combo?</li>
     *  <li>root: The root path to prepend to module names for the combo service. Ex: 2.5.2/build/</li>
     *  <li>filter:
     *  
     * A filter to apply to result urls.  This filter will modify the default
     * path for all modules.  The default path for the YUI library is the
     * minified version of the files (e.g., event-min.js).  The filter property
     * can be a predefined filter or a custom filter.  The valid predefined 
     * filters are:
     * <dl>
     *  <dt>DEBUG</dt>
     *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
     *      This option will automatically include the Logger widget</dd>
     *  <dt>RAW</dt>
     *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>
     * </dl>
     * You can also define a custom filter, which must be an object literal 
     * containing a search expression and a replace string:
     * <pre>
     *  myFilter: &#123; 
     *      'searchExp': "-min\\.js", 
     *      'replaceStr': "-debug.js"
     *  &#125;
     * </pre>
     *
     *  </li>
     *  <li>filters: per-component filter specification.  If specified for a given component, this overrides the filter config</li>
     *  <li>combine:
     *  Use the YUI combo service to reduce the number of http connections required to load your dependencies</li>
     *  <li>ignore:
     *  A list of modules that should never be dynamically loaded</li>
     *  <li>force:
     *  A list of modules that should always be loaded when required, even if already present on the page</li>
     *  <li>insertBefore:
     *  Node or id for a node that should be used as the insertion point for new nodes</li>
     *  <li>charset:
     *  charset for dynamic nodes</li>
     *  <li>timeout:
     *  number of milliseconds before a timeout occurs when dynamically loading nodes.  in not set, there is no timeout</li>
     *  <li>onSuccess:
     *  callback for the 'success' event</li>
     *  <li>onFailure:
     *  callback for the 'failure' event</li>
     *  <li>onTimeout:
     *  callback for the 'timeout' event</li>
     *  <li>onProgress:
     *  callback executed each time a script or css file is loaded</li>
     *  <li>modules:
     *  A list of module definitions.  See Loader.addModule for the supported module metadata</li>
     * </ul>
     */
	YAHOO_bootstrap = function (o) {
		
		// analyzing "o"
		o = o || _config || {};
		
		// initializing the bootstrap only once
		if (!_loaderObj) {
			_initLoader(o);
		}
		
		// adding the 
		_addMods (o.modules);
		
		return {
			/**
		     * Load a set of modules and notify thru the callback method.
		     * @param modules* {string} 1-n modules to bind (uses arguments array)
		     * @param *callback {function} callback function executed when 
		     * the instance has the required functionality.  If included, it
		     * must be the last parameter.
		     *
		     * YAHOO_bootstrap().use('tabview')
		     *
		     * @return void
		     */
			use: function () {
				var a=Array.prototype.slice.call(arguments, 0),
					callback = a.pop ();
				if (callback) {
				  if (a && a.length > 0) {
					  // using the YUI loader utility to load the requirements...
					  _loaderQueue.push ({
						  require: a,
						  config: o, 
						  callback: callback
					  });
					  if (_loaderQueue.length == 1) {
						  _loaderDispatch();
					  }
				  } else {
					  callback.call ();
				  }
				}
			},
			/**
		     * Set the default configuration for the loader.
		     * @param o {object} default configuration object for the bootstrap, 
		     * basically "o" can be used to define the global configuration once in 
		     * your application, instead of including the configuration for each single 
		     * bootstrap call.
		     *
		     * YAHOO_bootstrap(o).setAsDefault()
		     *
		     * @return void
		     */
			setAsDefault: function (o) {
				if (o) {
					_config = o || {};
				}
			}
		};
	};
	
})();