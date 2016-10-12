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
 * Test the moveTo method for popups
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.bindPosition.PopupMoveToRobotTestCase",
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

        // this.defaultTestTimeout = 10000;
    },
    $prototype : {

        startDialogTest : function () {
            aria.core.Timer.addCallback({
                fn : this._afterFirstDialogShow,
                scope : this,
                delay : 500
            });
        },

        /**
         * Test the moveTo. Provide full condition coverage of the method
         */
        _afterFirstDialogShow : function () {
            this.testPosArgs = {
                sectionOverlay : "dialogContent_one",
                dialog : this.getWidgetInstance("firstDialog").getDom(),
                testValues : {
                    left : 50,
                    top : 100
                },
                tolerance : (aria.core.Browser.isIE9 || aria.core.Browser.isIE10) ? 5 : 1
            };
            this.popup = this.getWidgetInstance("firstDialog")._popup;

            // Test moveTo with no arguments
            this.popup.moveTo();
            this._testPositioning();

            // Test moveTo with center
            this.testPosArgs.testValues = {
                width : 300,
                height : 300
            };
            this.popup.moveTo({
                center : true
            });
            this._testPositioning();

            // Test with absolute position when center is not changed
            this.popup.moveTo({
                absolutePosition : {
                    left : 2,
                    top : 5
                }
            });
            this._testPositioning();

            // Change the center property
            this.testPosArgs.testValues = {
                left : 2,
                top : 5
            };
            this.popup.moveTo({
                center : false
            });
            this._testPositioning();
            this.end();
        }

    }
});
