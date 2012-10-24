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
 * Test case for the Json class.
 * @class test.aria.utils.JsonTest
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.JsonTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Data", "aria.utils.Date",
            "test.aria.utils.json.InvalidJsonSerializer", "test.aria.utils.json.FirstValidJsonSerializer",
            "test.aria.utils.json.SecondValidJsonSerializer"],
    $prototype : {

        /**
         * Test the convertToJsonString method
         */
        testConvertToJsonString : function () {

            // Test various options and data types
            var testObj = {
                a : new Date(2011, 5, 24, 12, 45, 50),
                b : false,
                c : 3.6,
                d : "abcd+ %",
                e : function () {},
                f : /^[\s\t]|([ggg])$/gim,
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

            var output = aria.utils.Json.convertToJsonString(testObj, {
                indent : "\t",
                maxDepth : 2,
                encodeParameters : true,
                serializedDatePattern : "dd MMM yy"
            });
            var testOut1 = "{\n\t\"a\": \"24 Jun 11\",\n\t\"b\": false,\n\t\"c\": 3.6,\n\t\"d\": \"abcd%2B%20%25\",\n\t\"e\": \"[function]\",\n\t\"f\": \"%2F%5E%5B%5C%5Cs%5C%5Ct%5D%7C(%5Bggg%5D)%24%2Fgim\",\n\t\"g\": null,\n\t\"h\": [\n\t\t\"a\",\n\t\t\"b\",\n\t\t[...],\n\t\t\"\"\n\t],\n\t\"i\": {\n\t\t\"a\": {...}\n\t}\n}";
            var testOut2 = "{\n\t\"a\": \"24 Jun 11\",\n\t\"b\": false,\n\t\"c\": 3.6,\n\t\"d\": \"abcd%2B%20%25\",\n\t\"e\": \"[function]\",\n\t\"f\": \"%2F%5E%5B%5C%5Cs%5C%5Ct%5D%7C(%5Bggg%5D)%24%2Figm\",\n\t\"g\": null,\n\t\"h\": [\n\t\t\"a\",\n\t\t\"b\",\n\t\t[...],\n\t\t\"\"\n\t],\n\t\"i\": {\n\t\t\"a\": {...}\n\t}\n}";

            this.assertTrue(output == testOut1 || output == testOut2);

            // Test that an error is raised when the instance does not have a serializer
            var invalidSerializer = new test.aria.utils.json.InvalidJsonSerializer();
            aria.utils.Json.convertToJsonString(testObj, {}, invalidSerializer);
            this.assertErrorInLogs(aria.utils.Json.INVALID_JSON_SERIALIZER_INSTANCE, "invalid serializer was not detected");
            invalidSerializer.$dispose();

            // Test valid serializers
            var validSerializer = new test.aria.utils.json.FirstValidJsonSerializer();
            output = aria.utils.Json.convertToJsonString(testObj, {}, validSerializer);
            this.assertTrue(output == "FirstValidJsonSerializer", "valid serializer given as instance was not called");
            validSerializer.$dispose();

            validSerializer = new test.aria.utils.json.SecondValidJsonSerializer();
            output = aria.utils.Json.convertToJsonString(testObj, {
                message : "testMsg"
            }, validSerializer);
            this.assertTrue(output == "SecondValidJsonSerializer message testMsg", "valid serializer given as instance was not called");
            validSerializer.$dispose();

        },

        /**
         * Test __checkBackRefs method
         */
        testCheckBackRefs : function () {
            var jsonUtils = aria.utils.Json;
            var a = {
                obj : {
                    my : "prop"
                }
            };
            var b = {
                obj : {
                    other : "prop2"
                }
            };
            var c = Aria.$global;
            a.obj.b = b;
            b.obj.a = a;

            var myListenerScope = {
                count : 0
            };

            // Recursive Listener on a
            aria.utils.Json.addListener(a, null, {
                scope : myListenerScope,
                fn : function () {}
            }, true, true);

            // Non-recursive Listener on a
            aria.utils.Json.addListener(a, {
                scope : myListenerScope,
                fn : function () {}
            }, true);

            // Recursive Listener on a.obj
            aria.utils.Json.addListener(a, "obj", null, {
                scope : myListenerScope,
                fn : function () {}
            }, true, true);

            // Non-recursive Listener on a.obj
            aria.utils.Json.addListener(a, "obj", null, {
                scope : myListenerScope,
                fn : function () {}
            }, true);

            // Recursive Listener on b
            aria.utils.Json.addListener(b, null, {
                scope : myListenerScope,
                fn : function () {}
            }, true, true);

            // Non-recursive Listener on b
            aria.utils.Json.addListener(b, null, {
                scope : myListenerScope,
                fn : function () {}
            }, true);

            var testData = {};
            jsonUtils.setValue(testData, "myA", a);
            jsonUtils.setValue(testData, "myB", b);
            jsonUtils.setValue(testData, "myC", c);

            // a is part of the tree decorated with back-references:
            this.assertTrue(a[jsonUtils.OBJECT_PARENT_PROPERTY] != null);
            // listeners must not be part of the tree decorated with back-references:
            this.assertTrue(myListenerScope[jsonUtils.OBJECT_PARENT_PROPERTY] == null);

        },

        /**
         * Test addListener method and tricky notification
         */
        testAddListener : function () {
            var objTest = {
                a : 1,
                b : 2,
                c : {
                    ca : [{
                                ca0a : 1
                            }],
                    cb : 2
                },
                d : [{
                            d0a : {}
                        }]
            };

            // counters
            var aCall = 0, bCall = 0, cCall = 0, cRecCall = 0, ca0aCall = 0, genCall = 0, genRecCall = 0;

            // callbacks
            var aCallback = function (args) {
                aCall++;
            };

            var bCallback = function (args) {
                bCall++;
            };

            var cCallback = function (args) {
                cCall++;
            };

            var cRecCallback = function (args) {
                cRecCall++;
            };

            var ca0aCallback = function (args) {
                ca0aCall++;
            };

            var genCallback = function (args) {
                genCall++;
            };

            var genRecCallback = function (args) {
                genRecCall++;
            };

            // callback that will remove callback -> this should not break, and aCallback should be called
            var aRemoveCallback = function (args) {
                aria.utils.Json.removeListener(objTest, aCallback);
            };

            // this should never be called twice
            var nbCall = 0;
            var failCallback = function () {
                nbCall++;
                if (nbCall > 2) {
                    throw {};
                }
            };

            // add general listeners
            aria.utils.Json.addListener(objTest, null, {
                scope : [],
                fn : genCallback
            }, true);

            aria.utils.Json.addListener(objTest, null, {
                scope : [],
                fn : genRecCallback
            }, true, true);

            // add target listeners
            // A
            aria.utils.Json.addListener(objTest, "a", {
                scope : [],
                fn : aRemoveCallback
            }, true);

            aria.utils.Json.addListener(objTest, "a", {
                scope : [],
                fn : aCallback
            }, true);

            // B
            aria.utils.Json.addListener(objTest, "b", {
                scope : [],
                fn : bCallback
            }, true);

            // C -> object
            aria.utils.Json.addListener(objTest, "c", {
                scope : [],
                fn : cCallback
            }, true);
            aria.utils.Json.addListener(objTest, "c", {
                scope : [],
                fn : cRecCallback
            }, true, true);
            aria.utils.Json.addListener(objTest.c.ca[0], "ca0a", {
                scope : [],
                fn : ca0aCallback
            }, true);

            // TEST CALLBACK REMOVAL AND TARGETING
            aria.utils.Json.setValue(objTest, "a", 2);
            this.assertTrue(aCall === 1, "a callback was not called, because it was removed");
            this.assertTrue(bCall === 0, "obj.b was not changed, bCallback should not have been called");
            this.assertTrue(genCall === 1, "General callback was not called");
            this.assertTrue(genRecCall === 1, "General Rec callback was not called");

            // TEST SETTING THE SAME VALUE
            aria.utils.Json.setValue(objTest, "a", 2);
            this.assertTrue(aCall === 1, "Listener was called twice, but value was never changed");

            // TEST BUBBLING
            aria.utils.Json.setValue(objTest.c.ca[0], "ca0a", 2);
            this.assertTrue(ca0aCall === 1, "ca0aa callback was not called");
            this.assertTrue(cRecCall === 1, "cRec callback was not called -> bubbling");
            this.assertTrue(genCall === 1, "General callback was called for a change in its child");
            this.assertTrue(genRecCall === 2, "General Rec callback was not called");
            this.assertTrue(cCall === 0, "A none recursive callback was called for a change in its child");

            // this should not recursively loop : creates a loop
            aria.utils.Json.setValue(objTest.d[0].d0a, "d0aa", objTest);
            aria.utils.Json.addListener(objTest.d[0].d0a, null, failCallback, true, true);

            aria.utils.Json.setValue(objTest.d[0].d0a, "test", 1);
        },

        /**
         * Test the copy function of JSON
         */
        testCopy : function () {

            var json = {
                // meta from aria
                "aria:test" : true,

                // user defined meta
                "mymeta:test" : true,
                foo : {
                    string : "string",
                    bar : {
                        number : 8,
                        bool : false,
                        date : new Date(),
                        "mymeta:test" : true
                    }
                },
                bar : {
                    a : 1
                }
            };

            // REC
            var copyNoRec = aria.utils.Json.copy(json, false);
            // change json :
            json.foo.bar.number = 10;
            this.assertTrue(copyNoRec.foo.bar.number == 10);
            // restaure
            json.foo.bar.number = 8;

            // FILTERS
            var copyFilter = aria.utils.Json.copy(json, true, ["foo"]);
            // change json :
            json.foo.bar.number = 10;

            // copy filters only foo
            this.assertFalse("bar" in copyFilter);

            // but copy everything else
            this.assertTrue(copyFilter.foo.string === "string");
            this.assertTrue(copyFilter.foo.bar.number === 8);
            this.assertTrue(copyFilter.foo.bar.bool === false);
            this.assertTrue(copyFilter.foo.bar.date.getTime() === json.foo.bar.date.getTime());

            // copy the date into new object
            this.assertFalse(copyFilter.foo.bar.date === json.foo.bar.date);

            // restaure
            json.foo.bar.number = 8;

            // META
            var copyMeta = aria.utils.Json.copy(json, true, null, true);

            // aria meta are to be removed parameter
            this.assertFalse("aria:test" in copyMeta);

            // user defined
            this.assertTrue(copyMeta["mymeta:test"]);
            this.assertTrue(copyMeta.foo.bar["mymeta:test"]);

        },

        /**
         * Test inject function
         */
        testInject : function () {
            var myFunction = function () {};
            var myOtherFunction = function () {};
            var source = {
                foo : {
                    bar : 0,
                    f : myFunction
                },
                foo2 : {
                    bar2 : "value"
                }
            };

            var target = {
                foo : {
                    bar : 5,
                    f : myOtherFunction,
                    bar2 : 6
                }
            };

            // with merge = false, replace
            var withoutMerge = {
                foo : {
                    bar : 0,
                    f : myFunction
                },
                foo2 : {
                    bar2 : "value"
                }
            };

            // with merge = true, recursive injection
            var withMerge = {
                foo : {
                    bar : 0,
                    bar2 : 6,
                    f : myFunction
                },
                foo2 : {
                    bar2 : "value"
                }
            };

            var withoutMergeResult = aria.utils.Json.copy(target);
            aria.utils.Json.inject(aria.utils.Json.copy(source), withoutMergeResult);
            this.assertJsonEquals(withoutMerge, withoutMergeResult);

            var withMergeResult = aria.utils.Json.copy(target);
            aria.utils.Json.inject(aria.utils.Json.copy(source), withMergeResult, true);
            this.assertJsonEquals(withMerge, withMergeResult);

        },

        /**
         * Tests the methods assertJsonContains() and assertJsonEquals()
         */
        testAssertJson : function () {
            var jsonA = {
                fieldA : "valueA",
                group1 : {
                    field1 : "value1",
                    field2 : [1, 2, 3]
                }
            };

            var jsonB = aria.utils.Json.copy(jsonA);

            var jsonC = {
                group1 : {
                    field2 : [1, 2, 3],
                    field1 : "value1",
                    group2 : {
                        field21 : "value21"
                    }
                },
                fieldA : "valueA",
                fieldNew : "hey!"
            };

            var jsonD = {
                fieldA : "valueA",
                group1 : {
                    field1 : "valueWRONG",
                    field2 : [1, 2, 3]
                }
            };

            this.assertJsonContains(jsonA, jsonB);
            this.assertJsonContains(jsonB, jsonA);
            this.assertJsonContains(jsonC, jsonA);
            this.assertJsonContains(jsonC, jsonB);

            this.assertFalse(aria.utils.Json.contains(jsonA, jsonC));
            this.assertFalse(aria.utils.Json.contains(jsonA, jsonD));
            this.assertFalse(aria.utils.Json.contains(jsonC, jsonD));

            this.assertJsonEquals(jsonA, jsonB);
            this.assertJsonEquals(jsonB, jsonA);

            this.assertFalse(aria.utils.Json.equals(jsonA, jsonC));
            this.assertFalse(aria.utils.Json.equals(jsonA, jsonD));
            this.assertFalse(aria.utils.Json.equals(jsonC, jsonD));

        },

        /**
         * Test isMetaData method
         */
        testIsMetadata : function () {
            var metaObj = {
                "aria:listener" : {
                    "o:k" : "ok"
                }
            };

            var nonMetaObj = {
                ok : "ok",
                1 : 2
            };

            for (var mKey in metaObj) {
                this.assertTrue(aria.utils.Json.isMetadata(mKey));
            }

            for (var oKey in nonMetaObj) {
                this.assertTrue(!aria.utils.Json.isMetadata(oKey));
            }

        },

        /**
         * Test removeMetaData method
         */
        testRemoveMetadata : function () {
            var metaObj = {
                "aria:listener" : {
                    "o:k" : "ok"
                },
                "content" : {
                    "meta:data" : {
                        "another:meta" : "rr"
                    },
                    "non_meta" : {
                        "aria:parent" : "rr",
                        "parent" : "first",
                        "child" : {
                            "second" : "two",
                            "aria:parent" : {}
                        }
                    }
                },
                "twelve" : 12,
                "undefined" : undefined,
                "null" : null,
                "array" : [1, 2, 3]
            };

            metaObj.array["aria:meta"] = "toto";

            var stripped = {
                "content" : {
                    "non_meta" : {
                        "parent" : "first",
                        "child" : {
                            "second" : "two"
                        }
                    }
                },
                "twelve" : 12,
                "undefined" : undefined,
                "null" : null,
                "array" : [1, 2, 3]
            };

            var noMeta = aria.utils.Json.removeMetadata(metaObj);
            this.assertTrue(!stripped.array["aria:meta"], "Meta data not removed on array");
            this.assertTrue(aria.utils.Json.equals(noMeta, stripped));

        },

        /**
         * Test setValue method
         */
        testSetValue : function () {
            var myJson = aria.utils.Json;
            var testData = {
                myArray : ["a", "b", "c", "d"],
                myMap : {
                    orange : 1,
                    blue : 3
                }
            };
            var callCount = {
                listener1 : 0,
                listener2 : 0,
                listener3 : 0,
                listener4 : 0,
                listener5 : 0
            };
            var listener1 = function () {
                callCount.listener1++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 0);
                this.assertTrue(arg.newValue == "f");
                this.assertTrue(arg.oldValue == "a");
                this.assertTrue(arg.change == myJson.VALUE_CHANGED);
            };
            var listener2 = function () {
                callCount.listener2++;
            };
            var listener3 = function () {
                callCount.listener3++;
                var arg = arguments[0];
                switch (callCount.listener3) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 0);
                        this.assertTrue(arg.newValue == "f");
                        this.assertTrue(arg.oldValue == "a");
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 4);
                        this.assertTrue(arg.newValue == "g");
                        this.assertTrue(arg.oldValue == undefined);
                        this.assertTrue(arg.change == myJson.KEY_ADDED);
                        break;
                }
            };
            var listener4 = function () {
                callCount.listener4++;
                var arg = arguments[0];
                switch (callCount.listener4) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 0);
                        this.assertTrue(arg.newValue == "f");
                        this.assertTrue(arg.oldValue == "a");
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 4);
                        this.assertTrue(arg.newValue == "g");
                        this.assertTrue(arg.oldValue == undefined);
                        this.assertTrue(arg.change == myJson.KEY_ADDED);
                        break;
                }
            };
            var listener5 = function () {
                callCount.listener5++;
                var arg = arguments[0];
                switch (callCount.listener5) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myMap);
                        this.assertTrue(arg.dataName == "orange");
                        this.assertTrue(arg.newValue == 4);
                        this.assertTrue(arg.oldValue == 1);
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myMap);
                        this.assertTrue(arg.dataName == "magenta");
                        this.assertTrue(arg.newValue == 7);
                        this.assertTrue(arg.oldValue == undefined);
                        this.assertTrue(arg.change == myJson.KEY_ADDED);
                        break;
                }
            };
            myJson.addListener(testData.myArray, 0, {
                fn : listener1,
                scope : this
            }, false, false);
            myJson.addListener(testData, "myArray", {
                fn : listener2,
                scope : this
            }, false, false);
            myJson.addListener(testData, "myArray", {
                fn : listener3,
                scope : this
            }, false, true);
            myJson.addListener(testData.myArray, null, {
                fn : listener4,
                scope : this
            }, false, false);
            myJson.addListener(testData.myMap, null, {
                fn : listener5,
                scope : this
            }, false, false);

            myJson.setValue(testData.myArray, 0, "f");
            myJson.setValue(testData.myArray, 4, "g");
            myJson.setValue(testData.myMap, "orange", 4);
            myJson.setValue(testData.myMap, "magenta", 7);
            this.assertTrue(callCount.listener1 == 1);
            this.assertTrue(callCount.listener2 == 0);
            this.assertTrue(callCount.listener3 == 2);
            this.assertTrue(callCount.listener4 == 2);
            this.assertTrue(callCount.listener5 == 2);
        },

        /**
         * Test add method
         */
        testAdd : function () {
            var myJson = aria.utils.Json;
            var testData = {
                myArray : ["a", "b", "c", "d"],
                myMap : {
                    orange : 1,
                    blue : 2
                }
            };
            var callCount = {
                listener1 : 0,
                listener2 : 0,
                listener3 : 0,
                listener4 : 0,
                listener5 : 0,
                listener6 : 0,
                listener7 : 0
            };
            var listener1 = function () {
                callCount.listener1++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 0);
                this.assertTrue(arg.newValue == "f");
                this.assertTrue(arg.oldValue == "a");
                this.assertTrue(arg.change == myJson.VALUE_CHANGED);
            };
            var listener2 = function () {
                callCount.listener2++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 4);
                this.assertTrue(arg.newValue == "d");
                this.assertTrue(arg.oldValue == undefined);
                this.assertTrue(arg.change == myJson.VALUE_CHANGED);
            };
            var listener3 = function () {
                callCount.listener3++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 5);
                this.assertTrue(arg.newValue == "g");
                this.assertTrue(arg.oldValue == undefined);
                this.assertTrue(arg.change == myJson.VALUE_CHANGED);
            };
            var listener4 = function () {
                callCount.listener4++;
                var arg = arguments[0];
                switch (callCount.listener4) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 0);
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "f");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 5);
                        this.assertTrue(arg.removed.length == 0);
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "g");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener5 = function () {
                callCount.listener5++;
                var arg = arguments[0];
                switch (callCount.listener5) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 0);
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "f");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 5);
                        this.assertTrue(arg.removed.length == 0);
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "g");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener6 = function () {
                callCount.listener6++;
                var arg = arguments[0];
                switch (callCount.listener6) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 0);
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "f");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 5);
                        this.assertTrue(arg.removed.length == 0);
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "g");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener7 = function () {
                callCount.listener7++;
            };

            myJson.addListener(testData.myArray, 0, {
                fn : listener1,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, 4, {
                fn : listener2,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, 5, {
                fn : listener3,
                scope : this
            }, false, false);

            myJson.addListener(testData.myArray, null, {
                fn : listener4,
                scope : this
            }, false, false);
            myJson.addListener(testData, "myArray", {
                fn : listener5,
                scope : this
            }, false, true);
            myJson.addListener(testData, null, {
                fn : listener6,
                scope : this
            }, false, true);
            myJson.addListener(testData, null, {
                fn : listener7,
                scope : this
            }, false, false);

            myJson.add(testData.myArray, "f", 0);
            myJson.add(testData.myArray, "g");

            this.assertTrue(callCount.listener1 == 1);
            this.assertTrue(callCount.listener2 == 1);
            this.assertTrue(callCount.listener3 == 1);
            this.assertTrue(callCount.listener4 == 2);
            this.assertTrue(callCount.listener5 == 2);
            this.assertTrue(callCount.listener6 == 2);
            this.assertTrue(callCount.listener7 == 0);

            myJson.add(testData.myMap, 0, 0);
            this.assertErrorInLogs(myJson.INVALID_SPLICE_PARAMETERS);

        },

        /**
         * Test removeAt method
         */
        testRemoveAt : function () {
            var myJson = aria.utils.Json;
            var testData = {
                myArray : ["a", "b", "c", "d"]
            };
            var callCount = {
                listener1 : 0,
                listener2 : 0,
                listener3 : 0,
                listener4 : 0,
                listener5 : 0,
                listener6 : 0,
                listener7 : 0
            };
            var listener1 = function () {
                callCount.listener1++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 0);
                this.assertTrue(arg.newValue == "b");
                this.assertTrue(arg.oldValue == "a");
                this.assertTrue(arg.change == myJson.VALUE_CHANGED);
            };
            var listener2 = function () {
                callCount.listener2++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 3);
                this.assertTrue(!arg.newValue);
                this.assertTrue(arg.oldValue == "d");
                this.assertTrue(arg.change == myJson.KEY_REMOVED);
            };
            var listener3 = function () {
                callCount.listener3++;
                var arg = arguments[0];
                switch (callCount.listener3) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 1);
                        this.assertTrue(arg.newValue == "c");
                        this.assertTrue(arg.oldValue == "b");
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 1);
                        this.assertTrue(arg.newValue == "d");
                        this.assertTrue(arg.oldValue == "c");
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                }
            };
            var listener4 = function () {
                callCount.listener4++;
                var arg = arguments[0];
                switch (callCount.listener4) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "a");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 1);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "c");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener5 = function () {
                callCount.listener5++;
                var arg = arguments[0];
                switch (callCount.listener5) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "a");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 1);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "c");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener6 = function () {
                callCount.listener6++;
                var arg = arguments[0];
                switch (callCount.listener6) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "a");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 1);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "c");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener7 = function () {
                callCount.listener7++;
            };

            myJson.addListener(testData.myArray, 0, {
                fn : listener1,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, 3, {
                fn : listener2,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, 1, {
                fn : listener3,
                scope : this
            }, false, false);

            myJson.addListener(testData.myArray, null, {
                fn : listener4,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, null, {
                fn : listener5,
                scope : this
            }, false, false);
            myJson.addListener(testData, null, {
                fn : listener6,
                scope : this
            }, false, true);
            myJson.addListener(testData, null, {
                fn : listener7,
                scope : this
            }, false, false);

            myJson.removeAt(testData.myArray, 0);
            myJson.removeAt(testData.myArray, 1);

            this.assertTrue(callCount.listener1 == 1);
            this.assertTrue(callCount.listener2 == 1);
            this.assertTrue(callCount.listener3 == 2);
            this.assertTrue(callCount.listener4 == 2);
            this.assertTrue(callCount.listener5 == 2);
            this.assertTrue(callCount.listener6 == 2);
            this.assertTrue(callCount.listener7 == 0);

            myJson.removeAt(testData.myMap, 0);
            this.assertErrorInLogs(myJson.INVALID_SPLICE_PARAMETERS);

        },

        /**
         * Test deleteKey method
         */
        testDeleteKey : function () {
            var myJson = aria.utils.Json;
            var testData = {
                myArray : ["a", "b", "c", "d"],
                myMap : {
                    orange : 1,
                    blue : 2,
                    magenta : 4
                }
            };
            var callCount = {
                listener1 : 0,
                listener2 : 0,
                listener3 : 0,
                listener4 : 0,
                listener5 : 0,
                listener6 : 0,
                listener7 : 0,
                listener8 : 0,
                listener9 : 0
            };
            var listener1 = function () {
                callCount.listener1++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 0);
                this.assertTrue(!arg.newValue);
                this.assertTrue(arg.oldValue == "a");
                this.assertTrue(arg.change == myJson.KEY_REMOVED);
            };
            var listener2 = function () {
                callCount.listener2++;
            };
            var listener3 = function () {
                callCount.listener3++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myMap);
                this.assertTrue(arg.dataName == "orange");
                this.assertTrue(!arg.newValue);
                this.assertTrue(arg.oldValue == 1);
                this.assertTrue(arg.change == myJson.KEY_REMOVED);
            };
            var listener4 = function () {
                callCount.listener4++;
            };

            var listener5 = function () {
                callCount.listener5++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myMap);
                this.assertTrue(arg.dataName == "orange");
                this.assertTrue(!arg.newValue);
                this.assertTrue(arg.oldValue == 1);
                this.assertTrue(arg.change == myJson.KEY_REMOVED);
            };
            var listener6 = function () {
                callCount.listener6++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 0);
                this.assertTrue(!arg.newValue);
                this.assertTrue(arg.oldValue == "a");
                this.assertTrue(arg.change == myJson.KEY_REMOVED);
            };
            var listener7 = function () {
                callCount.listener7++;
                var arg = arguments[0];
                this.assertTrue(arg.dataHolder == testData.myArray);
                this.assertTrue(arg.dataName == 0);
                this.assertTrue(!arg.newValue);
                this.assertTrue(arg.oldValue == "a");
                this.assertTrue(arg.change == myJson.KEY_REMOVED);
            };
            var listener8 = function () {
                callCount.listener8++;
                var arg = arguments[0];
                switch (callCount.listener8) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 0);
                        this.assertTrue(!arg.newValue);
                        this.assertTrue(arg.oldValue == "a");
                        this.assertTrue(arg.change == myJson.KEY_REMOVED);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myMap);
                        this.assertTrue(arg.dataName == "orange");
                        this.assertTrue(!arg.newValue);
                        this.assertTrue(arg.oldValue == 1);
                        this.assertTrue(arg.change == myJson.KEY_REMOVED);
                        break;
                }
            };
            var listener9 = function () {
                callCount.listener9++;
            };

            myJson.addListener(testData.myArray, 0, {
                fn : listener1,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, 3, {
                fn : listener2,
                scope : this
            }, false, false);

            myJson.addListener(testData.myMap, "orange", {
                fn : listener3,
                scope : this
            }, false, false);

            myJson.addListener(testData, "myMap", {
                fn : listener4,
                scope : this
            }, false, false);

            myJson.addListener(testData.myMap, null, {
                fn : listener5,
                scope : this
            }, false, false);

            myJson.addListener(testData, "myArray", {
                fn : listener6,
                scope : this
            }, false, true);
            myJson.addListener(testData.myArray, null, {
                fn : listener7,
                scope : this
            }, false, false);
            myJson.addListener(testData, null, {
                fn : listener8,
                scope : this
            }, false, true);
            myJson.addListener(testData, null, {
                fn : listener9,
                scope : this
            }, false, false);

            myJson.deleteKey(testData.myArray, 0);
            myJson.deleteKey(testData.myMap, "orange");

            this.assertTrue(callCount.listener1 == 1);
            this.assertTrue(callCount.listener2 == 0);
            this.assertTrue(callCount.listener3 == 1);
            this.assertTrue(callCount.listener4 == 0);
            this.assertTrue(callCount.listener5 == 1);
            this.assertTrue(callCount.listener6 == 1);
            this.assertTrue(callCount.listener7 == 1);
            this.assertTrue(callCount.listener8 == 2);
            this.assertTrue(callCount.listener9 == 0);

            myJson.deleteKey(testData.myMap, "cyan");

        },

        /**
         * Test splice method
         */
        testSplice : function () {
            var myJson = aria.utils.Json;
            var testData = {
                myArray : ["a", "b", "c", "d"],
                myMap : {
                    orange : 1,
                    blue : 2,
                    magenta : 4
                }
            };
            var callCount = {
                listener1 : 0,
                listener2 : 0,
                listener3 : 0,
                listener4 : 0,
                listener5 : 0,
                listener6 : 0,
                listener7 : 0,
                listener8 : 0
            };
            var listener1 = function () {
                callCount.listener1++;
                var arg = arguments[0];
                switch (callCount.listener1) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 0);
                        this.assertTrue(arg.newValue == "e");
                        this.assertTrue(arg.oldValue == "a");
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                }
            };
            var listener2 = function () {
                callCount.listener2++;
                var arg = arguments[0];
                switch (callCount.listener2) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 3);
                        this.assertTrue(arg.newValue == "c");
                        this.assertTrue(arg.oldValue == "d");
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 3);
                        this.assertTrue(arg.newValue == "h");
                        this.assertTrue(arg.oldValue == "c");
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                }
            };

            var listener3 = function () {
                callCount.listener3++;
                var arg = arguments[0];
                switch (callCount.listener3) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 4);
                        this.assertTrue(arg.newValue == "d");
                        this.assertTrue(arg.oldValue == undefined);
                        this.assertTrue(arg.change == myJson.VALUE_CHANGED);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.dataName == 4);
                        this.assertTrue(!arg.newValue);
                        this.assertTrue(arg.oldValue == "d");
                        this.assertTrue(arg.change == myJson.KEY_REMOVED);
                        break;
                }
            };
            var listener4 = function () {
                callCount.listener4++;
                var arg = arguments[0];
                switch (callCount.listener4) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "a");
                        this.assertTrue(arg.added.length == 2);
                        this.assertTrue(arg.added[0] == "e");
                        this.assertTrue(arg.added[1][0] == "f");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 3);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "c");
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "h");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (3) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 4);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "d");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener5 = function () {
                callCount.listener5++;
                var arg = arguments[0];
                switch (callCount.listener5) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "a");
                        this.assertTrue(arg.added.length == 2);
                        this.assertTrue(arg.added[0] == "e");
                        this.assertTrue(arg.added[1][0] == "f");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 3);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "c");
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "h");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (3) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 4);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "d");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener6 = function () {
                callCount.listener6++;
                var arg = arguments[0];
                switch (callCount.listener6) {
                    case (1) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 0);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "a");
                        this.assertTrue(arg.added.length == 2);
                        this.assertTrue(arg.added[0] == "e");
                        this.assertTrue(arg.added[1][0] == "f");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (2) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 3);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "c");
                        this.assertTrue(arg.added.length == 1);
                        this.assertTrue(arg.added[0] == "h");
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                    case (3) :
                        this.assertTrue(arg.dataHolder == testData.myArray);
                        this.assertTrue(arg.index == 4);
                        this.assertTrue(arg.removed.length == 1);
                        this.assertTrue(arg.removed[0] == "d");
                        this.assertTrue(arg.added.length == 0);
                        this.assertTrue(arg.change == myJson.SPLICE);
                        break;
                }
            };
            var listener7 = function () {
                callCount.listener7++;
            };
            var listener8 = function () {
                callCount.listener8++;
            };

            myJson.addListener(testData.myArray, 0, {
                fn : listener1,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, 3, {
                fn : listener2,
                scope : this
            }, false, false);
            myJson.addListener(testData.myArray, 4, {
                fn : listener3,
                scope : this
            }, false, false);

            myJson.addListener(testData.myArray, null, {
                fn : listener4,
                scope : this
            }, false, false);
            myJson.addListener(testData, "myArray", {
                fn : listener5,
                scope : this
            }, false, true);
            myJson.addListener(testData, null, {
                fn : listener6,
                scope : this
            }, false, true);
            myJson.addListener(testData, null, {
                fn : listener7,
                scope : this
            }, false, false);
            myJson.addListener(testData, "myArray", {
                fn : listener8,
                scope : this
            }, false, false);

            myJson.splice(testData.myArray, 0, 1, "e", ["f", "g"]);
            myJson.splice(testData.myArray, -2, 1, "h");
            myJson.splice(testData.myArray, 4, 5);

            this.assertTrue(callCount.listener1 == 1);
            this.assertTrue(callCount.listener2 == 2);
            this.assertTrue(callCount.listener3 == 2);
            this.assertTrue(callCount.listener4 == 3);
            this.assertTrue(callCount.listener5 == 3);
            this.assertTrue(callCount.listener6 == 3);
            this.assertTrue(callCount.listener7 == 0);
            this.assertTrue(callCount.listener8 == 0);

            myJson.splice(testData.myMap, 0, 0);
            this.assertErrorInLogs(myJson.INVALID_SPLICE_PARAMETERS);
        }

    }
});