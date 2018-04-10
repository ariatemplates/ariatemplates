/*
 * Copyright 2012 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.container.dialog.restoreFocusOnClose.RestoreFocusOnCloseRobotBase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            dialogVisible : false,
            restoreFocusOnDialogClose: this.initialValue
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.restoreFocusOnClose.RestoreFocusOnClose",
            data : this.data
        });
    },
    $prototype : {
        initialValue: false,
        toggleValueWhileDialogOpen: false,
        finalFocusedId: "",

        runTemplateTest : function () {
            var self = this;

            function step0() {
                var tf = self.getElementById("tf");
                self.synEvent.execute([
                    ["click", tf],
                    ["waitFocus", tf],
                    ["type", null, "[tab]"],
                    ["pause", 100],
                    ["type", null, "[enter]"]
                ], step1);
            }

            function step1() {
                self.waitFor({
                    condition: function () {
                        return !!self.getElementById("myDiv");
                    },
                    callback: step2
                });
            }
            
            function step2() {
                if (self.toggleValueWhileDialogOpen) {
                    aria.utils.Json.setValue(self.data, "restoreFocusOnDialogClose", !self.data.restoreFocusOnDialogClose);
                }
                self.synEvent.execute([
                    ["type", null, "[escape]"]
                ], step3);
            }

            function step3() {
                var expectedFocusElt = self.getWidgetDomElement(self.finalFocusedId, "button");
                self.waitFor({
                    condition: function () {
                        return !self.getElementById("myDiv") && Aria.$window.document.activeElement === expectedFocusElt;
                    },
                    callback: step4
                });
            }

            function step4() {
                // check that the focused element does not change later
                setTimeout(step5, 500);
            }

            function step5() {
                self.assertEquals(Aria.$window.document.activeElement, self.getWidgetDomElement(self.finalFocusedId, "button"));
                self.end();
            }

            step0();
        }
    }
});
