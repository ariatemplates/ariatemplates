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
    $classpath : "test.aria.widgets.form.datepicker.pickdate.PickDate",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Date"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            boundValue : ""
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this.start,
                scope : this,
                delay : 25
            });
        },

        start : function () {
            this.datepickerDom = this.getElementById('myDatepicker');
            var icon = this.getElementsByClassName(this.datepickerDom, "xICNdropdown")[0];

            this.synEvent.click(icon, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return this.getElementsByClassName(Aria.$window.document.body, "xCalendar_dropdown_day").length > 0;
                        },
                        callback : this._pickDate
                    });
                },
                scope : this
            });
        },

        _pickDate : function () {

            // Click on the first available day
            var tdDay = this.getElementsByClassName(Aria.$window.document.body, "xCalendar_dropdown_day")[0];
            this.selectedDate = new Date(parseInt(tdDay.getAttribute("data-date"), 10));

            this.synEvent.click(tdDay, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            return this.getElementsByClassName(Aria.$window.document.body, "xCalendar_dropdown_day").length === 0;
                        },
                        callback : this._checkValue
                    });
                },
                scope : this
            });

        },

        _checkValue : function () {
            var strDate = aria.utils.Date.format(this.selectedDate, "yyyy-MM-dd");
            var inputValue = this.getInputField('myDatepicker').value;
            this.assertEquals(strDate, inputValue, "The date choosen in the calendar (%1) is not the one in the input value (%2)");

            // Check that the input contains valid chars
            var regexpDate = /[^0-9-]/;
            this.assertFalse(regexpDate.test(inputValue), "The date shouldn't be invalid");

            // Check that the same value is in the data model
            strDate = aria.utils.Date.format(this.data.boundValue, "yyyy-MM-dd");
            this.assertEquals(inputValue, strDate, "Discrepancy found between the selected date (%1) and the data model (%2)");

            this.end();
        }
    }
});
