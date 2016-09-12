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
    $classpath : "test.aria.widgets.container.dialog.container.ResizeDialogContainerTestCase",
    $extends : "test.aria.widgets.container.dialog.container.BaseDialogContainerTestCase",
    $dependencies : ["aria.utils.resize.Resize"], // Required to have the dialog quickly ready
    $prototype : {
        start: function () {
            var self = this;
            var jsonUtils = self.templateCtxt._tpl.$json;
            var containerGeometry;

            function step0() {
                jsonUtils.setValue(self.data, "homeDialogModalCenter", false);
                jsonUtils.setValue(self.data, "homeDialogModalX", 49);
                jsonUtils.setValue(self.data, "homeDialogModalY", 70);
                jsonUtils.setValue(self.data, "homeDialogModalWidth", 300);
                jsonUtils.setValue(self.data, "homeDialogModalHeight", 200);
                self.synEvent.click(self.getElementById("homeDialogModalToggleButton"), self.waitForIdVisible("homeDialogModalInput1", step1));
            }

            function step1() {
                // containerGeometry must be set only once the dialog is displayed (because the scrollbar disappears when the modal dialog appears)
                containerGeometry = self.getClientGeometry("home");
                var dialogGeometry = self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.assertPixelEquals(dialogGeometry.x - containerGeometry.x, 49);
                self.assertPixelEquals(dialogGeometry.y - containerGeometry.y, 70);
                self.assertPixelEquals(dialogGeometry.width, 300);
                self.assertPixelEquals(dialogGeometry.height, 200);
                var startPos = {
                    x: dialogGeometry.x,
                    y: dialogGeometry.y
                };
                var endPos = {
                    x: containerGeometry.x - 50,
                    y: containerGeometry.y - 50
                };
                self.synEvent.drag({
                    to: endPos
                }, startPos, step3);
            }

            function step3() {
                var dialogGeometry = self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.assertPixelEquals(dialogGeometry.x, containerGeometry.x);
                self.assertPixelEquals(dialogGeometry.y, containerGeometry.y);
                self.assertPixelEquals(dialogGeometry.width, 349);
                self.assertPixelEquals(dialogGeometry.height, 270);

                jsonUtils.setValue(self.data, "homeDialogModalX", containerGeometry.width - 400);
                jsonUtils.setValue(self.data, "homeDialogModalY", containerGeometry.height - 300);
                dialogGeometry = self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.assertPixelEquals(dialogGeometry.x, containerGeometry.x + containerGeometry.width - 400);
                self.assertPixelEquals(dialogGeometry.y, containerGeometry.y + containerGeometry.height - 300);
                var startPos = {
                    x: dialogGeometry.x + dialogGeometry.width - 10,
                    y: dialogGeometry.y + dialogGeometry.height - 10
                };
                var endPos = {
                    x: containerGeometry.x + containerGeometry.width + 50,
                    y: containerGeometry.y + containerGeometry.height + 50
                };
                self.synEvent.drag({
                    to: endPos
                }, startPos, step4);
            }

            function step4() {
                var dialogGeometry = self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.assertPixelEquals(dialogGeometry.x, containerGeometry.x + containerGeometry.width - 400);
                self.assertPixelEquals(dialogGeometry.y, containerGeometry.y + containerGeometry.height - 300);
                self.assertPixelEquals(dialogGeometry.width, 400);
                self.assertPixelEquals(dialogGeometry.height, 300);

                jsonUtils.setValue(self.data, "homeDialogModalCenter", true);
                dialogGeometry = self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.assertTrue(self.data.homeDialogModalCenter);
                self.end();
            }

            step0();
        }
    }
});
