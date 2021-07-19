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
    $classpath : "test.aria.widgets.wai.datePicker.DatePicker1JawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.datePicker.DatePickerRobotTestCaseTpl",
            data : {
                dpWaiEnabledValue : new Date(2016, 0, 1)
            }
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var input = this.getElementById("dpWaiEnabledNextInput");
            this.execute([
                ["click", input],
                ["waitFocus", input],
                ["type",null,"[up][up][up]"],
                ["waitForJawsToSay","Display calendar"],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Space"],
                ["waitForJawsToSay","Calendar table. Use arrow keys to navigate and space to validate. Friday 1 January 2016"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Friday 8 January 2016"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Friday 15 January 2016"],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Space"],
                ["waitForJawsToSay","Travel date Edit"],
                ["waitForJawsToSay","15 slash 1 slash 16"],
                ["waitForJawsToSay","Type in text."],
                ["waitForJawsToSay","Friday 15 January 2016"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
