/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.dropdown.disabled.DropDownDynamicallyDisabledTabJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.dropdown.disabled.Tpl",
            data: {
                disabled: false
            }
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
            actions.push(["click", this.getElementById("firstItem")], ["pause", 500]);
            actions.push(["type", null, "[<shift>][tab][>shift<]"], ["pause", 500]);
            actions.push(["type", null, "[space]"], ["pause", 500]);
            actions.push(["type", null, "[tab]"], ["pause", 500]);
            actions.push(["type", null, "[tab]"], ["pause", 500]);
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
                        "FirstFieldLabel Edit",
                        "Disabled widgets check box not checked",
                        "checked",
                        "FirstFieldLabel Edit",
                        "LastFieldLabel Edit"
                    ].join("\n"), this.end);
                },
                scope: this
            });
        }
    }
});
