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
    $classpath : "test.aria.widgets.wai.dropdown.disabled.DropDownInitiallyDisabledDownJawsTestCase",
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
                ["pause", 100],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Date Picker Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "Edit Unavailable"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Auto Complete Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "Edit Unavailable"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Select Box Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "Edit Unavailable"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Multi Select Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay", "Edit Unavailable"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Last Field Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit"],
                ["click", firstItem],
                ["waitFocus", firstItem],
                ["type",null,"[up]"],
                ["waitForJawsToSay","First Field Label"],
                ["type",null,"[up]"],
                ["waitForJawsToSay","Disabled widgets check box  checked"],
                ["type",null,"[space]"],
                ["waitForJawsToSay","not checked"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","First Field Label"],
                ["type",null,"[down]"],
                ["pause", 500],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Date Picker Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Drop Down Label For Date Picker"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Auto Complete Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Drop Down Label For Auto Complete"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Select Box Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Drop Down Label For Select Box"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Multi Select Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Drop Down Label For Multi Select"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Last Field Label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
