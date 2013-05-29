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
 * Testcase for shared macro libraries
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.macrolibs.MacrolibsTestCase",
    $dependencies : ["aria.templates.BaseTemplate", "aria.templates.BaseCtxt"],
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._simpleEnv = {
            template : "test.aria.templates.macrolibs.simple.Macrolibs",
            moduleCtrl : {
                classpath : "test.aria.templates.macrolibs.simple.MacrolibsModule"
            }
        };
        this._nestedEnv = {
            template : "test.aria.templates.macrolibs.nested.Macrolibs"
        };
        this._errorsEnv1 = {
            template : "test.aria.templates.macrolibs.errors.Error1"
        };
        this._errorsEnv2 = {
            template : "test.aria.templates.macrolibs.errors.Error2"
        };
        this._widgetsEnv = {
            template : "test.aria.templates.macrolibs.widgets.Macrolibs",
            data : {
                count : 10
            }
        };
        this._templatesEnv = {
            template : "test.aria.templates.macrolibs.templates.Macrolibs",
            data : {
                value : 1,
                subdata1 : {
                    value : 10,
                    subdata2 : {
                        value : 20
                    },
                    subdata3 : {
                        value : 30
                    }
                }
            }
        };
        this.dataForResourcesTest = {};
        this._resourcesEnv = {
            template : "test.aria.templates.macrolibs.resources.Macrolibs",
            data : this.dataForResourcesTest
        };
        this.setTestEnv(this._simpleEnv);
    },
    $prototype : {
        runTemplateTest : function () {
            this.myTestSimple();
        },

        myTestSimple : function () {
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "hello World 1! <BR>".toLowerCase());

            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "thelonious <BR>".toLowerCase());

            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].innerHTML);
            this.assertTrue(test3 == "2,4,6,");

            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[3].innerHTML);
            this.assertTrue(test4.toLowerCase() == "ciao, dog <BR>".toLowerCase());

            var test5 = aria.utils.String.trim(this.testDiv.children[0].children[4].innerHTML);
            this.assertTrue(test5.toLowerCase() == "my ciao, dog <BR>".toLowerCase());

            var test6 = aria.utils.String.trim(this.testDiv.children[0].children[5].innerHTML);
            this.assertTrue(test6.toLowerCase() == "hello World 2! <BR>".toLowerCase());

            var test7 = aria.utils.String.trim(this.testDiv.children[0].children[6].innerHTML);
            this.assertTrue(test7.toLowerCase() == "hello World 3! <BR>".toLowerCase());

            this._replaceTestTemplate(this._nestedEnv, {
                fn : this.myTestNested,
                scope : this
            });
        },

        myTestNested : function () {
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "hello World 1! <BR>".toLowerCase());

            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "hello World 2! <BR>".toLowerCase());

            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].children[0].children[0].innerHTML);
            this.assertTrue(test3.toLowerCase() == "hello World 3!".toLowerCase());

            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[2].children[0].children[1].innerHTML);
            this.assertTrue(test4 == "4!");

            var test5 = aria.utils.String.trim(this.testDiv.children[0].children[2].children[0].children[2].innerHTML);
            this.assertTrue(test5 == "5!");

            var test6 = aria.utils.String.trim(this.testDiv.children[0].children[3].innerHTML);
            this.assertTrue(test6 == "4!");

            this._replaceTestTemplate(this._errorsEnv1, {
                fn : this.myTestErrors1,
                scope : this
            });

        },

        myTestErrors1 : function () {
            this.assertErrorInLogs(aria.templates.BaseCtxt.LIBRARY_HANDLE_CONFLICT);
            this.assertErrorInLogs(aria.templates.BaseTemplate.EXCEPTION_IN_MACRO);
            this._replaceTestTemplate(this._errorsEnv2, {
                fn : this.myTestErrors2,
                scope : this
            });
        },

        myTestErrors2 : function () {
            this.assertErrorInLogs(aria.templates.BaseCtxt.LIBRARY_ALREADY_LOADED);
            this._replaceTestTemplate(this._widgetsEnv, {
                fn : this.myTestWidgets,
                scope : this
            });

        },

        myTestWidgets : function () {
            var lib1button = this.getWidgetInstance("button1");
            var lib1nf = this.getInputField("nf1");
            var value = lib1nf.value;
            this.assertTrue(value == "10");

            this.synEvent.click(lib1button.getDom(), {
                fn : this._myTestWidgetsCB,
                scope : this
            });
        },

        _myTestWidgetsCB : function () {
            var lib1nf = this.getInputField("nf1");
            var value = lib1nf.value;
            this.assertTrue(value == "11");

            var div = this.templateCtxt.$getElementById('div');
            this.assertTrue(!!div, "Div cannot be retrieved with it id.");

            this._replaceTestTemplate(this._templatesEnv, {
                fn : this.myTestTemplates,
                scope : this
            });
        },

        myTestTemplates : function () {
            var test1 = this.testDiv.children[0].children[0].children[0].children[0].innerHTML;
            this.assertTrue(test1 == "10");

            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[0].children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase() == "hello World 1! <BR>".toLowerCase());

            var test3 = this.testDiv.children[0].children[0].children[0].children[2].children[0].children[0].innerHTML;
            this.assertTrue(test3 == "20");

            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[0].children[0].children[2].children[0].children[1].innerHTML);
            this.assertTrue(test4.toLowerCase() == "hello World 2! <BR>".toLowerCase());

            var test5 = this.testDiv.children[0].children[0].children[0].children[3].children[0].children[0].innerHTML;
            this.assertTrue(test5 == "30");

            var test6 = aria.utils.String.trim(this.testDiv.children[0].children[0].children[0].children[3].children[0].children[1].innerHTML);
            this.assertTrue(test6.toLowerCase() == "libThree: hello World 3! <BR>".toLowerCase());

            var test7 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test7.toLowerCase() == "hello World 1! <BR>".toLowerCase());

            this._replaceTestTemplate(this._resourcesEnv, {
                fn : this.myTestResources,
                scope : this
            });
        },

        myTestResources : function () {
            this.assertTrue(this.dataForResourcesTest.resFromMacrolib == "ContentFromResourcesOfTheMacrolib", "Resources of the macrolib have not been loaded correctly.");
            this.finishTest();
        },

        /**
         * Finalize the test, in this case, nothing special to do
         */
        finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});