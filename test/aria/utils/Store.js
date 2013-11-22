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
 * Test case for aria.utils.Store
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Store",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Store", "aria.utils.Array"],
    $prototype : {
        testSingleMatch : function () {
            var store = Aria.getClassInstance("aria.utils.Store");

            store._store = ["a", "b", "c", "d", "e", "f"];
            store._storeLength = store._store.length;

            var matchedAgainst = [];
            var matchFunction = function (elt) {
                matchedAgainst.push(elt);
                if (elt === "b") {
                    return true;
                }
                return false;
            };

            var removed = store.removeMatch(matchFunction, false);
            store.$dispose();

            // It won't be matched against all the elements
            // One should be removed
            this.assertEquals(removed, "b");
        },

        testMultipleMatch : function () {
            var arrayUtil = aria.utils.Array;
            var store = Aria.getClassInstance('aria.utils.Store');

            store._store = ["a", "b", "c", "d", "e", "f"];
            store._storeLength = store._store.length;

            var matchedAgainst = [];
            var matchFunction = function (elt) {
                matchedAgainst.push(elt);
                if (elt === "b" || elt === "c") {
                    return true;
                }
                return false;
            };

            var removed = store.removeMatch(matchFunction, true);
            store.$dispose();

            // It should be matched against all the items
            this.assertEquals(matchedAgainst.length, 6);

            // Two should be removed
            this.assertEquals(removed.length, 2);
            this.assertTrue(arrayUtil.indexOf(removed, "b") > -1);
            this.assertTrue(arrayUtil.indexOf(removed, "c") > -1);
        }
    }
});
