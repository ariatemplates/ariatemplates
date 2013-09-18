/*
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
var Aria = require("../Aria");

/**
 * This class ensures the asynchronous load of multiple types of resources (e.g. classes, files, templates, etc...) and
 * calls back the user when resources are available
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.MultiLoader",
    /**
     * Multi Loader constructor
     * @param {Object} loadDescription description of the content to load + callback
     *
     * <pre>
     * {
     *      classes : {Array} list of JS classpaths to be loaded
     *      templates : {Array} list of TPL classpaths to be loaded
     *      resources : {Array} list of RES classpaths to be loaded
     *      css : {Array} list of TPL.CSS classpaths to be loaded
     *      tml : {Array} list of TML classpaths to be loaded
     *      cml : {Array} list of CML classpaths to be loaded
     *      txt : {Array} list of TXT classpaths to be loaded
     *      oncomplete : {
     *          fn : {Function} the callback function - may be called synchronously if all dependencies are already available
     *          scope : {Object} [optional] scope object (i.e. 'this') to associate to fn - if not provided, the Aria object will be used
     *          args: {Object} [optional] callback arguments (passed back as argument when the callback is called)
     *      },
     *      onerror : {
     *          fn : {Function} the callback function called in case of load error
     *          scope : {Object} [optional] scope object
     *          args: {Object} [optional] callback arguments
     *          override: {Boolean} [optional] used to disable error warnings
     *      }
     * }
     * </pre>
     *
     * Alternatively, if there is no need to specify a scope and args, the callback property can contain directly the
     * callback function
     *
     * <pre>
     * oncomplete: function () {...}
     * </pre>.
     * @param {Boolean} autoDispose if true (default) the instance of multiloader will be automatically disposed when
     * the callback is called
     */
    $constructor : function (loadDescription, autoDispose) {
        this._autoDispose = (autoDispose !== false);
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
         * Start the load of the resources passed to the constructor. Warning: this method may be synchronous if all
         * resources are already available. As such, the caller should not make any processing but the callback after
         * this method call
         */
        load : function () {
            var cm = (require("./ClassMgr")), descriptor = this._loadDesc, hasError = false, allLoaded = true;

            var dependencies = {
                "JS" : cm.filterMissingDependencies(descriptor.classes),
                "TPL" : cm.filterMissingDependencies(descriptor.templates),
                // TODO: remove classType - temp fix for resources reloading and json injection
                "RES" : cm.filterMissingDependencies(descriptor.resources, "RES"),
                "CSS" : cm.filterMissingDependencies(descriptor.css),
                "TML" : cm.filterMissingDependencies(descriptor.tml),
                "TXT" : cm.filterMissingDependencies(descriptor.txt),
                "CML" : cm.filterMissingDependencies(descriptor.cml)
            };

            // This first loop only detects whether there are errors or missing dependencies
            for (var type in dependencies) {
                if (dependencies.hasOwnProperty(type)) {
                    var missing = dependencies[type];

                    hasError = hasError || missing === false;
                    allLoaded = allLoaded && missing === null;
                }
            }

            if (hasError || allLoaded) {
                this._execCallback(true, hasError);
            } else {
                var loader = new (require("./ClassLoader"))();

                // multiloader has a onerror function -> it will handle errors
                if (this._loadDesc['onerror'] && this._loadDesc['onerror'].override) {
                    loader.handleError = false;
                }
                this._clsLoader = loader; // useful reference for debugging

                loader.$on({
                    "classReady" : this._onClassesReady,
                    "classError" : this._onClassesError,
                    "complete" : this._onClassLoaderComplete,
                    scope : this
                });

                // This second loop adds dependencies on the loader
                for (type in dependencies) {
                    if (dependencies.hasOwnProperty(type)) {
                        missing = dependencies[type];

                        if (missing) {
                            loader.addDependencies(missing, type);
                        }
                    }
                }
                loader.loadDependencies();
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
         * @param {aria.core.ClassLoader:classReady:event} evt
         * @private
         */
        _onClassesReady : function (evt) {
            this._execCallback(false, false);
        },

        /**
         * Internal callback called if there is an error while loading classes
         * @param {aria.core.ClassLoader:classError:event} evt
         * @private
         */
        _onClassesError : function (evt) {
            this._execCallback(false, true);
        },

        /**
         * Internal method called when the class loader can be disposed
         * @param {aria.core.ClassLoader:complete:event} evt
         * @private
         */
        _onClassLoaderComplete : function (evt) {
            var loader = evt.src;
            this.$assert(90, this._clsLoader === loader);
            this._clsLoader = null;
            loader.$dispose();
            if (this._autoDispose) {
                this.$dispose();
            }
        }
    }
});
