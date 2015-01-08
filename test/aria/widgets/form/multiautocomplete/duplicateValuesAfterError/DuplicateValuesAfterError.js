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
    $classpath : "test.aria.widgets.form.multiautocomplete.duplicateValuesAfterError.DuplicateValuesAfterError",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {

        this.data = {
            ac_airline_values : [{
                        label : 'Air France',
                        code : 'AF'

                    }, {
                        label : 'Air Canada',
                        code : 'AC'
                    }],
            freeText : false
        };
        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);

    },
    $prototype : {

        runTemplateTest : function () {
            this.checkSelectedItems(2, ["Air France", "Air Canada"]);

            this.clickAndType("o", {
                fn : this._afterWrongType,
                scope : this
            }, 25);
        },

        _afterWrongType : function () {
            this.focusOut({
                fn : this._afterFocusOut,
                scope : this
            });
        },

        _afterFocusOut : function () {
            this.clickAndType(["[right][backspace]P1", this.dropdownOpenCondition, "[enter]",
                    this.dropdownCloseCondition], {
                fn : this._afterSelectionWithEnter,
                scope : this
            }, 1);
        },

        _afterSelectionWithEnter : function () {
            this.checkSelectedItems(3, ["Air France", "Air Canada", "P1.some"]);
            this.end();
        }

    }
});
