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
    var arrayPrototype = Array.prototype;
    var arrayUtils;

    /**
     * @class aria.utils.Array Utilities for manipulating javascript arrays
     * @extends aria.core.JsObject
     * @singleton
     */
    Aria.classDefinition({
        $classpath : 'aria.utils.Array',
        $singleton : true,
        $constructor : function () {
            arrayUtils = this;
        },
        $destructor : function () {
            arrayPrototype = null;
            arrayUtils = null;
        },
        $prototype : {

            /**
             * Returns the first (least) index of an element within the array equal to the specified value, or -1 if
             * none is found.
             * @param {Array} array Array to be searched.
             * @param {Object} element Element for which we are searching.
             * @return {Number} Index of the first matching array element.
             */
            indexOf : (!arrayPrototype.indexOf) ? (function (array, element) {
                var length = array.length;
                for (var i = 0; i < length; i++) {
                    if (i in array && array[i] === element) {
                        return i;
                    }
                }

                return -1;
            }) : function (array, element) {
                return array.indexOf(element);
            },

            /**
             * Test if the array contains the given object.
             * @param {Array} array Array to test for the presence of the element
             * @param {Object} element Element for which to test
             * @return {Boolean} true if element is present.
             */
            contains : function (array, element) {
                return arrayUtils.indexOf(array, element) != -1;
            },

            /**
             * Returns a copy of the given array. The cloned array can be modified without impacting the original array.
             * @param {Array} array The array to clone
             * @return {Array} The cloned array
             */
            clone : function (array) {
                var clonedArray = array.slice(0);
                return clonedArray;
            },

            /**
             * Removes the first occurrence of a particular value from an array.
             * @param {Array} array : Array from which to remove element
             * @param {Object} element : Element to remove
             * @return {Boolean} True if an element was removed.
             */
            remove : function (array, element) {
                var index = arrayUtils.indexOf(array, element);
                if (index > -1) {
                    arrayUtils.removeAt(array, index);
                    return true;
                }
                return false;
            },

            /**
             * Removes from an array the element at index i
             * @param {Array} array Array from which to remove element.
             * @param {Number} i The index to remove.
             * @return {Boolean} True if an element was removed.
             */
            removeAt : function (array, index) {
                return array.splice(index, 1).length == 1;
            },

            /**
             * Wether the array is empty of not
             * @param {Array} array Array from which to test
             * @return {Boolean} True if the array is empty
             */
            isEmpty : function (array) {
                return array.length === 0;
            },

            /**
             * Filter elements of an array according to the result of callback
             * @param {Array} array Array to filter.
             * @param {Function} Function to test each element of the array. This function receive as arguments the
             * value, the index and the array.
             * @param {Object} thisObject Object to use as this when executing callback.
             * @return {Array} array
             */
            filter : (!arrayPrototype.filter) ? function (array, callback, thisObject) {

                // clone array to avoid mutation when executing the callback
                var workArray = arrayUtils.clone(array);

                var res = [];
                thisObject = thisObject || array;
                var len = workArray.length;
                for (var i = 0; i < len; i++) {
                    var val = workArray[i];
                    if (callback.call(thisObject, val, i, array)) {
                        res.push(val);
                    }
                }
                return res;
            } : function (array, callback, thisObject) {
                return array.filter(callback, thisObject);
            },

            /**
             * Call a function on each element of the array
             * @param {Array} array Array to filter.
             * @param {Function} Function to test each element of the array. This function receive as arguments the
             * value, the index and the array.
             * @param {Object} thisObject Object to use as this when executing callback.
             */
            forEach : (!arrayPrototype.forEach) ? function (array, callback, thisObject) {

                // clone array to avoid mutation when executing the callback
                var workArray = arrayUtils.clone(array);

                var res = [];
                thisObject = thisObject || array;
                var len = workArray.length;
                for (var i = 0; i < len; i++) {
                    callback.call(thisObject, workArray[i], i, array);
                }
                return res;
            } : function (array, callback, thisObject) {
                return array.forEach(callback, thisObject);
            },

            /**
             * Return an array with the values contained in the given map.
             * @param {Object} map
             * @return {Array}
             */
            extractValuesFromMap : function (map) {
                var output = [];
                for (var k in map) {
                    if (map.hasOwnProperty(k)) {
                        output.push(map[k]);
                    }
                }
                return output;
            }
        }
    });

})();
