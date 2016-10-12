/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexClickRobotTestCase",
    $extends : "test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexRobotBase",
    $prototype : {
        runTemplateTest : function () {
            var self = this;

            function step0() {
                self.assertDialogOrder(["nonModalDialog3", "nonModalDialog2", "nonModalDialog1"]);
                self.clickAndCheck(232, 43, ["nonModalDialog1", "nonModalDialog3", "nonModalDialog2"], step1); // click on dialog 1
            }

            function step1() {
                self.clickAndCheck(34, 304, ["nonModalDialog3", "nonModalDialog1", "nonModalDialog2"], step2); // click on dialog 3
            }

            function step2() {
                self.clickAndCheck(232, 43, ["nonModalDialog1", "nonModalDialog3", "nonModalDialog2"], step3); // click on dialog 1
            }

            function step3() {
                self.clickAndCheck(403, 115, ["nonModalDialog2", "nonModalDialog1", "nonModalDialog3"], step4); // click on dialog 2
            }

            function step4() {
                self.clickAndCheck(232, 43, ["nonModalDialog1", "nonModalDialog2", "nonModalDialog3"], step5); // click on dialog 1
            }

            function step5() {
                self.clickAndCheck(34, 304, ["nonModalDialog3", "nonModalDialog1", "nonModalDialog2"], step6); // click on dialog 3
            }

            function step6() {
                self.clickAndCheck(403, 115, ["nonModalDialog2", "nonModalDialog3", "nonModalDialog1"], this.end); // click on dialog 2
            }

            setTimeout(step0, 1); // setTimeout here helps IE8
        },

        clickAndCheck : function (x, y, order, cb) {
            var count = 2;
            var callCallback = function () {
                count--;
                if (count === 0) {
                    this.$callback(cb);
                }
            };
            this.waitForZIndexChange(function () {
                this.assertDialogOrder(order);
                this.$callback(callCallback);
            });
            this.synEvent.click({
                x: x,
                y: y
            }, {
                fn: callCallback,
                scope: this
            });
        }
    }
});
