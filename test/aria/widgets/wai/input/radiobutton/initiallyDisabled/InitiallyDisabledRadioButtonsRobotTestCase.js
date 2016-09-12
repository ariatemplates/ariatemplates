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
    $classpath : "test.aria.widgets.wai.input.radiobutton.initiallyDisabled.InitiallyDisabledRadioButtonsRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.core.Browser"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            firstGroup: "auto",
            manualOption: "opt1"
        };
        this.setTestEnv({
            data: this.data,
            template : "test.aria.widgets.wai.input.radiobutton.initiallyDisabled.InitiallyDisabledRadioButtonsTpl"
        });
    },
    $prototype : {
        run: function () {
            // Because of the following bug, this test is disabled on IE <= 9
            // https://connect.microsoft.com/IE/feedback/details/703991/ie9-allows-for-the-focusing-of-the-input-type-radio-tabindex-1-element-via-the-tab-key
            var browser = aria.core.Browser;
            if (browser.isIE && browser.majorVersion <= 9) {
                this.skipTest = true;
            }
            this.$RobotTestCase.run.call(this);
        },

        runTemplateTest : function () {
            function step0 () {
                var tf1 = this.getElementById("tf1");
                this.executeAndCheck([ ["click", tf1], ["waitFocus", tf1], ["type", null, "[tab]"] ], {
                    firstGroup: "auto",
                    manualOption: "opt1",
                    focusLabel: "Automatic"
                }, step1);
            }

            function step1 () {
                this.executeAndCheck([ ["type", null, "[down]"] ], {
                    firstGroup: "manual",
                    manualOption: "opt1",
                    focusLabel: "Manual"
                }, step2);
            }

            function step2 () {
                this.executeAndCheck([ ["type", null, "[tab]"] ], {
                    firstGroup: "manual",
                    manualOption: "opt1",
                    focusLabel: "Manual option 1"
                }, step3);
            }

            function step3 () {
                this.executeAndCheck([ ["type", null, "[down]"] ], {
                    firstGroup: "manual",
                    manualOption: "opt2",
                    focusLabel: "Manual option 2"
                }, step4);
            }

            function step4 () {
                this.executeAndCheck([ ["type", null, "[down]"] ], {
                    firstGroup: "manual",
                    manualOption: "opt4",
                    focusLabel: "Manual option 4"
                }, step5);
            }

            function step5 () {
                this.executeAndCheck([ ["type", null, "[up]"] ], {
                    firstGroup: "manual",
                    manualOption: "opt2",
                    focusLabel: "Manual option 2"
                }, step6);
            }

            function step6 () {
                this.executeAndCheck([ ["type", null, "[<shift>][tab][>shift<]"] ], {
                    firstGroup: "manual",
                    manualOption: "opt2",
                    focusLabel: "Manual"
                }, step7);
            }

            function step7 () {
                this.executeAndCheck([ ["type", null, "[up]"] ], {
                    firstGroup: "auto",
                    manualOption: "opt2",
                    focusLabel: "Automatic"
                }, step8);
            }

            function step8 () {
                this.executeAndCheck([ ["type", null, "[tab]"], ["waitFocus", this.getElementById("tf2")] ], {
                    firstGroup: "auto",
                    manualOption: "opt2"
                }, this.end);
            }

            step0.call(this);
        },

        executeAndCheck: function (commands, checks, cb) {
            this.synEvent.execute(commands, {
                scope: this,
                fn: function () {
                    this.waitFor({
                        condition: function () {
                            var res = true;
                            res = res && this.data.firstGroup === checks.firstGroup;
                            res = res && this.data.manualOption === checks.manualOption;
                            res = res && this.getFocusedEltLabel() === checks.focusLabel;
                            return res;
                        },
                        callback: cb
                    });
                }
            });
        },

        getFocusedEltLabel: function () {
            var activeElement = Aria.$window.document.activeElement;
            if (activeElement) {
                var widget = activeElement.parentNode.__widget;
                if (widget) {
                    return widget._cfg.label;
                }
            }
        }
    }
});
