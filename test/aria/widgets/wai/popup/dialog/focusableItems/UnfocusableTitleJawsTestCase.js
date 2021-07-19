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
    $classpath : "test.aria.widgets.wai.popup.dialog.focusableItems.UnfocusableTitleJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.popup.dialog.focusableItems.Tpl",
            data : {
                dialogs: [{
                    title: "Mydialogtitle",
                    macro: "dialogContent",
                    focusableTitle: false,
                    width: 500,
                    height: 500,
                    modal: true,
                    waiAria: true,
                    bind: {
                        visible: {
                            to: "visible",
                            inside: {}
                        }
                    }
                }]
            }
        });
    },
    $prototype : {
        skipClearHistory: true,

        runTemplateTest : function () {
            var unacceptableTextListener = {
                match: "This is the content of my dialog",
                fn: this.lastJawsTextFailure,
                scope: this
            };
            var tf = this.getElementById("tf");
            this.execute([
                ["registerJawsListener", unacceptableTextListener],
                ["click", tf],
                ["waitFocus", tf],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Show dialog"],
                ["type", null, "[enter]"],
                ["pause", 500],
                ["waitForJawsToSay", "Mydialogtitle"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", "Do nothing"],
                ["pause", 500],
                ["type", null, "[escape]"],
                ["pause", 500]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
