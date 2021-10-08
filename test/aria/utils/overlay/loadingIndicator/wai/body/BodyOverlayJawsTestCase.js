/*
 * Copyright 2021 Amadeus s.a.s.
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
    $classpath : "test.aria.utils.overlay.loadingIndicator.wai.body.BodyOverlayJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var textField = this.getElementById("field");
            this.execute([
                ["click", textField],
                ["waitFocus", textField],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Display loading indicator"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "myoverlaymessage"],
                ["waitForJawsToSay", "finished"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
