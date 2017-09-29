/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.container.dialog.modalMaskSize.DialogModalMaskSizeTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            boxWidth: 10,
            boxHeight: 10
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.modalMaskSize.DialogModalMaskSize",
            data : this.data,
            iframe : true
        });
    },
    $prototype : {
        runTemplateTest : function () {
            var self = this;
            var testWindow = self.testWindow;
            var document = testWindow.document;
            var body = document.body;
            var documentElement = document.documentElement;
            var jsonUtils = testWindow.aria.utils.Json;
            var domUtils = testWindow.aria.utils.Dom;
            var initialScroll;

            function readScroll() {
                return domUtils._getDocumentScroll().scrollTop;
            }

            function checkScroll() {
                var newScroll = readScroll();
                self.assertEqualsWithTolerance(newScroll, initialScroll, 5);
            }

            function checkAndEnforceScroll(callback) {
                checkScroll();
                scrollToInput();
                setTimeout(callback, 100);
            }

            function scrollToInput() {
                self.getElementById("myInput").scrollIntoView(true);
            }

            function step0() {
                scrollToInput();
                setTimeout(step1, 1000);
            }

            function step1() {
                initialScroll = readScroll();
                jsonUtils.setValue(self.data, "visible", true);
                self.waitFor({
                    condition: function () {
                        return testWindow.aria.popups.PopupManager.openedPopups.length === 1;
                    },
                    callback: step2
                });
            }

            function step2() {
                checkAndEnforceScroll(step3);
            }

            function step3() {
                checkScroll();
                jsonUtils.setValue(self.data, "boxHeight", 10000);
                setTimeout(step4, 100);
            }

            function step4() {
                checkAndEnforceScroll(step5);
            }

            function step5() {
                checkScroll();
                self.end();
            }

            step0();
        }
    }
});
