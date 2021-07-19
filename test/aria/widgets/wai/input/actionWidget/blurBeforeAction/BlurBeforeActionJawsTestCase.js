/*
 * Copyright 2018 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.actionWidget.blurBeforeAction.BlurBeforeActionJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.actionWidget.blurBeforeAction.BlurBeforeActionTpl",
            data: {}
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            this.execute([
                ["click", this.getElementById("tf1")],
                ["waitForJawsToSay", "First field"],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Query"],
                ["type", null, "hello"],
                ["pause", 200],
                ["type", null, "[escape]"],
                ["waitForJawsToSay", "virtual PC Cursor"],
                ["type", null, "b"],
                ["waitForJawsToSay", "Search"],
                ["type", null, "[enter]"],
                ["waitForJawsToSay", "Search"],
                ["click", this.getElementById("tf2")],
                ["waitForJawsToSay", "Second field"],
                ["type", null, "[up]"],
                ["waitForJawsToSay", "Second field"],
                ["type", null, "[up]"],
                ["waitForJawsToSay", "Last search colon hello"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
