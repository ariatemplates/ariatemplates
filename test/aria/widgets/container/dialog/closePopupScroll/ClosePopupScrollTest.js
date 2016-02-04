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
    $classpath : "test.aria.widgets.container.dialog.closePopupScroll.ClosePopupScrollTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            var self = this;
            var outsideSelect = this.getElementById("outsideSelect");
            var outsideSelectGeometry;

            function checkOutsideSelectGeometry() {
                var newGeometry = aria.utils.Dom.getGeometry(outsideSelect);
                self.assertJsonEquals(newGeometry, outsideSelectGeometry);
            }

            function step1() {
                aria.utils.Dom.scrollIntoView(outsideSelect, true);
                outsideSelectGeometry = aria.utils.Dom.getGeometry(outsideSelect);
                var dropdownButton = self.getExpandButton("happySelect");
                self.synEvent.click(dropdownButton, step2);
            }

            function step2() {
                self.waitForDropDownPopup("happySelect", step3);
            }

            function step3() {
                self.synEvent.click(outsideSelect, step4);
            }

            function step4() {
                self.waitFor({
                    condition: function () {
                        return !self.getWidgetDropDownPopup("happySelect");
                    },
                    callback: step5
                });
            }

            function step5() {
                checkOutsideSelectGeometry();
                // wait a bit more and check again to be sure
                setTimeout(step6, 1000);
            }

            function step6() {
                // clicking outside the select should not scroll
                checkOutsideSelectGeometry();
                self.end();
            }

            setTimeout(step1, 10);
        }
    }
});
