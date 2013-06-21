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

/**
 * Global class it checks DOM is in Ready state and executes the callback function
 */
Aria.classDefinition({
    $classpath : "aria.dom.DomReady",
    $singleton : true,
    $events : {
        "ready" : "Raised when the DOM is in ready state."
    },
    $constructor : function () {

        /**
         * True if the DOM is in Ready state.
         * @type Boolean
         */
        this.isReady = false;

        /**
         * @type Boolean
         * @private
         */
        this._isListening = false;

        /**
         * List of added listeners that have to be removed
         * @type Array
         * @private
         */
        this._listenersToRemove = [];

    },
    $prototype : {
        /**
         * This method executes the callback once the DOM is in ready state.
         * @param {aria.core.CfgBeans:Callback} a callback function
         */
        onReady : function (callback) {
            if (this.isReady) {
                this.$callback(callback);
            } else {
                this.$on({
                    "ready" : callback,
                    scope : this
                });
            }
            if (!this._isListening) {
                this._isListening = true;
                this._listen();
            }
        },

        /**
         * This method to listen to the native Events to execute the callback.
         */
        _listen : function () {
            var windowObj = Aria.$frameworkWindow;
            if (windowObj == null) {
                // not a browser
                this._raiseReadyEvent();
                return;
            }
            this._checkReadyState(false);
            if (this.isReady) {
                return;
            }
            var docRef = windowObj.document, browser = aria.core.Browser, that = this, handler;
            if (windowObj.addEventListener) {
                if (!browser.isOpera) {
                    handler = function () {
                        that._raiseReadyEvent();
                    };
                    docRef.addEventListener("DOMContentLoaded", handler, false);
                    this._listenersToRemove.push([docRef, "removeEventListener", "DOMContentLoaded", handler]);

                }
                // since for opera the DOMContentLoaded fires before all CSS are loaded check if all CSS are loaded
                else {
                    handler = function () {
                        that._checkCSSLoaded();
                    };
                    docRef.addEventListener("DOMContentLoaded", handler, false);
                    this._listenersToRemove.push([docRef, "removeEventListener", "DOMContentLoaded", handler]);
                }
                var loadHandler = function () {
                    that._raiseReadyEvent();
                };
                this._listenersToRemove.push([windowObj, "removeEventListener", "load", loadHandler]);

                // a fallback to window.load
                windowObj.addEventListener("load", loadHandler, false);

            } else if (windowObj.attachEvent) {

                if (windowObj === windowObj.top) {
                    this._checkScroll();

                } else {
                    that._checkReadyState(true);
                }

                handler = function () {
                    that._raiseReadyEvent();
                };
                this._listenersToRemove.push([windowObj, "detachEvent", "onload", handler]);
                // a fallback to window.onload
                windowObj.attachEvent("onload", handler);
            }

        },
        /**
         * This method is to check if DOM is already in Ready State else wait until its loaded completly.
         * @param {Boolean} wait
         */
        _checkReadyState : function (wait) {
            var docRef = Aria.$frameworkWindow.document;
            var that = this;
            if (docRef.readyState === "complete") {
                this._raiseReadyEvent();
            } else if (wait) {
                setTimeout(function () {
                    that._checkReadyState();
                }, 16);
            }

        },
        /**
         * Method to check for any disabled Style sheets wait until its loaded completly.
         */
        _checkCSSLoaded : function () {
            var that = this;
            var docRef = Aria.$frameworkWindow.document;
            for (var i = 0; i < docRef.styleSheets.length; i++) {
                if (docRef.styleSheets[i].disabled) {
                    setTimeout(function () {
                        that._checkCSSLoaded();
                    }, 16);
                    return;
                }
            }
            // and execute any waiting functions
            this._raiseReadyEvent();
        },

        /**
         * Method to check the DOM is ready of IE versions < 9 and window is not a iframe. returns if the DOM goes to
         * ready State.
         */
        _checkScroll : function () {
            var that = this;
            try {
                Aria.$frameworkWindow.document.documentElement.doScroll("left");

            } catch (e) {
                // above the default timer resolution
                setTimeout(function () {
                    that._checkScroll();
                }, 16);
                return;
            }

            // DOM Loaded
            this._raiseReadyEvent();
        },

        /**
         * The method is to execute the callback once the DOM is Ready
         */
        _raiseReadyEvent : function () {
            // check the ready state
            if (this.isReady) {
                return;
            }
            this.isReady = true;
            this._removeListeners();
            this.$raiseEvent('ready');
        },

        /**
         * Removes listeners added for dom ready detection
         * @private
         */
        _removeListeners : function () {
            var listeners = this._listenersToRemove, list;
            for (var i = 0, length = listeners.length; i < length; i++) {
                list = listeners[i];
                list[0][list[1]](list[2], list[3], false);
            }
            this._listenersToRemove = [];
        }

    }
});
