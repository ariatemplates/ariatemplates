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
    $classpath : "test.aria.widgets.wai.dropdown.disabled.DropDownInitiallyDisabledTabJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.dropdown.disabled.Tpl",
            data: {
                disabled: true
            }
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var firstItem = this.getElementById("firstItem");
            this.execute([
                ["click", firstItem],
                ["waitFocus", firstItem],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Last Field Label Edit"],
                ["click", firstItem],
                ["waitFocus", firstItem],
                ["type", null, "[<shift>][tab][>shift<]"],
                ["waitForJawsToSay", "Disabled widgets check box checked"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "not checked"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "First Field Label Edit"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Date Picker Label Edit"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Drop Down Label For Date Picker"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Auto Complete Label Edit"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Drop Down Label For Auto Complete"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Select Box Label Edit"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Drop Down Label For Select Box"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Multi Select Label Edit"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Drop Down Label For Multi Select"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Last Field Label Edit"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
