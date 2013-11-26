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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test8.MultiAutoMaxOptions",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            ac_airline_values : []
        };

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.multiautocomplete.test8.MultiAutoMaxOptionsTpl",
            data : this.data
        });

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {

            this.synEvent.click(this.getInputField("MultiAutoId"), {
                fn : this._typeFirstString,
                scope : this
            });
        },

        _typeFirstString : function (evt, callback) {
            // give it the time to open a drop down
            this.synEvent.type(this.getInputField("MultiAutoId"), "a", {
                fn : this._wait,
                scope : this,
                args : this._selectVal1
            });
        },
        _wait : function (evt, callback) {
            aria.core.Timer.addCallback({
                fn : callback,
                scope : this,
                delay : 500
            });
        },
        _selectVal1 : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][enter]", {
                fn : this._typeSecondString,
                scope : this
            });
        },
        _typeSecondString : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "a", {
                fn : this._wait,
                scope : this,
                args : this._selectVal2
            });

        },
        _selectVal2 : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][enter]", {
                fn : this._typeThirdString,
                scope : this
            });
        },
        _typeThirdString : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "a", {
                fn : this._wait,
                scope : this,
                args : this._selectVal3
            });

        },

        _selectVal3 : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][enter]", {
                fn : this._typeMaxString,
                scope : this
            });
        },

        _typeMaxString : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "fi", {
                fn : this._wait,
                scope : this,
                args : this._selectVal4
            });

        },

        _selectVal4 : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "blur", {
                fn : this._checkSelected,
                scope : this
            });
        },

        _checkSelected : function () {
            var parentNode = this.getInputField("MultiAutoId").parentNode;
            this.assertEquals(this.data.ac_airline_values.length, 3, "The Wrong No. of elements are added.");
            var expectedVal = ["American Airlines", "Air France", "Air Canada"];
            for (var i = 0; i < parentNode.childNodes.length - 1; i++) {
                var element = parentNode.childNodes[i].innerText || parentNode.childNodes[i].textContent;
                this.assertEquals(element, expectedVal[i], "The Wrong values are added as for Autocomplete.");
                this.assertEquals(this.data.ac_airline_values[i].label, expectedVal[i], "The Wrong values are added as for Autocomplete.");
            }
            this.notifyTemplateTestEnd();
        }

    }
});
