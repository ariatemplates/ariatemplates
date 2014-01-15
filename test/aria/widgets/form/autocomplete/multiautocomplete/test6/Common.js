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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test6.Common",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            ac_airline_values : []
        };

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.multiautocomplete.template.MultiAutoTpl",
            data : this.data
        });

    },
    $prototype : {
        rangePattern1 : "",
        rangePattern2 : "",
        rangeLabels : "",
        rangeCount : "",

        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("MultiAutoId"), {
                fn : this._typeSomething,
                scope : this
            });
        },

        _typeSomething : function (evt, callback) {
            // give it the time to open a drop down
            this.synEvent.type(this.getInputField("MultiAutoId"), this.rangePattern1, {
                fn : this._wait,
                scope : this,
                args : this._selectVal
            });
        },
        _wait : function (evt, callback) {
            aria.core.Timer.addCallback({
                fn : callback,
                scope : this,
                delay : 800
            });
        },
        _selectVal : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[enter]", {
                fn : this._checkValues,
                scope : this,
                args : {
                    count : this.rangeCount[0],
                    cb : this._focusBack
                }
            });
        },

        _focusBack : function () {
            this.synEvent.click(this.getInputField("MultiAutoId"), {
                fn : this._typeAgain,
                scope : this
            });
        },
        _typeAgain : function () {
            // give it the time to open a drop down
            this.synEvent.type(this.getInputField("MultiAutoId"), this.rangePattern2, {
                fn : this._wait,
                scope : this,
                args : this._selectVal2
            });
        },
        _selectVal2 : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[enter]", {
                fn : this._checkValues,
                scope : this,
                args : {
                    count : this.rangeCount[1],
                    cb : this._endRangeCheckTest
                }
            });

        },
        _checkValues : function (arg, argValue) {
            var value = this.data.ac_airline_values;
            var rangeLabels = this.rangeLabels;

            this.assertEquals(value.length, argValue.count, "The Wrong range of elements are prefilled. Prefilled = "
                    + value.length);
            for (var k = 0; k < value.length; k++) {
                this.assertEquals(value[k].label, rangeLabels[k], "The Wrong range of elements are prefilled. Expected = "
                        + value[k].label + " Prefilled = " + rangeLabels[k]);
            }
            this.$callback(argValue.cb);

        },
        _endRangeCheckTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
