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
 * Test case for aria.utils.json.JsonSerializer
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.json.JsonSerializer",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.json.JsonSerializer", "aria.utils.Date"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.jsonSerializer = new aria.utils.json.JsonSerializer(true);
        this.buggyStringify = false;

        var browser = aria.core.Browser;
        if (browser.isFirefox && browser.majorVersion < 4) {
            // FF 3.6 JSON.stringify is a bit buggy regarding spaces and indentation
            this.buggyStringify = true;
        }
    },
    $destructor : function () {
        this.jsonSerializer.$dispose();
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {

        /**
         * Does the appropriate transformation to a JSON string so that when applying it to both the expected string and
         * the value given by a buggy implementation of JSON.stringify (buggy regarding spaces only), the resulting
         * strings are equal (and the test is still valid even if it is less precise).
         */
        fixBuggyJsonString : function (value) {
            return value.replace(/: /g, ':').replace(/\[\s*/g, '[');
        },

        /**
         * Check that a string given by a call to the JsonSerializer is equal to the expected value. In case
         * JSON.stringify is buggy for spaces (e.g. in FF3.6), the comparison is less strict.
         * @param {String} value1 Result of the JsonSerializer
         * @param {String} value2 Expected value
         * @param {String} msg Message in case strings are not equal.
         */
        assertJsonStringEquals : function (value1, value2, msg) {
            if (this.buggyStringify) {
                value1 = this.fixBuggyJsonString(value1);
                value2 = this.fixBuggyJsonString(value2);
            }
            this.assertEquals(value1, value2, msg);
        },

        /**
         * Test the indent option
         */
        testIndentOption : function () {
            // for objects
            var testObj = {
                a : "a",
                b : {
                    c : {
                        d : "d"
                    }
                }
            };
            var output = this.jsonSerializer.serialize(testObj, {
                indent : "\t"
            });
            this.assertJsonStringEquals(output, "{\n\t\"a\": \"a\",\n\t\"b\": {\n\t\t\"c\": {\n\t\t\t\"d\": \"d\"\n\t\t}\n\t}\n}", "Indent option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                indent : "  "
            });
            this.assertJsonStringEquals(output, "{\n  \"a\": \"a\",\n  \"b\": {\n    \"c\": {\n      \"d\": \"d\"\n    }\n  }\n}", "Indent option did not work correctly");

            output = this.jsonSerializer.serialize(testObj, {
                indent : " \t"
            });
            this.assertJsonStringEquals(output, "{\n \t\"a\": \"a\",\n \t\"b\": {\n \t \t\"c\": {\n \t \t \t\"d\": \"d\"\n \t \t}\n \t}\n}", "Indent option did not work correctly");

            output = this.jsonSerializer.serialize(testObj);
            this.assertJsonStringEquals(output, "{\"a\":\"a\",\"b\":{\"c\":{\"d\":\"d\"}}}", "Indent option did not work correctly");

            // for arrays
            testObj = {
                a : ["a", "b", ["c", ["d", "e"]]]
            };
            output = this.jsonSerializer.serialize(testObj, {
                indent : "\t"
            });
            this.assertJsonStringEquals(output, "{\n\t\"a\": [\n\t\t\"a\",\n\t\t\"b\",\n\t\t[\n\t\t\t\"c\",\n\t\t\t[\n\t\t\t\t\"d\",\n\t\t\t\t\"e\"\n\t\t\t]\n\t\t]\n\t]\n}", "Indent option did not work correctly");
            output = this.jsonSerializer.serialize(testObj);
            this.assertJsonStringEquals(output, "{\"a\":[\"a\",\"b\",[\"c\",[\"d\",\"e\"]]]}", "Indent option did not work correctly");
        },

        /**
         * Test the escapeKeyNames options
         */
        testEscapeKeyNamesOption : function () {
            var testObj = {
                a : "a",
                b : {
                    c : {
                        d : "d"
                    }
                }
            };
            var output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                escapeKeyNames : false
            });
            this.assertJsonStringEquals(output, "{\n\ta: \"a\",\n\tb: {\n\t\tc: {\n\t\t\td: \"d\"\n\t\t}\n\t}\n}", "escapeKeyNames option did not work correctly");
        },

        /**
         * Test the maxDepth option
         */
        testMaxDepthOption : function () {
            var testObj = {
                a : "a",
                b : {
                    c : {
                        d : "d"
                    }
                }
            };
            var output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 0
            });
            this.assertJsonStringEquals(output, "{...}", "maxDepth option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 1
            });

            this.assertJsonStringEquals(output, "{\n\t\"a\": \"a\",\n\t\"b\": {...}\n}", "maxDepth option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 2
            });

            this.assertJsonStringEquals(output, "{\n\t\"a\": \"a\",\n\t\"b\": {\n\t\t\"c\": {...}\n\t}\n}", "maxDepth option did not work correctly");

            testObj = ["a", "b", ["c", ["d", "e"]]];
            output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 0
            });
            this.assertJsonStringEquals(output, "[...]", "maxDepth option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                maxDepth : 1
            });
            this.assertJsonStringEquals(output, "[\"a\",\"b\",[...]]", "maxDepth option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                maxDepth : 2
            });
            this.assertJsonStringEquals(output, "[\"a\",\"b\",[\"c\",[...]]]", "maxDepth option did not work correctly");

            testObj = {
                a : "a"
            };
            testObj.b = testObj;
            output = this.jsonSerializer.serialize(testObj, {
                reversible : true
            });
            this.assertTrue(output == null, "maxDepth default was not applied");
        },

        /**
         * Test encodeParameters option
         */
        testEncodeParameters : function () {
            var str = "abcd+ %";
            var output = this.jsonSerializer.serialize(str, {
                encodeParameters : true
            });
            this.assertJsonStringEquals(output, "\"abcd%2B%20%25\"", "encodeParametersOption did not work correctly");

        },

        /**
         * Test reversible option
         */
        testReversible : function () {
            var testObj = {
                a : "a",
                b : {
                    c : {
                        d : "d"
                    }
                }
            };
            var output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 0,
                reversible : true
            });
            this.assertTrue(output === null, "reversible option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 1,
                reversible : true
            });

            this.assertTrue(output === null, "reversible option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 2,
                reversible : true
            });

            this.assertTrue(output === null, "reversible option did not work correctly");

            output = this.jsonSerializer.serialize(testObj, {
                reversible : true
            });
            var evalOutput;
            eval("evalOutput = " + output + ";");
            this.assertJsonEquals(evalOutput, testObj);

            testObj = ["a", "b", ["c", ["d", "e"]]];
            output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 0,
                reversible : true
            });
            this.assertTrue(output === null, "reversible option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                maxDepth : 1,
                reversible : true
            });
            this.assertTrue(output === null, "reversible option did not work correctly");
            output = this.jsonSerializer.serialize(testObj, {
                maxDepth : 2,
                reversible : true
            });
            this.assertTrue(output === null, "reversible option did not work correctly");

            output = this.jsonSerializer.serialize(testObj, {
                reversible : true
            });
            var evalOutput;
            eval("evalOutput = " + output + ";");
            this.assertJsonEquals(evalOutput, testObj);

            // reversible option in dates
            testObj = new Date();
            output = this.jsonSerializer.serialize(testObj, {
                reversible : true
            });
            var outputDate;
            eval("outputDate = " + output + ";");
            this.assertTrue(testObj.getTime() == outputDate.getTime(), "reversible option did not work correctly with dates");

        },

        /**
         * Test the serializedDatePattern option
         */
        testSerializedDatePattern : function () {
            var testObj = {
                arrivalDate : new Date(2011, 5, 24, 12, 45, 50)
            };
            var output = this.jsonSerializer.serialize(testObj);
            this.assertJsonStringEquals(output, '{"arrivalDate":"2011/06/24 12:45:50"}', "serializedDatePattern option did not work correctly with dates");
            output = this.jsonSerializer.serialize(testObj, {
                serializedDatePattern : "dd MMM yy"
            });
            this.assertJsonStringEquals(output, '{"arrivalDate":"24 Jun 11"}', "serializedDatePattern option did not work correctly with dates");
        },

        /**
         * Test the serialization of regular expressions, null, boolean and functions
         */
        testRegExpNullBooleanFunctionSerialization : function () {
            var testObj = {
                "re1" : /abc*/gim,
                re2 : /^[\s\t]|([ggg])$/m,
                re3 : /ttt/i,
                nu : null
            };
            var output = this.jsonSerializer.serialize(testObj, {
                reversible : true
            });
            var evalOutput;
            eval("evalOutput = " + output + ";");
            this.assertTrue((evalOutput.re1.source == testObj.re1.source)
                    && (evalOutput.re1.ignoreCase == testObj.re1.ignoreCase)
                    && (evalOutput.re1.multiline == testObj.re1.multiline)
                    && (evalOutput.re1.global == testObj.re1.global), "RegExp serialization failed");
            this.assertTrue((evalOutput.re2.source == testObj.re2.source)
                    && (evalOutput.re2.ignoreCase == testObj.re2.ignoreCase)
                    && (evalOutput.re2.multiline == testObj.re2.multiline)
                    && (evalOutput.re2.global == testObj.re2.global), "RegExp serialization failed");
            this.assertTrue((evalOutput.re3.source == testObj.re3.source)
                    && (evalOutput.re3.ignoreCase == testObj.re3.ignoreCase)
                    && (evalOutput.re3.multiline == testObj.re3.multiline)
                    && (evalOutput.re3.global == testObj.re3.global), "RegExp serialization failed");
            var output = this.jsonSerializer.serialize(testObj, {
                reversible : false
            });
            var evalOutput;
            eval("evalOutput = " + output + ";");
            this.assertTrue((evalOutput.re1 == testObj.re1.toString()), "RegExp serialization failed");
            this.assertTrue((evalOutput.re2 == testObj.re2.toString()), "RegExp serialization failed");
            this.assertTrue((evalOutput.re3 == testObj.re3.toString()), "RegExp serialization failed");
            this.assertTrue(evalOutput["nu"] === null, "null conversion did not work");
            output = this.jsonSerializer.serialize(null);
            this.assertTrue(output == "null", "null conversion did not work");

            testObj = true;
            output = this.jsonSerializer.serialize(testObj);
            this.assertTrue(output == 'true', "Boolean serialization failed");
            testObj = false;
            output = this.jsonSerializer.serialize(testObj);
            this.assertTrue(output == 'false', "Boolean serialization failed");
            testObj = function () {};
            output = this.jsonSerializer.serialize(testObj);
            this.assertTrue(output == '\"[function]\"', "Function serialization failed");
        },

        /**
         * Test the serialization of numbers
         */
        testNumberSerialization : function () {
            var testObj = {
                n1 : 5,
                n2 : 3.7
            };

            var output = this.jsonSerializer.serialize(testObj);
            this.assertJsonStringEquals(output, "{\"n1\":5,\"n2\":3.7}", "number serialization failed");
        },

        /**
         * Test on the serialization of a complex object
         */
        testAll : function () {
            var testObj = {
                a : new Date(2011, 5, 24, 12, 45, 50),
                b : false,
                c : 3.6,
                d : "abcd+ %",
                e : function () {},
                g : null,
                h : ["a", "b", ["c", "d", ["e"]], ""],
                i : {
                    a : {
                        f : "f",
                        b : {
                            c : {
                                d : "d"
                            }
                        }
                    }
                }

            };

            var output = this.jsonSerializer.serialize(testObj, {
                indent : "\t",
                maxDepth : 2,
                encodeParameters : true,
                serializedDatePattern : "dd MMM yy"
            });
            var testOut = "{\n\t\"a\": \"24 Jun 11\",\n\t\"b\": false,\n\t\"c\": 3.6,\n\t\"d\": \"abcd%2B%20%25\",\n\t\"e\": \"[function]\",\n\t\"g\": null,\n\t\"h\": [\n\t\t\"a\",\n\t\t\"b\",\n\t\t[...],\n\t\t\"\"\n\t],\n\t\"i\": {\n\t\t\"a\": {...}\n\t}\n}";

            this.assertJsonStringEquals(output, testOut);

        },

        testRemoveMetadata : function () {
            var testObj = {
                "a" : "a",
                "b" : {
                    c : "c"
                }
            };

            testObj[Aria.FRAMEWORK_PREFIX] = "meta";
            testObj.b[Aria.FRAMEWORK_PREFIX + "meta"] = {
                d : "d"
            };

            var expectedNoMeta = '{"a":"a","b":{"c":"c"}}';
            var expectedMeta = '{"a":"a","b":{"c":"c","' + Aria.FRAMEWORK_PREFIX + 'meta":{"d":"d"}},"'
                    + Aria.FRAMEWORK_PREFIX + '":"meta"}';

            // keep metadata
            var output = this.jsonSerializer.serialize(testObj, {
                keepMetadata : true,
                encodeParameters : true
            });
            this.assertJsonStringEquals(output, expectedMeta);

            // default vale
            var output = this.jsonSerializer.serialize(testObj, {
                keepMetadata : null, // defaults to false
                encodeParameters : true
            });
            this.assertJsonStringEquals(output, expectedNoMeta);

            // remove metadata
            var output = this.jsonSerializer.serialize(testObj, {
                keepMetadata : false,
                encodeParameters : true
            });
            this.assertJsonStringEquals(output, expectedNoMeta);
        },

        testRegexpNonReversible : function () {
            var testObj = {
                a : /aaa/
            };
            var output = this.jsonSerializer.serialize(testObj, {
                keepMetadata : true
            });
            this.assertJsonStringEquals(output, "{\"a\":\"/aaa/\"}");
        },

        /**
         * Test if undefined values are ignored like the default behaviour of JSON.stringify
         */
        testUndefined : function () {
            var testObj = {
                a : undefined,
                b : 1
            };
            var result = this.jsonSerializer.serialize(testObj);
            this.assertJsonStringEquals(result, "{\"b\":1}");
        },

        /**
         * Test some special cases
         */
        testSpecialCases : function () {
            // Special chars in key
            var testObj = {
                "/?\\" : "test"
            };
            var output = this.jsonSerializer.serialize(testObj, {
                reversible : true,
                keepMetadata : false
            });
            this.assertJsonEquals(testObj, this.jsonSerializer.parse(output));
        },

        /**
         * Allow dates to be parsed/evaluated
         */
        testAllowDates : function () {
            var testObj = {
                date : new Date(1383232749707)
            };

            var str = '{"date":new Date(1383232749707)}';

            var result = this.jsonSerializer.parse(str);
            this.assertJsonEquals(testObj, result);
        },

        testAllowDates2 : function () {
            var testObj = {
                text : "text",
                date : new Date(1383232749707),
                date1 : new Date(1383232749707)
            };

            var str = '{"text": "text", "date":new Date(1383232749707), "date1":new Date(1383232749707)}';

            var result = this.jsonSerializer.parse(str);
            this.assertJsonEquals(testObj, result);
        },

        testAllowDates3 : function () {
            var testObj = {
                "date" : new Date(1383232749707),
                "dateArray" : [new Date(1383232749707), new Date(1383232749707)],
                "dateNestedObject" : {
                    "dateInner" : new Date(1383232749707)
                }
            };

            var str = '{"date" : new Date(1383232749707), "dateArray": [new Date(1383232749707), new Date(1383232749707)], "dateNestedObject" : {"dateInner" : new Date(1383232749707)}}';

            var result = this.jsonSerializer.parse(str);
            this.assertJsonEquals(testObj, result);
        },

        testSerializeAndParseDate : function () {
            var testObj = {
                "date" : new Date(1383232749707),
                "dateArray" : [new Date(1383232749707), new Date(1383232749707)],
                "dateNestedObject" : {
                    "dateInner" : new Date(1383232749707)
                }
            };
            var str = '{"date":new Date(1383232749707),"dateArray":[new Date(1383232749707),new Date(1383232749707)],"dateNestedObject":{"dateInner":new Date(1383232749707)}}';

            var serializedValue = this.jsonSerializer.serialize(testObj, {
                reversible : true
            });
            this.assertJsonEquals(str, serializedValue);

            var result = this.jsonSerializer.parse(serializedValue);
            this.assertJsonEquals(testObj, result);
        }
    }
});
