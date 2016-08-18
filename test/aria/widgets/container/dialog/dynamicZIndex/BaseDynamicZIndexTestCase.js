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
    $classpath : "test.aria.widgets.container.dialog.dynamicZIndex.BaseDynamicZIndexTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.popups.PopupManager", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            nonModalDialog1Visible: true,
            nonModalDialog1X: 16,
            nonModalDialog1Y: 25,
            nonModalDialog1Width: 304,
            nonModalDialog1Height: 223,
            nonModalDialog1Center: false,
            nonModalDialog2Visible: true,
            nonModalDialog2X: 106,
            nonModalDialog2Y: 70,
            nonModalDialog2Width: 403,
            nonModalDialog2Height: 232,
            nonModalDialog2Center: false,
            nonModalDialog3Visible: true,
            nonModalDialog3X: 25,
            nonModalDialog3Y: 205,
            nonModalDialog3Width: 502,
            nonModalDialog3Height: 223,
            nonModalDialog3Center: false
        };
        this.setTestEnv({
            template: "test.aria.widgets.container.dialog.dynamicZIndex.DynamicZIndexTestTpl",
            data : this.data
        });
    },
    $prototype : {

        assertDialogOrder : function (expectedOrder) {
            var dialogOrder = this.getDialogOrder();
            this.assertJsonEquals(dialogOrder, expectedOrder);
        },

        getDialogOrder : function () {
            var counts = {
                "nonModalDialog1" : 0,
                "nonModalDialog2" : 0,
                "nonModalDialog3" : 0
            };
            this.incrementPopup(counts, 124, 223); // 1, 2 or 3
            this.incrementPopup(counts, 124, 115); // 1 or 2
            this.incrementPopup(counts, 430, 223); // 2 or 3
            this.incrementPopup(counts, 34, 223); // 1 or 3
            return ["nonModalDialog1", "nonModalDialog2", "nonModalDialog3"].sort(function (a, b) {
                var res = counts[b] - counts[a];
                if (res === 0) {
                    throw new Error("Same score for 2 popups: " + a + " and " + b);
                }
                return res;
            });
        },

        incrementPopup : function (counts, x, y) {
            var popup = this.getPopupNameFromElement(this.testDocument.elementFromPoint(x, y));
            counts[popup]++;
            if (isNaN(counts[popup])) {
                throw new Error("Unexpected popup: " + popup);
            }
        },

        getPopupFromElement : function (element) {
            var popups = aria.popups.PopupManager.openedPopups;
            var foundPopup;
            for (var i = 0, l = popups.length; i < l; i++) {
                var curPopup = popups[i];
                var curPopupAncestor = aria.utils.Dom.isAncestor(element, curPopup.domElement);
                if (curPopupAncestor) {
                    foundPopup = curPopup;
                    break;
                }
            }
            return foundPopup;
        },

        getPopupNameFromElement: function (element) {
            var foundPopup = this.getPopupFromElement(element);
            if (foundPopup) {
                var dialogTitle = this.getElementsByClassName(foundPopup.domElement, "xDialog_title");
                if (dialogTitle.length > 0) {
                    return dialogTitle[0].innerHTML;
                }
                return "unknown";
            }
            return "none";
        },

        waitForZIndexChange : function (cb) {
            var document = this.testDocument;
            var initialTopMostPopup = this.getPopupNameFromElement(document.elementFromPoint(124, 223));
            this.waitFor({
                condition: function () {
                    return initialTopMostPopup !== this.getPopupNameFromElement(document.elementFromPoint(124, 223));
                },
                callback: cb
            });
        }
    }
});
