/** 
 * Provides Bootstrap definition based on YUI 3.x.
 *
 * @module bootstrap
 */
(function() {
	
	var _config = {modules:{}},
		_loaderQueue = [];
   	
	/**
     * YUI_bootstrap function.  If YUI_bootstrap is already defined, the
     * existing YUI_bootstrap function will not be overwritten to preserve
     * the state of the bootstrap.
     *
     * @class YUI_bootstrap
     * @static
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
     *  <li>root: The root path to prepend to module names for the combo service. Ex\\: 2\\.5\\.2\\/build\\/</li>
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
     * 
     * Also, we can pass a custom argument thru "o" to customize
     * the file that should be injected to define the YUI Loader Utility. This feature allow us to
     * define a custom COMBO url to load a default set of components including loader in a single entry.
     * 
     * @param boolean def if true, "o" will be used as the default configuration object for succesive 
     * calls without the "o" argument.
     *
     */
	
	/**
	 * Dispatch the first element from the job queue 
	 * @method _loaderDispatch
	 * @private
	 * @static
	 * @return void
	 */
	function _loaderDispatch () {
		var c;
		if ((c = _loaderQueue.shift())) {
			c.call();
		}
	}
	
	/**
	 * Include YUI Loader in the the page, and wait until it get available to start dispatching jobs
	 * from the queue
	 * @method _includeLoader
	 * @private
	 * @static
	 * @return void
	 */
	function _includeLoader () {
		/* injecting the YUI Loader in the current page */
		var base = _config.base || 'http://yui.yahooapis.com/3.0.0pr2/build/',
			seed = _config.seed || 'yui/yui-min.js',
			s = document.createElement('script'),
			fn = function(){
				if ((typeof YUI === 'undefined') || !YUI || YUI.Loader) {
					// keep waiting...
					window.setTimeout(fn, 50);
				} else {	  
					// YUI is ready...
					window.setTimeout(_loaderDispatch, 1);
				}
		    };
	    s.setAttribute('type', 'text/javascript');
		// analyzing the seed
		seed = (seed.indexOf('http')===0?seed:base+seed);
	    s.setAttribute('src', seed);
	    document.getElementsByTagName('head')[0].appendChild(s);
		fn();
	}
	
	/**
	 * Verify if the current configuration object just defines new modules. If that's the case, 
	 * we will use "_config" as the computed configuration, and "o" as the list of modules to add.
	 * @method _getConf
	 * @param o currrent configuration object
	 * @private
	 * @static
	 * @return object computed configuration
	 */
	function _getConf(o) {
		o = o||{};
		var m = o.modules || {}, 
			flag = true, i;
		// using _config and injecting more modules
		if (flag) {
			for (i in m) {
			  	if (m.hasOwnProperty(i)) {
					_config.modules[i] = m[i];
				}
			}
			o = _config;
		}
		return o;
	}
	
	YUI_bootstrap = function (o, def) {
		// analyzing "o"
		o = _getConf(o);
		// if def is true, o will be used as the default config from now on 
		_config = (def?o:_config);
		return {
			/**
		     * Load a set of modules and notify thru the callback method.
		     * @param modules* {string} 1-n modules to bind (uses arguments array)
		     * @param *callback {function} callback function executed when 
		     * the instance has the required functionality.  If included, it
		     * must be the last parameter.
		     *
		     * YUI_bootstrap().use('dd', callback)
		     *
		     * @return void
		     */
			use: function () {
				var a=Array.prototype.slice.call(arguments, 0);
				_loaderQueue.push (function () {
					var Y = YUI(o), i;
					Y.use.apply (Y, a);
					_loaderDispatch(); // dispatching the rest of the waiting jobs
				});
				// verifying if the loader is ready in the page, if not, it will be 
				// included automatically and then the process will continue.
				if (_loaderQueue.length===1) {
					((typeof YUI === 'undefined' || !YUI)?_includeLoader():_loaderDispatch());				
				}
			}
		};
	};

})();