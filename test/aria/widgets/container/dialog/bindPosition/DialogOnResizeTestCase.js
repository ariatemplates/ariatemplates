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
 * Test the binding of xpos, ypos and center for dialog widgets when resizing the window
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.bindPosition.DialogOnResizeTestCase",
    $extends : "test.aria.widgets.container.dialog.MovableDialogBaseTestCase",
    $constructor : function () {
        this.$MovableDialogBaseTestCase.constructor.call(this);
        this.testData = {
            firstDialog : {
                visible : true,
                center : false
            },
            processing : true
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.bindPosition.IframeTemplate",
            data : this.testData,
            iframe : true,
            cssText : "position:fixed;top:20px;left:20px;z-index:10000;width:612px;height:612px;border:1px solid blue;background:aliceblue"
        });

    },
    $prototype : {

        startDialogTest : function () {
            var testWindow = this.testWindow, data = this.testData;

            this.testPosArgs = {
                dataHolder : data.firstDialog,
                sectionOverlay : "dialogContent_one",
                tolerance : (aria.core.Browser.isIE9 || aria.core.Browser.isIE10) ? 5 : 1
            };
            this.testPosArgs.dialog = this.getWidgetInstance("firstDialog").getDom();
            this.testPosArgs.testValues = {
                left : 50,
                top : 100
            };
            // Test initial positioning
            this._testPositioning();
            this.assertTrue(data.firstDialog.center === false);

            // Change xpos
            this.json.setValue(data.firstDialog, "xpos", 150);
            this.testPosArgs.testValues.left = 150;
            this._testPositioning();

            // Change ypos
            this.json.setValue(data.firstDialog, "ypos", 125);
            this.testPosArgs.testValues.top = 125;
            this._testPositioning();

            // Resize the iframe
            var iframe = this.testIframe;
            iframe.style.width = "500px";
            iframe.style.height = "500px";

            aria.core.Timer.addCallback({
                fn : this._afterIframeResize,
                scope : this,
                delay : 1000
            });
        },

        _afterIframeResize : function () {

            // Test that the position did not change after resizing
            this._testPositioning();

            // center the dialog
            this.json.setValue(this.testData.firstDialog, "center", true);

            this.testPosArgs.testValues = {
                width : 300,
                height : 300
            };

            this._testPositioning();

            // resize the window
            var iframe = this.testIframe;
            iframe.style.width = "400px";
            iframe.style.height = "400px";

            aria.core.Timer.addCallback({
                fn : this._afterIframeResizeAgain,
                scope : this,
                delay : 1000
            });
        },

        _afterIframeResizeAgain : function () {
            // Test that the dialog is still centered
            this._testPositioning();

            var data = this.testData;
            this.json.setValue(data.firstDialog, "xpos", 15000);
            this.testPosArgs.testValues = this._fitInViewport({
                left : 15000,
                top : 15000,
                width : 300,
                height : 300
            });
            this.json.setValue(data.firstDialog, "ypos", 15000);
            this._testPositioning();

            // resize the window
            this.borderValues = {
                left : data.firstDialog.xpos,
                top : data.firstDialog.ypos
            };

            var iframe = this.testIframe;

            iframe.style.width = "350px";
            iframe.style.height = "350px";

            aria.core.Timer.addCallback({
                fn : this._afterIframeResizeOnceAgain,
                scope : this,
                delay : 1000
            });
        },

        // Test that the dialog is kept in viewport after resizing
        _afterIframeResizeOnceAgain : function () {

            this.testPosArgs.testValues = {
                left : this.borderValues.left - 50,
                top : this.borderValues.left - 50
            };
            this._testPositioning();

            this.end();
        }

    }
});
