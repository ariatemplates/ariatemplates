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
    $classpath : "test.aria.widgets.form.multiautocomplete.test5.MultiAutoEdit",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $dependencies : ["aria.utils.FireDomEvent"],
    $prototype : {

        runTemplateTest : function () {
            this.clickAndType(["a", this.dropdownOpenCondition, "[down][down][enter]", this.dropdownCloseCondition,
                    "air", this.dropdownOpenCondition, "[down][down][enter]", this.dropdownCloseCondition], {
                fn : this._editValues,
                scope : this
            }, 1);
        },

        _editValues : function () {
            var element = this._getSelectedItemElement(0).firstChild;
            // to simulate double click
            aria.utils.FireDomEvent.fireEvent('dblclick', element, {});
            this.synEvent.click(this._getField(), {
                fn : this._onAfterUserAction,
                scope : this
            });
        },

        _onAfterUserAction : function () {
            this.getWidgetInstance("MultiAutoId").setCaretPosition(11, 11);
            this.type({
                text : ["[backspace][backspace][backspace][backspace][backspace][backspace][backspace]",
                        this.dropdownOpenCondition, "[down][down][enter]", this.dropdownCloseCondition],
                cb : {
                    fn : this._checkValue,
                    scope : this
                },
                delay : 1
            });
        },

        _checkValue : function () {
            this.checkSelectedItems(2, ["Air Canada", "Scandinavian Airlines System"]);
            this.end();
        }

    }
});
