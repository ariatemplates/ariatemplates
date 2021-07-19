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
    $classpath : "test.aria.widgets.wai.input.actionWidget.hasPopup.ButtonJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var tf1 = this.getElementById("tf1");
            this.execute([
                ["click", tf1],
                ["waitFocus", tf1],
                ["type",null,"[down]"],
                ["waitForJawsToSay","More info button menu"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Normal  Button"],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Edit"],
                ["type",null,"[<shift>][tab][>shift<]"],
                ["waitForJawsToSay","Normal Button"],
                ["type",null,"[<shift>][tab][>shift<]"],
                ["waitForJawsToSay","More info button menu"]
                // Note that JAWS 18 also says:
                // ["waitForJawsToSay","Press space to activate the menu, then navigate with arrow keys"]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
