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
 * Test case for aria.utils.Path
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.Path",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Path"],
    $prototype : {

        /**
         * Test the parse method
         */
        test_parse : function () {

            var path = "data.test.elem[0][\"par'a:m\\\"1\"].param2['0'].$properties";
            var parsedPath = aria.utils.Path.parse(path);

            this.assertTrue(parsedPath[0] == "data");
            this.assertTrue(parsedPath[1] == "test");
            this.assertTrue(parsedPath[2] == "elem");
            this.assertTrue(parsedPath[3] == "0");
            this.assertTrue(parsedPath[4] == "par'a:m\"1");
            this.assertTrue(parsedPath[5] == "param2");
            this.assertTrue(parsedPath[6] == "0");
            this.assertTrue(parsedPath[7] == "$properties");
        },

        /**
         * Test the resolve method
         */
        test_resolve : function () {

            // method has two signature, with string and array
            var pathStr = "param1[0]['param3']";
            var pathArray = ["param1", 0, "param4"];

            // test that properties starting with the dollar sign are correctly resolved
            var pathWithDollar = "param1[0].$var";

            // test that properties inside window object are correctly resolved (resolve method used without 2nd parameter)
            var pathInsideWindow = "Aria.version";

            var obj = {
                param1 : [{
                            param3 : 13,
                            param4 : false,
                            $var : "testString"
                        }]
            };
            this.assertTrue(aria.utils.Path.resolve(pathStr, obj) == 13);
            this.assertTrue(aria.utils.Path.resolve(pathArray, obj) === false);
            this.assertTrue(aria.utils.Path.resolve(pathWithDollar, obj) === "testString");
            this.assertEquals(aria.utils.Path.resolve(pathInsideWindow), Aria.version, "resolve method without second parameter does not extract the correct information: %1 != %2");
        },

        /**
         * test test pathArrayToString method
         */
        test_pathArrayToString : function () {
            var path = "data.test.elem[0][\"par'a:m\\\"1\"].param2['0']";
            var parsedPath = aria.utils.Path.parse(path);
            this.assertTrue(aria.utils.Path.pathArrayToString(parsedPath) == 'data["test"]["elem"]["0"]["par\'a:m\\\"1"]["param2"]["0"]');
        },

        testSetValue : function () {
            var obj = {};

            aria.utils.Path.setValue(obj, "first", 10);
            aria.utils.Path.setValue(obj, "second", {
                "nested" : {
                    "reality" : true,
                    "imagination" : false
                }
            });
            aria.utils.Path.setValue(obj, "second['nested'].reality", "better than imagination");
            aria.utils.Path.setValue(obj, "third.deep.inside", null);
            aria.utils.Path.setValue(obj, "fourth[0].something", "number");
            aria.utils.Path.setValue(obj, "will.be.cancelled", true);
            aria.utils.Path.setValue(obj, "will.be.cancelled.by.me", true);
            aria.utils.Path.setValue(obj, "number['0']['1']", 2);
            aria.utils.Path.setValue(obj, "number1.second2", 3);
            aria.utils.Path.setValue(obj, "array", "not really an array");
            aria.utils.Path.setValue(obj, "array[1]", "array");
            aria.utils.Path.setValue(obj, "array[0][1][2]", "now it is");

            var expected = {
                first : 10,
                second : {
                    nested : {
                        reality : "better than imagination",
                        imagination : false
                    }
                },
                third : {
                    deep : {
                        inside : null
                    }
                },
                fourth : [{
                            something : "number"
                        }],
                will : {
                    be : {
                        cancelled : {
                            by : {
                                me : true
                            }
                        }
                    }
                },
                number : {
                    0 : {
                        1 : 2
                    }
                },
                number1 : {
                    second2 : 3
                },
                array : [[], "array"]
            };
            expected.array[0][1] = [];
            expected.array[0][1][2] = "now it is";

            this.assertTrue(aria.utils.Json.equals(obj, expected), "Build object different from expected");
        },

        testDescribe : function () {
            var obj = {}, got, expected;

            got = aria.utils.Path.describe(obj, "a");
            this.assertEquals(got, null, "single path in empty object should be null");

            got = aria.utils.Path.describe(obj, "a.b.c");
            this.assertEquals(got, null, "multiple path in empty object should be null");

            obj = {
                a : "empty",
                b : ["a", "b", "c", {
                            f : "something"
                        }],
                c : {
                    a : "object",
                    b : false,
                    c : {
                        one : 1
                    }
                }
            };

            got = aria.utils.Path.describe(obj, "a");
            expected = {
                container : obj,
                property : "a",
                value : "empty"
            };
            this.assertTrue(aria.utils.Json.equals(got, expected), "describe 'a' is wrong");

            got = aria.utils.Path.describe(obj, "a.b");
            this.assertEquals(got, null, "a.b in object should be null");

            got = aria.utils.Path.describe(obj, "b[1]");
            expected = {
                container : obj.b,
                property : 1,
                value : "b"
            };
            this.assertTrue(aria.utils.Json.equals(got, expected), "describe 'b[1]' is wrong");

            got = aria.utils.Path.describe(obj, "b[3].f");
            expected = {
                container : obj.b[3],
                property : "f",
                value : "something"
            };
            this.assertTrue(aria.utils.Json.equals(got, expected), "describe 'b[3].f' is wrong");

            got = aria.utils.Path.describe(obj, "c['c'].one");
            expected = {
                container : obj.c.c,
                property : "one",
                value : 1
            };
            this.assertTrue(aria.utils.Json.equals(got, expected), "describe 'c['c'].one' is wrong");
        }
    }
});
