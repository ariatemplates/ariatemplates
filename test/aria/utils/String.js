/* jshint -W044 : true */
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
 * Test case for aria.utils.String
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.String",
    $dependencies : ["aria.utils.String", "aria.utils.Json"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        /**
         * Test trim method
         */
        testTrim : function () {
            var trimResult = aria.utils.String.trim("   \tthis is a test   \n");
            this.assertTrue(trimResult === "this is a test", "Expected 'this is a test', Found '" + trimResult + "'");
        },

        /**
         * Test trim method with null argument
         */
        testTrim : function () {
            var trimResult = aria.utils.String.trim(null);
            this.assertTrue(trimResult === null);
        },
        
        /**
         * Test case for the isEscaped method
         */
        testIsEscaped : function () {
            var pkg = aria.utils.String;
            this.assertFalse(pkg.isEscaped("{", 0));
            this.assertTrue(pkg.isEscaped("\\{", 1));
            this.assertFalse(pkg.isEscaped("\\\\{", 2));
            this.assertTrue(pkg.isEscaped("\\\\\\{", 3));
            this.assertFalse(pkg.isEscaped("a{", 1));
            this.assertTrue(pkg.isEscaped("a\\{", 2));
            this.assertFalse(pkg.isEscaped("a\\\\{", 3));
            this.assertTrue(pkg.isEscaped("a\\\\\\{", 4));
        },

        /**
         * Test indexOfNotEscape method
         */
        testIndexOfNotEscaped : function () {
            var test = "abc \\\d \d de\fg";
            this.assertTrue(aria.utils.String.indexOfNotEscaped(test, "a") === 0);
            this.assertTrue(aria.utils.String.indexOfNotEscaped(test, "\\") === 4);
            this.assertTrue(aria.utils.String.indexOfNotEscaped(test, "d") === 7);
            this.assertTrue(aria.utils.String.indexOfNotEscaped(test, "f") === -1);
            this.assertTrue(aria.utils.String.indexOfNotEscaped(test, "h") === -1);
        },

        /**
         * Test escapeHTML method
         */
        testEscapeHTML : function () {
            this.assertTrue(aria.utils.String.escapeHTML("<div> a & b </div>", "a") === "&lt;div&gt; a &amp; b &lt;/div&gt;", "Escape failed.");
        },

        testEscapeHTMLAttr : function () {
            this.assertTrue(aria.utils.String.escapeHTMLAttr("'") === "&#x27;", "Attribute escape failed.");
            this.assertTrue(aria.utils.String.escapeHTMLAttr('"') === "&quot;", "Attribute escape failed.");
            this.assertTrue(aria.utils.String.escapeHTMLAttr("'\"") === "&#x27;&quot;", "Attribute escape failed.");
        },

        testEscapeForHTML : function () {
            var originalString = "<div id='id' class=\"class\">/</div>";
            var escapedForAttrString = "<div id=&#x27;id&#x27; class=&quot;class&quot;>/</div>";
            var escapedForHTMLString = "&lt;div id='id' class=\"class\"&gt;&#x2F;&lt;&#x2F;div&gt;";
            var escapedForAllString = "&lt;div id=&#x27;id&#x27; class=&quot;class&quot;&gt;&#x2F;&lt;&#x2F;div&gt;";

            this.assertTrue(aria.utils.String.escapeForHTML(originalString) === escapedForAllString, "Full HTML escape failed.");
            this.assertTrue(aria.utils.String.escapeForHTML(originalString, null) === escapedForAllString, "Full HTML escape failed.");
            this.assertTrue(aria.utils.String.escapeForHTML(originalString, 5) === escapedForAllString, "Full HTML escape failed.");
            this.assertTrue(aria.utils.String.escapeForHTML(originalString, '5') === escapedForAllString, "Full HTML escape failed.");
            this.assertTrue(aria.utils.String.escapeForHTML(originalString, true) === escapedForAllString, "Full HTML escape failed.");
            this.assertTrue(aria.utils.String.escapeForHTML(originalString, {
                text : true,
                attr : true
            }) === escapedForAllString, "Full HTML escape failed.");

            this.assertTrue(aria.utils.String.escapeForHTML(originalString, false) === originalString, "Full HTML escape failed.");
            this.assertTrue(aria.utils.String.escapeForHTML(originalString, {
                text : false,
                attr : false
            }) === originalString, "Full HTML escape failed.");

            this.assertTrue(aria.utils.String.escapeForHTML(originalString, {
                text : false,
                attr : true
            }) === escapedForAttrString, "Full HTML escape failed.");
            this.assertTrue(aria.utils.String.escapeForHTML(originalString, {
                text : true,
                attr : false
            }) === escapedForHTMLString, "Full HTML escape failed.");
        },

        /**
         * Test stripAccents method
         */
        testStripAccents : function () {
            this.assertTrue(aria.utils.String.stripAccents("àébïuô") === "aebiuo", "Strip Accents failed failed.");
        },

        /**
         * Test nextWhiteSpace method
         */
        testNextWhiteSpace : function () {
            var test = " abc def\tghi";
            this.assertTrue(aria.utils.String.nextWhiteSpace(test, 0, 5) === 0);
            this.assertTrue(aria.utils.String.nextWhiteSpace(test, 1, 5) === 4);
            this.assertTrue(aria.utils.String.nextWhiteSpace(test, 5, 9) === 8);
            this.assertTrue(aria.utils.String.nextWhiteSpace(test, 1, 3) === -1);
            this.assertTrue(aria.utils.String.nextWhiteSpace('', 2, 5) === -1);
        },

        /**
         * Test encodeForQuotedHTMLAttribute method
         */
        testEncodeForQuotedHTMLAttribute : function () {
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute(undefined), "");
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute(""), "");
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute("abc"), "abc");
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute('"'), '&quot;');
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute('"abc'), '&quot;abc');
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute('a"b'), 'a&quot;b');
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute('a"b"c"d'), 'a&quot;b&quot;c&quot;d');
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute('"""'), '&quot;&quot;&quot;');
            this.assertEquals(aria.utils.String.encodeForQuotedHTMLAttribute('&quot;'), '&quot;');
        },

        /**
         * Test endsWith method
         */
        testEndsWith : function () {
            this.assertTrue(aria.utils.String.endsWith("", ""));
            this.assertFalse(aria.utils.String.endsWith("", "a"));
            this.assertTrue(aria.utils.String.endsWith("a", "a"));
            this.assertFalse(aria.utils.String.endsWith("ab", "a"));
            this.assertTrue(aria.utils.String.endsWith("aba", "a"));
            this.assertFalse(aria.utils.String.endsWith("aba", "b"));
            this.assertTrue(aria.utils.String.endsWith("abc", ""));
            this.assertTrue(aria.utils.String.endsWith("abc", "bc"));
            this.assertTrue(aria.utils.String.endsWith("a b", " b"));
            this.assertFalse(aria.utils.String.endsWith("a b", "a"));
        },

        /**
         * Test capitalize method
         */
        testCapitalize : function () {
            var result = aria.utils.String.capitalize("this is a test");
            this.assertTrue(result === "This is a test", "Expected 'This is a test', Found '" + result + "'");
        },

        /**
         * Test pad method
         */
        testPad : function () {
            var initial, size, expected, got;
            var toTest = {
                "" : {
                    "-1" : "",
                    0 : "",
                    1 : "a",
                    2 : "aa",
                    5 : "aaaaa"
                },
                "b" : {
                    "-1" : "b",
                    0 : "b",
                    1 : "b",
                    2 : "ab",
                    5 : "aaaab"
                },
                "cc" : {
                    "-1" : "cc",
                    0 : "cc",
                    1 : "cc",
                    2 : "cc",
                    5 : "aaacc"
                }
            };

            for (initial in toTest) {
                if (toTest.hasOwnProperty(initial)) {
                    for (size in toTest[initial]) {
                        if (toTest[initial].hasOwnProperty(size)) {
                            expected = toTest[initial][size];
                            got = aria.utils.String.pad(initial, size, "a", true);

                            this.assertEquals(got, expected, "Padding " + initial + " size " + size
                                    + " got %1 expected %2");
                        }
                    }
                }
            }

            // reverse
            toTest = {
                "" : {
                    0 : "",
                    1 : "a",
                    2 : "aa",
                    5 : "aaaaa"
                },
                "b" : {
                    0 : "b",
                    1 : "b",
                    2 : "ba",
                    5 : "baaaa"
                },
                "cc" : {
                    0 : "cc",
                    1 : "cc",
                    2 : "cc",
                    5 : "ccaaa"
                }
            };

            for (initial in toTest) {
                if (toTest.hasOwnProperty(initial)) {
                    for (size in toTest[initial]) {
                        if (toTest[initial].hasOwnProperty(size)) {
                            expected = toTest[initial][size];
                            got = aria.utils.String.pad(initial, size, "a", false);

                            this.assertEquals(got, expected, "Padding " + initial + " size " + size
                                    + " got %1 expected %2");
                        }
                    }
                }
            }
        },

        /**
         * Test crop method - crop from beginning
         */
        testCropBegin : function () {
            // cropping a
            var toTest = {
                "" : {
                    0 : "",
                    1 : "",
                    2 : "",
                    5 : ""
                },
                "a" : {
                    0 : "",
                    1 : "a",
                    2 : "a",
                    5 : "a"
                },
                "ab" : {
                    0 : "b",
                    1 : "b",
                    2 : "ab",
                    5 : "ab"
                },
                "aba" : {
                    0 : "ba",
                    1 : "ba",
                    2 : "ba",
                    5 : "aba"
                },
                "aab" : {
                    0 : "b",
                    1 : "b",
                    2 : "ab",
                    5 : "aab"
                },
                "caabaa" : {
                    0 : "caabaa",
                    1 : "caabaa",
                    2 : "caabaa",
                    5 : "caabaa"
                }
            };

            for (var initial in toTest) {
                if (toTest.hasOwnProperty(initial)) {
                    for (var size in toTest[initial]) {
                        if (toTest[initial].hasOwnProperty(size)) {
                            var expected = toTest[initial][size];
                            var got = aria.utils.String.crop(initial, size, "a", true);

                            this.assertEquals(got, expected, "Cropping " + initial + " size " + size
                                    + " got %1 expected %2");
                        }
                    }
                }
            }

        },

        /**
         * Test crop method - crop from end
         */
        testCropEnd : function () {
            // cropping a
            var toTest = {
                "" : {
                    0 : "",
                    1 : "",
                    2 : "",
                    5 : ""
                },
                "a" : {
                    0 : "",
                    1 : "a",
                    2 : "a",
                    5 : "a"
                },
                "ab" : {
                    0 : "ab",
                    1 : "ab",
                    2 : "ab",
                    5 : "ab"
                },
                "aba" : {
                    0 : "ab",
                    1 : "ab",
                    2 : "ab",
                    5 : "aba"
                },
                "aab" : {
                    0 : "aab",
                    1 : "aab",
                    2 : "aab",
                    5 : "aab"
                },
                "caabaa" : {
                    0 : "caab",
                    1 : "caab",
                    2 : "caab",
                    5 : "caaba"
                }
            };

            for (var initial in toTest) {
                if (toTest.hasOwnProperty(initial)) {
                    for (var size in toTest[initial]) {
                        if (toTest[initial].hasOwnProperty(size)) {
                            var expected = toTest[initial][size];
                            var got = aria.utils.String.crop(initial, size, "a", false);

                            this.assertEquals(got, expected, "Cropping " + initial + " size " + size
                                    + " got %1 expected %2");
                        }
                    }
                }
            }

        },

        /**
         * Test chunk method - chunk from begin
         */
        testChunkBegin : function () {
            var fromBegin = {
                "" : [[0, [""]], [1, [""]], [2, [""]], [[1, 2], [""]]],
                "a" : [[0, ["a"]], [1, ["a"]], [2, ["a"]], [[1, 2], ["a"]]],
                "ab" : [[0, ["ab"]], [1, ["a", "b"]], [2, ["ab"]], [[1, 2], ["a", "b"]]],
                "abc" : [[0, ["abc"]], [1, ["a", "b", "c"]], [2, ["ab", "c"]], [[1, 2], ["a", "bc"]]],
                "abcd" : [[0, ["abcd"]], [1, ["a", "b", "c", "d"]], [2, ["ab", "cd"]], [[1, 2], ["a", "bc", "d"]]],
                "abcdefg" : [[0, ["abcdefg"]], [1, ["a", "b", "c", "d", "e", "f", "g"]], [2, ["ab", "cd", "ef", "g"]],
                        [[1, 2], ["a", "bc", "defg"]]],
                "1234" : [[1, ["1", "2", "3", "4"]], [3, ["123", "4"]], [[2, 3], ["12", "34"]]]
            };

            for (var testing in fromBegin) {
                if (fromBegin.hasOwnProperty(testing)) {
                    for (var i = 0, len = fromBegin[testing].length; i < len; i += 1) {
                        var size = fromBegin[testing][i][0];
                        var expected = aria.utils.Json.convertToJsonString(fromBegin[testing][i][1]);

                        var got = aria.utils.Json.convertToJsonString(aria.utils.String.chunk(testing, size, true));

                        this.assertEquals(expected, got, "Testing -" + testing + "- size " + size
                                + " expected %1 got %2");
                    }
                }
            }
        },

        /**
         * Test chunk method - chunk from end
         */
        testChunkEnd : function () {
            var fromEnd = {
                "" : [[0, [""]], [1, [""]], [2, [""]], [[1, 2], [""]]],
                "a" : [[0, ["a"]], [1, ["a"]], [2, ["a"]], [[1, 2], ["a"]]],
                "ab" : [[0, ["ab"]], [1, ["a", "b"]], [2, ["ab"]], [[1, 2], ["a", "b"]]],
                "abc" : [[0, ["abc"]], [1, ["a", "b", "c"]], [2, ["a", "bc"]], [[1, 2], ["ab", "c"]]],
                "abcd" : [[0, ["abcd"]], [1, ["a", "b", "c", "d"]], [2, ["ab", "cd"]], [[1, 2], ["a", "bc", "d"]]],
                "abcdefg" : [[0, ["abcdefg"]], [1, ["a", "b", "c", "d", "e", "f", "g"]], [2, ["a", "bc", "de", "fg"]],
                        [[1, 2], ["abcd", "ef", "g"]]],
                "1234" : [[1, ["1", "2", "3", "4"]], [3, ["1", "234"]], [[2, 3], ["12", "34"]]]
            };

            for (var testing in fromEnd) {
                if (fromEnd.hasOwnProperty(testing)) {
                    for (var i = 0, len = fromEnd[testing].length; i < len; i += 1) {
                        var size = fromEnd[testing][i][0];
                        var expected = aria.utils.Json.convertToJsonString(fromEnd[testing][i][1]);

                        var got = aria.utils.Json.convertToJsonString(aria.utils.String.chunk(testing, size, false));

                        this.assertEquals(expected, got, "Testing -" + testing + "- size " + size
                                + " expected %1 got %2");
                    }
                }
            }
        },

        /**
         * Call chunk with the wrong parameters
         */
        testWrongChunk : function () {
            var got = aria.utils.String.chunk(12, 2);
            this.assertEquals(got, null, "Cannot chunk numbers");

            got = aria.utils.String.chunk(null, 3);
            this.assertEquals(got, null, "Cannot chunk null");
        },

        /**
         * Substitue a string using a string
         */
        testSubstituteString : function () {
            var holders = {
                "% 1" : "% 1",
                "%1" : "thisString",
                "%1aaa" : "thisStringaaa",
                "a%1aa" : "athisStringaa",
                "aaa%1" : "aaathisString",
                "%1111" : "thisString1111"
            }, got;

            var epxected = [];
            for (var key in holders) {
                if (holders.hasOwnProperty(key)) {
                    got = aria.utils.String.substitute(holders[key], "thisString");

                    this.assertEquals(got, holders[key], "Expecting %2, got %1");
                }
            }
        },

        /**
         * Substitue a string using an array, only one position in the holder
         */
        testSubstituteArrayOfOne : function () {
            var holders = {
                "% 1" : "% 1",
                "%1" : "thisString",
                "%1aaa" : "thisStringaaa",
                "a%1aa" : "athisStringaa",
                "aaa%1" : "aaathisString",
                "%1111" : "thisString1111"
            }, got;

            var epxected = [];
            for (var key in holders) {
                if (holders.hasOwnProperty(key)) {
                    got = aria.utils.String.substitute(holders[key], ["thisString", "another"]);

                    this.assertEquals(got, holders[key], "Expecting %2, got %1");
                }
            }
        },

        /**
         * Substitue a string using an array, multiple positions in the holder
         */
        testSubstituteMultiArray : function () {
            var holders = {
                "%1%2" : "onetwo",
                "%1aaa%2" : "oneaaatwo",
                "%1%2%3" : "onetwo%3",
                "%2%1" : "twoone",
                "%%12" : "%one2"
            }, got;

            var epxected = [];
            for (var key in holders) {
                if (holders.hasOwnProperty(key)) {
                    got = aria.utils.String.substitute(holders[key], ["one", "two"]);

                    this.assertEquals(got, holders[key], "Expecting %2, got %1");
                }
            }
        },

        testCamelToDashed : function () {
            var cc2d = aria.utils.String.camelToDashed;

            // standard
            this.assertEquals(cc2d("fooBarBaz"), "foo-bar-baz");
            // trailing uppercase
            this.assertEquals(cc2d("fooBarBazN"), "foo-bar-baz-n");
            // leading uppercase
            this.assertEquals(cc2d("FooBaz"), "foo-baz");
            // consecutive uppercase
            this.assertEquals(cc2d("fooABarACBaz"), "foo-a-bar-a-c-baz");
            // all in one
            this.assertEquals(cc2d("ABC"), "a-b-c");
        },

        testDashedToCamel : function () {
            var d2cc = aria.utils.String.dashedToCamel;

            this.assertEquals(d2cc("foo-bar-baz"), "fooBarBaz");
            this.assertEquals(d2cc("foo-bar-baz-n"), "fooBarBazN");
            this.assertEquals(d2cc("foo-a-bar-a-c-baz"), "fooABarACBaz");
            this.assertEquals(d2cc("a-b-c"), "aBC");
        }
    }
});
