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
 * Test the binding of xpos, ypos and center for dialog widgets
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.bindPosition.DialogTestCase",
    $extends : "test.aria.widgets.container.dialog.MovableDialogBaseTestCase",
    $constructor : function () {
        this.$MovableDialogBaseTestCase.constructor.call(this);

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
         * Check that the data model is correctly initialized with the values specified in the configuration and then
         * set those values. Check also that when a loading indicator is displayed on top of a dialog, it is correctly
         * moved too
         */
        _afterFirstDialogShow : function () {
            this.testPosArgs = {
                dataHolder : this.data.firstDialog,
                sectionOverlay : "dialogContent_one",
                dialog : this.getWidgetInstance("firstDialog").getDom(),
                testValues : {
                    left : 50,
                    top : 100
                },
                tolerance : (aria.core.Browser.isIE9 || aria.core.Browser.isIE10) ? 5 : 1
            };

            // Test initial positioninig
            this._testPositioning();

            // Change xpos
            this.json.setValue(this.data.firstDialog, "xpos", 150);
            this.testPosArgs.testValues.left = 150;
            this._testPositioning();
            // Change ypos
            this.json.setValue(this.data.firstDialog, "ypos", 125);
            this.testPosArgs.testValues.top = 125;
            this._testPositioning();

            // check that position is maintained after closing and reopening the dialog
            this.json.setValue(this.data.firstDialog, "visible", false);
            this.json.setValue(this.data.firstDialog, "visible", true);
            this.testPosArgs.dialog = this.getWidgetInstance("firstDialog").getDom();
            this._testPositioning();

            // check that the position is changed if the data model is modified while the dialog is closed
            this.json.setValue(this.data.firstDialog, "visible", false);
            this.json.setValue(this.data.firstDialog, "xpos", 113);
            this.json.setValue(this.data.firstDialog, "ypos", 114);
            this.json.setValue(this.data.firstDialog, "visible", true);
            this.testPosArgs.dialog = this.getWidgetInstance("firstDialog").getDom();
            this.testPosArgs.testValues = {
                left : 113,
                top : 114
            };
            this._testPositioning();

            // close the first dialog and open the second one
            this.json.setValue(this.data.firstDialog, "visible", false);
            this.json.setValue(this.data.secondDialog, "visible", true);

            aria.core.Timer.addCallback({
                fn : this._afterSecondDialogShow,
                scope : this,
                delay : 500
            });
        },
        /**
         * Check that xpos and ypos are correctly set after showing the centered dialog
         */
        _afterSecondDialogShow : function () {
            this.testPosArgs = {
                dataHolder : this.data.secondDialog,
                sectionOverlay : "dialogContent_two",
                dialog : this.getWidgetInstance("secondDialog").getDom(),
                testValues : {
                    width : 300,
                    height : 300
                },
                tolerance : (aria.core.Browser.isIE9 || aria.core.Browser.isIE10) ? 5 : 1
            };
            // Test initial positioning
            this._testPositioning();
            this.assertTrue(this.data.secondDialog.center === true, "Center value is not reflected in the data model");

            // Change xpos
            this.json.setValue(this.data.secondDialog, "xpos", 150);
            this.testPosArgs.testValues = {
                left : 150,
                top : this.data.secondDialog.ypos
            };
            this._testPositioning();
            this.assertTrue(this.data.secondDialog.center === false, "Center value is not reflected in the data model");

            // Change ypos
            this.json.setValue(this.data.secondDialog, "ypos", 125);
            this.testPosArgs.testValues.top = 125;
            this._testPositioning();
            this.assertTrue(this.data.secondDialog.center === false, "The dialog is still centered after moving it");

            // Center the dialog
            this.json.setValue(this.data.secondDialog, "center", true);
            this.testPosArgs.testValues = {
                width : 300,
                height : 300
            };
            this._testPositioning();

            // Change the positions
            this.json.setValue(this.data.secondDialog, "xpos", 150);
            this.json.setValue(this.data.secondDialog, "ypos", 125);
            this.assertTrue(this.data.secondDialog.center === false, "The dialog is still centered after moving it");

            // Test that positions are kept after closing opening the dialog
            this.json.setValue(this.data.secondDialog, "visible", false);
            this.json.setValue(this.data.secondDialog, "visible", true);
            this.testPosArgs.dialog = this.getWidgetInstance("secondDialog").getDom();
            this.testPosArgs.testValues = {
                left : 150,
                top : 125
            };
            this._testPositioning();

            // Test that the dialog is re-centered after changing the data model when it is closed
            this.json.setValue(this.data.secondDialog, "visible", false);
            this.json.setValue(this.data.secondDialog, "center", true);
            this.json.setValue(this.data.secondDialog, "visible", true);
            this.testPosArgs.dialog = this.getWidgetInstance("secondDialog").getDom();
            this.testPosArgs.testValues = {
                width : 300,
                height : 300
            };
            this._testPositioning();

            this.end();
        }

    }
});
