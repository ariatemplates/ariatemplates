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
    $classpath : "test.aria.widgets.wai.multiselect.MultiSelectTabJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.multiselect.MultiSelectTpl"
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var tf = this.getElementById("tf");
            this.execute([
                ["click", tf],
                ["waitFocus", tf],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "My Multi dash select"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Edit"],
                // extra check to avoid opening the browser context menu with shift+f10:
                ["waitFocus", this.getInputField("ms")],
                ["type", null, "[<shift>][F10][>shift<]"],
                ["waitForJawsToSay", "Air Canada check box not checked"],
                ["type", null, "[<shift>][tab][>shift<]"], // Shouldn't move
                ["pause", 500],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "checked"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Air France check box not checked"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Air New Zealand check box not checked"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "British Airways check box not checked"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Delta Airlines check box not checked"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Select All"],
                ["type", null, "[space]"], // Select all
                ["pause", 500],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Dee select All"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Close"],
                ["type", null, "[tab]"], // One extra tab, shouldn't move
                ["pause", 500],
                ["type", null, "[enter]"], // Close
                ["waitForJawsToSay", "Air Canada, Air France, British Airways"],
                ["type", null, "[down]"],
                ["pause", 500],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Press space to open the selection list"],
                ["type", null, "[space]"], // Open dropdown
                ["waitForJawsToSay", "Air Canada check box checked"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Air France check box checked"],
                ["type", null, "[space]"], // Unselect the second one
                ["waitForJawsToSay", "Air France check box not checked"],
                ["type", null, "[escape]"], // Close the dropdown
                ["waitForJawsToSay", "Air Canada, British Airways"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
