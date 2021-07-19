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
    $classpath : "test.aria.widgets.wai.iconLabel.IconLabelJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.iconLabel.IconLabelTpl"
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var tf = this.getInputField("tf");
            this.execute([
                ["click", tf],
                ["waitFocus", tf],

                ["type", null, "[tab]"],
                ["waitForJawsToSay", "City"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Press space to open the autocomplete list"],

                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Travel date"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Press space to open the calendar"],

                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Multi dash select"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Press space to open the selection list"],

                ["type", null, "[tab]"],
                ["waitForJawsToSay", "All Countries"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Press space to open the selection list"]

            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
