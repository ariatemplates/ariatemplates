/**
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @class aria.core.MultiLoader This class ensures the asynchronous load of multiple types of resources (e.g. classes,
 * files, templates, etc...) and calls back the user when resources are available
 * @extends aria.core.JsObject
 */
Aria.classDefinition({
	$classpath : 'aria.core.MultiLoader',
	/**
	 * Multi Loader constructor
	 * @param {Object} loadDescription description of the content to load + callback [loadDescription] { classes:[]
	 * {Array} list of JS classpaths to be loaded templates:[] {Array} list of TPL classpaths to be loaded resources:[]
	 * {Array} list of RES classpaths to be loaded oncomplete:{ fn: {Function} the callback function - may be called
	 * synchronously if all dependencies are already available scope: {Object} [optional] scope object (i.e. 'this') to
	 * associate to fn - if not provided, the Aria object will be used args: {Object} [optional] callback arguments
	 * (passed back as argument when the callback is called) } } Alternatively, if there is no need to specify a scope
	 * and args, the callback property can contain directly the callback function oncomplete: function () {...} instead
	 * of: oncomplete: {fn: function () {...}}.
	 * @param {Boolean} autoDispose if true (default) the class will be automatically disposed when the callback is
	 * called
	 */
	$constructor : function (loadDescription, autoDispose) {
		this._autoDispose = (autoDispose != false);
		this._loadDesc = loadDescription;
		this._clsLoader = null;
	},
	$statics : {
		// ERROR MESSAGES:
		MULTILOADER_CB1_ERROR : "Error detected while executing synchronous callback on MultiLoader.",
		MULTILOADER_CB2_ERROR : "Error detected while executing callback on MultiLoader."
	},
	$prototype : {
		/**
		 * Start the load of the resources passed to the constructor Warning: this mehod may be synchronous if all
		 * resources are already available As such, the caller should not make any processing but the callback after
		 * this method call
		 */
		load : function () {
			var cm = aria.core.ClassMgr;
			var mdpTPL = cm.filterMissingDependencies(this._loadDesc.templates);
			var mdpJS = cm.filterMissingDependencies(this._loadDesc.classes);
			var mdpRES = cm.filterMissingDependencies(this._loadDesc.resources, "RES"); // TODO: remove classType - temp
			// fix for resources reloading
			// and json injection
			var mdpCSS = cm.filterMissingDependencies(this._loadDesc.css);
			var mdpTML = cm.filterMissingDependencies(this._loadDesc.tml);
			var mdpTXT = cm.filterMissingDependencies(this._loadDesc.txt);

			if (mdpTPL == false || mdpJS == false || mdpRES == false || mdpCSS == false || mdpTML == false
					| mdpTXT == false) {
				this._execCallback(true, true);
			} else if (mdpJS != null || mdpTPL != null || mdpRES != null || mdpCSS != null || mdpTML != null
					| mdpTXT != null) {

				// Some classes are missing - let's use a ClassLoader
				var loader = new aria.core.ClassLoader();

				// multiloader has a onerror function -> it will handle errors
				if (this._loadDesc['onerror'] && this._loadDesc['onerror'].override) {
					loader.handleError = false;
				}
				this._clsLoader = loader; // usefull reference for debugging

				loader.$on({
					'classReady' : this._onClassesReady,
					'classError' : this._onClassesError,
					'complete' : this._onClassLoaderComplete,
					scope : this
				});

				// start dependency load
				if (mdpJS != null) {
					loader.addDependencies(mdpJS, "JS");
				}
				if (mdpTPL != null) {
					loader.addDependencies(mdpTPL, "TPL");
				}
				if (mdpRES != null) {
					loader.addDependencies(mdpRES, "RES");
				}
				if (mdpCSS != null) {
					loader.addDependencies(mdpCSS, "CSS");
				}
				if (mdpTML != null) {
					loader.addDependencies(mdpTML, "TML");
				}
				if (mdpTXT != null) {
					loader.addDependencies(mdpTXT, "TXT");
				}
				loader.loadDependencies();
			} else {
				// All dependencies are here - synchronous callback
				this._execCallback(true, false);
			}
		},

		/**
		 * Internal method used to callback the class user
		 * @param {Boolean} syncCall true if the callback is called synchronously (i.e. in the load() call stack)
		 * @private
		 */
		_execCallback : function (syncCall, error) {
			var cb = this._loadDesc[error ? "onerror" : "oncomplete"];
			if (cb) {
				if (typeof(cb) == 'function') {
					cb = {
						fn : cb
					};
				}
				var scope = (cb.scope) ? cb.scope : Aria;
				try {
					cb.fn.call(scope, cb.args);
				} catch (ex) {
					var errId = (syncCall) ? this.MULTILOADER_CB1_ERROR : this.MULTILOADER_CB2_ERROR;
					this.$logError(errId, null, ex);
				}
			}
			// in case of asynchronous call the dispose is done in the complete event
			if (syncCall && this._autoDispose) {
				this.$dispose();
			}
		},

		/**
		 * Internal callback called when the class dependencies are ready
		 * @param {aria.core.ClassLoader.$events.classReady} evt
		 * @private
		 */
		_onClassesReady : function (evt) {
			this._execCallback(false, false);
		},

		/**
		 * Internal callback called if there is an error while loading classes
		 * @param {aria.core.ClassLoader.$events.classError} evt
		 * @private
		 */
		_onClassesError : function (evt) {
			this._execCallback(false, true);
		},

		/**
		 * Internal method called when the class loader can be disposed
		 * @param {aria.core.ClassLoader.$events.complete} evt
		 * @private
		 */
		_onClassLoaderComplete : function (evt) {
			var loader = evt.src;
			this.$assert(90, this._clsLoader == loader);
			this._clsLoader = null;
			loader.$dispose();
			if (this._autoDispose) {
				this.$dispose();
			}
		}
	}
});
