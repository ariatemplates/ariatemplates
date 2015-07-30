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
    $classpath : "test.aria.widgets.container.dialog.container.FocusDialogContainerTestCase",
    $extends : "test.aria.widgets.container.dialog.container.BaseDialogContainerTestCase",
    $prototype : {

        start: function () {
            var self = this;

            function step0() {
                self.synEvent.click(self.getElementById("homeDialogModalToggleButton"), self.waitForIdVisible("homeDialogModalInput1", step1));
            }

            function step1() {
                self.synEvent.click(self.getElementById("bodyInput1"), self.waitForFocus("bodyInput1", step2));
            }

            function step2() {
                self.synEvent.type(null, "\t", self.waitForFocus("bodyInput2", step3));
                // pressing tab from bodyInput2 skips the content of the home tab and directly goes to the dialog
            }

            function step3() {
                self.synEvent.type(null, "\t", self.waitForFocus("homeDialogModalInput1", step4));
            }

            function step4() {
                self.synEvent.type(null, "\t", self.waitForFocus("homeDialogModalInput2", step5));
            }

            function step5 () {
                self.synEvent.click(self.getElementById("infoTab"), self.waitForIdVisible("infoInput1", step6));
            }

            function step6 () {
                self.synEvent.click(self.getElementById("bodyInput2"), self.waitForFocus("bodyInput2", step7));
            }

            function step7() {
                self.synEvent.type(null, "\t[ENTER]", self.waitForFocus("infoDialogModalInput1", step8));
            }

            function step8() {
                self.synEvent.click(self.getElementById("bodyInput2"), self.waitForFocus("bodyInput2", step9));
            }

            function step9() {
                self.synEvent.type(null, "\t", self.waitForFocus("infoDialogModalInput1", step10));
            }

            function step10() {
                self.synEvent.click(self.getElementById("homeTab"), self.waitForIdVisible("homeDialogModalInput1", step11));
            }

            function step11() {
                self.synEvent.click(self.getElementById("bodyInput2"), self.waitForFocus("bodyInput2", step12));
            }

            function step12() {
                self.synEvent.type(null, "\t", self.waitForFocus("homeDialogModalInput1", step13));
            }

            function step13() {
                self.synEvent.execute([["type", null, "[ESCAPE]"], ["click", self.getElementById("bodyInput2")]], self.waitForFocus("bodyInput2", step14));
            }

            function step14() {
                // after the dialog is closed, it is possible to focus homeInput1
                self.synEvent.type(null, "\t", self.waitForFocus("homeInput1", step15));
            }

            function step15() {
                self.end();
            }

            step0();
        }
    }
});
