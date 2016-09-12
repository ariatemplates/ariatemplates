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
    $classpath : "test.aria.widgets.container.tooltip.scrollbar.ScrollbarTooltip",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.templates.Layout", "aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            var self = this;
            self.scrollBarWidth = aria.templates.Layout.getScrollbarsMeasuredWidth();
            self.displayAndHideTooltip("withScrollBar", function (scrollbarDisplayed) {
                self.assertEquals(scrollbarDisplayed, true);
                self.displayAndHideTooltip("withoutScrollBar", function (scrollbarDisplayed) {
                    self.assertEquals(scrollbarDisplayed, false);
                    self.end();
                });
            });
        },

        displayAndHideTooltip : function (tooltipId, cb) {
            var self = this;
            var result = null;
            var tooltipArea = self.getElementById(tooltipId + "TooltipArea");
            var nothingArea = self.getElementById("nothingHere");

            var waitForTooltipToAppear = function () {
                self.waitFor({
                    condition: function () {
                        return !!self.getElementById("testMe");
                    },
                    callback: checkScrollBar
                });
            };

            var checkScrollBar = function () {
                var element = self.getElementById("testMe").parentNode;
                var overFlowYStyle = aria.utils.Dom.getStyle(element, "overflowY");
                if (overFlowYStyle === "auto") {
                    result = true;
                } else if (overFlowYStyle === "hidden") {
                    result = false;
                }
                if (self.scrollBarWidth > 0) {
                    self.assertEquals(result, element.offsetWidth > element.clientWidth);
                }
                this.synEvent.move({
                    to : nothingArea,
                    duration : 10
                }, tooltipArea, waitForTooltipToDisappear);
            };

            var waitForTooltipToDisappear = function () {
                self.waitFor({
                    condition: function () {
                        return !self.getElementById("testMe");
                    },
                    callback: function () {
                        self.$callback(cb, result);
                    }
                });
            };

            this.synEvent.move({
                to : tooltipArea,
                duration : 10
            }, nothingArea, waitForTooltipToAppear);
        }
    }
});
