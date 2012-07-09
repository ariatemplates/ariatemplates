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

(function () {
    /**
     * Mock for the resources handler. This is needed because loadResourcesHandler is called synchronously. This handler
     * has only a getSuggestions method that queues the latest suggestValue in order to replay it when the correct
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
            handler.getSuggestions(pendingSuggestion.entry, pendingSuggestion.callback);
        }
    }

    /**
     * Intermediate callback to make sure that Aria.load is always async.
     * @param {Object} args Callback arguments
     * @private
     */
    function delayLoading (args) {
        aria.core.Timer.addCallback({
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
    Aria.classDefinition({
        $classpath : "aria.html.controllers.Suggestions",
        $dependencies : ["aria.utils.Json", "aria.utils.Type"],
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
                 * @name aria.html.controllers.Suggestions.data
                 */
                this.data = {
                    suggestions : [],

                    value : null
                };

                /**
                 * Resources handler used by this controller
                 * @protected
                 * @type aria.resources.handlers.IResourcesHandler
                 * @name aria.html.controllers.Suggestions._resourcesHandler
                 */
                this._resourcesHandler = null;

                /**
                 * Specify if the handler was created by the controller, and has to be disposed.
                 * @protected
                 * @type Boolean
                 * @name aria.html.controllers.Suggestions._autoDisposeHandler
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
                if (aria.utils.Type.isString(resourcesHandler)) {
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
                aria.utils.Json.setValue(this.data, "suggestions", suggestions || []);
            },

            /**
             * Set the selected value inside the data model. It also clear the list of suggestions
             * @param {Object} suggestion Selected suggestion
             */
            setSelected : function (suggestion) {
                aria.utils.Json.setValue(this.data, "value", suggestion);
                this.empty();
            },

            /**
             * Empty the list of suggestions without modifying the selected value
             */
            empty : function () {
                aria.utils.Json.setValue(this.data, "suggestions", []);
            }
        }
    });
})();