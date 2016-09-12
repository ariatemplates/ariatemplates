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
                fn : this._clickingDatePicker6,
                scope : this
            }, true);
        },
        _clickingDatePicker6 : function () {
            this.clickAndType("date6", "dec252016", {
                fn : this._clickingDatePicker7,
                scope : this
            }, true);
        },
        _clickingDatePicker7 : function () {
            this.clickAndType("date7", "11216", {
                fn : this._checkValues,
                scope : this
            }, true);
        },
        _checkValues : function () {
            this.assertEquals(this.getInputField("date1").value, "16/7/12", "Value in datePicker1 is %1 instead of %2");
            this.assertEquals(this.getInputField("date2").value, "16/7/12", "Value in datePicker2 is %1 instead of %2");
            this.assertEquals(this.getInputField("date3").value, "16/7/12", "Value in datePicker3 is %1 instead of %2");
            this.assertEquals(this.getInputField("date4").value, "16/7/12", "Value in datePicker4 is %1 instead of %2");
            this.assertNotEquals(this.getInputField("date5").value, "16/7/12", "Value in datePicker5 shouldn't be %2");
            this.assertEquals(this.getInputField("date6").value, "25/12/2016", "Value in datePicker6 is %1 instead of %2");
            this.assertEquals(this.getInputField("date7").value, "01/12/2016", "Value in datePicker7 is %1 instead of %2");

            // Test fallback with day in 2 digits and month on 1 (opposite case doesn't match a date).
            this.getInputField("date7").value = "";
            this.clickAndType("date7", "11316", {
                fn : this._checkDate7,
                scope : this
            }, true);

        },
        _checkDate7 : function () {
            this.assertEquals(this.getInputField("date7").value, "11/03/2016", "Value in datePicker7 is %1 instead of %2");
            this.end();
        }
    }
});
