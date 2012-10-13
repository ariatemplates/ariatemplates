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
	$classpath : 'test.aria.templates.SectionTest',
	$extends : 'aria.jsunit.TestCase',
	$dependencies : ['aria.templates.Section', 'aria.templates.MarkupWriter'],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
	},
	$prototype : {
		tplCtxt : {
			$getId : function () {}
		},
		/**
		 * _getId is used as the getId method of the mock of behaviors created through newBehavior
		 * @private
		 */
		_behaviorGetId : function () {
			return this._id;
		},
		/**
		 * __behaviorDispose is used as the $dispose method of the mock of behaviors created through newBehavior
		 * @private
		 */
		_behaviorDispose : function () {
			this._disposed++;
		},
		newBehavior : function (id) {
			return {
				_id : id,
				_disposed : 0,
				getId : this._behaviorGetId,
				$dispose : this._behaviorDispose
			}
		},
		/**
		 * Check the basic procedure: create a section, add a subsection, add a behavior to the subsection, check that
		 * the behavior is accessible by its id from the parent section. Add the parent section to a root section and
		 * check the id is available from the root. Then, remove the parent section and check the id is no longer
		 * available.
		 */
		testBehaviorIds : function () {
			var Section = aria.templates.Section;
			var parentSection = new Section(this.tplCtxt, {
				id : "parentSection"
			});
			var childSection = new Section(this.tplCtxt, {
				id : "childSection"
			});
			var sampleBehavior = this.newBehavior("myId");
			parentSection.addSubSection(childSection);
			childSection.addBehavior(sampleBehavior);
			var rootSection = new Section(this.tplCtxt, {
				id : "rootSection"
			});
			rootSection.addSubSection(parentSection);
			// behavior ids can be retrieved only when the section belongs to a template root section
			var templateRootSection = new Section(this.tplCtxt, null, {
				isRoot : true,
				ownIdMap : true
			});
			templateRootSection.addSubSection(rootSection);
			this.assertTrue(parentSection.getBehaviorById("myId") == sampleBehavior);
			this.assertTrue(rootSection.getBehaviorById("myId") == sampleBehavior);
			parentSection.$dispose();
			this.assertTrue(sampleBehavior._disposed == 1);
			this.assertTrue(rootSection.getBehaviorById("myId") == null);
			rootSection.$dispose();
			templateRootSection.$dispose();
		},

		testProcessingBinding : function () {
			var section = new aria.templates.Section(this.tplCtxt, {
				id : "parentSection"
			});

			var result = section.__isValidProcessingBind();
			this.assertFalse(result);

			result = section.__isValidProcessingBind({});
			this.assertFalse(result);
			this.assertErrorInLogs(section.MISSING_TO_BINDING);

			result = section.__isValidProcessingBind({
				inside : {}
			});
			this.assertFalse(result);
			this.assertErrorInLogs(section.MISSING_TO_BINDING);

			result = section.__isValidProcessingBind({
				inside : {},
				to : "something"
			});
			this.assertTrue(result);

			result = section.__isValidProcessingBind({
				inside : {
					"something" : {}
				},
				to : "something"
			});
			this.assertFalse(result);
			this.assertErrorInLogs(section.INVALID_TO_BINDING);

			result = section.__isValidProcessingBind({
				inside : {
					"something" : 0
				},
				to : "something"
			});
			this.assertFalse(result);
			this.assertErrorInLogs(section.INVALID_TO_BINDING);

			result = section.__isValidProcessingBind({
				inside : {
					"something" : false
				},
				to : "something"
			});
			this.assertTrue(result);

			result = section.__isValidProcessingBind({
				inside : {
					"something" : true
				},
				to : "something"
			});
			this.assertTrue(result);
			section.$dispose();
		},

		/**
		 * This method tests the new "attributes" property of the Section class and checks if it only accepts the
		 * whitelisted set of attributes as defined by the new config bean HtmlAttribute
		 */
		testSectionAttributes : function () {

			var elements = [{
						"input" : {
							"type" : "text",
							"readonly" : "true"
						}
					}, {
						"input" : {
							"type" : "button",
							"title" : "Hello world",
							"disabled" : "true"
						}
					}, {
						"div" : {
							"style" : "text",
							"title" : "Hello World",
							"classList" : ["class1", "class2", "class3"]
						}
					}, {
						"img" : {
							"border" : "text",
							"height" : "10",
							"width" : "10"
						}
					}, {
						"input" : {
							"type" : "text",
							"readonly" : "true",
							"length" : "10"
						}
					}];

			var htmlElements = ['input type="text" readonly="true"',
					'input type="button" title="Hello world" disabled="true"',
					'div style="text" title="Hello World" class="class1 class2 class3"',
					'img border="text" height="10" width="10"', 'input type="text" readonly="true" length="10"'];

			for (var i = 0; i < elements.length; i++) {
				var elem = elements[i];
				for (var key in elem) {
					var out = new aria.templates.MarkupWriter(this.tplCtxt);
					var section = new aria.templates.Section(this.tplCtxt, {
						id : "testSection",
						type : key,
						attributes : elem[key]
					});
					section.writeBegin(out);
					this.__assertSection(out, htmlElements[i]);
					section.$dispose();
					out.$dispose();
				}
			}
		},

		/**
		 * asserts whether the section constructed contains the attributes provided and follows the correct HTML markup
		 * @private
		 */
		__assertSection : function (out, element) {
			var htmlStr = out._out.join("");

			if (element.indexOf("length") == -1) {
				this.assertTrue(htmlStr.indexOf(element) != -1, "Assert failed for " + htmlStr);
			} else {
				this.assertErrorInLogs(aria.templates.Section.INVALID_CONFIGURATION);
			}
			return;
		}
	}
});