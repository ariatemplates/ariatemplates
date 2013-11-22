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
    $classpath : "test.aria.widgets.form.datepicker.checkFormat.DatePicker",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            this.clickAndType("date1", "2012-07-16", {
                fn : this._clickingDatePicker2,
                scope : this
            }, true);

        },
        _clickingDatePicker2 : function () {
            this.clickAndType("date2", "2012:16-07", {
                fn : this._clickingDatePicker3,
                scope : this
            }, true);
        },
        _clickingDatePicker3 : function () {
            this.clickAndType("date3", "2012:Jul+16", {
                fn : this._clickingDatePicker4,
                scope : this
            }, true);
        },
        _clickingDatePicker4 : function () {
            this.clickAndType("date4", "2012 16-Jul", {
                fn : this._clickingDatePicker5,
                scope : this
            }, true);
        },
        _clickingDatePicker5 : function () {
            this.clickAndType("date5", "2012-16-07", {
                fn : this._finishTest,
                scope : this
            }, true);
        },
        _finishTest : function () {
            var val1 = this.getInputField("date1").value;
            var val2 = this.getInputField("date2").value;
            var val3 = this.getInputField("date3").value;
            var val4 = this.getInputField("date4").value;
            var val5 = this.getInputField("date5").value;

            this.assertTrue(val1 === "16/7/12", "Value in datePicker1  is " + val1);
            this.assertTrue(val2 === "16/7/12", "Value in datePicker2  is " + val2);
            this.assertTrue(val3 === "16/7/12", "Value in datePicker3  is " + val3);
            this.assertTrue(val4 === "16/7/12", "Value in datePicker4  is " + val4);
            this.assertFalse(val5 === "16/7/12", "Value in datePicker5  is " + val5);
            this.notifyTemplateTestEnd();
        }
    }
});
