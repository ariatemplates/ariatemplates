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
 * Test for the CSS Manager
 */
Aria.classDefinition({
	$classpath : "test.aria.templates.CSSMgrTest",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["aria.templates.CSSMgr", "aria.utils.Type", "aria.utils.Json", "aria.utils.Dom"],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		__helperGetCSSText : function (elm) {
			// Remove also ";" because some browsers (IE9) might inject them
			return (elm.innerHTML || elm.styleSheet.cssText || "").replace(/[\s\r\t;]/g, "").toLowerCase();
		},

		/**
		 * Test the behavior of the sorting algorithm
		 */
		testSorting : function () {
			// It should deal with contextes, just create a fake class for sorting
			var fake = {
				// classpaths loaded
				__pathsLoaded : ["a", "b", "c", "d", "e"],
				__textLoaded : {
					a : {},
					b : {},
					c : {},
					d : {},
					e : {}
				},
				// corresponding prefixes
				__prefixes : {
					a : "CSS1",
					b : "CSS10",
					c : "CSS2",
					d : "CSS100",
					e : "CSS20"
				},
				// prefix
				__PREFIX : "CSS",
				__sortPaths : aria.templates.CSSMgr.__sortPaths
			};

			var sorted = fake.__sortPaths();
			var expected = ["a", "c", "b", "e", "d"];

			this.assertTrue(aria.utils.Json.equals(sorted, expected));

			// Try again with an empty object
			fake.__pathsLoaded = [];
			fake.__textLoaded = {};
			sorted = fake.__sortPaths();
			this.assertTrue(sorted.length === 0);
		},

		testSortingDuplicates : function () {
			// It should deal with contextes, just create a fake class for sorting
			var fake = {
				// classpaths loaded
				__pathsLoaded : ["a", "b", "a", "b", "a", "b", "c"],
				__textLoaded : {
					a : {},
					b : {},
					c : {}
				},
				// corresponding prefixes
				__prefixes : {
					c : "CSS27",
					b : "CSS0"
				},
				// prefix
				__PREFIX : "CSS",
				__sortPaths : aria.templates.CSSMgr.__sortPaths
			};

			var sorted = fake.__sortPaths();
			var expected = ["b", "c", "a"];

			this.assertTrue(aria.utils.Json.equals(sorted, expected));
		},

		/**
		 * Test if the style tags are correctly added to the page. The input is a style builder
		 */
		testReloadStyleTags : function () {
			/* Try with an empty object */
			var builder = {};

			var _tagPoolCopy = aria.utils.Json.copy(aria.templates.CSSMgr.__styleTagPool);
			aria.templates.CSSMgr.__reloadStyleTags(builder);

			// Check that the pool didn't change
			this.assertTrue(aria.utils.Json.equals(aria.templates.CSSMgr.__styleTagPool, _tagPoolCopy)
			);

			/* Try with a real object */
			builder = {
				"one" : [".class {", "color :", "red }"]
			};

			aria.templates.CSSMgr.__reloadStyleTags(builder);

			// Check that the element is correctly added to the page
			var tag = aria.utils.Dom.getElementById(aria.templates.CSSMgr.__TAG_PREFX + "one");

			this.assertTrue(aria.utils.Type.isHTMLElement(tag));
			this.assertTrue(aria.templates.CSSMgr.__styleTagPool.one === tag);
			this.assertEquals(this.__helperGetCSSText(tag), ".class{color:red}");

			tag.parentNode.removeChild(tag);
			aria.templates.CSSMgr.__styleTagPool = {};

			/* Try with a bigger object */
			builder = {
				"one" : [".class {", "color :", "red }"],
				"two" : [".class {", "color :", "green }"],
				"three" : [".class {", "color :", "blue }"]
			};

			aria.templates.CSSMgr.__reloadStyleTags(builder);

			// Check that the element is correctly added to the page
			tag = aria.utils.Dom.getElementById(aria.templates.CSSMgr.__TAG_PREFX + "one");

			this.assertTrue(aria.utils.Type.isHTMLElement(tag));
			this.assertTrue(aria.templates.CSSMgr.__styleTagPool.one === tag);
			this.assertEquals(this.__helperGetCSSText(tag), ".class{color:red}");

			tag.parentNode.removeChild(tag);

			tag = aria.utils.Dom.getElementById(aria.templates.CSSMgr.__TAG_PREFX + "two");

			this.assertTrue(aria.utils.Type.isHTMLElement(tag));
			this.assertTrue(aria.templates.CSSMgr.__styleTagPool.two === tag);
			this.assertEquals(this.__helperGetCSSText(tag), ".class{color:green}");

			tag.parentNode.removeChild(tag);

			tag = aria.utils.Dom.getElementById(aria.templates.CSSMgr.__TAG_PREFX + "three");

			this.assertTrue(aria.utils.Type.isHTMLElement(tag));
			this.assertTrue(aria.templates.CSSMgr.__styleTagPool.three === tag);
			this.assertEquals(this.__helperGetCSSText(tag), ".class{color:blue}");

			tag.parentNode.removeChild(tag);

			aria.templates.CSSMgr.__styleTagPool = {};
		},

		/**
		 * Test the function textToDom, it's the one that generates the style builder. Requires some tricks
		 */
		testTextToDom : function () {
			// It should deal with contextes, just create a fake class
			var fake = {
				// classpaths loaded
				__pathsLoaded : ["a", "b", "c", "d", "e"],
				// corresponding prefixes
				__prefixes : {
					a : "CSS1",
					b : "CSS10",
					c : "CSS2",
					d : "CSS100",
					e : "CSS20"
				},
				__PREFIX : "CSS",
				__sortPaths : aria.templates.CSSMgr.__sortPaths,
				__textLoaded : {
					a : {
						text : "text a",
						lines : 10
					},
					b : {
						text : "text b",
						lines : 5
					},
					c : {
						text : "text c",
						lines : 1
					},
					d : {
						text : "text d",
						lines : 15
					},
					e : {
						text : "text e",
						lines : 4
					}
				},
				__styleTagAssociation : {
					a : "tpl",
					b : "wgt",
					c : "pool1",
					d : "wgt",
					e : "tpl"
				},
				__reloadStyleTags : function (arg) {
					return arg;
				},
				__isWidgetTemplate : function () {
					return true;
				},
				__textToDOM : aria.templates.CSSMgr.__textToDOM
			};

			/* See what happens when there's nothing to change */
			var changes = [];
			var builder = fake.__textToDOM(changes);
			var expected = {};

			this.assertTrue(aria.utils.Json.equals(builder, expected));

			/* See what happens when there is only one change */
			var changes = ["pool1"];
			var builder = fake.__textToDOM(changes);
			var expected = {
				pool1 : ["/**", "c", "**/", "text c"]
			};

			this.assertTrue(aria.utils.Json.equals(builder, expected));

			/* See what happens when there is only one change but with two associations */
			var changes = ["tpl"];
			var builder = fake.__textToDOM(changes);
			var expected = {
				tpl : ["/**", "a", "**/", "text a", "/**", "e", "**/", "text e"]
			};

			this.assertTrue(aria.utils.Json.equals(builder, expected));

			/* See what happens when there are multiple changes */
			var changes = ["pool1", "wgt"];
			var builder = fake.__textToDOM(changes);
			var expected = {
				wgt : ["/**", "b", "**/", "text b", "/**", "d", "**/", "text d"],
				pool1 : ["/**", "c", "**/", "text c"]
			};

			this.assertTrue(aria.utils.Json.equals(builder, expected));
		},

		/**
		 * Test the function textToDom, it's the one that generates the style builder. Requires some tricks
		 */
		testTextToDomWhileStopped : function () {
			// It should deal with contextes, just create a fake class
			var fake = {
				// classpaths loaded
				__pathsLoaded : ["a", "b", "c", "d", "e"],
				// corresponding prefixes
				__prefixes : {
					a : "CSS1",
					b : "CSS10",
					c : "CSS2",
					d : "CSS100",
					e : "CSS20"
				},
				__PREFIX : "CSS",
				__sortPaths : aria.templates.CSSMgr.__sortPaths,
				__textLoaded : {
					a : {
						text : "text a",
						lines : 10
					},
					b : {
						text : "text b",
						lines : 5
					},
					c : {
						text : "text c",
						lines : 1
					},
					d : {
						text : "text d",
						lines : 15
					},
					e : {
						text : "text e",
						lines : 4
					}
				},
				__styleTagAssociation : {
					a : "tpl",
					b : "wgt",
					c : "pool1",
					d : "wgt",
					e : "tpl"
				},
				__reloadStyleTags : function (arg) {
					return arg;
				},
				__isWidgetTemplate : function () {
					return true;
				},
				__textToDOM : aria.templates.CSSMgr.__textToDOM,
				stop : aria.templates.CSSMgr.stop,
				resume : aria.templates.CSSMgr.resume,
				__queuedChanges : []
			};

			fake.stop();

			// Load a template
			var changes = ["tpl"];
			var builder = fake.__textToDOM(changes);
			this.assertFalse(!!builder);
			this.assertTrue(this._verifyContainsOnly(fake.__queuedChanges, ["tpl"]));

			// Load another template
			var changes = ["tpl"];
			var builder = fake.__textToDOM(changes);
			this.assertFalse(!!builder);
			this.assertTrue(this._verifyContainsOnly(fake.__queuedChanges, ["tpl"]));

			// Load a widget
			var changes = ["wgt", "wgt", "wgt"];
			var builder = fake.__textToDOM(changes);
			this.assertFalse(!!builder);
			this.assertTrue(this._verifyContainsOnly(fake.__queuedChanges, ["tpl", "wgt"]));

			// And resume the CSS Manager
			var builder = fake.resume();
			var expected = {
				wgt : ["/**", "b", "**/", "text b", "/**", "d", "**/", "text d"],
				tpl : ["/**", "a", "**/", "text a", "/**", "e", "**/", "text e"]
			};

			this.assertTrue(aria.utils.Json.equals(builder, expected));
		},

		_verifyContainsOnly : function (original, accepted) {
			var arrayUtils = aria.utils.Array;

			for (var i = 0, len = original.length; i < len; i += 1) {
				if (!arrayUtils.contains(accepted, original[i])) {
					return false;
				}
			}

			return true;
		}
	}
})
