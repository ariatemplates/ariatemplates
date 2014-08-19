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
    $classpath : "test.aria.widgets.form.datefield.changeYear.IssueTest",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            date : null
        };
        this.setTestEnv({
            data : this.data
        });
        this.day = "10";
        this.month = "11";
        this.tests = [{
                    // set year = 1980 (should ignore final spaces)
                    text : "[backspace][backspace][backspace][backspace]1980[space][space][space]",
                    year : 1980
                }, {
                    // set year = 1950: not valid
                    text : "[backspace][backspace]50"
                }, {
                    // delete year: not valid
                    text : "[backspace][backspace][backspace][backspace]"
                }, {
                    // set year = 2017: back to valid state
                    text : "2017",
                    year : 2017
                }, {
                    // put invalid chars: not valid
                    text : "[backspace]uy"
                }, {
                    // set year = 1980
                    text : "[backspace][backspace][backspace][backspace][backspace]1980[space][space][space]",
                    year : 1980
                }];
    },
    $prototype : {
        runTemplateTest : function () {
            this.testCount = 0;
            this.df = this.getInputField("df1");
            this.extInput = this.getElementById("justToFocusOut");
            this.focusField(this.insertFirstValue);
        },

        insertFirstValue : function () {
            this.synEvent.type(this.df, this.day + this.month + "2014", {
                fn : this.blurField(this.execTest),
                scope : this
            });
        },

        execTest : function () {
            if (this.testCount < this.tests.length) {
                this.focusField(this.typeYear);
            } else {
                this.notifyTemplateTestEnd();
            }
        },

        typeYear : function () {
            this.synEvent.type(this.df, "[end]" + this.tests[this.testCount].text, {
                fn : this.blurField(this.onChangeYear),
                scope : this
            });
        },

        onChangeYear : function () {
            this.checkDate(this.tests[this.testCount].year);
            this.testCount++;
            this.execTest();
        },

        blurField : function (fn) {
            return function () {
                this.synEvent.click(this.extInput, {
                    fn : fn,
                    scope : this
                });
            };
        },

        focusField : function (fn) {
            this.synEvent.click(this.df, {
                fn : fn,
                scope : this
            });
        },

        checkDate : function (year) {
            if (year) {
                var d = new Date(year, this.month - 1, this.day);
                this.assertEquals(this.data.date.getTime(), d.getTime(), "Data set is " + this.data.date
                        + " while it should be " + d);
            } else {
                this.assertUndefined(this.data.date, "Data should be undefined. Instead it is %1");
            }
        }

    }
});
