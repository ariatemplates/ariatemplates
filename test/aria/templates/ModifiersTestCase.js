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
    $classpath : "test.aria.templates.ModifiersTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.Modifiers", "aria.utils.String", "aria.utils.Type"],
    $prototype : {
        /**
         * Call modifiers that don't exists, this should log an error
         */
        testError : function () {
            aria.templates.Modifiers.callModifier("");
            this.assertErrorInLogs(aria.templates.Modifiers.UNKNOWN_MODIFIER);
            aria.templates.Modifiers.callModifier(12);
            this.assertErrorInLogs(aria.templates.Modifiers.UNKNOWN_MODIFIER);
            aria.templates.Modifiers.callModifier();
            this.assertErrorInLogs(aria.templates.Modifiers.UNKNOWN_MODIFIER);
        },

        /**
         * Tests the "escapeforhtml" modifier.
         */
        testEscapeForHTML : function () {
            // Identity tests --------------------------------------------------

            // Checks that the input is left completely unaltered

            var identity;
            var output;

            // ------------------------------------------------------------ null

            identity = null;

            this.assertEquals(aria.templates.Modifiers.callModifier("escapeforhtml", [identity]), identity, "A null input should result in a null output.");

            // ------------------------------------------------------- undefined

            identity = undefined;

            this.assertEquals(aria.templates.Modifiers.callModifier("escapeforhtml", [identity]), identity, "An undefined input should result in an undefined output.");


            // Actual escaping data --------------------------------------------

            // ----------------------------------------------------------- input

            var originalString = "<div id='id' class=\"class\">/</div>";

            // ------------------------------------------------- expected output

            // The following should be computed directly with the proper utility function if the latter is fully tested
            // and working
            // Indeed, having the same results with this modifier as with the utility function is a sort of requirement

            var escapedForAttrString = "<div id=&#x27;id&#x27; class=&quot;class&quot;>/</div>";
            var escapedForHTMLString = "&lt;div id='id' class=\"class\"&gt;&#x2F;&lt;&#x2F;div&gt;";

            var escapedForAllString = "&lt;div id=&#x27;id&#x27; class=&quot;class&quot;&gt;&#x2F;&lt;&#x2F;div&gt;";



            // Actual escaping tests -------------------------------------------

            var self = this;
            function test(spec) {
                var arg = spec.arg;
                var expected = spec.expected;
                var message = spec.message;

                var output = aria.templates.Modifiers.callModifier("escapeforhtml", [originalString, arg]);

                self.assertEquals(output, expected, message);

            }

            var testSpec = {};

            // -------------------------------------------------- escape for all

            testSpec = {
                expected: escapedForAllString,
                message: "The string should be escaped for all contexts."
            };

            test(testSpec);

            testSpec.arg = true;
            test(testSpec);

            testSpec.arg = {
                text : true,
                attr : true
            };
            test(testSpec);

            // ---------------------------------------------- escape for nothing

            testSpec = {
                expected: originalString,
                message: "The string should not be escaped at all"
            };

            testSpec.arg = false;
            test(testSpec);

            testSpec.arg = {
                text : false,
                attr : false
            };
            test(testSpec);

            // ------------------------------------ escape for text OR attribute

            test({
                arg: {
                    text : false,
                    attr : true
                },
                expected: escapedForAttrString,
                message: "The string should be escaped for an attribute context."
            });

            test({
                arg: {
                    text : true,
                    attr : false
                },
                expected: escapedForHTMLString,
                message: "The string should be escaped for a text context."
            });
        },

        // ---------------------------------------------------------------------

        testPad : function () {
            var callModifier = aria.templates.Modifiers.callModifier;

            // basic functionality
            this.assertEquals(callModifier("pad", ["a", 3]), "a&nbsp;&nbsp;");
            this.assertEquals(callModifier("pad", ["a", 3, false]), "a&nbsp;&nbsp;");
            this.assertEquals(callModifier("pad", ["a", 3, true]), "&nbsp;&nbsp;a");
            this.assertEquals(callModifier("pad", ["abc", 3, true]), "abc");

            // does nothing when the input is too long
            this.assertEquals(callModifier("pad", ["abcdef", 3, true]), "abcdef");

            // does nothing when the length is negative
            this.assertEquals(callModifier("pad", ["abcdef", -2]), "abcdef");

            // test alternative padding string
            this.assertEquals(callModifier("pad", ["a", 2, false, ' ']), "a ");
            this.assertEquals(callModifier("pad", ["7", 3, true, '0']), "007");

            // when the padding string is empty, default to '&nbsp;' also
            this.assertEquals(callModifier("pad", ["foo", 6, true, '']), "&nbsp;&nbsp;&nbsp;foo");

            // when the padding string param is longer than one character, it should be used in its entirety
            // the main use case is to be able to pass HTML entites
            this.assertEquals(callModifier("pad", ["foo", 5, false, '&mdash;']), "foo&mdash;&mdash;");
            // the following is not of a much use probably, but let's not overengineer this function too much
            this.assertEquals(callModifier("pad", ["foo", 5, false, 'abc']), "fooabcabc");
        },

        /**
         * Unit test the highlight modifiers. Highlight puts &lt;strong&gt; tags around the initial part of the words
         */
        testHighlight : function () {
            var testThese = [
                    // One word str, one word highlight
                    ["abcd", "def"],
                    ["abcd", "ab"],
                    ["abcd", "abcd"],
                    ["abcd", "abcdef"],
                    // One word str, more highlight
                    ["abcd", "def ghjk"],
                    ["abcd", "def ab"],
                    ["abcd", "def ab abc"],
                    ["abcd", "abcdef a"],
                    // More words str, one highlight
                    ["abcd xyz", "ax"], ["abcd xyz", "ab"], ["abcd xyz", "xy"],
                    ["abcd asd", "a"],
                    ["abcd xyz asd", "a"],
                    ["abcd xyz abcd", "abc"],
                    // More words str, more highlight
                    ["abcd xyz", "ax def"], ["abcd xyz", "ab ab"], ["abcd xyz", "ab xy"],
                    ["abcd xyz asd", "a abc"],
                    ["abcd xyz abcd", "qwe a x"],
                    // Mixed case
                    ["aBcD", "abcd"], ["aBcD", "AbCd"],
                    ["ABCD", "abcd"],
                    // Extra spaces
                    ["abcd   jklm", "fcv"], ["abcd   jklm", "ab"], ["abcd   jklm", "   jk"],
                    ["    abcd   jklm", "   abc   "],
                    // Longest running highlight
                    ["abcdefghj", "a ab abcde"], ["abcdefghj", "abcde a ab"], ["abcdefghj", "ab abcde a"],
                    // String with special characters
                    ["abcd (123)", "123"], ["abcd +123", "123"], ["abcd .123", "123"],
                    // Selection in the middle
                    ["abcd", "bc"], ["ab.cd", "cd"], ["abcd.efg", "  efg "], ["abcd@efg", "d@ef"],
                    // Dangerous expression
                    ["abcd.efg", ".efg"], ["abcd[efg]", "[efg]"], ["abcdefg", ".efg"], ["abcd@efg", "@ef"],
                    ["abcd (1-123)", "(1-"], ["abcd (1-123)", "(1-123)"]];

            var expected = [
                    // One word str, one word highlight
                    "abcd",
                    "<strong>ab</strong>cd",
                    "<strong>abcd</strong>",
                    "abcd",
                    // One word str, more highlight
                    "abcd",
                    "<strong>ab</strong>cd",
                    "<strong>abc</strong>d",
                    "<strong>a</strong>bcd",
                    // More words str, one highlight
                    "abcd xyz",
                    "<strong>ab</strong>cd xyz",
                    "abcd <strong>xy</strong>z",
                    "<strong>a</strong>bcd <strong>a</strong>sd",
                    "<strong>a</strong>bcd xyz <strong>a</strong>sd",
                    "<strong>abc</strong>d xyz <strong>abc</strong>d",
                    // More words str, more highlight
                    "abcd xyz", "<strong>ab</strong>cd xyz",
                    "<strong>ab</strong>cd <strong>xy</strong>z",
                    "<strong>abc</strong>d xyz <strong>a</strong>sd",
                    "<strong>a</strong>bcd <strong>x</strong>yz <strong>a</strong>bcd",
                    // Mixed case
                    "<strong>aBcD</strong>", "<strong>aBcD</strong>",
                    "<strong>ABCD</strong>",
                    // Extra spaces
                    "abcd   jklm", "<strong>ab</strong>cd   jklm", "abcd   <strong>jk</strong>lm",
                    "    <strong>abc</strong>d   jklm",
                    // Longest running highlight
                    "<strong>abcde</strong>fghj", "<strong>abcde</strong>fghj", "<strong>abcde</strong>fghj",
                    // String with special characters
                    "abcd (<strong>123</strong>)", "abcd +<strong>123</strong>", "abcd .<strong>123</strong>",
                    // Selection in the middle
                    "abcd", "ab.<strong>cd</strong>", "abcd.<strong>efg</strong>", "abcd@efg",
                    // Dangerous expression
                    "abcd<strong>.efg</strong>", "abcd<strong>[efg]</strong>", "abcdefg", "abcd<strong>@ef</strong>g",
                    "abcd <strong>(1-</strong>123)", "abcd <strong>(1-123)</strong>"];

            // If an assert fails, please note that assert are counted from 1, this cycle from 0
            // so assert #13 fails -> i = 12
            for (var i = 0, len = testThese.length; i < len; i += 1) {
                var got = aria.templates.Modifiers.callModifier("highlight", testThese[i]);
                this.assertEquals(got, expected[i], "Expecting " + expected[i] + " got " + got);
            }
        },

        testHighlightFromNewWord : function () {
            var testThese = [
                    // basic: finds highlights on word boundaries
                    ["abc def ghi", "abc d"], ["abc def ghi", "def g"], ["abc def ghi", "ghi"],
                    // highlights only the first substring (sliding-window) and no more
                    ["abc abd", "ab"], ["abc abd abc", "abd a"],
                    // doesn't find higlights in the middle of the word
                    ["abc defgh ikj", "efg"],
                    // test multiple whitespace
                    ["abc    defgh", "def"],
                    // test tabulations
                    ["abc				defgh", "def"],
                    // test empty word,
                    ["", "aaa"],
                    // test empty highlight
                    ["abc", ""],
                    // test whitespace-only word
                    ["    ", "aaa"],
                    // test whitespace-only highlight
                    ["abc", "   "],
                    // leading space
                    [" abc def", "ab"],
                    // Mixed case
                    ["aBcDe", "abcd"], ["aBcDe", "AbCd"], ["ABCDe", "abcd"],
                    // String with special characters
                    ["abcd (123)", "123"], ["abcd +123", "123"], ["abcd .123", "123"],
                    // regex special chars in highlight
                    ["x abc", "a.c"],
                    // Dangerous expression
                    ["abcd .efg", ".efg"], ["abcd [efg]", "[efg]"], ["abcd efg", ".efg"], ["abcd @efg", "@ef"],
                    ["abcd (1-123)", "(1-"], ["abcd (1-123)", "(1-123)"], ["abc-defgh", "abc-de"],
                    // HTML escaping:
                    ["R&D-AFW", "R&"],
                    ["<strong>expression</strong>", "<strong>"],
                    ["TEST R&D-AFW", "R&"],
                    ["test <strong>expression</strong>", "<strong>"]
                ];

            var expected = [
                    // basic: finds highlights on word boundaries
                    "<strong>abc d</strong>ef ghi",
                    "abc <strong>def g</strong>hi",
                    "abc def <strong>ghi</strong>",
                    // highlights only the first substring (sliding-window) and no more
                    "<strong>ab</strong>c abd",
                    "abc <strong>abd a</strong>bc",
                    // doesn't find higlights in the middle of the word
                    "abc defgh ikj",
                    // test multiple whitespace
                    "abc    <strong>def</strong>gh",
                    // test tabulations
                    "abc				<strong>def</strong>gh",
                    // test empty word,
                    "",
                    // test empty highlight
                    "abc",
                    // test whitespace-only word
                    "    ",
                    // test whitespace-only highlight
                    "abc",
                    // leading space
                    " <strong>ab</strong>c def",
                    // Mixed case
                    "<strong>aBcD</strong>e", "<strong>aBcD</strong>e",
                    "<strong>ABCD</strong>e",
                    // String with special characters
                    "abcd (123)",
                    "abcd +123",
                    "abcd .123",
                    // regex special chars in highlight
                    "x abc",
                    // Dangerous expression
                    "abcd <strong>.efg</strong>", "abcd <strong>[efg]</strong>", "abcd efg",
                    "abcd <strong>@ef</strong>g", "abcd <strong>(1-</strong>123)", "abcd <strong>(1-123)</strong>",
                    "<strong>abc-de</strong>fgh",
                    // HTML escaping:
                    "<strong>R&amp;</strong>D-AFW",
                    "<strong>&lt;strong&gt;</strong>expression&lt;&#x2F;strong&gt;",
                    "TEST <strong>R&amp;</strong>D-AFW",
                    "test <strong>&lt;strong&gt;</strong>expression&lt;&#x2F;strong&gt;"
                ];
            for (var i = 0, len = testThese.length; i < len; i += 1) {
                var got = aria.templates.Modifiers.callModifier("highlightfromnewword", testThese[i]);
                this.assertEquals(got, expected[i], "Expecting '" + expected[i] + "', got '" + got + "'");
            }
        },

        /**
         * Unit test the starthighlight modifier.
         */
        testStartHighlight : function () {
            var testThese = [
                    ["abc def ghi", "abc d"], ["abc def ghi", "def g"], ["abc def ghi", "ghi"],
                    ["abc abd", "ab"], ["abc abd abc", "abd a"],
                    ["abc defgh ikj", "efg"],
                    ["abc    defgh", "def"],
                    ["abc				defgh", "def"],
                    ["", "aaa"],
                    ["abc", ""],
                    ["    ", "aaa"],
                    ["abc", "   "],
                    [" abc def", "ab"],
                    ["aBcDe", "abcd"], ["aBcDe", "AbCd"], ["ABCDe", "abcd"],
                    ["abcd (123)", "123"], ["abcd +123", "123"], ["abcd .123", "123"],
                    ["x abc", "a.c"],
                    ["abcd .efg", ".efg"], ["abcd [efg]", "[efg]"], ["abcd efg", ".efg"], ["abcd @efg", "@ef"],
                    ["abcd (1-123)", "(1-"], ["abcd (1-123)", "(1-123)"], ["abc-defgh", "abc-de"],
                    ["R&D-AFW", "R&"],
                    ["<strong>expression</strong>", "<strong>"],
                    ["TEST R&D-AFW", "R&"],
                    ["test <strong>expression</strong>", "<strong>"]
                ];

            var expected = [
                    "<strong>abc d</strong>ef ghi",
                    "abc def ghi",
                    "abc def ghi",
                    "<strong>ab</strong>c abd",
                    "abc abd abc",
                    "abc defgh ikj",
                    "abc    defgh",
                    "abc				defgh",
                    "",
                    "abc",
                    "    ",
                    "abc",
                    " abc def",
                    "<strong>aBcD</strong>e", "<strong>aBcD</strong>e",
                    "<strong>ABCD</strong>e",
                    "abcd (123)",
                    "abcd +123",
                    "abcd .123",
                    "x abc",
                    "abcd .efg", "abcd [efg]", "abcd efg",
                    "abcd @efg", "abcd (1-123)", "abcd (1-123)",
                    "<strong>abc-de</strong>fgh",
                    // HTML escaping:
                    "<strong>R&amp;</strong>D-AFW",
                    "<strong>&lt;strong&gt;</strong>expression&lt;&#x2F;strong&gt;",
                    "TEST R&amp;D-AFW",
                    "test &lt;strong&gt;expression&lt;&#x2F;strong&gt;"
                ];
            for (var i = 0, len = testThese.length; i < len; i += 1) {
                var got = aria.templates.Modifiers.callModifier("starthighlight", testThese[i]);
                this.assertEquals(got, expected[i], "Expecting '" + expected[i] + "', got '" + got + "'");
            }
        }
    }
});
