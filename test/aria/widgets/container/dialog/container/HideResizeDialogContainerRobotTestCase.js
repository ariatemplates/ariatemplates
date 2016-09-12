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
    $classpath : "test.aria.widgets.container.dialog.container.HideResizeDialogContainerRobotTestCase",
    $extends : "test.aria.widgets.container.dialog.container.DialogContainerRobotBase",
    $prototype : {

        start: function () {
            var self = this;

            function step0() {
                self.synEvent.click(self.getElementById("homeDialogModalToggleButton"), self.waitForIdVisible("homeDialogModalInput1", step1));
            }

            function step1() {
                var containerGeometry = self.getClientGeometry("home");
                var dialogMaskGeometry = self.getDialogMaskGeometry("homeDialogModalDialog");
                self.assertSameGeometry(containerGeometry, dialogMaskGeometry);
                self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.synEvent.click(self.getElementById("infoTab"), self.waitForIdVisible("infoInput1", step2));
            }

            function step2() {
                self.resizeViewport(1300, 550, step3);
            }

            function step3() {
                self.synEvent.click(self.getElementById("homeTab"), self.waitForIdVisible("homeDialogModalInput1", step4));
            }

            function step4() {
                var containerGeometry = self.getClientGeometry("home");
                var dialogMaskGeometry = self.getDialogMaskGeometry("homeDialogModalDialog");
                self.assertSameGeometry(containerGeometry, dialogMaskGeometry);
                self.assertDisplayMatchesDataModel(containerGeometry, "homeDialogModal");
                self.end();
            }

            step0();
        }
    }
});
