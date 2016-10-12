/*
 * Copyright 2012 Amadeus s.a.s.
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

/**
 * Test that the dialog is kept in the viewport
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.bindPosition.DialogInViewportRobotTestCase",
    $extends : "test.aria.widgets.container.dialog.MovableDialogRobotBase",
    $constructor : function () {
        this.$MovableDialogRobotBase.constructor.call(this);

        this.data = {
            firstDialog : {
                visible : true,
                center : false
            },
            processing : true,
            secondDialog : {
                visible : false
            }
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.bindPosition.DialogTemplate",
            data : this.data
        });
    },
    $prototype : {

        startDialogTest : function () {
            this.waitFor({
                condition : function () {
                    return this.getWidgetInstance("firstDialog") != null;
                },
                callback : {
                    fn : this._afterFirstDialogShow,
                    scope : this
                }
            });
        },

        /**
         * Check that the dialog is kept in the viewport and the data model is correctly updated
         */
        _afterFirstDialogShow : function () {
            this.testPosArgs = {
                dataHolder : this.data.firstDialog,
                sectionOverlay : "dialogContent_one",
                dialog : this.getWidgetInstance("firstDialog").getDom(),
                tolerance : (aria.core.Browser.isIE9 || aria.core.Browser.isIE10) ? 10 : 1
            };

            var xposArray = [15000, 125, -500], xpos, xposCount, i;
            var yposArray = [15000, 130, -500], ypos, yposCount, j;

            for (i = 0, xposCount = xposArray.length; i < xposCount; i++) {
                xpos = xposArray[i];
                for (j = 0, yposCount = yposArray.length; j < yposCount; j++) {
                    ypos = yposArray[j];

                    // 1, 2
                    this._clearTheViewport();
                    this.testPosArgs.testValues = this._fitInViewport({
                        left : xpos,
                        top : ypos,
                        width : 300,
                        height : 300
                    });

                    // 3
                    aria.templates.RefreshManager.stop();
                    this.json.setValue(this.data.firstDialog, "xpos", xpos);
                    this.json.setValue(this.data.firstDialog, "ypos", ypos);
                    aria.templates.RefreshManager.resume();

                    this._testPositioning();
                }
            }

            for (i = 0, xposCount = xposArray.length; i < xposCount; i++) {
                xpos = xposArray[i];
                for (j = 0, yposCount = yposArray.length; j < yposCount; j++) {
                    ypos = yposArray[j];

                    // 1, 2
                    this._clearTheViewport();
                    this.testPosArgs.testValues = this._fitInViewport({
                        left : xpos,
                        top : ypos,
                        width : 300,
                        height : 300
                    });

                    // 3
                    aria.templates.RefreshManager.stop();
                    this.json.setValue(this.data.firstDialog, "visible", false);
                    this.json.setValue(this.data.firstDialog, "xpos", xpos);
                    this.json.setValue(this.data.firstDialog, "ypos", ypos);
                    aria.templates.RefreshManager.resume();
                    this.assertTrue(this.data.firstDialog.xpos === xpos);
                    this.assertTrue(this.data.firstDialog.ypos === ypos);
                    this.json.setValue(this.data.firstDialog, "visible", true);
                    this.testPosArgs.dialog = this.getWidgetInstance("firstDialog").getDom();

                    this._testPositioning();
                }
            }

            this.end();
        },

        /**
         * If we create an object with left=10000 and top=10000, this adds scrollbars; therefore getViewport returned by
         * two consecutive invocations may differ, and the test suite will mistakenly fail. To assure the correctness,
         * we should at each time do as follows:
         * <ul>
         * <li>1 "clear" the viewport by moving the dialog to (0,0) so there are no scrollbars</li>
         * <li>2 generate the values for comparison</li>
         * <li>3 use json.setValue for xpos and ypos</li>
         * </ul>
         * (In 3, it internally invokes getViewportSize() and normalizes the values to fit in the viewport). The order
         * matters heavily here. If 3 is invoked before 2, it may introduce scrollbars and the second measurements will
         * differ.
         */
        _clearTheViewport : function () {
            aria.templates.RefreshManager.stop();
            this.json.setValue(this.data.firstDialog, "xpos", 0);
            this.json.setValue(this.data.firstDialog, "ypos", 0);
            aria.templates.RefreshManager.resume();
        }

    }
});
