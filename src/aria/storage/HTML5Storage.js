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
var ariaUtilsEvent = require("../utils/Event");
var ariaStorageAbstractStorage = require("./AbstractStorage");
var ariaCoreBrowser = require("../core/Browser");

/**
 * Abstract class that defines the API to interact with HTML5 DOM storage mechanism like localStorage and
 * sessionStorage. On top of the standard functionalities it also provides an event mechanism across instances, while in
 * the standard API events are not raised in the page that is currently modifying the storage location.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.storage.HTML5Storage",
    $extends : ariaStorageAbstractStorage,
    $statics : {
        UNAVAILABLE : "%1 not supported by the browser."
    },
    /**
     * Create a generic instance of HTML5Storage
     * @param {aria.storage.Beans:ConstructorArgs} options Constructor options
     * @param {String} storage Type of storage: either localStorage or sessionStorage
     */
    $constructor : function (options, storage, throwIfMissing) {
        this.$AbstractStorage.constructor.call(this, options);

        /**
         * Type of html5 storage. E.g. localStorage, sessionStorage
         * @type String
         */
        this.type = storage;

        /**
         * Keep a reference to the global storage object
         * @type Object
         */
        this.storage = Aria.$window[storage];

        /**
         * Event Callback for storage event happening on different windows
         * @type aria.core.CfgBeans:Callback
         */
        this._browserEventCb = null;

        if (!this.storage && throwIfMissing !== false) {
            // This might have been created by AbstractStorage
            if (this._disposeSerializer && this.serializer) {
                this.serializer.$dispose();
            }

            this.$logError(this.UNAVAILABLE, [this.type]);
            throw new Error(this.type);
        }
    },
    $destructor : function () {
        this.__target = null;
        this.$AbstractStorage.$destructor.call(this);

        this._listeners = null;
        this._checkListeners();
        this.storage = null;
    },
    $prototype : {
        /**
         * Internal method to get the current value associated with the given key. If the given key does not exist in
         * the list associated with the object then this method returns null.
         * @param {String} key identifier of a value
         * @return {String} Value stored as is
         */
        _get : function (key) {
            return this.storage.getItem(key);
        },

        /**
         * Internal method to add a key/value pair in the list.
         * @param {String} key identifier of a value
         * @param {String} value value to be stored after serialization
         */
        _set : function (key, value) {
            this.storage.setItem(key, value);
        },

        /**
         * Internal method to remove the value associated to key from the list.
         * @param {String} key identifier of the value to be removed
         */
        _remove : function (key) {
            this.storage.removeItem(key);
        },

        /**
         * Internal methof to empty the list of all key/value pairs, if any.
         */
        _clear : function () {
            this.storage.clear();
        },

        /**
         * React to storage event raised by the browser. We react only if this class does not have a namespace or if the
         * key appears to be correctly namespaced.
         * @param {HTMLEvent} event Event raised by the browser
         */
        _browserEvent : function (event) {
            // In FF 3.6 this event is raised also inside the same window
            if (aria.storage.EventBus.stop) {
                return;
            }

            var isInteresting = this.namespace
                    ? event.key.substring(0, this.namespace.length) === this.namespace
                    : true;

            if (isInteresting) {
                var oldValue = event.oldValue, newValue = event.newValue;
                if (oldValue) {
                    try {
                        oldValue = this.serializer.parse(oldValue);
                    } catch (e) {}
                }
                if (newValue) {
                    try {
                        newValue = this.serializer.parse(newValue);
                    } catch (e) {}
                }
                this._onStorageEvent({
                    name : "change",
                    key : event.key,
                    oldValue : oldValue,
                    newValue : newValue,
                    url : event.url,
                    namespace : this.namespace
                });
            }
        },

        /**
         * Depending on whether there is any listener, registers or unregisters the browser storage event.
         */
        _checkListeners : function () {
            if (!this.storage) {
                return;
            }
            var listeners = !!this._listeners;
            var registeredBrowserEvent = !!this._browserEventCb;

            if (listeners !== registeredBrowserEvent) {
                if (listeners) {
                    this._browserEventCb = {
                        fn : this._browserEvent,
                        scope : this
                    };
                    // listen to events raised by instances in a different window but the same storage location
                    ariaUtilsEvent.addListener(Aria.$window, "storage", this._browserEventCb);
                } else {
                    ariaUtilsEvent.removeListener(Aria.$window, "storage", this._browserEventCb);
                    this._browserEventCb = null;
                }
            }

        },

        /**
         * Override the $addListeners function to also register to the browser storage event if needed.
         * @override
         */
        $addListeners : function () {
            this.$on.apply(this, arguments);
        },

        /**
         * Override the $on function to log an error in IE8 that doesn't support storage event
         * @param {Object} event Event description
         * @override
         */
        $on : function (event) {
            if (ariaCoreBrowser.isIE8) {
                this.$logWarn(this.UNAVAILABLE, "change event");
            }

            this.$AbstractStorage.$on.call(this, event);
            this._checkListeners();
        },

        /**
         * Override the $unregisterListeners function to also unregister the browser storage event if needed.
         * @override
         */
        $unregisterListeners : function () {
            this.$AbstractStorage.$unregisterListeners.apply(this, arguments);
            this._checkListeners();
        },

        /**
         * Override the $removeListeners function to also unregister the browser storage event if needed.
         * @override
         */
        $removeListeners : function () {
            this.$AbstractStorage.$removeListeners.apply(this, arguments);
            this._checkListeners();
        }
    }
});
