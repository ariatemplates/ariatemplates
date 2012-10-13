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
	$classpath : "test.aria.templates.ModifiersTest",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["aria.templates.Modifiers", "aria.utils.String", "aria.utils.Type"],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
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
		 * Unit test the highlight modifiers.
		 * Highlight puts &lt;strong&gt; tags around the initial part of the words
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
				["abcd xyz", "ax"],
				["abcd xyz", "ab"],
				["abcd xyz", "xy"],
				["abcd asd", "a"],
				["abcd xyz asd", "a"],
				["abcd xyz abcd", "abc"],
				// More words str, more highlight
				["abcd xyz", "ax def"],
				["abcd xyz", "ab ab"],
				["abcd xyz", "ab xy"],
				["abcd xyz asd", "a abc"],
				["abcd xyz abcd", "qwe a x"],
				// Mixed case
				["aBcD", "abcd"],
				["aBcD", "AbCd"],
				["ABCD", "abcd"],
				// Extra spaces
				["abcd   jklm", "fcv"],
				["abcd   jklm", "ab"],
				["abcd   jklm", "   jk"],
				["    abcd   jklm", "   abc   "],
				// Longest running highlight
				["abcdefghj", "a ab abcde"],
				["abcdefghj", "abcde a ab"],
				["abcdefghj", "ab abcde a"],
				// String with special characters
				["abcd (123)","123"],
				["abcd +123","123"],
				["abcd .123","123"],
				// Selection in the middle
				["abcd", "bc"],
				["ab.cd", "cd"],
				["abcd.efg", "  efg "],
				["abcd@efg", "d@ef"],
				// Dangerous expression
				["abcd.efg", ".efg"],
				["abcd[efg]", "[efg]"],
				["abcdefg", ".efg"],
				["abcd@efg", "@ef"],
				["abcd (1-123)", "(1-"],
				["abcd (1-123)", "(1-123)"]
			];

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
				"abcd xyz",
				"<strong>ab</strong>cd xyz",
				"<strong>ab</strong>cd <strong>xy</strong>z",
				"<strong>abc</strong>d xyz <strong>a</strong>sd",
				"<strong>a</strong>bcd <strong>x</strong>yz <strong>a</strong>bcd",
				// Mixed case
				"<strong>aBcD</strong>",
				"<strong>aBcD</strong>",
				"<strong>ABCD</strong>",
				// Extra spaces
				"abcd   jklm",
				"<strong>ab</strong>cd   jklm",
				"abcd   <strong>jk</strong>lm",
				"    <strong>abc</strong>d   jklm",
				// Longest running highlight
				"<strong>abcde</strong>fghj",
				"<strong>abcde</strong>fghj",
				"<strong>abcde</strong>fghj",
				// String with special characters
				"abcd (<strong>123</strong>)",
				"abcd +<strong>123</strong>",
				"abcd .<strong>123</strong>",
				// Selection in the middle
				"abcd",
				"ab.<strong>cd</strong>",
				"abcd.<strong>efg</strong>",
				"abcd@efg",
				// Dangerous expression
				"abcd<strong>.efg</strong>",
				"abcd<strong>[efg]</strong>",
				"abcdefg",
				"abcd<strong>@ef</strong>g",
				"abcd <strong>(1-</strong>123)",
				"abcd <strong>(1-123)</strong>"
			];

			// If an assert fails, please note that assert are counted from 1, this cycle from 0
			// so assert #13 fails -> i = 12
			for (var i = 0, len = testThese.length; i < len; i += 1) {
				var got = aria.templates.Modifiers.callModifier("highlight", testThese[i]);
				this.assertEquals(got, expected[i], "Expecting " + expected[i] + " got " + got);
			}
		}
	}
});