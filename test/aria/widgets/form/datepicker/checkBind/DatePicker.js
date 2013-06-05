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
    $classpath : "test.aria.widgets.form.datepicker.checkBind.DatePicker",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            boundValue : new Date(2012, 11, 21),
            submitValue : null
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this._datePickerField = this.getInputField("datePicker");
            this.synEvent.click(this._datePickerField, {
                fn : this._afterClicking,
                scope : this
            });

        },
        _afterClicking : function () {
            this.synEvent.type(this._datePickerField, "19/12/2050[enter]", {
                fn : this._afterTyping,
                scope : this
            });
        },
        _afterTyping : function () {
            try {
                // check that the value in submitValue is the right one
                this.assertTrue(this.data.submitValue.getFullYear() == "2050", "Wrong value in data.submitValue");
                this.notifyTemplateTestEnd();
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        }
    }
});