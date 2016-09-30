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
var ariaUtilsArray = require("./Array");



var objectUtils;

/**
 * Utils for general Objects/Map
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.Object",
    $singleton : true,
    $constructor : function () {
        objectUtils = this;
    },
    $destructor : function () {
        objectUtils = null;
    },
    $prototype : {
        /**
         * Iterates over the own keys of the given object, passing to the callback the following arguments: the current key, the current index (iteration number), the given object.
         *
         * @param {Object} object The object to iterate over
         * @param {Function} callback The function to call at each iteration
         * @param {Any} thisArg The value to use as "this" for the given callback
         *
         * @return {Object} The given object
         */
        forOwnKeys : function (object, callback, thisArg) {
            var index = 0;
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    callback.call(thisArg, key, index, object);
                }
                index++;
            }
            return object;
        },

        /**
         * Returns an array of all own enumerable properties found upon a given object, in the same order as that provided by a for-in loop.
         * @public
         * @param {Object} object
         * @return {Array}
         */
        keys : (Object.keys) ? function (object) {
            if (!ariaUtilsType.isObject(object)) {
                return [];
            }

            return Object.keys(object);
        } : function (object) {
            if (!ariaUtilsType.isObject(object)) {
                return [];
            }
            var enumKeys = [];
            objectUtils.forOwnKeys(object, function(key) {
                enumKeys.push(key);
            });
            return enumKeys;
        },

        /**
         * Returns true if the object has no own enumerable properties
         * @public
         * @param {Object} object
         * @return {Boolean}
         */
        isEmpty : function (object) {
            var keys = objectUtils.keys(object);
            return keys.length === 0;
        },

        /**
         * Iterates over all the given source objects and over all of their own keys to call the given callback with the following arguments: the given object, the current source object, the current key of the current source.
         *
         * @param {Object} object The target object (this is the constant in each iteration)
         * @param {Function} callback The function to call at each iteration
         * @param {Object} ...sources The sources to iterate over
         *
         * @return {Object} The given object
         *
         * @private
         */
        _sourcesToTarget : function (object, callback, sources) {
            ariaUtilsArray.forEach(sources, function (source) {
                objectUtils.forOwnKeys(source, function (key) {
                    callback(object, source, key);
                });
            });

            return object;
        },

        /**
         * Assigns the own properties of each given source to the given destination object.
         *
         * @param {Object} destination The object to assign to
         * @param {Object} ...sources The objects to take the properties from
         *
         * @return {Object} The given destination object
         */
        assign : (Object.assign != null) ? function () {
            return Object.assign.apply(Object, arguments);
        } : function (object) {
            var sources = Array.prototype.slice.call(arguments, 1);

            return objectUtils._sourcesToTarget(object, function (object, source, key) {
                object[key] = source[key];
            }, sources);
        },

        /**
         * Applies default values to the properties of the given object. A property is considered to have no value - and thus eligible to be applied the default value - if accessing it resolves to the value "undefined".
         *
         * @param {Object} object The object to apply default values to
         * @param {Object} ...sources The source objects containing the default values
         *
         * @return {Object} The given object
         */
        defaults : function (object) {
            var sources = Array.prototype.slice.call(arguments, 1);

            return objectUtils._sourcesToTarget(object, function (object, source, key) {
                if (object[key] === undefined) {
                    object[key] = source[key];
                }
            }, sources);
        }
    }
});
