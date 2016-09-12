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
    $classpath : "test.aria.widgets.form.datepicker.checkValue.DatePicker",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            date1 : null,
            date2 : null,
            date3 : null
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.focusDate();
        },
        focusDate : function () {
            this.synEvent.click(this.getInputField("date1"), {
                fn : function () {
                    this.waitForWidgetFocus("date1", this.typeDate);
                },
                scope : this
            });
        },
        typeDate : function () {
            this.synEvent.type(this.getInputField("date1"), "10/09/11", {
                fn : this.focusDate2,
                scope : this
            });
        },
        focusDate2 : function () {
            this.synEvent.click(this.getInputField("date2"), {
                fn : function () {
                    this.waitForWidgetFocus("date2", this.typeDate2);
                },
                scope : this
            });
        },
        typeDate2 : function () {
            this.synEvent.type(this.getInputField("date2"), "+5", {
                fn : this.focusDate3,
                scope : this
            });
        },
        focusDate3 : function () {
            this.synEvent.click(this.getInputField("date3"), {
                fn : function () {
                    this.waitForWidgetFocus("date3", this.typeDate3);
                },
                scope : this
            });
        },
        typeDate3 : function () {
            this.synEvent.type(this.getInputField("date3"), "+5", {
                fn : this.focusDate4,
                scope : this
            });
        },
        focusDate4 : function () {
            this.synEvent.click(this.getInputField("date4"), {
                fn : function () {
                    this.waitForWidgetFocus("date4", this.checkDate4);
                },
                scope : this
            });
        },
        checkDate4 : function () {
            this.synEvent.type(this.getInputField("date4"), "+5", {
                fn : this.focusText,
                scope : this
            });
        },
        focusText : function () {
            this.synEvent.click(this.getInputField("text1"), {
                fn : function () {
                    this.waitForWidgetFocus("text1", this.finishTest);
                },
                scope : this
            });
        },
        finishTest : function () {
            var val1 = this.getInputField("date2").value;
            var val2 = this.getInputField("date3").value;
            var val3 = this.getInputField("date4").value;
            this.assertTrue(val1 === "15/9/11", "Value is not 15/9/11");
            this.assertTrue(val2 === "20/9/11", "Value is not 20/9/11");
            this.assertTrue(val3 === "15/10/11", "Value is not 15/10/11");
            this.notifyTemplateTestEnd();
        }
    }
});
