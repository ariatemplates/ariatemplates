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
    $classpath : "test.aria.templates.section.asContainer.SectionAsContainerTest",
    $extends : "aria.jsunit.RobotTestCase",
    dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.templates.section.asContainer.SimpleTemplateForErrorLogging"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var errorObj = this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR).objOrErr;
            if (errorObj.logDetails) {
                errorObj.logDetails();
            }
            var error = (errorObj.message || errorObj.description || errorObj) + "";
            var expectedError = aria.templates.ClassGenerator.UNEXPECTED_CONTAINER.replace("%1", "section").replace("%2", "21");
            this.assertTrue(error.indexOf(expectedError) > -1, "Expected some details about the error ("
                    + expectedError + "), found: " + error);

            aria.core.AppEnvironment.setEnvironment({
                templateSettings : {
                    allowSectionsAsContainers : true
                }
            });

            this.assertErrorInLogs(aria.templates.Statements.SECTIONS_AS_CONTAINERS);

            this._replaceTestTemplate({
                template : "test.aria.templates.section.asContainer.TestTemplate"
            }, this._afterSecondTemplateLoaded);

        },
        _afterSecondTemplateLoaded : function () {

            var viewData = this.templateCtxt._tpl.viewData;

            // test that local variables defined in the section are not added to the global scope
            this.assertEquals(this.testWindow.secondVar, undefined);
            this.assertEquals(this.testWindow.thirdVar, undefined);

            this._testHTML("0", "0", "0", null, "thirdVar");

            viewData.value++;
            this.templateCtxt.$refresh();

            this._testHTML("1", "1", "1", null, "thirdVar");

            viewData.value++;
            this.templateCtxt.$refresh({
                section : "sectionThree"
            });

            this._testHTML("1", "1", "2");

            viewData.value++;
            this.templateCtxt.$refresh({
                section : "sectionTwo"
            });

            this._testHTML("1", "3", "2");

            aria.utils.Json.setValue(viewData, "value", 4);

            this._testHTML("4", "4", "2");

            this.synEvent.click(this.getElementById("buttonOne"), {
                fn : this._afterFirstClick,
                scope : this
            });
        },

        _afterFirstClick : function () {

            this._testHTML("5", "5", "2");

            this.synEvent.click(this.getElementById("buttonTwo"), {
                fn : this._afterSecondClick,
                scope : this
            });
        },

        _afterSecondClick : function () {

            this._testHTML("5", "5", "2", "macrolibvalue1");

            aria.core.AppEnvironment.setEnvironment({
                templateSettings : {
                    allowSectionsAsContainers : false
                }
            });
            this.end();
        },

        _testHTML : function (first, second, third, macroLibValue, thirdVar11) {
            thirdVar11 = thirdVar11 || "overriddenThirdVar";
            macroLibValue = macroLibValue || "macrolibvalue";
            this._testDivHTML("testDiv1", first);
            this._testDivHTML("testDiv2", "maintemplatevar");
            this._testDivHTML("testDiv3", "mainscriptvalue");
            this._testDivHTML("testDiv4", second);
            this._testDivHTML("testDiv5", "maintemplatevar");
            this._testDivHTML("testDiv6", "mainscriptvalue");
            this._testDivHTML("testDiv7", third);
            this._testDivHTML("testDiv8", "testforlocalVar");
            this._testDivHTML("testDiv9", "testforlocalVar");
            this._testDivHTML("testDiv10", "thirdVar");
            this._testDivHTML("testDiv11", thirdVar11);
            this._testDivHTML("testDiv13", "overriddenThirdVar");
            this._testDivHTML("testDiv12", "differentValue");

            this._testDivHTML("macroDiv1", second);
            this._testDivHTML("macroDiv2", "macrolibvar");
            this._testDivHTML("macroDiv3", "macrolibvalue");
            this._testDivHTML("macroDiv4", second);
            this._testDivHTML("macroDiv5", "macrolibvar");
            this._testDivHTML("macroDiv6", "macrolibvalue");
            this._testDivHTML("macroDiv7", second);
            this._testDivHTML("macroDiv8", "macrolibvar");
            this._testDivHTML("macroDiv9", macroLibValue);

        },

        _testDivHTML : function (id, innerHTML) {
            this.assertEquals(aria.utils.Dom.getElementById(id).innerHTML, innerHTML);
        }

    }
});
