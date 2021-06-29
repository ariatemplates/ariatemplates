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
    $classpath : "test.aria.widgets.wai.autoComplete.AutoComplete1JawsTestCase",
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
                ["click",this.getElementById("inputBeforeAutoComplete")],
                ["waitForJawsToSay","Type in text."],
                ["type",null,"[down][down][down][down]"],
                ["waitForJawsToSay","Edit"],
                ["type",null,"p"],
                ["waitForJawsToSay","p"],
                ["waitForJawsToSay","There are 8 suggestions, use up and down arrow keys to navigate and enter to validate."],
                ["type",null,"a"],
                ["waitForJawsToSay","a"],
                ["waitForJawsToSay","There are 2 suggestions, use up and down arrow keys to navigate and enter to validate."],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Pau 1 of 2"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Paris 2 of 2"],
                ["type",null,"[enter]"],
                ["waitForJawsToSay","Enter"],
                ["waitForJawsToSay","City 2 Edit"],
                ["waitForJawsToSay","Paris"],
                ["waitForJawsToSay","Type in text."]
            ], {
                scope: this,
                fn: this.end
            });
        }
    }
});
