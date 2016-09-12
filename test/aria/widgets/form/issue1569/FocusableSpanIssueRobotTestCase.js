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
    $classpath : "test.aria.widgets.form.issue1569.FocusableSpanIssue",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.widgets.AriaSkinNormalization"],
    $prototype : {

        createSimpleFrameTextInput : function () {
            var widgetSkin = aria.widgets.AriaSkin.skinObject["TextInput"];
            delete widgetSkin["aria:skinNormalized"];
            widgetSkin.simpleframe = {
                frame: {
                    frameType: "Simple"
                }
            };
            aria.widgets.AriaSkinNormalization.normalizeWidget("TextInput", widgetSkin);
        },

        setUp : function () {
            this.createSimpleFrameTextInput();
        },

        runTemplateTest : function () {
            var startInput = this.getElementById("start");
            var textfield1 = this.getInputField("textfield1");
            var textfield2 = this.getInputField("textfield2");
            var textfield3 = this.getInputField("textfield3");
            var button = this.getWidgetInstance("button");
            var textarea = this.getInputField("textarea");
            var endInput = this.getElementById("end");
            button.getDom();
            this.synEvent.execute([
                ["click", startInput],
                ["waitFocus", startInput],
                ["type", null, "\t"],
                ["waitFocus", textfield1],
                ["type", null, "\t"],
                ["waitFocus", textfield2],
                ["type", null, "\t"],
                ["waitFocus", textfield3],
                ["type", null, "\t"],
                ["waitFocus", button._focusElt],
                ["type", null, "\t"],
                ["waitFocus", textarea],
                ["type", null, "\t"],
                ["waitFocus", endInput]
            ], {
                scope: this,
                fn: this.end
            });
        }
    }
});
