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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test9.MultiAutoBackSpace",
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
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("MultiAutoId"), {
                fn : this.typeSomething,
                scope : this
            });
        },

        typeSomething : function (evt, callback) {
            // give it the time to open a drop down
            this.synEvent.type(this.getInputField("MultiAutoId"), "p1-4", {
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
                fn : this._pressBackSpace,
                scope : this
            });
        },
        _pressBackSpace : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[backspace]", {
                fn : this._checkValues,
                scope : this
            });
        },
        _checkValues : function () {
            var value = this.data.ac_airline_values;
            var rangeLabels = ['P1.some', 'P2.kon', 'P3.red'];
            this.assertEquals(value.length, 3, "The Wrong range of elements are prefilled. Expected = 4, Prefilled = "
                    + value.length);
            for (var k = 0; k < value.length; k++) {
                this.assertEquals(value[k].label, rangeLabels[k], "The Wrong range of elements are prefilled. Expected = "
                        + value[k].label + " Prefilled = " + rangeLabels[k]);
            }
            this.notifyTemplateTestEnd();
        }
    }
});
