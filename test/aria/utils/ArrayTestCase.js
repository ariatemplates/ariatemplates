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

var Aria = require('ariatemplates/Aria');
var TestCase = require('ariatemplates/jsunit/TestCase');
var ariaUtilsArray = require('ariatemplates/utils/Array');



/**
 * Test case for aria.utils.Array
 */
module.exports = Aria.classDefinition({
    $classpath : "test.aria.utils.ArrayTestCase",
    $extends : TestCase,
    $prototype : {
        testEnsureWrap : function () {
            // common ----------------------------------------------------------

            var ensureWrap = ariaUtilsArray.ensureWrap;

            var self = this;

            var test = function(input, expectedResult) {
                var result = ensureWrap(input);

                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test(null, []);
            test(undefined, []);

            test(1, [1]);
            test('1', ['1']);

            test([], []);
            test(['1'], ['1']);
        },

        /**
         * Test case on the aria.utils.Array.indexOf method
         */
        testIndexOf : function () {
            // Shortcut on indexOf
            var arrayIndexOf = ariaUtilsArray.indexOf;

            var obj = {
                a : "a"
            };
            var testArray = [0, "string", obj];

            this.assertEquals(arrayIndexOf(testArray, "notInTheArray"), -1);
            this.assertEquals(arrayIndexOf(testArray, 0), 0);
            this.assertEquals(arrayIndexOf(testArray, "string"), 1);
            this.assertEquals(arrayIndexOf(testArray, obj), 2);
        },

        /**
         * Test case on the aria.utils.Array.contains method
         */
        testContains : function () {
            // Shortcut on contains
            var arrayContains = ariaUtilsArray.contains;

            var obj = {
                a : "a"
            };
            var testArray = [0, "string", obj];

            this.assertFalse(arrayContains(testArray, "notInTheArray"));
            this.assertTrue(arrayContains(testArray, 0));
            this.assertTrue(arrayContains(testArray, "string"));
            this.assertTrue(arrayContains(testArray, obj));
        },

        testIsEmpty : function () {
            // Shortcut on isEmpty
            var arrayIsEmpty = ariaUtilsArray.isEmpty;

            var emptyArray = [];
            var filledArray = [0];
            var notAnArray = {};

            this.assertTrue(arrayIsEmpty(emptyArray), "aria.utils.Array.isEmpty should return true on an empty array");
            this.assertFalse(arrayIsEmpty(filledArray), "aria.utils.Array.isEmpty should return false on a filled array");
            this.assertFalse(arrayIsEmpty(notAnArray), "aria.utils.Array.isEmpty should return false on non-array objects, even if they are 'empty'");
        },

        /**
         * Test case on the aria.utils.Array.remove method
         */
        testRemoveAt : function () {
            // Shortcut on indexOf
            var arrayIndexOf = ariaUtilsArray.indexOf;
            // Shortcut on contains
            var arrayContains = ariaUtilsArray.contains;
            // Shortcut on remove
            var arrayRemoveAt = ariaUtilsArray.removeAt;
            // Shortcut on isEmpty
            var arrayIsEmpty = ariaUtilsArray.isEmpty;

            var obj = {
                a : "a"
            };
            var testArray = [0, "string", obj];

            // Attempt to remove undefined element
            arrayRemoveAt(testArray, 3);
            // Check the array wasn't modified by this
            this.assertTrue(arrayContains(testArray, 0));
            this.assertTrue(arrayContains(testArray, "string"));
            this.assertTrue(arrayContains(testArray, obj));
            // Also check the length of the Array
            this.assertEquals(testArray.length, 3);

            // Remove First element
            arrayRemoveAt(testArray, 1);
            // Check Middle element is not anymore in the array
            this.assertFalse(arrayContains(testArray, "string"));

            // Check the two remaining elements are in the array
            // and that their position is ok
            this.assertEquals(arrayIndexOf(testArray, 0), 0);
            this.assertEquals(arrayIndexOf(testArray, obj), 1);

            // Remove Second element
            arrayRemoveAt(testArray, 1);
            // Check Second element is not anymore in the array
            this.assertFalse(arrayContains(testArray, obj));

            // Check the remaining element is in the array
            this.assertEquals(arrayIndexOf(testArray, 0), 0);

            // Remove Last element
            arrayRemoveAt(testArray, 0);
            // Check last element is not anymore in the array
            this.assertFalse(arrayContains(testArray, 0));
            // Check the array is now empty
            this.assertTrue(arrayIsEmpty(testArray));
        },

        /**
         * Test case on the aria.utils.Array.remove method
         */
        testRemove : function () {
            // Shortcut on indexOf
            var arrayIndexOf = ariaUtilsArray.indexOf;
            // Shortcut on contains
            var arrayContains = ariaUtilsArray.contains;
            // Shortcut on remove
            var arrayRemove = ariaUtilsArray.remove;
            // Shortcut on isEmpty
            var arrayIsEmpty = ariaUtilsArray.isEmpty;

            var obj = {
                a : "a"
            };
            var testArray = [0, "string", obj];

            // Remove First element
            arrayRemove(testArray, 0);
            // Check First element is not anymore in the array
            this.assertFalse(arrayContains(testArray, 0));

            // Check the two remaining elements are in the array
            // and that their position is ok
            this.assertEquals(arrayIndexOf(testArray, "string"), 0);
            this.assertEquals(arrayIndexOf(testArray, obj), 1);

            // Remove Second element
            arrayRemove(testArray, "string");
            // Check Second element is not anymore in the array
            this.assertFalse(arrayContains(testArray, "string"));

            // Check the remaining element is in the array
            this.assertEquals(arrayIndexOf(testArray, obj), 0);

            // Remove Last element
            arrayRemove(testArray, obj);
            // Check last element is not anymore in the array
            this.assertFalse(arrayContains(testArray, obj));
            // Check the array is now empty
            this.assertTrue(arrayIsEmpty(testArray));
        },

        /**
         * Test case on the aria.utils.Array.clone method
         */
        testClone : function () {
            // Shortcut on indexOf
            var arrayIndexOf = ariaUtilsArray.indexOf;
            // Shortcut on contains
            var arrayContains = ariaUtilsArray.contains;
            // Shortcut on remove
            var arrayRemove = ariaUtilsArray.remove;
            // Shortcut on clone
            var arrayClone = ariaUtilsArray.clone;

            var obj = {
                a : "a"
            };
            var testArray = [0, "string", obj];
            var clonedArray = /** @type Array */
            arrayClone(testArray);

            this.assertTrue(testArray.length == clonedArray.length, "Original array and cloned array have different sizes");

            var anotherObj = {
                a : "a"
            };
            clonedArray[2] = anotherObj;
            this.assertFalse(arrayContains(testArray, anotherObj), "Original array has been changed by a modification on clonedArray");
            // Remove an item from the original array
            arrayRemove(testArray, 0);
            // Check it wasn't remove from the cloned array
            this.assertTrue(arrayContains(clonedArray, 0), "clonedArray has been changed by a modification on the original array");
        },

        testRepeatValue : function () {
            // common ----------------------------------------------------------

            var repeatValue = ariaUtilsArray.repeatValue;

            var self = this;

            var test = function(input, times, expectedResult) {
                var result = repeatValue(input, times);

                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test(1, -1, []);
            test(1, 0, []);
            test(1, 1, [1]);
            test(1, 3, [1, 1, 1]);
            test([1, 2], 2, [[1, 2], [1, 2]]);
        },

        testRepeatArray : function () {
            // common ----------------------------------------------------------

            var repeatArray = ariaUtilsArray.repeatArray;

            var self = this;

            var test = function(input, times, expectedResult) {
                var result = repeatArray(input, times);

                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test(1, -1, []);
            test(1, 0, []);
            test(1, 1, [1]);

            test([1], 1, [1]);
            test([1], 3, [1, 1, 1]);

            test([1, 2], 2, [1, 2, 1, 2]);
            test([[1, 2]], 2, [[1, 2], [1, 2]]);
        },

        testFilter : function () {
            // shortcut
            var filter = ariaUtilsArray.filter;

            // doing nothing returns empty array
            this.assertTrue(filter([], function () {}) !== null);

            // test
            var testArray = [1, 2, 3, 4, 5, 9];
            var filteredArray = filter(testArray, function (value, index, array) {
                // changing the array should not break
                testArray = [];
                return value < 4;
            }, this);
            this.assertTrue(filteredArray.toString() === "1,2,3");
        },

        testForEach : function () {
            // shortcut
            var forEach = ariaUtilsArray.forEach;

            // doing stuff on empty array should do nothing
            var count = 0;
            forEach([], function () {
                count++;
            });
            this.assertTrue(count === 0);

            // forEach simple test
            var testArray = [1, 2, 3, 4, 5, 9], result = "";
            forEach(testArray, function (value, index, array) {
                // changing the array should not break
                testArray = [];
                result += value;
            }, this);
            this.assertTrue(result === "123459");
        },

        testEvery : function () {
            // shortcut
            var every = ariaUtilsArray.every;

            // doing stuff on empty array should do nothing
            var count = 0;
            every([], function () {
                count++;
            });
            this.assertTrue(count === 0);

            // simple test false
            var testArray = [1, 2, 3, 4, 5, 9], result = "";
            this.assertFalse(every(testArray, function (value, index, array) {
                // changing the array should not break
                testArray = [];
                result += value;
                return value !== 4;
            }, this));
            this.assertTrue(result === "1234");

            // simple test true
            testArray = [1, 2, 3, 4, 5, 9];
            result = "";
            this.assertTrue(every(testArray, function (value, index, array) {
                // changing the array should not break
                testArray = [];
                result += value;
                return true;
            }, this));
            this.assertTrue(result === "123459");
        },

        testMap : function () {
            // common ----------------------------------------------------------

            var map = ariaUtilsArray.map;

            var self = this;

            var callback = function (item) {
                return item * 2;
            };
            var test = function(input, expectedResult) {
                var result = map(input, callback);

                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test([], []);
            test([1], [2]);
            test([1, 2, 3, 4], [2, 4, 6, 8]);
        },

        testFlatten : function () {
            // common ----------------------------------------------------------

            var flatten = ariaUtilsArray.flatten;

            var self = this;

            var test = function(input, expectedResult) {
                var result = flatten(input);

                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test([], []);
            test([1], [1]);
            test([1, 2], [1, 2]);

            test([1, [2], 3], [1, 2, 3]);
            test([1, [[2]], 3], [1, [2], 3]);
        },

        testFlattenDeep : function () {
            // common ----------------------------------------------------------

            var flattenDeep = ariaUtilsArray.flattenDeep;

            var self = this;

            var test = function(input, expectedResult) {
                var result = flattenDeep(input);

                self.assertJsonEquals(result, expectedResult);
            };

            // tests -----------------------------------------------------------

            test(1, [1]);

            test([], []);
            test([1], [1]);
            test([1, 2], [1, 2]);

            test([1, [2], 3], [1, 2, 3]);
            test([1, [[2]], 3], [1, 2, 3]);
        },

        testReduce : function () {
            // common ----------------------------------------------------------

            var reduce = ariaUtilsArray.reduce;

            var self = this;

            var callback = function (a, b) {
                return a + b;
            };
            var test = function(array) {
                var originalArray = ariaUtilsArray.clone(array);

                var expectedResult;
                var args = [array, callback];
                if (arguments.length === 2) {
                    expectedResult = arguments[1];
                } else if (arguments.length === 3) {
                    args.push(arguments[1]);
                    expectedResult = arguments[2];
                }
                var result = reduce.apply(null, args);

                self.assertJsonEquals(result, expectedResult);
                self.assertJsonEquals(array, originalArray);
            };

            // tests -----------------------------------------------------------

            // No value at all
            try {
                test([]);
                this.assertTrue(false, 'Calling reduce with no value should fail with a TypeError');
            } catch (exception) {
                this.assertTrue(exception instanceof TypeError, 'Calling reduce with no value has failed but with the wrong exception type: expected a TypeError.');
            }

            // Initial value only
            test([], undefined, undefined);
            test([], null, null);
            test([], 1, 1);

            // No initial value and only 1 item
            test([1], 1);

            // Other cases
            test([1], 2, 3);
            test([1, 2], 3);
            test([1, 2], 3, 6);
        },

        testPushAll : function () {
            // common ----------------------------------------------------------

            var pushAll = ariaUtilsArray.pushAll;

            var self = this;

            var test = function(array, addition, expectedResult) {
                var result = pushAll(array, addition);

                self.assertTrue(result === array, 'The original array instance should be returned');

                self.assertJsonEquals(array, expectedResult);
            };

            // tests -----------------------------------------------------------

            test([], [], []);

            test([], [1], [1]);
            test([1], [], [1]);

            test([], [1, 2], [1, 2]);
            test([1, 2], [], [1, 2]);

            test([1], [2, 3], [1, 2, 3]);
            test([1, 2], [3], [1, 2, 3]);
        },

        testInsert : function () {
            // common ----------------------------------------------------------

            var insert = ariaUtilsArray.insert;

            var self = this;

            var test = function(array, item, index, expectedResult) {
                var result = insert(array, item, index);

                self.assertTrue(result === array, 'The original array instance should be returned');

                self.assertJsonEquals(array, expectedResult);
            };

            // tests -----------------------------------------------------------

            test([1, 2], 0, 0, [0, 1, 2]);
            test([0, 2], 1, 1, [0, 1, 2]);
            test([0, 1], 2, 2, [0, 1, 2]);

            test([0, 1], 2, -1, [0, 1, 2]);

            test([0, 1], 3, 3, [0, 1, undefined, 3]);
        }
    }
});
