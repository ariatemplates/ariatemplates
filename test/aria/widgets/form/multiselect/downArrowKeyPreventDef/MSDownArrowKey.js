/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.multiselect.downArrowKeyPreventDef.MSDownArrowKey",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            var self = this;
            var scrollableItem = aria.utils.Dom.getDocumentScrollElement();

            function step1() {
                self.testDiv.style.position = "absolute";
                scrollableItem.scrollTop = 3000;
                var happyMS = self.getInputField("happyMS");
                self.synEvent.execute([["click", happyMS], ["waitFocus", happyMS], ["type", null, "[down]"]], step2);
            }

            function step2() {
                self.assertEquals(scrollableItem.scrollTop, 3000);
                self.waitFor({
                    condition: function () {
                        return !!self.getWidgetDropDownPopup("happyMS");
                    },
                    callback: step3
                });
            }

            function step3() {
                self.synEvent.execute([["type", null, " [up]"]], step4);
            }

            function step4() {
                self.assertEquals(scrollableItem.scrollTop, 3000);
                var happyMS = self.getInputField("happyMS");
                self.synEvent.execute([["click", happyMS], ["waitFocus", happyMS], ["type", null, "[down][down]"]], step5);
            }

            function step5() {
                self.assertEquals(scrollableItem.scrollTop, 3000);
                self.waitFor({
                    condition: function () {
                        return !!self.getWidgetDropDownPopup("happyMS");
                    },
                    callback: step6
                });
            }

            function step6() {
                self.synEvent.execute([["type", null, " [up][up]"]], step7);
            }

            function step7() {
                self.assertEquals(scrollableItem.scrollTop, 3000);
                self.end();
            }

            step1();
        }
    }
});
