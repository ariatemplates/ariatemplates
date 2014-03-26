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
    $classpath : "test.aria.templates.section.SectionTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            data : {
                refreshCount : 0,
                macroRefreshCount : 0,
                macroParam : null
            }

        });
    },
    $prototype : {

        runTemplateTest : function () {

            // clean what was before
            this._disposeTestTemplate();

            this._loadTestTemplate({
                fn : this.tplTestSectionType,
                scope : this
            });
        },

        tplTestSectionType : function (args) {

            // check section typing
            var child = aria.utils.Dom.getElementById('childOfTypedSection');
            this.assertTrue(child.parentNode && child.parentNode.nodeName == "DIV");

            var child = aria.utils.Dom.getElementById('childOfComplexeSection');
            this.assertTrue(child.parentNode && child.parentNode.nodeName == "DIV");

            // reinit counter
            this.templateCtxt.data.refreshCount = 0;

            this.templateCtxt.$refresh({
                section : "myComplexeSection"
            });

            this.assertTrue(this.templateCtxt.data.refreshCount == 1, "this.$refresh did not work");

            // reinit counter
            this.templateCtxt.data.refreshCount = 0;

            // this should trigger refresh
            aria.utils.Json.setValue(this.templateCtxt.data, "myDummyValue", 1);

            this.assertTrue(this.templateCtxt.data.refreshCount == 1, "binding $refresh did not work");

            // reinit counters
            this.templateCtxt.data.refreshCount = 0;
            this.templateCtxt.data.macroRefreshCount = 0;
            this.templateCtxt.data.macroParam = null;

            this.templateCtxt.$refresh({
                section : "mySectionWithMacro1"
            });

            this.assertTrue(this.templateCtxt.data.refreshCount === 0, "mySectionWithMacro1: main macro was called instead of only macroForSection");
            this.assertTrue(this.templateCtxt.data.macroRefreshCount == 1, "mySectionWithMacro1: there was a problem with the call of macroForSection");
            this.assertTrue(this.templateCtxt.data.macroParam === undefined, "mySectionWithMacro1: the parameter for macroForSection was wrong");

            // reinit counters
            this.templateCtxt.data.refreshCount = 0;
            this.templateCtxt.data.macroRefreshCount = 0;
            this.templateCtxt.data.macroParam = null;

            this.templateCtxt.$refresh({
                section : "mySectionWithMacro1",
                macro : {
                    // overriding the args parameter or the macro
                    args : ["newParam"]
                }
            });

            this.assertTrue(this.templateCtxt.data.refreshCount === 0, "mySectionWithMacro1: main macro was called instead of only macroForSection");
            this.assertTrue(this.templateCtxt.data.macroRefreshCount == 1, "mySectionWithMacro1: there was a problem with the call of macroForSection");
            this.assertTrue(this.templateCtxt.data.macroParam === "newParam", "mySectionWithMacro1: the parameter for macroForSection was wrong");

            // reinit counters
            this.templateCtxt.data.refreshCount = 0;
            this.templateCtxt.data.macroRefreshCount = 0;
            this.templateCtxt.data.macroParam = null;

            this.templateCtxt.$refresh({
                section : "mySectionWithMacro2"
            });

            this.assertTrue(this.templateCtxt.data.refreshCount === 0, "mySectionWithMacro2: main macro was called instead of only macroForSection");
            this.assertTrue(this.templateCtxt.data.macroRefreshCount == 1, "mySectionWithMacro2: there was a problem with the call of macroForSection");
            this.assertTrue(this.templateCtxt.data.macroParam === "initialParam", "mySectionWithMacro2: the parameter for macroForSection was wrong");

            // reinit counters
            this.templateCtxt.data.refreshCount = 0;
            this.templateCtxt.data.macroRefreshCount = 0;
            this.templateCtxt.data.macroParam = null;

            this.templateCtxt.$refresh({
                section : "mySectionWithMacro2",
                macro : {
                    // overriding the args parameter or the macro
                    args : ["newParam"]
                }
            });

            this.assertTrue(this.templateCtxt.data.refreshCount === 0, "mySectionWithMacro2: main macro was called instead of only macroForSection");
            this.assertTrue(this.templateCtxt.data.macroRefreshCount == 1, "mySectionWithMacro2: there was a problem with the call of macroForSection");
            this.assertTrue(this.templateCtxt.data.macroParam === "newParam", "mySectionWithMacro2: the parameter for macroForSection was wrong");

            // check that the cssClass statement was correctly set on the section wrapper
            var sClass = this.templateCtxt.$getElementById("mySectionWithMacro1").classList.getClassName();
            this.assertTrue(sClass === "mySectionClass");

            // clean
            this._disposeTestTemplate();

            this.notifyTemplateTestEnd();
        }
    }
});
