/** 
 * Provides Bootstrap definition based on YUI 2.x.
 *
 * @module bootstrap
 */
(function() {

	if ((typeof YAHOO_bootstrap != "undefined") && YAHOO_bootstrap) {
		return;
	}
		
	var _config = {modules:{}},
		_loaderObj = null,
		_loaderQueue = [],
		_loading = false;
		
	/**
     * YAHOO_bootstrap function.  If YAHOO_bootstrap is already defined, the
     * existing YAHOO_bootstrap function will not be overwritten to preserve
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
     *  <li>seed:
     *  custom COMBO url to load a default set of components including loader in a single entry.</li>
     * </ul>
     * 
     * @param def {boolean} if true, "o" will be used as the default configuration object for succesive 
     * calls without the "o" argument.
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
			_loading = false;
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
			var base = _config.base || 'http://yui.yahooapis.com/2.7.0/build/',
				seed = _config.seed || 'yuiloader/yuiloader-min.js',
				s = document.createElement('script');
			// analyzing the seed
			seed = (seed.indexOf('http')===0?seed:base+seed);
			// more info about this here: http://www.nczonline.net/blog/2009/06/23/loading-javascript-without-blocking/
		    s.type = "text/javascript";
		    if (s.readyState){  //IE
		        s.onreadystatechange = function(){
		            if (s.readyState == "loaded" || s.readyState == "complete"){
		                s.onreadystatechange = null;
		                _loaderDispatch();
		            }
		        };
		    } else {  //Others
		        s.onload = _loaderDispatch;
		    }
		    s.src = seed;
			document.getElementsByTagName('head')[0].appendChild(s);
		}
		
		/**
		 * Add a set of modules to _loaderObj, it also normalize the module information before include it
		 * @method _addMods
		 * @private
		 * @static
		 * @param m {object} collection of modules
		 * @return void
		 */
		function _addMods (m) {
			var i;
			// adding modules to the loader 
			if (m && (typeof m === 'object')) {
				for (i in m) {
					if (m.hasOwnProperty(i)) {
						m[i].name = m[i].name || i;
						m[i].type = m[i].type || ((m[i].fullpath||m[i].path).indexOf('.css')>=0?'css':'js');
						//console.log ('Adding a default module: ', m[i].name, m[i]);
						_loaderObj.addModule (m[i]);
					}
				}
			}
		} 
	
		/**
		 * Initialization process for the YUI Loader obj. In YUI 2.x we should
		 * have a single instance to control everything.
		 * @method _initLoader
		 * @private
		 * @static
		 * @return void
		 */
		function _initLoader (l) {
			if (!_loaderObj) {
				/* creating the loader object for this region */
				l = l || {};
				l.combine = (l.hasOwnProperty('combine')?l.combine:true); /* using the Combo Handle */
			    l.filter = l.filter || 'min';  /* you can switch between YUI branch */
				
				// more config here ...
			
				_loaderObj = new YAHOO.util.YUILoader(l);			
				_addMods(l.modules);
			}
			// probably more configurations here
		}
		
		/**
		 * Verify if the current configuration object just defines new modules. If that's the case, 
		 * we will use "_config" as the computed configuration, and "o" as the list of modules to add.
		 * @method _getConf
		 * @param o {object} currrent configuration object
		 * @private
		 * @static
		 * @return object computed configuration
		 */
		function _getConf(o) {
			o = o||{};
			var m = o.modules || {}, 
				flag = true, i;
			for (i in o) {
			  	if (o.hasOwnProperty(i) && (i != 'modules')) {
			  		flag = false;
			  	}
			}
			// using _config and injecting more modules
			if (flag) {
				for (i in m) {
				  	if (m.hasOwnProperty(i)) {
						_config.modules[i] = m[i];
					}
				}
				if (_loaderObj) {
					_addMods(m);
				}
				o = _config;
			}
			return o;
		}

	YAHOO_bootstrap = function (o, def) {
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
		     * YAHOO_bootstrap().use('tabview', callback)
		     *
		     * @return void
		     */
			use: function () {
				var a=Array.prototype.slice.call(arguments, 0),
					callback = a.pop ();
				_loaderQueue.push (function () {
					_initLoader(o);
					_loaderObj.require(a);
					_loaderObj.insert({
						onSuccess: function () {
							_loaderDispatch();
							callback.call();
							(o.onSuccess || function(){}).call();
						},
						onFailure: function(){
							_loaderDispatch();
							(o.onFailure || function(){}).call();
						},
						onTimeout: function () {
							_loaderDispatch();
							(o.onTimeout || function(){}).call();
						}
					}, o.type);
					_loading = true;
				});
				// verifying if the loader is ready in the page, if not, it will be 
				// included automatically and then the process will continue.
				if ((_loaderQueue.length===1) && !_loading) {
					((typeof YAHOO == "undefined" || !YAHOO)?_includeLoader():_loaderDispatch());				
				}
			}
		};
	};
	
})();
