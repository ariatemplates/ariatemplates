/*
 * Copyright 2018 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.dropdown.dialogTitle.DropDownDialogTitleJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.data = {};
        this.setTestEnv({
            template : "test.aria.widgets.wai.dropdown.dialogTitle.Tpl",
            data: this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            aria.utils.Json.setValue(this.data, "dialogVisible", true);
            this.waitFor({
                condition : function () {
                    return !!this.getElementById("firstItem");
                },
                callback : this.afterDialogDisplayed
            });
        },

        afterDialogDisplayed : function () {
            this.noiseRegExps.push(/type|thisisadate/i, /^MyDialogTitle Edit$/);
            var actions = [
                ["click", this.getElementById("firstItem")], ["pause", 500],
                ["type", null, "[tab]"], ["pause", 500],
                
                // DatePicker:
                ["type", null, "[down]"], ["pause", 100],
                ["type", null, "[space]"], ["pause", 2000],
                ["type", null, "[down]"], ["pause", 1000],
                ["type", null, "[enter]"], ["pause", 2000],
                ["type", null, "[tab]"], ["pause", 100],
                ["type", null, "[tab]"], ["pause", 100],

                // AutoComplete:
                ["type", null, "d"], ["pause", 100],
                ["type", null, "[down]"], ["pause", 1000],
                ["type", null, "[enter]"], ["pause", 2000],
                ["type", null, "[tab]"], ["pause", 100],
                ["type", null, "[tab]"], ["pause", 100],

                // MultiSelect:
                ["type", null, "[down]"], ["pause", 100],
                ["type", null, "[space]"], ["pause", 2000],
                ["type", null, "[down]"], ["pause", 1000],
                ["type", null, "[space]"], ["pause", 2000],
                ["type", null, "[escape]"], ["pause", 2000],
                ["type", null, "[tab]"], ["pause", 100],
                ["type", null, "[tab]"], ["pause", 100],

                // closes the dialog:
                ["type", null, "[escape]"], ["pause", 1000]
            ];
            this.synEvent.execute(actions, {
                fn: function () {
                    this.assertJawsHistoryEquals([
                        "MyDialogTitle dialog",
                        "FirstFieldLabel Edit",
                        "DatePickerLabel Edit",
                        "DropDownLabelForDatePicker",
                        "Calendar table. Use arrow keys to navigate and space to validate.",
                        "DatePickerLabel Edit",
                        "DropDownLabelForDatePicker",
                        "AutoCompleteLabel Edit",
                        "List view Desktop device",
                        "AutoCompleteLabel Edit",
                        "Desktop device",
                        "DropDownLabelForAutoComplete",
                        "MultiSelectLabel Edit",
                        "DropDownLabelForMultiSelect",
                        "Touch device check box not checked",
                        "Desktop device check box not checked",
                        "Desktop device check box checked",
                        "MultiSelectLabel Edit",
                        "Desktop device",
                        "DropDownLabelForMultiSelect",
                        "LastFieldLabel Edit"
                    ].join("\n"), this.end, function (response) {
                        return response.replace(/\n(check box)/g, " $1").replace(/not checked\n(checked)/g, "$1");
                    });
                },
                scope: this
            });
        }
    }
});
