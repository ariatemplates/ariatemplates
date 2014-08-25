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
var Aria = require("../../Aria");
var ariaUtilsJson = require("../../utils/Json");
var ariaUtilsType = require("../../utils/Type");
var ariaCoreTimer = require("../../core/Timer");


(function () {
    /**
     * Mock for the resources handler. This is needed because loadResourcesHandler is called synchronously. This handler
     * has only methods to get suggestions. These methods queue the latest suggestValue in order to replay it when the correct
     * resources handler is loaded.
     * @private
     */
    function PromisedHandler () {
        this.getSuggestions = function (entry, callback) {
            this.pendingSuggestion = {
                entry : entry,
                callback : callback
            };
        };
        this.getAllSuggestions = function (callback) {
            this.pendingSuggestion = {
                // there's no entry, in case you didn't notice
                callback : callback
            };
        };
        this.$dispose = Aria.empty;
    }

    /**
     * Error callback for Aria.load.
     * @param {Object} args Callback arguments
     * @private
     */
    function resourcesHandlerError (args) {
        var scope = args.scope;

        // resources handler is not an AT class, no need to dispose
        scope._autoDisposeHandler = false;

        scope.$logError(scope.INVALID_RESOURCES_HANDLER, args.classpath);
    }

    /**
     * Callback for Aria.load. Instantiate the ResourcesHandler class and set it on Suggestions controller
     * @param {Object} args Callback arguments
     * @private
     */
    function resourcesHandlerLoaded (args) {
        var scope = args.scope, handler = Aria.getClassInstance(args.classpath);
        var pendingSuggestion = scope._resourcesHandler.pendingSuggestion;

        scope._resourcesHandler = handler;
        scope._autoDisposeHandler = true;

        if (pendingSuggestion) {
            if (pendingSuggestion.entry) {
                handler.getSuggestions(pendingSuggestion.entry, pendingSuggestion.callback);
            } else {
                handler.getAllSuggestions(pendingSuggestion.callback);
            }
        }
    }

    /**
     * Intermediate callback to make sure that Aria.load is always async.
     * @param {Object} args Callback arguments
     * @private
     */
    function delayLoading (args) {
        ariaCoreTimer.addCallback({
            fn : resourcesHandlerLoaded,
            args : args,
            scope : {},
            delay : 12
        });
    }

    /**
     * Load and instantiate the resources handler.
     * @param {String} classpath Resources Handler classpath
     * @param {aria.html.controllers.Suggestions} self Suggestions controller instance
     * @private
     */
    function loadResourcesHandler (classpath, self) {
        var Handler = Aria.getClassRef(classpath);

        if (Handler) {
            return new Handler();
        } else {
            var callbackArgs = {
                scope : self,
                classpath : classpath
            };

            Aria.load({
                classes : [classpath],
                oncomplete : {
                    fn : delayLoading,
                    args : callbackArgs
                },
                onerror : {
                    fn : resourcesHandlerError,
                    args : callbackArgs
                }
            });

            return new PromisedHandler();
        }
    }

    /**
     * Suggestions controller. This class can be used to provide auto-completion functionalities on widgets or standard
     * element.<br />
     * It exposes a data model with a list of suggestions and a selected value in order to bind the view to those
     * values.<br />
     * The list of possible suggestions must be specified inside a ReasourcesHandler, a class implementing
     * aria.resources.handlers.IResourcesHandler
     */
    module.exports = Aria.classDefinition({
        $classpath : "aria.html.controllers.Suggestions",
        $constructor : function () {
            this._init();
        },
        $destructor : function () {
            this.dispose();
        },
        $statics : {
            INVALID_RESOURCES_HANDLER : "Invalid resources handler '%1'"
        },
        $prototype : {
            /**
             * Initialize the class. This function is called in the constructor to create instance variable but is also
             * available on the prototype in order to be called by classes with multiple extends. It modifies 'this'
             * object so it should have the context of the class instance.
             * @protected
             */
            _init : function () {
                /**
                 * Data model. It contains the list of suggestions and the selected value.
                 * @type Object
                 *
                 * <pre>
                 * {
                 *    suggestions : Array of suggestions, empty array if none
                 *    value : Selected value, null if none
                 * }
                 * </pre>
                 * @name aria.html.controllers.Suggestions.instance.data
                 */
                this.data = {
                    suggestions : [],

                    value : null
                };

                /**
                 * Resources handler used by this controller
                 * @protected
                 * @type aria.resources.handlers.IResourcesHandler
                 * @name aria.html.controllers.Suggestions.instance._resourcesHandler
                 */
                this._resourcesHandler = null;

                /**
                 * Specify if the handler was created by the controller, and has to be disposed.
                 * @protected
                 * @type Boolean
                 * @name aria.html.controllers.Suggestions.instance._autoDisposeHandler
                 */
                this._autoDisposeHandler = false;
            },

            /**
             * Dispose this controller. This class has a dispose so that we can have multiple extends and still dispose
             * it.
             */
            dispose : function () {
                if (this._autoDisposeHandler && this._resourcesHandler) {
                    this._resourcesHandler.$dispose();
                }
            },

            /**
             * Set the resourceHandler for this controller. If it's a classpath the class will be loaded and
             * instantiated.
             * @param {String|Object} resourcesHandler classpath or instance
             */
            setResourcesHandler : function (resourcesHandler) {
                if (ariaUtilsType.isString(resourcesHandler)) {
                    resourcesHandler = loadResourcesHandler(resourcesHandler, this);
                    this._autoDisposeHandler = true;
                }
                this._resourcesHandler = resourcesHandler;
            },

            /**
             * Given a search string, populate the internal data model with a list of suggestions taken from the
             * resources handler.
             * @param {String} text Search string
             */
            suggestValue : function (text) {
                this._resourcesHandler.getSuggestions(text, {
                    fn : this._callback,
                    scope : this
                });
            },

            /**
             * Callback for ResourcesHandler.getSuggestions
             * @protected
             * @param {Array} suggestions List of suggestions
             */
            _callback : function (suggestions) {
                ariaUtilsJson.setValue(this.data, "suggestions", suggestions || []);
            },

            /**
             * Set the selected value inside the data model. It also clear the list of suggestions
             * @param {Object} suggestion Selected suggestion
             */
            setSelected : function (suggestion) {
                ariaUtilsJson.setValue(this.data, "value", suggestion);
                this.empty();
            },

            /**
             * Empty the list of suggestions without modifying the selected value
             */
            empty : function () {
                ariaUtilsJson.setValue(this.data, "suggestions", []);
            }
        }
    });
})();
