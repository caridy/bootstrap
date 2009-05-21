/** 
 * Provides Bootstrap definition based on YUI 3.x.
 *
 * @module bootstrap
 */

/**
 * Provides YUI_bootstrap methods.
 *
 * @class YUI_bootstrap
 * @static
 */
(function() {
	
	var _config = null;
   	
	/**
     * YUI_bootstrap function.  If YUI_bootstrap is already defined, the
     * existing YUI_bootstrap functino will not be overwritten to preserve
     * the state of the bootstrap.
     *
     * @class YUI_bootstrap
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
     */
	YUI_bootstrap = function (o) {
		
		// analyzing "o"
		o = o || _config || {};
		
		return {
			/**
		     * Load a set of modules and notify thru the callback method.
		     * @param modules* {string} 1-n modules to bind (uses arguments array)
		     * @param *callback {function} callback function executed when 
		     * the instance has the required functionality.  If included, it
		     * must be the last parameter.
		     *
		     * YUI_bootstrap().use('dd')
		     *
		     * @return void
		     */
			use: function () {
				var Y = YUI(o);
				Y.use.apply (Y, arguments);
			},
			/**
		     * Set the default configuration for the loader.
		     * @param o {object} default configuration object for the bootstrap, 
		     * basically "o" can be used to define the global configuration once in 
		     * your application, instead of including the configuration for each single 
		     * bootstrap call.
		     *
		     * YUI_bootstrap(o).setAsDefault()
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