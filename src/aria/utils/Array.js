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

var ariaUtilsAlgo = require("./Algo");
var ariaUtilsType = require("./Type");



var arrayPrototype = Array.prototype;
var arrayUtils;

/**
 * @class aria.utils.Array Utilities for manipulating javascript arrays
 * @extends aria.core.JsObject
 * @singleton
 */
module.exports = Aria.classDefinition({
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
         * Ensures to return an array from the given value: if it is already an array it is returned as is, otherwise if it is void it returns an empty array, and eventually in any other case it returns the value wrapped in an array.
         *
         * @param value Any value. See full description for more details.
         *
         * @return {Array} An array. See full description for more details.
         */
        ensureWrap : function (value) {
            if (!ariaUtilsType.isArray(value)) {
                if (value == null) {
                    value = [];
                } else {
                    value = [value];
                }
            }

            return value;
        },

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
            var clonedArray = Array.prototype.slice.call(array);
            return clonedArray;
        },

         /**
         * Repeats an item a certain number of times to build an array. This results of an array whose size corresponds to the number of times the item was repeated.
         *
         * @param {Number} times The number of times to repeat the item.
         *
         * @return {Array} The array with the same item repeated the given number of times.
         */
        repeatValue : function (item, times) {
            var result = [];

            for (var index = 0; index < times; index++) {
                result.push(item);
            }

            return result;
        },

        /**
         * Repeats the items of an array item a certain number of times to build a new array. This results of an array whose size corresponds to the size of the repeated array, times the given number.
         *
         * @param {Number} times The number of times to repeat the items of the array.
         *
         * @return {Array} The array with the items of the given array repeated the given number of times.
         */
        repeatArray : function (array, times) {
            array = arrayUtils.repeatValue(array, times);
            array = arrayUtils.flatten(array);
            return array;
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
         * @param {Object} thisArg Object to use as this when executing callback.
         * @return {Array} array
         */
        filter : (!arrayPrototype.filter) ? function (array, callback, thisArg) {

            // clone array to avoid mutation when executing the callback
            var workArray = arrayUtils.clone(array);

            var res = [];
            thisArg = thisArg || array;
            var len = workArray.length;
            for (var i = 0; i < len; i++) {
                var val = workArray[i];
                if (callback.call(thisArg, val, i, array)) {
                    res.push(val);
                }
            }
            return res;
        } : function (array, callback, thisArg) {
            return array.filter(callback, thisArg);
        },

        /**
         * Call a function on each element of the array
         * @param {Array} array Array to filter.
         * @param {Function} Function to test each element of the array. This function receive as arguments the
         * value, the index and the array.
         * @param {Object} thisArg Object to use as this when executing callback.
         */
        forEach : (!arrayPrototype.forEach) ? function (array, callback, thisArg) {

            // clone array to avoid mutation when executing the callback
            var workArray = arrayUtils.clone(array);

            var res = [];
            thisArg = thisArg || array;
            var len = workArray.length;
            for (var i = 0; i < len; i++) {
                callback.call(thisArg, workArray[i], i, array);
            }
            return res;
        } : function (array, callback, thisArg) {
            return array.forEach(callback, thisArg);
        },

        /**
         * Iterates over the elements of an array and applies the given callback on each of them, collecting the result of each iteration and returning the array of results.
         *
         * <p>
         * The callback called at each iteration receives the following parameters: "item", "index", "array". It also has "thisArg" as the value of "this".
         * </p>
         *
         * @param {Array} array The array to map
         * @param {Function} callback The function to call at each iteration (see more information in description)
         * @param {Any} thisArg The value of "this" for the callback
         *
         * @return {Array} The array of results of the callback for each iteration
         */
        map : (arrayPrototype.map == null) ? function (array, callback, thisArg) {
            var result = [];
            arrayUtils.forEach(array, function(item, index, array) {
                result.push(callback.call(this, item, index, array));
            }, thisArg);

            return result;
        } : function (array, callback, thisArg) {
            return array.map(callback, thisArg);
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
        },

        /**
         * This tests whether all elements in the array pass the predicate given by the callback function.
         * As long as the predicate (callback) returns truthy values, the loop will continue. However, as soon as a falsy
         * value is returned, the function will return without analyzing the rest of the elements.
         * @param {Array} array Array to process.
         * @param {Function} callback Function to test each element of the array. This function receives as arguments value, the index and the array.
         * @param {Object} thisArg Object to use as this when executing callback. The default value, when thisArg is falsy, will be the given array.
         * @return {Boolean} true if every element in the given array returns truthy values for the predicate (callback), false if at least one element returns a falsy value for the predicate (callback)
         */
        every : (!arrayPrototype.every) ? function(array, callback, thisArg) {
            // clone array to prevent being impacted by possible mutations of the array in the callback
            var workArray = arrayUtils.clone(array);

            thisArg = thisArg || array;
            var arrayLength = workArray.length;
            for (var arrayIndex = 0; arrayIndex < arrayLength; arrayIndex++) {
                if ( !callback.call(thisArg, workArray[arrayIndex], arrayIndex, array) ) {
                    return false;
                }
            }
            return true;
        } : function(array, callback, thisArg) {
            return array.every(callback, thisArg);
        },

        /**
         * Flattens the given array on one level.
         *
         * @param {Array} array The array to flatten
         *
         * @return {Array} The flattened array
         */
        flatten : function (array) {
            var result = [];
            return result.concat.apply(result, array);
        },

        /**
         * Deeply flattens the given array, removing any presence of array.
         *
         * @param {Array} value The array to flatten
         *
         * @return {Array} The flattened array
         */
        flattenDeep : function (value) {
            if (!ariaUtilsType.isArray(value)) {
                return [value];
            }

            var output = [];
            arrayUtils.forEach(value, function (item) {
                arrayUtils.pushAll(output, arrayUtils.flattenDeep(item));
            });

            return output;
        },

        /**
         * Reduces the given array to a single value, by applying the given binary function.
         *
         * The binary function takes the accumulated result as first parameter, and the current array item as second parameter. It must return the new accumulated result. It additionally takes the current item index and the array.
         *
         * @param {Array} array The array to reduce to one element: an accumulated result
         * @param {Function} callback The reducer function
         * @param {Any} initialResult The initial accumulated value - first item if none provided
         *
         * @return {Any} The accumulated result (can be the initialResult if array is empty)
         */
        reduce : (arrayPrototype.reduce == null) ? function (array, callback, initialResult) {
            // -------------------------------------- input arguments processing

            var hasInitialResult = !!(arguments.length >= 3);

            // ----------------------------------------------- early termination

            var TypeError = Aria.$window.TypeError;

            if (this === null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            if (array.length === 0) {
                if (!hasInitialResult) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

            }

            // -------------------------------------- input arguments processing

            var valuesToReduce;
            if (hasInitialResult) {
                valuesToReduce = array;
            } else {
                valuesToReduce = arrayUtils.clone(array);
                initialResult = valuesToReduce.shift();
            }

            // ------------------------------------------------------ processing

            var currentResult = initialResult;
            arrayUtils.forEach(valuesToReduce, function (item, index) {
                currentResult = callback(currentResult, item, index, array);
            });

            // ---------------------------------------------------------- return

            return currentResult;
        } : function (array) {
            return array.reduce.apply(array, Array.prototype.slice.call(arguments, 1));
        },

        /**
         * Pushes all given elements to the end of the array (inplace mutation).
         *
         * @param {Array} array The array to push elements to
         * @param {Array} elements The elements to push to the array
         *
         * @return {Array} The given array
         */
        pushAll : function (array, elements) {
            array.push.apply(array, elements);
            return array;
        },

        /**
         * Inserts the given item at the given index into the given array.
         *
         * <p>
         * If the given index is negative, it will index in reverse order from the end of the array, with -1 being after the current last element. If it designates an index beyond the last element of the array, undefined values will be pushed to fill in the gap, and then the given value will be pushed.
         * </p>
         *
         * @param {Array} The array to modify
         * @param item The item to insert.
         * @param {Number} index The index at which to insert the item.
         *
         * @return {Array} The modified array
         */
        insert : function (array, item, index) {
            if (index == null) {
                index = array.length;
            }

            if (index < 0) {
                index = array.length + 1 + index;
            }

            if (index < array.length) {
                Array.prototype.splice.call(array, index, 0, item);
            } else {
                ariaUtilsAlgo.times(index - array.length, function() {
                    Array.prototype.push.call(array, undefined);
                });
                Array.prototype.push.call(array, item);
            }

            return array;
        }
    }
});
