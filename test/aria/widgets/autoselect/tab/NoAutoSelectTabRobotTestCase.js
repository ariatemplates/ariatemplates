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
    $classpath : "test.aria.widgets.autoselect.tab.NoAutoSelectTabRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Caret"],
    $prototype : {
         _tabAndCheck : function (nextWidgetId, callback) {

            var input = this.getWidgetInstance(nextWidgetId).getTextInputField();
            this.synEvent.execute([
                ["type", null, "[tab]"],
                ["waitFocus", input]
            ], {
                fn: function () {
                    var length = input.value.length;
                    var caretPosition = aria.utils.Caret.getPosition(input);

                    this.assertTrue(
                        caretPosition.start === 0 && caretPosition.end == length,
                        "The widget text of " + nextWidgetId + "should be selected"
                    );

                    callback.call(this);
                },
                scope: this
            });
        },

        runTemplateTest : function () {
           var input = this.getWidgetInstance("start").getTextInputField();
            this.synEvent.execute([
                ["click", input],
                ["waitFocus", input]
            ], {
                fn: this.tabsAll,
                scope: this
            });
        },

        tabsAll : function () {

            var tabIndex = -1;
            var widgetsSequence = ["txtf0", "txtf1", "nf0", "nf1", "tf0", "tf1", "df0", "df1", "dp0", "dp1", "ms0",
                                  "ms1", "ac0", "ac1"];

            var currentWidget = widgetsSequence[0];
            var newTab = function() {
                tabIndex++;
                var nextWidget = widgetsSequence[tabIndex];
                if (nextWidget) {
                    this._tabAndCheck(nextWidget, newTab);
                } else {
                    this.end();
                }
            };

            newTab.call(this);

        }
    }
});
