/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.dropdown.icon.DropDownIconJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.dropdown.icon.Tpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.noiseRegExps.push(/type/i);
            var actions = [
                ["click", this.getElementById("firstItem")], ["pause", 500]
            ];
            for (var i = 0; i < 9; i++) {
                actions.push(["type", null, "[tab]"], ["pause", 500]);
            }
            actions.push(["type", null, "[enter]"], ["pause", 500]);
            actions.push(["type", null, "b"], ["pause", 500]); // buttons
            actions.push(["type", null, "c"], ["pause", 500]); // controls
            this.execute(actions, {
                fn: function () {
                    this.assertJawsHistoryEquals([
                        "FirstFieldLabel Edit",
                        "DatePickerLabel Edit",
                        "DropDownLabelForDatePicker",
                        "AutoCompleteLabel Edit",
                        "DropDownLabelForAutoComplete",
                        "SelectBoxLabel Edit",
                        "DropDownLabelForSelectBox",
                        "MultiSelectLabel Edit",
                        "DropDownLabelForMultiSelect",
                        "LastFieldLabel Edit",
                        "There are no Buttons on this page.",
                        "There are no Selectable ARIA controls, comboboxes, listboxes or treeviews on this page."
                    ].join("\n"), this.end);
                },
                scope: this
            });
        }
    }
});
