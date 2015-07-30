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
    $classpath : "test.aria.widgets.container.dialog.container.MoveDialogContainerTestCase",
    $extends : "test.aria.widgets.container.dialog.container.BaseDialogContainerTestCase",
    $prototype : {
        start: function () {
            var self = this;
            var containerGeometry;

            function step0() {
                self.synEvent.click(self.getElementById("homeDialogModalToggleButton"), self.waitForIdVisible("homeDialogModalInput1", step1));
            }

            function step1() {
                // containerGeometry must be set only once the dialog is displayed (because the scrollbar disappears when the modal dialog appears)
                containerGeometry = self.getClientGeometry("home");
                var dialogMaskGeometry = self.getDialogMaskGeometry("homeDialogModalDialog");
                self.assertSameGeometry(containerGeometry, dialogMaskGeometry);
                self.assertTrue(self.data.homeDialogModalCenter);
                self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.moveDialog("homeDialogModalDialog", {x: - self.data.homeDialogModalX - 50, y: - self.data.homeDialogModalY - 50}, step2);
            }

            function step2() {
                self.assertFalse(self.data.homeDialogModalCenter);
                var dialogGeometry = self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.assertPixelEquals(dialogGeometry.x, containerGeometry.x);
                self.assertPixelEquals(dialogGeometry.y, containerGeometry.y);
                self.moveDialog("homeDialogModalDialog", {
                    x: containerGeometry.width - dialogGeometry.width + 50,
                    y: containerGeometry.height - dialogGeometry.height + 50
                }, step3);
            }

            function step3() {
                var dialogGeometry = self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.assertFalse(self.data.homeDialogModalCenter);
                self.assertPixelEquals(dialogGeometry.x + dialogGeometry.width, containerGeometry.x + containerGeometry.width);
                self.assertPixelEquals(dialogGeometry.y + dialogGeometry.height, containerGeometry.y + containerGeometry.height);
                self.end();
            }

            step0();
        }
    }
});
