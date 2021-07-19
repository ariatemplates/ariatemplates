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

var Aria = require("ariatemplates/Aria");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.input.actionWidget.hasPopup.LinkJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $prototype : {
        skipClearHistory: true,

        runTemplateTest : function () {
            var tf1 = this.getElementById("tf1");
            this.execute([
                ["click", tf1],
                ["waitFocus", tf1],
                ["pause", 500],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Link Has Popup menu More info"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Link Normal"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Edit"],
                ["type", null, "[<shift>][tab][>shift<]"],
                ["waitForJawsToSay", "Normal Link"],
                ["type", null, "[<shift>][tab][>shift<]"],
                ["waitForJawsToSay", "More info Has Popup menu Link"],
                ["pause", 1000]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
