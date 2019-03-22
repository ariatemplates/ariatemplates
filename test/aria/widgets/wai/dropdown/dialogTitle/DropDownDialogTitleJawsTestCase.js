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
        skipClearHistory : true,

        runTemplateTest : function () {
            var forbidDialogTitle = {
                match: /my\s*dialog\s*title/i,
                fn: this.lastJawsTextFailure,
                scope: this
            };

            this.execute([
                ["click", this.getElementById("openDialogButton")],
                ["waitForJawsToSay", "My Dialog Title heading level  1"],
                ["registerJawsListener", forbidDialogTitle],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],
                ["waitForJawsToSay", "First Field Label Edit"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],
                
                // DatePicker:
                ["waitForJawsToSay", "Date Picker Label Edit"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Drop Down Label For Date Picker"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "Space"],
                ["waitForJawsToSay", "Calendar table. Use arrow keys to navigate and space to validate."],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "thisisadate"],
                ["type", null, "[enter]"],
                ["waitForJawsToSay", "Enter"],
                ["waitForJawsToSay", "Date Picker Label Edit"],
                ["waitForJawsToSay", "thisisadate"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],
                ["waitForJawsToSay", "Drop Down Label For Date Picker"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],

                // AutoComplete:
                ["waitForJawsToSay", "Auto Complete Label Edit"],
                ["type", null, "d"],
                ["waitForJawsToSay", "d"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "List view Desktop device"],
                ["type", null, "[enter]"],
                ["waitForJawsToSay", "Enter"],
                ["waitForJawsToSay", "Auto Complete Label Edit"],
                ["waitForJawsToSay", "Desktop device"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],
                ["waitForJawsToSay", "Drop Down Label For Auto Complete"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],

                // MultiSelect:
                ["waitForJawsToSay", "Multi Select Label Edit"],
                ["type", null, "[down]"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "Space"],
                ["waitForJawsToSay", "Touch device check box  not checked"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Desktop device check box  not checked"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "Space"],
                ["waitForJawsToSay", "Desktop device check box  checked"],
                ["type", null, "[escape]"],
                ["waitForJawsToSay", "Escape"],
                ["waitForJawsToSay", "Multi Select Label Edit"],
                ["waitForJawsToSay", "Desktop device"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],
                ["waitForJawsToSay", "Drop Down Label For Multi Select"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Tab"],
                ["waitForJawsToSay", "Last Field Label Edit"],

                // closes the dialog:
                ["type", null, "[escape]"],
                ["waitForJawsToSay", "Escape"],
                ["waitForJawsToSay", "Open dialog Button"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
