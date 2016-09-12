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
    $classpath : "test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexFocusTestCase",
    $extends : "test.aria.widgets.container.dialog.dynamicZIndex.BaseDynamicZIndexTestCase",
    $prototype : {
        runTemplateTest : function () {
            var self = this;

            function step0() {
                var lastInput = self.getElementById("input1");
                self.synEvent.execute([["click", lastInput], ["waitFocus", lastInput]], step1);
            }

            function step1() {
                self.assertDialogOrder(["nonModalDialog3", "nonModalDialog2", "nonModalDialog1"]);
                self.typeAndCheck("[tab]", ["nonModalDialog1", "nonModalDialog3", "nonModalDialog2"], step2); // focus dialog 1
            }

            function step2() {
                self.typeAndCheck("[tab][tab]", ["nonModalDialog2", "nonModalDialog1", "nonModalDialog3"], step3); // focus dialog 2
            }

            function step3() {
                self.typeAndCheck("[<shift>][tab][>shift<]", [ "nonModalDialog1", "nonModalDialog2", "nonModalDialog3"], step4); // focus dialog 1
            }

            function step4() {
                self.typeAndCheck("[tab]", ["nonModalDialog2", "nonModalDialog1", "nonModalDialog3"], step5); // focus dialog 2
            }

            function step5() {
                self.typeAndCheck("[tab][tab]", ["nonModalDialog3", "nonModalDialog2", "nonModalDialog1"], step6); // focus dialog 3
            }

            function step6() {
                self.typeAndCheck("[<shift>][tab][>shift<]", ["nonModalDialog2", "nonModalDialog3", "nonModalDialog1"], self.end); // focus dialog 2
            }

            step0();
        },

        typeAndCheck : function (keys, order, cb) {
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
            this.synEvent.type(null, keys, {
                fn: callCallback,
                scope: this
            });
        }
    }
});
