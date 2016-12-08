/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Test different API for the section statement
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.section.sectionAttributes.SectionAttributesTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {

        runTemplateTest : function () {
            this.dom = this.templateCtxt.$getElementById('section_1');

            this.checkGetAttribute();
        },

        checkGetAttribute : function (args) {
            var dom = this.dom;
            var title = dom.getAttribute('title');

            this.assertEquals(title, "This is my section", "getAttributes doesn't work properly");
            this.checkClasses();
        },

        checkClasses : function (args) {
            var dom = this.dom;

            this.assertTrue(dom.classList.contains("class1"), "The dom should contains the class1");
            this.assertTrue(dom.classList.contains("class2"), "The dom should contains the class2");
            this.assertEquals(dom.classList.getClassName(), "class1 class2", "classList.getClassName should return 'class1 class2'");

            dom.classList.add("class3");
            this.assertTrue(dom.classList.contains("class3"), "The dom should contains the class3");

            dom.classList.remove("class2");
            this.assertFalse(dom.classList.contains("class2"), "The dom shouldn't contains the class2");

            dom.classList.toggle("class3");
            this.assertFalse(dom.classList.contains("class3"), "The dom shouldn't contains the class3");

            dom.classList.toggle("class2");
            this.assertTrue(dom.classList.contains("class2"), "The dom should contains the class2");

            dom.classList.setClassName("foo1 foo2");
            this.assertFalse(dom.classList.contains("class1"), "The dom shouldn't contains class1");
            this.assertTrue(dom.classList.contains("foo1"), "The dom should contains foo1");
            this.assertTrue(dom.classList.contains("foo2"), "The dom should contains foo2");

            this.checkExpando();
        },

        checkExpando : function (args) {
            var dom = this.dom;

            this.assertEquals(dom.getData("foo1"), "Foo 1", "The expando attribute 'foo1' should be set to 'Foo 1'");
            this.assertEquals(dom.getData("foo2"), "Foo 2", "The expando attribute 'foo2' should be set to 'Foo 2'");

            this.endTest();
        },

        endTest : function () {
            this.dom.$dispose();
            this.notifyTemplateTestEnd();
        }
    }
});
