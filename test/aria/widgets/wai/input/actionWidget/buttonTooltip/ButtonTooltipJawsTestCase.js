/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.actionWidget.buttonTooltip.ButtonTooltipJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $prototype : {
        runTemplateTest : function () {
            this.noiseRegExps.push(/^Type/i);
            this.execute([
                ["click", this.getElementById("tf1")], ["pause", 100],
                ["type", null, "[tab]"], ["pause", 200],
                ["type", null, "[tab]"], ["pause", 200],
                ["type", null, "[tab]"], ["pause", 200]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals([
                        "First field Edit",
                        "my first button Button",
                        "first tooltip",
                        "my second button Button",
                        "second tooltip",
                        "Last field Edit"
                    ].join("\n"), this.end);
                },
                scope: this
            });
        }
    }
});
