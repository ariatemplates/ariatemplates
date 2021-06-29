/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.autoComplete.AutoComplete2JawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.autoComplete.AutoCompleteTpl"
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            this.execute([
                ["click", this.getElementById("inputBeforeAutoComplete")],
                ["waitForJawsToSay", "Type in text."],
                ["type", null, "[down][down][down][down]"],
                ["waitForJawsToSay", "Edit"],
                ["type", null, "p"],
                ["waitForJawsToSay", "There are 8 suggestions, use up and down arrow keys to navigate and enter to validate."],
                ["type", null, "l"],
                ["waitForJawsToSay", "There is one suggestion, use up and down arrow keys to navigate and enter to validate."],
                ["type", null, "u"],
                ["waitForJawsToSay", "There is no suggestion."],
                ["type", null, "s"],
                ["waitForJawsToSay", /^s$/],
                ["type", null, "\b"],
                ["waitForJawsToSay", /^s$/],
                ["type", null, "\b"],
                ["waitForJawsToSay", "There is one suggestion, use up and down arrow keys to navigate and enter to validate."],
                ["type", null, "\b"],
                ["waitForJawsToSay", "There are 8 suggestions, use up and down arrow keys to navigate and enter to validate."],
                ["type", null, "\b"],
                ["waitForJawsToSay", "There is no suggestion."]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
