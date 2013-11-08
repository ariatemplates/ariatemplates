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
    $classpath : "test.aria.widgets.form.textinput.blurvalidation.BlurValidationTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.textinput.blurvalidation.BlurValidationTestCaseTpl",
            data : {
                value1 : "",
                value2 : ""
            }
        });
    },
    $prototype : {
        _getErrorElements : function () {
            var tpl = this.testDiv.getElementsByTagName("div")[0];

            var arr = [];
            var nl = this.getElementsByClassName(tpl, "xTextInput_std_normalError_w");
            for (var i = 0, n; n = nl[i]; ++i) {
                arr.push(n);
            }

            var nl = this.getElementsByClassName(tpl, "xTextInput_std_normalErrorFocused_w");
            for (var i = 0, n; n = nl[i]; ++i) {
                arr.push(n);
            }

            return arr;
        },

        runTemplateTest : function () {

            // Check the init states
            this.assertEquals(this._getErrorElements().length, 2, "The two textfields should be in error");

            // The two fields are in error state, check here that the focus-blur actions without change don't change
            // their state
            this.synEvent.click(this.getInputField("tfBlurValidation"), {
                fn : this.focusSecondField,
                scope : this
            });

        },

        focusSecondField : function () {
            this.synEvent.click(this.getInputField("tfNoBlurValidation"), {
                fn : this.focusFirstField,
                scope : this
            });
        },
        focusFirstField : function () {
            this.synEvent.click(this.getInputField("tfBlurValidation"), {
                fn : this.checkStates,
                scope : this
            });
        },
        checkStates : function () {
            this.assertEquals(this._getErrorElements().length, 2, "The two textfields should be in error after the focus-blur iteration");
            this.notifyTemplateTestEnd();
        }
    }
});