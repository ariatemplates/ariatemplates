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
    $classpath : 'test.aria.widgets.wai.datePicker.readDate.DatePickerReadDateJawsTestCase',
    $extends : 'aria.jsunit.JawsTestCase',
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : 'test.aria.widgets.wai.datePicker.readDate.Tpl',
            data: {}
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            this.execute([
                ["click", this.getElementById(this.env.data.elements.before.id)],
                ["waitForJawsToSay","focus me"],

                // Navigating to the DatePicker's calendar button

                ["type",null,"[down]"],
                ["waitForJawsToSay","calendar one label"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit 6 slash 9 slash 16"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","calendar one button"],

                // Opening calendar and selecting the next date

                ["type",null,"[enter]"],
                ["waitForJawsToSay","Enter"],
                ["waitForJawsToSay","calendar one 6 September 2016"],
                ["type",null,"[right]"],
                ["waitForJawsToSay","7 September 2016"],

                // Typing enter to validate

                ["type",null,"[enter]"],
                ["waitForJawsToSay","Enter"],
                ["waitForJawsToSay","calendar one label Edit"],
                ["waitForJawsToSay","7 slash 9 slash 16"], // input content is read
                ["waitForJawsToSay","Wednesday 7 September 2016"], // date is read

                // Inputting date "by hand"

                ["type",null,"[backspace]5"],
                ["waitForJawsToSay","6"],
                ["waitForJawsToSay","5"],
                ["waitForJawsToSay","Monday 7 September 2015"], // date is read

                // Checking that keystrokes not changing text don't trigger a read

                ["type",null,"[left]"],
                ["waitForJawsToSay","5"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
