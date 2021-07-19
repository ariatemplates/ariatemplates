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
    $classpath : "test.aria.widgets.wai.multiselect.MultiSelectJawsTestCase",
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
                ["type", null, "[space]"],
                ["waitForJawsToSay", "checked"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Air France check box not checked"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "Air France check box checked"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Air New Zealand check box not checked"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "British Airways check box not checked"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "British Airways check box checked"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Delta Airlines check box not checked Unavailable"],
                ["type", null, "[space]"],
                ["pause", 500],
                ["type", null, "[escape]"],
                ["waitForJawsToSay", "Air Canada, Air France, British Airways"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Press space to open the selection list"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "Air Canada check box checked"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
