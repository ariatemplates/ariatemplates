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
    $classpath : "test.aria.widgets.form.multiautocomplete.test11.MultiAutoInvalidDataModel",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $dependencies : ["aria.core.Browser"],
    $constructor : function () {
        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);
        if (aria.core.Browser.isPhantomJS || aria.core.Browser.isIE) {
            this.defaultTestTimeout = 120000;
        }
        this.data.freeText = false;
    },
    $prototype : {

        runTemplateTest : function () {
            var dataBind = this.data.ac_airline_values;
            this.clickAndType(["Air Canada", "[enter]", "Air France", "[enter]", "z", "[enter]"], {
                fn : this._afterEnter,
                scope : this
            }, 800);
        },

        _afterEnter : function () {
            var dataBind = this.data.ac_airline_values;
            this.assertTrue(dataBind !== undefined, "The data model should contain 2 items, but it is undefined instead.");
            this.assertTrue(dataBind.length === 2, "The data model should contain 2 items.");

            this.clickAndType(["[backspace]", "z", "[tab]"], {
                fn: this._afterTab,
                scope: this
            }, 800);
        },

        _afterTab : function () {
            var dataBind = this.data.ac_airline_values;
            this.assertTrue(dataBind !== undefined, "The data model should contain 2 items, but it is undefined instead.");
            this.assertTrue(dataBind.length === 2, "The data model should contain 2 items.");

            this.clickAndType(["[backspace]", "z"], {
                fn: this._afterType,
                scope: this
            }, 800);
        },

        _afterType : function () {
            this.synEvent.click(this.getElementById("justToFocusOut"), {
                fn : this._afterClick,
                scope : this,
                delay : 800
            });
        },

        _afterClick : function () {
            var dataBind = this.data.ac_airline_values;
            this.assertTrue(dataBind !== undefined, "The data model should contain 2 items, but it is undefined instead.");
            this.assertTrue(dataBind.length === 2, "The data model should contain 2 items.");
            this.end();
        }
    }
});
