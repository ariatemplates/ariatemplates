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
    },
    $statics : {
        LOAD_ERROR : "Load failed",

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
            var descriptor = this._loadDesc;
            var promise = Aria.loadOldDependencies({
                classpaths : {
                    "JS" : descriptor.classes,
                    "TPL" : descriptor.templates,
                    "RES" : descriptor.resources,
                    "CSS" : descriptor.css,
                    "TML" : descriptor.tml,
                    "TXT" : descriptor.txt,
                    "CML" : descriptor.cml
                },
                complete : {
                    fn : Aria.returnNull,
                    scope : this,
                    args : []
                }
            });

            if (promise) {
                var self = this;
                promise.thenSync(function () {
                    self._execCallback(false);
                }, function (error) {
                    if (!descriptor.onerror || !descriptor.onerror.override) {
                        // multiloader has an onerror function -> it will handle errors
                        self.$logError(self.LOAD_ERROR, null, error);
                    }
                    self._execCallback(false, true);
                }).done();
            } else {
                this._execCallback(true);
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
            if (this._autoDispose) {
                this.$dispose();
            }
        }
    }
});
