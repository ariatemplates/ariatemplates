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
var ariaUtilsType = require("./Type");
var ariaUtilsJson = require("./Json");
var ariaStorageLocalStorage = require("../storage/LocalStorage");
var ariaCoreBrowser = require("../core/Browser");
var ariaUtilsEvent = require("./Event");
/**
 * <pre>
 * {
 *     isHtml5HistoryAvailable : whether the HTML5 History API is available,
 *     hashManager : a reference to aria.utils.HashManager if needed,
 *     arrayUtil : a reference to aria.utils.Array if needed
 * }
 * </pre>
 *
 * @type Object
 * @private
 */
var dynamicDependencies = require("./$History").getDependencies();

(function () {
    "use strict";

    var window = Aria.$window;

    var readHtml5HistoryState = function () {
        try {
            return window.history.state;
        } catch (e) {
            // reading history.state on IE 10 can raise an "Unspecified error" exception
            return null;
        }
    };

    /**
     * Whether HTML5 history API is natively supported
     * @type Boolean
     * @private
     */
    var html5History = dynamicDependencies.isHtml5HistoryAvailable;

    /**
     * Contains a set of states that have to be stored. If the browser supports native HTML5 history API, it only
     * contains the initial states in order to be able to restore the title. Local storage is used in order to keep this
     * information persistent. This allows to support navigation to external links and page refresh.
     * @type Object
     * @private
     */
    var stateMemory = {};

    /**
     * Used only when hash-based fallback is needed
     * @type aria.utils.HashManager
     * @private
     */
    var hashManager = dynamicDependencies.hashManager;

    module.exports = Aria.classDefinition({
        $classpath : "aria.utils.History",
        $singleton : true,
        $statics : {

            /**
             * Key that is used in order to save state information in the local storage
             * @type String
             * @private
             */
            _STORAGE_KEY : "at_history",

            /**
             * Key that is used in order to append the id of the state in the url. It is needed for hash-based
             * navigation fallback
             * @type String
             */
            ID_KEY : "&_hid=",

            /**
             * Represents the number of seconds after which the states retrieved from the local storage are considered
             * expired. It can be set from the outside.
             * @type Number
             */
            EXPIRATION_TIME : 86400
        },
        $constructor : function () {

            /**
             * Called on window unload.
             * @type aria.core.CfgBeans:Callback
             * @private
             */
            this._saveStateCB = {
                fn : this._saveState,
                scope : this
            };

            /**
             * Current state id. Only used in browsers that do not support HTML5 history API.
             * @type String
             * @private
             */
            this._currentId = null;

            /**
             * Position of the current state in the array of stored states. Only used in browsers that do not support
             * HTML5 history API.
             * @type String
             * @private
             */
            this._currentPos = 0;

            /**
             * Called on hash changeOnly used in browsers that do not support HTML5 history API.
             * @type aria.core.CfgBeans:Callback
             * @private
             */
            this._hashChangeCB = {
                fn : this._onHashChange,
                scope : this
            };

            /**
             * Used to store state information for page refresh and external navigation
             * @type aria.storage.LocalStorage
             * @private
             */
            this._storage = new ariaStorageLocalStorage();

            stateMemory = this._storage.getItem(this._STORAGE_KEY) || {
                discarded : [],
                states : []
            };

            ariaUtilsEvent.addListener(window, "unload", this._saveStateCB);

            /**
             * Whether the browser is IE7 or a previous version
             * @type Boolean
             * @private
             */
            this._isIE7OrLess = ariaCoreBrowser.isOldIE && ariaCoreBrowser.majorVersion < 8;

            this._init();

            /**
             * State object containing the data that were associated to it when pushing or replacing the state.
             * Compliant with the standard window.history.state
             * @type Object
             */
            this.state = this.getState();

        },
        $destructor : function () {
            if (this._storage) {
                this._saveState();
            }
            this._dispose();
        },
        $events : {
            "onpopstate" : {
                description : "Notify window when a state is popped and raise this event",
                properties : {
                    state : "The state that has been popped."
                }
            }
        },
        $prototype : {

            /**
             * Gets the current state of the browser
             * @return {object} state object containing the data that were associated to it when pushing or replacing
             * the state. Compliant with the standard window.history.state
             */
            getState : html5History ? function () {
                var state = ariaUtilsJson.copy(readHtml5HistoryState());
                if (state) {
                    delete state.__info;
                }

                return state;
            } : function () {
                var stateInfo = this._retrieveFromMemory();
                var state = stateInfo ? stateInfo.state.state : null;
                return state;
            },

            /**
             * Gets the current title of the page
             * @return {String} title
             */
            getTitle : function () {
                return window.document.title;
            },

            /**
             * Gets url part that was set using a pushState or replaceState
             * @return {String} url
             */
            getUrl : html5History ? function () {
                var state = readHtml5HistoryState();
                if (state && state.__info) {
                    return state.__info.url;
                }
                return window.location.href;
            } : function () {
                var hash = hashManager.getHashString();
                if (hash) {
                    return hash.split(this.ID_KEY)[0];
                }
                return window.location.href;
            },

            /**
             * Go back once through the history (same as hitting the browser's back button)
             */
            back : function () {
                window.history.back();
            },

            /**
             * Go forward once through the history (same as hitting the browser's forward button)
             */
            forward : function () {
                window.history.forward();
            },

            /**
             * Go back or forward through the history x times
             * @param {Number} n positive to go forward, negative to go back
             */
            go : window.history.go ? function (n) {
                window.history.go(n);
            } : function (n) {
                var method = n < 0 ? "back" : "forward";
                n = Math.abs(n);
                for (var i = 0; i < n; i++) {
                    window.history[method]();
                }
            },

            /**
             * Pushes a new state to the browser
             * @param {Object} data
             * @param {String} title
             * @param {String} url mandatory
             */
            pushState : html5History ? function (data, title, url) {
                title = this._setTitle(title);
                data = data ? ariaUtilsJson.copy(data) : {};
                data.__info = {
                    title : title,
                    url : url
                };
                window.history.pushState(data, title, url);
                this.state = this.getState();

            } : function (data, title, url) {
                this._setState(data, title, url);
            },

            /**
             * Replaces the existing state with a new state to the browser
             * @param {Object} data
             * @param {String} title
             * @param {String} url mandatory
             */
            replaceState : html5History ? function (data, title, url) {
                title = this._setTitle(title);
                data = data ? ariaUtilsJson.copy(data) : {};
                data.__info = {
                    title : title,
                    url : url
                };
                window.history.replaceState(data, title, url);
                this.state = this.getState();
            } : function (data, title, url) {
                this._setState(data, title, url, true);
            },

            /**
             * Add listeners and saves state information that are needed by the class according to the browser support
             * of HTML5 history API.
             * @private
             */
            _init : html5History ? function () {

                var self = this;
                window.onpopstate = function (evt) {
                    self._raiseOnPopStateEvent.call(self, evt);
                };
                var state = readHtml5HistoryState(), title;
                if (state && state.__info) {
                    title = state.__info.title;
                    if (title) {
                        this._setTitle(title);
                    }
                } else {
                    this._addInitialState();
                }

            } : function () {

                var stateInfo = this._retrieveFromMemory();
                if (stateInfo) {
                    this._applyState(stateInfo);
                } else {
                    this._addInitialState();
                }

                hashManager.addCallback(this._hashChangeCB);
            },

            /**
             * Save the states that are still valid and needed in order to support page refresh and external navigation.
             * Called on window unload.
             * @private
             */
            _saveState : function () {
                this._removeOldStates();
                ariaUtilsEvent.removeListener(window, "unload", this._saveStateCB);
                this._storage.setItem(this._STORAGE_KEY, stateMemory);
                this._storage.$dispose();
                this._storage = null;
            },

            /**
             * Remove listeners added in the _init method
             * @private
             */
            _dispose : html5History ? function () {
                window.onpopstate = null;
            } : function () {
                hashManager.removeCallback(this._hashChangeCB);
            },

            /**
             * Set the title of the page.
             * @param {String} title
             * @return {String} Actual title of the page. If no argument is provided, it represents the actual title of
             * the page
             * @private
             */
            _setTitle : function (title) {
                var document = window.document;
                if (ariaUtilsType.isString(title)) {
                    document.title = title;
                } else {
                    title = document.title;
                }
                return title;
            },

            /**
             * Generate unique id's in an increasing fashion
             * @return {String} Id
             * @private
             */
            _generateId : function () {
                return (new Date()).getTime() + "";
            },

            /**
             * Retrieve the state from the store.
             * @param {String} id Id of the state
             * @return {Object}
             *
             * <pre>
             * {
             *     position : {Number} position in the store,
             *     state : {
             *         id : {String} id of the state,
             *         title : {String} title of the page,
             *         url : {String} only for initial states,
             *         state : {Object} Saved data for the state
             *     }
             * }
             * </pre>
             *
             * @private
             */
            _retrieveFromMemory : function (id) {
                if (html5History) {
                    id = null;
                } else {
                    id = id || this._getIdFromHash();
                }
                var states = stateMemory.states;
                var url = window.location.href.replace(/#.*$/, "");
                var returnValue = null, mostRecent = "0", state;
                for (var i = 0, length = states.length; i < length; i++) {
                    state = states[i];
                    if (state.id === id) {
                        return {
                            position : i,
                            state : state
                        };
                    }
                    if (state.url === url && state.id > mostRecent) {
                        returnValue = {
                            position : i,
                            state : state
                        };
                        mostRecent = state.id;
                    }
                }
                return returnValue;
            },

            /**
             * Add an initial state by storing also the url
             * @private
             */
            _addInitialState : function () {
                var id = this._generateId();
                this._currentPos = stateMemory.states.length;

                var stateEntry = {
                    url : window.location.href.replace(/#.*$/, ""),
                    id : id,
                    title : window.document.title || "",
                    state : null
                };
                stateMemory.states.push(stateEntry);
            },

            /**
             * Remove old states that are present in the state store. States are considered old if they have been stored
             * more than aria.utils.History.EXPIRATION_TIME seconds before
             * @private
             */
            _removeOldStates : function () {
                stateMemory.discarded = [];
                if (this._isIE7OrLess) {
                    stateMemory.states = [stateMemory.states[this._currentPos]];
                    return;
                }
                var states = stateMemory.states;
                var expirationTime = ((new Date()).getTime() - this.EXPIRATION_TIME * 1000) + "";
                for (var i = 0; i < states.length; i++) {
                    if (states[i].id > expirationTime) {
                        break;
                    }
                }
                states.splice(0, i);
            },

            // Methods that are specific to browsers that support HTML5 history API.

            /**
             * React to native onpopstate event by setting the title and raising the onpopstate class event. Only used
             * in browsers that support HTML5 history API.
             * @param {Object} Event object
             * @private
             */
            _raiseOnPopStateEvent : function (evt) {
                var state = ariaUtilsJson.copy(evt.state), title;
                if (state && state.__info) {
                    title = state.__info.title;
                    delete state.__info;
                } else {
                    var stateInfo = this._retrieveFromMemory();
                    title = stateInfo ? stateInfo.state.title : null;
                }
                this.state = state;
                if (title) {
                    this._setTitle(title);
                }
                this.$raiseEvent({
                    name : "onpopstate",
                    state : state
                });
            },

            // Methods that are specific to browsers that do not support HTML5 history API. Hash-based navigation
            // fallback is needed

            /**
             * Get the id based on the hash. Useful when hash-based navigation is used as a fallback
             * @return {String} Inferred id
             * @private
             */
            _getIdFromHash : function () {
                var id = hashManager.getHashString().split(this.ID_KEY);
                if (id.length > 1) {
                    return id[1];
                }
                return null;
            },

            /**
             * React to a hash change by retrieving the state from the store and raising the onpopstate event.
             * @private
             */
            _onHashChange : function () {
                var stateInfo = this._retrieveFromMemory();
                var id = stateInfo ? stateInfo.state.id : null;
                if (id && this._currentId != id && this._applyState(stateInfo)) {
                    this.state = this.getState();
                    this.$raiseEvent({
                        name : "onpopstate",
                        state : this.state
                    });
                }
            },

            /**
             * Pushes or replaces a new state in the browser history
             * @param {Object} data
             * @param {String} title
             * @param {String} url mandatory
             * @param {Boolean} replace
             */
            _setState : function (data, title, url, replace) {
                if (replace && this._isIE7OrLess) {
                    var stateInfo = this._retrieveFromMemory();
                    stateMemory.discarded.push(stateInfo.state.id);
                }
                var id = this._generateId();
                var hash = url || "";
                hash += this.ID_KEY + id;
                title = this._setTitle(title);
                this._currentId = id;
                var stateEntry = {
                    id : id,
                    title : title,
                    state : data ? ariaUtilsJson.copy(data) : {}
                };
                this._currentPos++;
                stateMemory.states.splice(this._currentPos, stateMemory.states.length - this._currentPos, stateEntry);
                if (!replace || this._isIE7OrLess) {
                    hashManager.setHash(hash);
                } else {
                    window.location.replace(window.location.href.replace(/#.*$/, "") + "#" + hash);
                }
                this.state = this.getState();

            },

            /**
             * Apply a state by also checking whether it is discarded or not
             * @param {Objet} stateInfo
             *
             * <pre>
             * {
             *     position : {Number} position in the store,
             *     state : {
             *         id : {String} id of the state,
             *         title : {String} title of the page,
             *         url : {String} only for initial states,
             *         state : {Object} Saved data for the state
             *     }
             * }
             * </pre>
             *
             * @return {Boolean} true if the state has been applied, false if the state is discarded
             * @private
             */
            _applyState : function (stateInfo) {
                if (dynamicDependencies.arrayUtil.contains(stateMemory.discarded, stateInfo.state.id)) {
                    if (stateInfo.position < this._currentPos) {
                        this.back();
                    } else {
                        this.forward();
                    }
                    return false;
                }
                this._currentPos = stateInfo.position;
                this._currentId = stateInfo.state.id;
                this._setTitle(stateInfo.state.title);
                return true;
            }

        }
    });
})();