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
 * DomeElementWrapper test class
 */
Aria.classDefinition({
	$classpath : "test.aria.templates.DomElementWrapper",
	$extends : "aria.jsunit.TestCase",
	$dependencies : ["aria.templates.DomElementWrapper"],
	$constructor : function () {
		this.$TestCase.constructor.call(this);
		var document = Aria.$window.document;
		/**
		 * Playground
		 * @type HTMLElement
		 */
		this.container = document.createElement("div");
		document.body.appendChild(this.container);

	},
	$destructor : function () {
		var document = Aria.$window.document;
		document.body.removeChild(this.container);
		this.container = null;
		this.$TestCase.$destructor.call(this);
	},
	$prototype : {

		/**
		 * Test the getParentWithName method of a DomElementWrapper
		 */
		testGetParentWithName : function () {
			var document = Aria.$window.document;
			this.container.innerHTML = "<div id='parent_testGetParentWithName' class='troLaClass'><p>"
					+ "<div id='child_testGetParentWithName'>The Cake is a Lie. Really.</div></p><div>";
			var child = document.getElementById('child_testGetParentWithName');
			var wrapper = new aria.templates.DomElementWrapper(child);
			var parent = wrapper.getParentWithName("div");
			this.assertTrue(parent.getClassName() == 'troLaClass', "Parent was not retrieved.");
			parent.$dispose();
			wrapper.$dispose();
		},

		/**
		 * Test the getProperty method of a DomElementWrapper
		 */
		testGetProperty : function () {
			var document = Aria.$window.document;
			var element = document.createElement("a");
			document.body.appendChild(element);
			var wrapper = new aria.templates.DomElementWrapper(element);

			// try to get the id property
			element.id = "myTestId"
			this.assertTrue(wrapper.getProperty("id") == "myTestId");
			this.assertLogsEmpty();

			// try to get the parentNode property
			this.assertTrue(wrapper.getProperty("parentNode") == null);
			this.assertErrorInLogs(aria.templates.DomElementWrapper.READ_ACCESS_DENIED);
			this.assertLogsEmpty();

			wrapper.$dispose();
			element.parentNode.removeChild(element);
		},

		/**
		 * Test the setProperty method of a DomElementWrapper
		 */
		testSetProperty : function () {
			var document = Aria.$window.document;
			var element = document.createElement("a");
			document.body.appendChild(element);
			var wrapper = new aria.templates.DomElementWrapper(element);

			// try to set the innerHTML property
			var previousInnerHTML = element.innerHTML;
			wrapper.setProperty("innerHTML", "hello");
			this.assertErrorInLogs(aria.templates.DomElementWrapper.WRITE_ACCESS_DENIED);
			this.assertLogsEmpty();
			// check that innerHTML did not change on the object:
			this.assertTrue(element.innerHTML == previousInnerHTML);

			// try to set the href property
			this.assertFalse(/#hello/.test(element.href));
			wrapper.setProperty("href", "#hello");
			this.assertLogsEmpty();
			this.assertTrue(/#hello/.test(element.href));

			// try to set the src property
			var previousSrc = element.src;
			wrapper.setProperty("src", "hello");
			this.assertErrorInLogs(aria.templates.DomElementWrapper.WRITE_ACCESS_DENIED);
			this.assertLogsEmpty();
			this.assertTrue(element.src == previousSrc);

			wrapper.$dispose();
			element.parentNode.removeChild(element);
		},

		/**
		 * Test the getParentWithData method of a DomElementWrapper
		 */
		testGetParentWithData : function () {
			var document = Aria.$window.document;
			this.container.innerHTML = '<div data-test1="test1" data-test3="false"><div data-test2="second" data-test3="" id="parent_getParentWithData"><div><div data-test1="itself" id="child_getParentWithData"></div></div></div></div>';
			var child = document.getElementById("child_getParentWithData");
			var wrapperOnChild = new aria.templates.DomElementWrapper(child);

			this.assertTrue(wrapperOnChild.getParentWithData("expandoWhichDoesntExist") == null);

			// the expando on the element itself should be used
			var parentTest1 = wrapperOnChild.getParentWithData("test1");
			this.assertTrue(parentTest1.getData("test1", false) == "itself");
			this.assertTrue(parentTest1.getProperty("id") == "child_getParentWithData");
			parentTest1.$dispose();

			var parentTest2 = wrapperOnChild.getParentWithData("test2");
			this.assertTrue(parentTest2.getData("test2", false) == "second");
			this.assertTrue(parentTest2.getProperty("id") == "parent_getParentWithData");
			parentTest2.$dispose();

			var parentTest3 = wrapperOnChild.getParentWithData("test3");
			this.assertTrue(parentTest3.getData("test3", false) == "");
			this.assertTrue(parentTest3.getProperty("id") == "parent_getParentWithData");
			parentTest3.$dispose();

			wrapperOnChild.$dispose();
		}
	}
});