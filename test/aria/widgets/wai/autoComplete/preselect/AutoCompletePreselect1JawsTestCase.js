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
    $classpath : "test.aria.widgets.wai.autoComplete.preselect.AutoCompletePreselect1JawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.autoComplete.preselect.AutoCompleteTpl"
        });
        this.noiseRegExps.push(/type in text/i);
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            this.execute([
                ["click", this.getInputField("country")],
                ["waitForJawsToSay","Country Edit"],
                ["type",null,"0"],
                ["waitForJawsToSay","0"],
                ["waitForJawsToSay","Austria 043 1 of 4"],
                ["waitForJawsToSay","There are 3 other suggestions, use up and down arrow keys to navigate and enter to validate."],
                ["type",null,"4"],
                ["waitForJawsToSay","4"],
                ["waitForJawsToSay","Austria 043 1 of 2"],
                ["waitForJawsToSay","There is 1 other suggestion, use up and down arrow keys to navigate and enter to validate."],
                ["type",null,"[down]"],
                ["waitForJawsToSay","United Kingdom 044 2 of 2"],
                ["type",null,"[up]"],
                ["waitForJawsToSay","Austria 043 1 of 2"],
                ["type",null,"[enter]"],
                ["waitForJawsToSay","Enter"],
                ["waitForJawsToSay","Country Edit"],
                ["waitForJawsToSay","Austria 043"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
