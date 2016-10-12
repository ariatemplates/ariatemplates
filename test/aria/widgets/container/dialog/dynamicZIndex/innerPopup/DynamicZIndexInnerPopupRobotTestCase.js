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
    $classpath : "test.aria.widgets.container.dialog.dynamicZIndex.innerPopup.DynamicZIndexInnerPopupRobotTestCase",
    $extends : "test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexRobotBase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$DynamicZIndexRobotBase.constructor.call(this);
        this.setTestEnv({
            template: "test.aria.widgets.container.dialog.dynamicZIndex.innerPopup.DynamicZIndexInnerPopupTestTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var self = this;

            function step0() {
                self.assertDialogOrder(["nonModalDialog3", "nonModalDialog2", "nonModalDialog1"]);
                self.synEvent.click(self.getElementById("nonModalDialog2Input1"), function () {
                    self.waitForDropDownPopup("nonModalDialog2Input1", step1);
                });
            }

            function step1() {
                // clicking should both bring dialog2 to the front and open the select popup
                self.assertDialogOrder(["nonModalDialog2", "nonModalDialog3", "nonModalDialog1"]);
                var expectedPopup = self.getWidgetDropDownPopup("nonModalDialog2Input1");
                var expectedPopupPosition = aria.utils.Dom.getGeometry(expectedPopup);
                var pointInPopup = {
                    x: expectedPopupPosition.x + 25,
                    y: expectedPopupPosition.y + expectedPopupPosition.height - 25
                };
                var actualPopup = self.getPopupFromElement(self.testDocument.elementFromPoint(pointInPopup.x, pointInPopup.y)).domElement;
                self.assertEquals(expectedPopup, actualPopup);
                self.synEvent.click(pointInPopup, function () {
                    // waits for the popup to disappear
                    self.waitFor({
                        condition: function () {
                            return !self.getWidgetDropDownPopup("nonModalDialog2Input1");
                        },
                        callback: step2
                    });
                });
            }

            function step2() {
                self.assertDialogOrder(["nonModalDialog2", "nonModalDialog3", "nonModalDialog1"]);
                self.assertEquals(self.data.nonModalDialog2Input1, "IL");
                var datePicker = self.getInputField("nonModalDialog2Input2");
                var outside = self.getElementById("input1");
                self.synEvent.execute([
                    ["click", datePicker],
                    ["waitFocus", datePicker],
                    ["type", null, "xxx"], // type something wrong
                    ["click", outside], // go out of the field
                    ["waitFocus", outside],
                    ["click", datePicker], // come back to the field, this should trigger the display of the error popup
                    ["waitFocus", datePicker]
                ], step3);
            }

            function step3() {
                var expectedPopup = self.getWidgetInstance("nonModalDialog2Input2")._onValidatePopup._validationPopup.domElement;
                var expectedPopupPosition = aria.utils.Dom.getGeometry(expectedPopup);
                var pointInPopup = {
                    x: expectedPopupPosition.x + 25,
                    y: expectedPopupPosition.y + expectedPopupPosition.height - 25
                };
                var actualPopup = self.getPopupFromElement(self.testDocument.elementFromPoint(pointInPopup.x,pointInPopup.y)).domElement;
                self.assertEquals(expectedPopup, actualPopup);
                self.synEvent.click(pointInPopup, step4);
            }

            function step4() {
                self.end();
            }

            setTimeout(step0, 1); // setTimeout here helps IE8
        }
    }
});
