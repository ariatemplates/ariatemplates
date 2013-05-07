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

Aria.classDefinition({
    $classpath : "test.aria.templates.focusHandling.FocusHandlingTestCase",
    $dependencies : ["aria.templates.TemplateCtxt"],
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._focusTestCaseEnv = {
            template : "test.aria.templates.focusHandling.test1.FocusTemplate",
            data : {
                cb : {
                    fn : this.myTestFocus,
                    scope : this
                }
            }
        };
        this._focusFirstErrorEnv = {
            template : "test.aria.templates.focusHandling.errortest.FirstFocusError"
        };
        this._focusSecondErrorEnv = {
            template : "test.aria.templates.focusHandling.errortest.SecondFocusError"
        };
        this._focusSecondTestEnv = {
            template : "test.aria.templates.focusHandling.test2.FirstTemplate",
            data : {
                cb : {
                    fn : this.mySecondTestFocus,
                    scope : this
                }
            }
        };

        this.setTestEnv(this._focusTestCaseEnv);
    },
    $prototype : {
        runTemplateTest : function () {
            // this.myTestFocus();
            // Instead of calling this method here to start the asserts, it is given as callback to the template, which
            // calls it at a proper time
        },

        /**
         * test that the $focusFromParent methods of the subtemplates scripts have been called correctly
         */
        myTestFocus : function () {
            var test1 = test.aria.templates.focusHandling.test1.FirstSubTemplate.testVariable;
            this.assertTrue(test1.toLowerCase() == "focusFromParent called".toLowerCase());
            var test2 = test.aria.templates.focusHandling.test1.SecondSubTemplate.testVariable;
            this.assertTrue(test2.toLowerCase() == "focusFromParent called".toLowerCase());

            this._replaceTestTemplate(this._focusFirstErrorEnv, {
                fn : this.myFocusFirstError,
                scope : this
            });
        },

        /**
         * Test that an error is thrown by the $focus method of the template context if the element to focus is not
         * ready yet
         */
        myFocusFirstError : function () {
            this.assertErrorInLogs(aria.templates.TemplateCtxt.FOCUS_FAILURE);

            this._replaceTestTemplate(this._focusSecondErrorEnv, {
                fn : this.myFocusSecondError,
                scope : this
            });
        },

        /**
         * Test that an error is thrown by the $focus method of the template context if the id of the element to focus
         * does not exist
         */
        myFocusSecondError : function () {
            this.assertErrorInLogs(aria.templates.TemplateCtxt.FOCUS_FAILURE);

            this._replaceTestTemplate(this._focusSecondTestEnv);
        },

        /**
         * test the automatic focus on the first focusable element encountered when the $focusFromParent method is not
         * defined in the script
         */
        mySecondTestFocus : function () {
            var test1 = test.aria.templates.focusHandling.test2.ThirdTemplate.testVariable;
            this.assertTrue(test1.toLowerCase() == "focusFromParent called".toLowerCase());

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
