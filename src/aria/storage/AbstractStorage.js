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
var ariaStorageEventBus = require("./EventBus");
var ariaUtilsJsonJsonSerializer = require("../utils/json/JsonSerializer");
var ariaUtilsType = require("../utils/Type");
var ariaStorageIStorage = require("./IStorage");
var ariaUtilsJson = require("../utils/Json");


/**
 * Abstract class that defines the API to interact with any storage mechanism. Defines an event mechanism across
 * instances and a serialization utility.<br />
 * Classes extending from this, normally should only define the protected methods
 * <ul>
 * <li>_get()</li>
 * <li>_set()</li>
 * <li>_remove()</li>
 * <li>_clear()</li>
 * </ul>
 * which have direct access to the storage location. This class calls the mentioned methodes with namespaced and
 * serialized key/value pairs.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.storage.AbstractStorage",
    $implements : [ariaStorageIStorage],
    $statics : {
        INVALID_SERIALIZER : "Invalid serializer configuration. Make sure it implements aria.utils.json.ISerializer",
        INVALID_NAMESPACE : "Inavlid namespace configuration. Must be a string.",
        EVENT_KEYS : ["name", "key", "oldValue", "newValue", "url"]
    },
    /**
     * Create an abstract instance of storage
     * @param {aria.storage.Beans:ConstructorArgs} options Constructor options
     */
    $constructor : function (options) {
        /**
         * Whether the serializer instance should be disposed when this instance is disposed
         * @type Boolean
         * @protected
         */
        this._disposeSerializer = false;

        /**
         * Callback for storage events
         * @type aria.core.CfgBeans:Callback
         */
        this._eventCallback = {
            fn : this._onStorageEvent,
            scope : this
        };

        // listen to events raised by other instances on the same window
        ariaStorageEventBus.$on({
            "change" : this._eventCallback
        });

        var serializer = options ? options.serializer : null, create = true;
        if (serializer) {
            if ("serialize" in serializer && "parse" in serializer) {
                // There is a serializer matching the interface, it's the only case where we don't have to create a
                // new instance
                create = false;
            } else {
                this.$logError(this.INVALID_SERIALIZER);
            }
        }
        if (create) {
            serializer = new ariaUtilsJsonJsonSerializer(true);
            this._disposeSerializer = true;
        }

        /**
         * Serializer instance
         * @type aria.utils.json.ISerializer
         */
        this.serializer = serializer;

        var nspace = "";
        if (options && options.namespace) {
            if (!ariaUtilsType.isString(options.namespace)) {
                this.$logError(this.INVALID_NAMESPACE);
            } else {
                // The dollar is just there to separate the keys from the namespace
                nspace = options.namespace + "$";
            }
        }
        /**
         * Namespace. It's the prefix used to store keys. It's a sort of security feature altough it doesn't provide
         * much of it.
         * @type String
         */
        this.namespace = nspace;
    },
    $destructor : function () {
        ariaStorageEventBus.$removeListeners({
            "change" : this._eventCallback
        });

        if (this._disposeSerializer && this.serializer) {
            this.serializer.$dispose();
        }

        this.serializer = null;
        this._eventCallback = null;
    },
    $prototype : {
        /**
         * Return the current value associated with the given key. If the given key does not exist in the list
         * associated with the object then this method return null.
         * @param {String} key identifier of a value
         * @return {Object} The result of a serializer parse
         */
        getItem : function (key) {
            var stored = this._get(this.namespace + key);

            return this.serializer.parse(stored);
        },

        /**
         * Add a key/value pair in the list. If the key already exists, its value is updated without raising errors or
         * warnings. If the value can't be set (for instance because of exceeded quota or wrong value type) an error is
         * thrown.
         * @param {String} key identifier of a value
         * @param {String|Object} value value to be stored. If it's not a string, it's converted into it with an
         * optional serialization
         * @throws
         */
        setItem : function (key, value) {
            var oldValue = this.getItem(key);

            var serializedValue = this.serializer.serialize(value, {
                reversible : true,
                keepMetadata : false
            });

            ariaStorageEventBus.stop = true;
            this._set(this.namespace + key, serializedValue);
            ariaStorageEventBus.stop = false;

            // don't notify directly value because the serialization might modify the object (e.g. metadata)
            value = this.serializer.parse(serializedValue);

            ariaStorageEventBus.notifyChange(this.type, key, value, oldValue, this.namespace);
        },

        /**
         * Remove the value associated to key from the list. Subsequent calls of <code>getItem</code> for that value
         * return null.
         * @param {String} key identifier of the value to be removed
         */
        removeItem : function (key) {
            var oldValue = this.getItem(key);

            if (oldValue !== null) {
                ariaStorageEventBus.stop = true;
                this._remove(this.namespace + key);
                ariaStorageEventBus.stop = false;

                ariaStorageEventBus.notifyChange(this.type, key, null, oldValue, this.namespace);
            }
        },

        /**
         * Empty the list of all key/value pairs, if any. This works across namespaced instances as it cleans the whole
         * storage location.
         */
        clear : function () {
            ariaStorageEventBus.stop = true;
            this._clear();
            ariaStorageEventBus.stop = false;

            ariaStorageEventBus.notifyChange(this.type, null, null, null);
        },

        /**
         * React to storage event coming from the EventBus. This function raises an Aria Templates event making sure
         * that it's not raised when namespacing is applied
         * @param {HTMLEvent} event Event raised by the browser
         */
        _onStorageEvent : function (event) {
            if (event.key === null || event.namespace === this.namespace) {
                var lessDetailedEvent = ariaUtilsJson.copy(event, false, this.EVENT_KEYS);
                this.$raiseEvent(lessDetailedEvent);
            }
        }
    }
});
