/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.datepicker.issue429.DateFormatTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.form.datepicker.issue429.DateFormat",
            data : {}
        });
        this._elements = ["dp1", "dp11", "dp2", "dp3", "dp33"];
        this._instances = null;
        this._activeIdx = 0;
    },
    $destructor : function () {
        this._instances = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            this._instances = [this.getWidgetInstance("dp1"), this.getWidgetInstance("dp11"),
                    this.getWidgetInstance("dp2"), this.getWidgetInstance("dp3"), this.getWidgetInstance("dp33")];

            this.__testDatePicker("2013-07-23");
        },
        __testDatePicker : function (text) {
            this.clickAndType(this._elements[this._activeIdx], text, {
                fn : this.__checkDate,
                scope : this
            }, true);
        },
        __checkDate : function () {
            var elemIndex = this._activeIdx;
            var formatError = this._instances[elemIndex]._cfg.formatError;
            this._activeIdx += 1;

            if (elemIndex === 0) {
                this.assertEquals(formatError, false, "As pattern is 'yyyy-MM-dd', 2013-07-23 was expected to be valid format, where as we got format error");
                this.__testDatePicker("07-23-2013");
            } else if (elemIndex === 1) {
                this.assertEquals(formatError, true, "As pattern is 'yyyy-MM-dd', 07-23-2013 was expected to be invalid format, where as we didnot get format error");
                this.__testDatePicker("23/03/2013");
            } else if (elemIndex === 2) {
                this.assertEquals(formatError, false, "It was expected, dd/MM/yyyy is a valid format where as we got format error.");
                this.__testDatePicker("12-2013-27");
            } else if (elemIndex === 3) {
                this.assertEquals(formatError, false, "As inputPattern is 'MM-yyyy-dd', 12-2013-27 was expected to be a valid format where as we got format error.");
                this.__testDatePicker("2013-27-12");
            } else if (elemIndex === 4) {
                this.assertEquals(formatError, true, "As inputPattern is 'MM-yyyy-dd', 2013-27-12 was expected to be invalid format where as we didnot get format error.");
                this.end();
            }
        }
    }
});
