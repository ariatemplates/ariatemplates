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
    $classpath : "test.aria.widgets.form.multiautocomplete.onChangeHandler.MultiAutoOnChangeTest",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $prototype : {
        runTemplateTest : function () {
            this.clickAndType(["sca", this.dropdownOpenCondition, "[down][enter]", this.dropdownCloseCondition], {
                fn : this._checkDataAdded,
                scope : this
            }, 1);
        },

        _checkDataAdded : function () {
            this.assertEquals(this.data.ac_airline_values.length, 1, "Data not updated after adding an entry");
            this.assertEquals(this.data.onChangeCalls, 1, "Onchange handler not called properly after adding an entry");
            var parentNode = this.getInputField("MultiAutoId").parentNode;
            var msIcon = this.getElementsByClassName(parentNode, "closeBtn");
            this.synEvent.click(msIcon[0], {
                fn : this._checkValue,
                scope : this
            });
        },

        _checkValue : function () {
            this.assertEquals(this.data.ac_airline_values.length, 0, "Data not updated after removing the entry");
            this.assertEquals(this.data.onChangeCalls, 2, "Onchange handler not called properly after removing the entry");
            this.notifyTemplateTestEnd();
        }
    }
});
