/* jshint -W075 : true */
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

Aria.classDefinition({
    $classpath : "test.aria.utils.Object",
    $dependencies : ["aria.utils.Object", "aria.utils.Json"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        /**
         * Test case on the aria.utils.Object.keys method
         */
        test_keys : function () {
            var objects = [null, undefined, {}, "abc", {
                        1 : "1"
                    }, {
                        1 : "1",
                        "1" : 1
                    }, {
                        1 : "1",
                        2 : "2"
                    }, {
                        1 : 2,
                        3 : 4
                    }, {
                        "abc" : 3,
                        "defg" : 4,
                        "hj" : 2
                    }, {
                        "fun" : function () {},
                        "null" : null
                    }, {
                        "nested" : {
                            "child" : "2"
                        }
                    }, ["a", "b", "c"]];

            // keys are always converted into strings
            var results = [[], [], [], [], ["1"], ["1"], ["1", "2"], ["1", "3"], ["abc", "defg", "hj"],
                    ["fun", "null"], ["nested"], []];

            var object = aria.utils.Object;
            var json = aria.utils.Json;

            for (var i = 0, len = objects.length; i < len; i += 1) {
                this.assertTrue(json.equals(object.keys(objects[i]), results[i]), "Array " + i
                        + " differs from expected");
            }

            // Use the prototype
            var Constr = function () {
                this.a = "b";
            };
            Constr.prototype.b = "c";

            var proto = new Constr();

            this.assertTrue(json.equals(object.keys(proto), ["a"]), "Proto object different from expected");
        },

        test_isEmpty : function () {
            var objUtil = aria.utils.Object;
            var obj = {};
            this.assertTrue(objUtil.isEmpty(obj), "Empty object not recognized as such.");
            var str = "justAString";
            this.assertTrue(objUtil.isEmpty(str), "String recognized as a non-empty object.");
            obj = {
                just : "anObject"
            };
            this.assertFalse(objUtil.isEmpty(obj), "Non-empty object recognized as empty");
        }
    }
});
