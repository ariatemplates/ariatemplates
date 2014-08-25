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
 * Interface definition for public storage classes. It define the publicly accessible methods and the event raised by
 * such classes.
 */
module.exports = Aria.interfaceDefinition({
    $classpath : "aria.storage.IStorage",
    $events : {
        "change" : {
            description : "Raised when the storage area changes because an item is set or removed, or the storage is cleared.",
            properties : {
                "key" : "Name of the key that changed",
                "oldValue" : "Old value of the key in question, null if the key is newly added",
                "newValue" : "New value being set",
                "url" : "Address of the document whose storage object was affected"
            }
        }
    },
    $interface : {
        /**
         * Return the current value associated with the given key. If the given key does not exist in the list
         * associated with the object then this method return null.
         * @param {String} key identifier of a value
         * @return {Object} The value stored
         */
        "getItem" : function (key) {},

        /**
         * Add a key/value pair in the list. If the key already exists, its value is updated without raising errors or
         * warnings. If the value can't be set (for instance because of exceeded quota or wrong value type) an error is
         * thrown.
         * @param {String} key identifier of a value
         * @param {String|Object} value value to be stored. If it's not a string, it's converted into it with an
         * optional serialization
         */
        "setItem" : function (key, value) {},

        /**
         * Remove the value associated to key from the list. Subsequent calls of <code>getItem</code> for that value
         * return null.
         * @param {String} key identifier of the value to be removed
         */
        "removeItem" : function (key) {},

        /**
         * Empty the list of all key/value pairs, if any.
         */
        "clear" : function () {}
    }
});
