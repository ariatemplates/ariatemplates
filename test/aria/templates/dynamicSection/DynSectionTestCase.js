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
 * Test dynamic sections
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.dynamicSection.DynSectionTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.templates.Section", "aria.templates.TemplateCtxt"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._testEnv1 = {
            template : "test.aria.templates.dynamicSection.testOne.DynSectionTestOne",
            data : {
                refCount : {}
            }
        };
        this._testEnv2 = {
            template : "test.aria.templates.dynamicSection.testTwo.DynSectionTestTwo"
        };
        this._testEnv3 = {
            template : "test.aria.templates.dynamicSection.testThree.DynSectionTestThree",
            data : {
                refCount : {},
                section4Change : ""
            }
        };
        this.setTestEnv(this._testEnv1);
    },
    $prototype : {

        runTemplateTest : function () {
            var tpl = this.templateCtxt._tpl;
            var section1 = tpl.$getElementById("section1");
            var section2 = tpl.$getElementById("section2");
            this.assertTrue(this.testDiv.children[0].children[0].children[0].innerHTML == "section1");
            section1.insertAdjacentSection("beforeBegin", {
                id : "section3",
                macro : {
                    name : "macroContentToAdd",
                    args : ["section3"]
                }
            });
            this.assertTrue(this.testDiv.children[0].children[0].tagName == "SPAN");
            this.assertTrue(this.testDiv.children[0].children[0].children[0].innerHTML == "section3");
            var section3 = tpl.$getElementById("section3");
            section3.insertAdjacentSection("afterBegin", {
                id : "section4",
                type : "DIV",
                macro : {
                    name : "macroContentToAdd",
                    args : ["section4"]
                }
            });
            this.assertTrue(this.testDiv.children[0].children[0].children[0].tagName == "DIV");
            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[0].innerHTML == "section4");
            section2.insertAdjacentSection("beforeEnd", {
                id : "section5",
                type : "DIV",
                macro : {
                    name : "macroContentToAdd",
                    args : ["section5"]
                }
            });
            this.assertTrue(this.testDiv.children[0].children[2].children[1].tagName == "DIV");
            this.assertTrue(this.testDiv.children[0].children[2].children[1].children[0].innerHTML == "section5");
            var section4 = tpl.$getElementById("section4");
            section4.insertAdjacentSection("afterEnd", {
                id : "section6",
                type : "DIV",
                macro : {
                    name : "macroContentToAdd",
                    args : ["section6"]
                }
            });
            this.assertTrue(this.testDiv.children[0].children[0].children[1].children[0].innerHTML == "section6");

            section3.remove();
            this.assertTrue(this.testDiv.children[0].children[0].children[0].innerHTML == "section1");

            for (var i = 1; i <= 6; i++) {
                this.assertTrue(tpl.data.refCount["section" + i] == 1);
            }

            this._replaceTestTemplate(this._testEnv2, {
                fn : this.runTestTwo,
                scope : this
            });
        },

        /**
         * Verifies that errors are raised when -- the section is both a container and has a macro property in its
         * configuration -- the section is not a container, nor has it a macro property in the configuration -- the
         * position is not one in [before|after]+[Begin|End]
         */
        runTestTwo : function () {
            this.assertErrorInLogs(aria.utils.Dom.INSERT_ADJACENT_INVALID_POSITION);
            this.assertErrorInLogs(aria.templates.Section.SECTION_ALREADY_EXISTS);

            this._replaceTestTemplate(this._testEnv3, {
                fn : this.runTestThree,
                scope : this
            });
        },

        /**
         * Deals with more complex sections. It verifies the possibilty of using macrolibs and the correct functionjing
         * of the bindRefreshTo property
         */
        runTestThree : function () {
            var tpl = this.templateCtxt._tpl;
            var section1 = tpl.$getElementById("section1");
            var section2 = tpl.$getElementById("section2");
            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[0].tagName == "TR");
            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[0].children[0].innerHTML == "section1");

            section1.remove();
            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[0].children[0].innerHTML == "section2");

            section2.insertAdjacentSection("afterEnd", {
                id : "section3",
                type : "TR",
                macro : {
                    name : "macroContentToAdd",
                    args : ["section3", tpl.data],
                    scope : tpl.libOne
                }
            });
            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[1].children[0].innerHTML == "section3");
            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[1].children.length == 6);
            var section3 = tpl.$getElementById("section3");
            section3.insertAdjacentSection("beforeBegin", {
                id : "section4",
                type : "TR",
                bindRefreshTo : [{
                            inside : tpl.data,
                            to : "section4Change"
                        }],
                macro : {
                    name : "macroContentToAdd",
                    args : ["section4", tpl.data],
                    scope : tpl.libOne
                }
            });

            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[1].children[0].innerHTML == "section4");
            this.assertTrue(this.testDiv.children[0].children[0].children[0].children[1].children.length == 6);

            tpl.$json.setValue(tpl.data, "section4Change", "4");
            for (var i = 1; i <= 3; i++) {
                this.assertTrue(tpl.data.refCount["section" + i] == 1);
            }
            this.assertTrue(tpl.data.refCount["section4"] == 2);

            this.notifyTemplateTestEnd();
        }
    }
});
