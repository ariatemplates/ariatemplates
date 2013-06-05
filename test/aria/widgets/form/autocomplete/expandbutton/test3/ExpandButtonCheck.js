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
    $classpath : "test.aria.widgets.form.autocomplete.expandbutton.test3.ExpandButtonCheck",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.dataModel = {
            value1 : ""
        };
        this.setTestEnv({
            data : this.dataModel
        });
        // this.defaultTestTimeout = 2000;
    },
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var field = this.getInputField("ac1");
            field.focus();
            this._downArrow();
        },
        _downArrow : function () {
            this.synEvent.type(this.getInputField("ac1"), "[down]", {
                fn : this._addDelay,
                scope : this
            });
        },

        _addDelay : function () {
            aria.core.Timer.addCallback({
                fn : this._checkSelected,
                scope : this,
                delay : 1000
            });
        },

        _checkSelected : function () {
            this.synEvent.type(this.getInputField("ac1"), "[down][down][enter]", {
                fn : this._checkFinalVal,
                scope : this
            });
        },

        _checkFinalVal : function () {
            this.assertTrue(this.getInputField("ac1").value == "Finnair");
            this._finishTest();
        },

        _finishTest : function () {
            this.getInputField("ac1").blur();
            var data = aria.utils.Json.getValue(this.dataModel, "value1");
            this.assertTrue(data.label == "Finnair");
            this.notifyTemplateTestEnd();
        }

    }
});
