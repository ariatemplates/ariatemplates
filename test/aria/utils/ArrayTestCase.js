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
 * Test case for aria.widgets.form.Input
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.ArrayTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Array"],
    $prototype : {

        /**
         * Test case on the aria.utils.Array.indexOf method
         */
        testIndexOf : function () {
            // Shortcut on indexOf
            var arrayIndexOf = aria.utils.Array.indexOf;

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
            var arrayContains = aria.utils.Array.contains;

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
            var arrayIsEmpty = aria.utils.Array.isEmpty;

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
            var arrayIndexOf = aria.utils.Array.indexOf;
            // Shortcut on contains
            var arrayContains = aria.utils.Array.contains;
            // Shortcut on remove
            var arrayRemoveAt = aria.utils.Array.removeAt;
            // Shortcut on isEmpty
            var arrayIsEmpty = aria.utils.Array.isEmpty;

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
            var arrayIndexOf = aria.utils.Array.indexOf;
            // Shortcut on contains
            var arrayContains = aria.utils.Array.contains;
            // Shortcut on remove
            var arrayRemove = aria.utils.Array.remove;
            // Shortcut on isEmpty
            var arrayIsEmpty = aria.utils.Array.isEmpty;

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
            var arrayIndexOf = aria.utils.Array.indexOf;
            // Shortcut on contains
            var arrayContains = aria.utils.Array.contains;
            // Shortcut on remove
            var arrayRemove = aria.utils.Array.remove;
            // Shortcut on clone
            var arrayClone = aria.utils.Array.clone;

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

        testFilter : function () {
            // shortcut
            var filter = aria.utils.Array.filter;

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
            var forEach = aria.utils.Array.forEach;

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
            var every = aria.utils.Array.every;

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
            testArray = [1, 2, 3, 4, 5, 9], result = "";
            this.assertTrue(every(testArray, function (value, index, array) {
                // changing the array should not break
                testArray = [];
                result += value;
                return true;
            }, this));
            this.assertTrue(result === "123459");
        }
    }
});
