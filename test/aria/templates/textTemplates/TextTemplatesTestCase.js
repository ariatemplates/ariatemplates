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
 * Testcase for text templates
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.textTemplates.TextTemplatesTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.templates.BaseCtxt"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._completeEnv = {
            template : "test.aria.templates.textTemplates.complete.MainTemplate"
        };
        this._errorsEnv1 = {
            template : "test.aria.templates.textTemplates.errors.MainTemplate"
        };
        this._errorsEnv2 = {
            template : "test.aria.templates.textTemplates.errors.AnotherTemplate"
        };
        this._errorsEnv3 = {
            template : "test.aria.templates.textTemplates.errors.LastTemplate"
        };
        this._errorsEnv4 = {
            template : "test.aria.templates.textTemplates.errors.FirstTemplate"
        };
        this._errorsEnv5 = {
            template : "test.aria.templates.textTemplates.errors.SecondTemplate"
        };

        this.setTestEnv(this._completeEnv);
    },
    $prototype : {
        runTemplateTest : function () {
            this.myTestComplete();
        },

        myTestComplete : function () {
            var test1 = aria.utils.String.trim(this.testDiv.children[0].children[0].innerHTML);
            this.assertTrue(test1.toLowerCase() == "{this is MainScriptText$\\/}".toLowerCase());
            var test2 = aria.utils.String.trim(this.testDiv.children[0].children[1].innerHTML);
            this.assertTrue(test2.toLowerCase().replace(/[ \n\t\r]*/gm, '') == "truekeymainTextParentMacromyTextScriptFunctionMTPSstatic".toLowerCase());
            var test3 = aria.utils.String.trim(this.testDiv.children[0].children[2].innerHTML);
            this.assertTrue(test3.toLowerCase() == "libParentText processed".toLowerCase());
            var test4 = aria.utils.String.trim(this.testDiv.children[0].children[3].innerHTML);
            this.assertTrue(test4.toLowerCase() == "libParentText processed".toLowerCase());
            var test5 = aria.utils.String.trim(this.testDiv.children[0].children[4].innerHTML);
            this.assertTrue(test5.toLowerCase().replace(/[ \n\t\r]*/gm, '') == "yellow,blue1234libParentTextprocessedgide".toLowerCase());
            var test6 = this.testDiv.children[0].children[5];
            var style6 = aria.utils.Dom.getStyle(test6, "fontSize");
            this.assertTrue(style6.toLowerCase() == "40px".toLowerCase());

            this._replaceTestTemplate(this._errorsEnv1, {
                fn : this.myTestErrors1,
                scope : this
            });
        },

        myTestErrors1 : function () {
            this.assertErrorInLogs(Aria.TEXT_TEMPLATE_HANDLE_CONFLICT);

            this._replaceTestTemplate(this._errorsEnv2, {
                fn : this.myTestErrors2,
                scope : this
            });
        },
        myTestErrors2 : function () {
            this.assertErrorInLogs(aria.templates.BaseCtxt.LIBRARY_HANDLE_CONFLICT);

            this._replaceTestTemplate(this._errorsEnv3, {
                fn : this.myTestErrors3,
                scope : this
            });
        },
        myTestErrors3 : function () {
            this.assertErrorInLogs(aria.templates.BaseCtxt.MACRO_CALL_ERROR);
            this.assertErrorInLogs(aria.templates.BaseCtxt.MACRO_NOT_FOUND);

            this._replaceTestTemplate(this._errorsEnv4, {
                fn : this.myTestErrors4,
                scope : this
            });
        },
        myTestErrors4 : function () {
            this.assertErrorInLogs(Aria.TEXT_TEMPLATE_HANDLE_CONFLICT);

            this._replaceTestTemplate(this._errorsEnv5, {
                fn : this.myTestErrors5,
                scope : this
            });
        },
        myTestErrors5 : function () {
            this.assertErrorInLogs(Aria.RESOURCES_HANDLE_CONFLICT);
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
