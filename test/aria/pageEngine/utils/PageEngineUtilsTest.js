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
 * aria.pageEngine.utils.PageEngineUtils test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.utils.PageEngineUtilsTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.utils.PageEngineUtils", "aria.utils.Array"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this._utils = aria.pageEngine.utils.PageEngineUtils;
        this._array = aria.utils.Array;
    },
    $prototype : {

        testAddIfMissing : function () {
            var utils = this._utils;
            var testArray = ["a", "b", 8];
            utils.addIfMissing(null, testArray);
            this.assertJsonEquals(testArray, ["a", "b", 8]);
            utils.addIfMissing("c", testArray);
            this.assertJsonEquals(testArray, ["a", "b", 8, "c"]);
            utils.addIfMissing("c", testArray);
            this.assertJsonEquals(testArray, ["a", "b", 8, "c"]);
            utils.addIfMissing("a", testArray);
            this.assertJsonEquals(testArray, ["a", "b", 8, "c"]);
            utils.addIfMissing(8, testArray);
            this.assertJsonEquals(testArray, ["a", "b", 8, "c"]);
        },

        testWiseConcat : function () {
            var utils = this._utils;
            var testArray = ["a", "b", 8];
            utils.wiseConcat(testArray, ["c", "d"]);
            this.assertJsonEquals(testArray, ["a", "b", 8, "c", "d"]);
            utils.wiseConcat(testArray, ["c", "d"]);
            this.assertJsonEquals(testArray, ["a", "b", 8, "c", "d"]);
            utils.wiseConcat(testArray, ["c", "d", "e", 8]);
            this.assertJsonEquals(testArray, ["a", "b", 8, "c", "d", "e"]);
        },

        testExtractPropertyFromArrayElements : function () {
            var testFunction = this._utils.extractPropertyFromArrayElements;

            var testArray = testFunction([{
                        "a" : "b"
                    }, {
                        "a" : "c"
                    }], "a");
            this.assertTrue(this._array.contains(testArray, "b"));
            this.assertTrue(this._array.contains(testArray, "c"));
            this.assertTrue(testArray.length == 2);

            testArray = testFunction([{
                        "a" : "b",
                        "c" : "d"
                    }, {
                        "a" : null
                    }], "a");
            this.assertTrue(this._array.contains(testArray, "b"));
            this.assertFalse(this._array.contains(testArray, "c"));
            this.assertTrue(testArray.length == 1);
        },

        testAddKeyAsProperty : function () {
            var testFunction = this._utils.addKeyAsProperty;
            var testObject = {
                "a" : {
                    my : "fake"
                },
                "c" : {
                    strange : "object"
                }
            };
            testFunction(testObject, "bbb");
            this.assertTrue(testObject.a.bbb == "a");
            this.assertTrue(testObject.c.bbb == "c");
        },

        testResolvePath : function () {
            var testFunction = this._utils.resolvePath;
            var testObject = {
                a : {
                    b : "c",
                    d : "e",
                    f : {
                        g : "h",
                        i : {
                            l : "m"
                        },
                        n : null
                    }
                }
            };
            this.assertTrue(testFunction("a.b", testObject) == "c");
            this.assertTrue(testFunction("a.f.i.l", testObject) == "m");
            this.assertTrue(testFunction(["a", "f", "i", "l"], testObject) == "m");
            this.assertTrue(testFunction(["a", "f", "n"], testObject) === null);
            this.assertTrue(testFunction(["a", "f", "n", "i"], testObject) == null);
            this.assertTrue(testFunction(["g", "f", "n", "i"], testObject) == null);
            this.assertTrue(testFunction("aria.pageEngine.utils.PageEngineUtils", Aria.$frameworkWindow) == aria.pageEngine.utils.PageEngineUtils);
        },

        testLogMultipleErrors : function () {
            var testFunction = this._utils.logMultipleErrors;
            testFunction("errorMsg", [], this);
            this.assertErrorInLogs("errorMsg:");
            testFunction("errorMsg", [{
                        msgId : "a",
                        msgArgs : {}
                    }, {
                        msgId : "b",
                        msgArgs : {}
                    }], this);
            this.assertErrorInLogs("errorMsg:");
            this.assertErrorInLogs("1 - a");
            this.assertErrorInLogs("2 - b");
        }

    }
});
