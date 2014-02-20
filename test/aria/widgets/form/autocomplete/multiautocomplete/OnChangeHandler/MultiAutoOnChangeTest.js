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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.OnChangeHandler.MultiAutoOnChangeTest",
    $extends : "test.aria.widgets.form.autocomplete.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $dependencies : ["aria.utils.FireDomEvent"],

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
            this.synEvent.type(this.getInputField("MultiAutoId"), "sca", {
                fn : this._wait,
                scope : this,
                args : this._selectVal
            });
        },
        _wait : function (evt, callback) {
            aria.core.Timer.addCallback({
                fn : callback,
                scope : this,
                delay : 1000
            });
        },
        _selectVal : function () {
            this.synEvent.type(this.getInputField("MultiAutoId"), "[down][enter]", {
                fn : this._checkDataAdded,
                scope : this
            });
        },

        _checkDataAdded : function () {
            this.assertEquals(this.data.ac_airline_values.length, 1, "The data is not updated after removing the entry");

            var parentNode = this.getInputField("MultiAutoId").parentNode;
            var msIcon = this.getElementsByClassName(parentNode, "closeBtn");
            this.synEvent.click(msIcon[0], {
                fn : this._checkValue,
                scope : this,
                delay : 2000
            });
        },

        _checkValue : function () {
            this.assertEquals(this.data.ac_airline_values.length, 0, "The data is not updated after removing the entry");
            this.assertEquals(this.data.refresh,3, "Onchange handler not called properly");
           this.notifyTemplateTestEnd();
        }
    }
});
