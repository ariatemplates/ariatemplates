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
var ariaUtilsJson = require("ariatemplates/utils/Json");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.input.actionWidget.buttonFocusableWhenDisabled.FocusableDisabledButtonJawsTestCase",
    $extends : require("ariatemplates/jsunit/JawsTestCase"),
    $prototype : {
        runTemplateTest : function () {
            var data = this.templateCtxt.data;
            this.noiseRegExps.push(/^Type/i);

            this.assertFalsy(data.firstButtonNbClicks),
            this.assertFalsy(data.secondButtonNbClicks),
            this.assertFalsy(data.thirdButtonNbClicks),
            this.assertFalsy(data.fourthButtonNbClicks),

            this.execute([
                ["click", this.getElementById("tf1")], ["pause", 100],
                ["type", null, "[tab]"], ["pause", 200], ["type", null, "[space]"], ["pause", 200],
                ["type", null, "[tab]"], ["pause", 200], ["type", null, "[space]"], ["pause", 200],
                ["type", null, "[tab]"], ["pause", 200], ["type", null, "[space]"], ["pause", 200],
                ["type", null, "[tab]"], ["pause", 200]
            ], {
                fn: function () {
                    this.assertEquals(Aria.$window.document.activeElement, this.getElementById("tf2"));
                    this.assertFalsy(data.firstButtonNbClicks),
                    this.assertEquals(data.secondButtonNbClicks, 1),
                    this.assertFalsy(data.thirdButtonNbClicks),
                    this.assertEquals(data.fourthButtonNbClicks, 1),
                    ariaUtilsJson.setValue(data, "firstButtonDisabled", false);
                    ariaUtilsJson.setValue(data, "secondButtonDisabled", true);
                    ariaUtilsJson.setValue(data, "thirdButtonDisabled", false);
                    ariaUtilsJson.setValue(data, "fourthButtonDisabled", true);
                    this.execute([
                        ["click", this.getElementById("tf1")], ["pause", 100],
                        ["type", null, "[tab]"], ["pause", 200], ["type", null, "[space]"], ["pause", 200],
                        ["type", null, "[tab]"], ["pause", 200], ["type", null, "[space]"], ["pause", 200],
                        ["type", null, "[tab]"], ["pause", 200], ["type", null, "[space]"], ["pause", 200],
                        ["type", null, "[tab]"], ["pause", 200]
                    ], {
                        fn: function () {
                            this.assertEquals(Aria.$window.document.activeElement, this.getElementById("tf2"));
                            this.assertEquals(data.firstButtonNbClicks, 1),
                            this.assertEquals(data.secondButtonNbClicks, 1),
                            this.assertEquals(data.thirdButtonNbClicks, 1),
                            this.assertEquals(data.fourthButtonNbClicks, 1),
                            this.assertJawsHistoryEquals([
                                "First field Edit",
                                "First button Button Unavailable",
                                "Second button Button",
                                "Fourth button Button",
                                "Last field Edit",
                                "First field Edit",
                                "First button Button",
                                "Second button Button Unavailable",
                                "Third button Button",
                                "Last field Edit"
                            ].join("\n"), this.end);
                        },
                        scope: this
                    });
                },
                scope: this
            });
        }
    }
});
