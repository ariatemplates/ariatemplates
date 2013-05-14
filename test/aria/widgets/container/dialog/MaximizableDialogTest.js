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

/**
 * Test case for aria.widgets.container.Dialog
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.MaximizableDialogTest",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.INITIAL_WIDTH = 300;
        this.INITIAL_HEIGHT = 300;
        this.INITIAL_XPOS = 111;
        this.INITIAL_YPOS = 111;
        this.INITIAL_MAXHEIGHT = 500; // must be smaller than iframe height

        this.data = {
            dialog : {
                width : this.INITIAL_WIDTH,
                height : this.INITIAL_HEIGHT,
                maxheight : this.INITIAL_MAXHEIGHT,
                xpos : this.INITIAL_XPOS,
                ypos : this.INITIAL_YPOS,
                visible : false,
                center : false,
                maximized : false
            },
            dialogMaxiFromStart : {
                width : this.INITIAL_WIDTH,
                height : this.INITIAL_HEIGHT,
                xpos : this.INITIAL_XPOS,
                ypos : this.INITIAL_YPOS,
                visible : true,
                maximized : true
            },
            page : {
                overflowX : true,
                overflowY : true
            },
            iframeWrapper : {
                width : 600,
                height : 600
            },
            sectionRefreshTimeStamp : new Date().getTime()
        };

        this.$on({
            "beforeLoadTplInIframe" : {
                fn : this.onBeforeTemplateLoadInIframe
            },
            scope : this
        });

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.MaximizableDialogTestTpl",
            data : this.data,
            cssText : [
                "width:" + this.data.iframeWrapper.width + "px",
                "height:" + this.data.iframeWrapper.height + "px",
                "border:1px solid blue;"
            ].join(";"),
            iframe : true
        });

        this.widgetUnderTestId = "dialogMaxiFromStart"; // only for the first test
        this.isPhantomJs = Aria.$window.navigator.userAgent.indexOf("PhantomJS") != -1;
        this.json = aria.utils.Json;
    },
    $prototype : {
        onBeforeTemplateLoadInIframe : function (event) {
            // override skin's shadows with some non-zero values to check if the shadow handling in the maximized mode
            // works as supposed (defaults are 0 so it won't be really checked)
            var skin = event.window.aria.widgets.AriaSkin.skinObject.Dialog.std;
            skin.shadowLeft = 2;
            skin.shadowTop = 2;
        },

        runTemplateTest : function () {
            // This is an implicit test whether Dialog maxheight is ignored in the maximized mode.
            // If below is true and all other tests pass, then maxheight is correctly ignored.
            this.assertTrue(this.data.dialog.maxheight + 50 < this.data.iframeWrapper.height, "Invalid test config, iframe should be bigger than Dialog maxheight for this test.");

            // the assumption is that after any test below, the situation will be like the initial one
            this._testsToExecute = [];
            this._testsToExecute.push("_testVisibleAndMaximizedFromStart");

            this._testsToExecute.push("_testVisibleMaximizeUnmaximizeMaximize");
            this._testsToExecute.push("_testHiddenMaximize");
            this._testsToExecute.push("_testHiddenUnmaximize");
            this._testsToExecute.push("_testAutoDimensionsMaximize");
            this._testsToExecute.push("_testCenteredMaximizeUnmaximize");

            this._testsToExecute.push("_testMoveWhileMaximizedGetsIgnored");
            this._testsToExecute.push("_testResizeWhileMaximizedGetsIgnored");

            this._testsToExecute.push("_testStaysMaximizedOnViewportResize");
            this._testsToExecute.push("_testCanUnmaximizeAfterSectionRefresh");

            this.nextTest();
        },

        _testVisibleAndMaximizedFromStart : function () {
            // in this test we use another instance of widget
            this.widgetUnderTestId = "dialogMaxiFromStart";
            this.__doMaximizedAssertions();

            this.json.setValue(this.data.dialogMaxiFromStart, "maximized", false);

            // After unmaximizing this Dialog, the instances od Draggable and Resizable are created asynchronously for
            // the first time. We need to wait for the dependencies to be loaded before continuing with the tests.
            this.waitFor({
                condition : function () {
                    var dialog = this.__getDialog();
                    return (dialog._draggable && dialog._resizable);
                },
                callback : {
                    fn : this.__checkVisMaxFromStart_AfterUnmax,
                    scope : this
                }
            });
        },
        __checkVisMaxFromStart_AfterUnmax : function () {
            this.__doUnmaximizedAssertions();

            // reset for another tests
            this.json.setValue(this.data.dialogMaxiFromStart, "visible", false);
            this.widgetUnderTestId = "dialogMaxi";

            this.nextTest();
        },

        _testVisibleMaximizeUnmaximizeMaximize : function () {
            var dialogData = this.data.dialog;

            this.json.setValue(dialogData, "visible", true);
            var dialog = this.__getDialog();

            // Very basic test to check if max/unmax work properly in "normal" circumstances.
            this.__waitForDialog(dialog, this.__checkMaxUnmaxMax);
        },

        __checkMaxUnmaxMax : function () {
            var dialogData = this.data.dialog;

            this.__doUnmaximizedAssertions();

            this.json.setValue(dialogData, "maximized", true);
            this.__doMaximizedAssertions();

            this.json.setValue(dialogData, "maximized", false);
            this.__doUnmaximizedAssertions();

            this.json.setValue(dialogData, "maximized", true);
            this.__doMaximizedAssertions();

            this.json.setValue(dialogData, "maximized", false);
            this.nextTest();
        },

        _testHiddenMaximize : function () {
            var dialogData = this.data.dialog;

            // hide it, maximize when hidden, and display. Should be maximized.
            this.json.setValue(dialogData, "visible", false);
            this.json.setValue(dialogData, "maximized", true);
            this.json.setValue(dialogData, "visible", true);
            this.__doMaximizedAssertions();

            this.json.setValue(dialogData, "maximized", false);
            this.__doUnmaximizedAssertions();

            this.nextTest();
        },

        _testHiddenUnmaximize : function () {
            var dialogData = this.data.dialog;

            // maximize when visible, then hide, unmaximize when hidden, redisplay. Should be in initial state.
            this.json.setValue(dialogData, "maximized", true);
            this.json.setValue(dialogData, "visible", false);
            this.json.setValue(dialogData, "maximized", false);
            this.json.setValue(dialogData, "visible", true);
            this.__doUnmaximizedAssertions();

            this.nextTest();
        },

        _testAutoDimensionsMaximize : function () {
            var dialogData = this.data.dialog;

            // this is to test that maximized works also when width/height is set to -1 (auto) in the config
            this.json.setValue(dialogData, "height", -1);
            this.json.setValue(dialogData, "maximized", true);
            this.__doMaximizedAssertions();

            // when setting height to -1, the Dialog expands and it can be moved upwards, hence need to reset ypos
            this.json.setValue(dialogData, "maximized", false);
            this.json.setValue(dialogData, "height", this.INITIAL_HEIGHT);
            this.json.setValue(dialogData, "ypos", this.INITIAL_YPOS);
            this.__doUnmaximizedAssertions();

            this.json.setValue(dialogData, "width", -1);
            this.json.setValue(dialogData, "maximized", true);
            this.__doMaximizedAssertions();

            this.json.setValue(dialogData, "maximized", false);
            this.json.setValue(dialogData, "width", this.INITIAL_WIDTH);
            this.json.setValue(dialogData, "xpos", this.INITIAL_XPOS);
            this.__doUnmaximizedAssertions();

            this.nextTest();
        },

        _testCenteredMaximizeUnmaximize : function () {
            // after centering, maximizing, unmaximizing, it should remain centered

            var dialogData = this.data.dialog;
            var dialogGeo; // {x,y,width,height}
            var val1, val2;
            var iframeViewport = this.__getViewportSizeInIframe();

            this.json.setValue(dialogData, "visible", true);
            this.json.setValue(dialogData, "xpos", 0);
            dialogGeo = this.__getDialogGeometry();
            this.assertEquals(dialogGeo.x, 0);

            this.json.setValue(dialogData, "center", true);
            dialogGeo = this.__getDialogGeometry();
            // when centered, 2 * xpos === leftmargin + rightmargin, with 1px margin error in IE9+
            val1 = Math.abs(2 * dialogGeo.x + dialogGeo.width - iframeViewport.width);
            val2 = Math.abs(2 * dialogGeo.y + dialogGeo.height - iframeViewport.height);
            this.assertTrue(val1 <= 1, "Not centered properly on X axis. The error is " + val1 + "px.");
            this.assertTrue(val2 <= 1, "Not centered properly on Y axis. The error is " + val2 + "px.");

            this.json.setValue(dialogData, "maximized", true);
            this.__doMaximizedAssertions();

            this.json.setValue(dialogData, "maximized", false);
            dialogGeo = this.__getDialogGeometry();
            val1 = Math.abs(2 * dialogGeo.x + dialogGeo.width - iframeViewport.width);
            val2 = Math.abs(2 * dialogGeo.y + dialogGeo.height - iframeViewport.height);
            this.assertTrue(val1 <= 1, "Not centered properly on X axis. The error is " + val1 + "px.");
            this.assertTrue(val2 <= 1, "Not centered properly on Y axis. The error is " + val2 + "px.");

            // reset
            this.json.setValue(dialogData, "xpos", this.INITIAL_XPOS);
            this.json.setValue(dialogData, "ypos", this.INITIAL_YPOS);
            this.nextTest();
        },

        _testMoveWhileMaximizedGetsIgnored : function () {
            var dialogData = this.data.dialog;
            var wherever = 42;

            // nothing should happen
            this.json.setValue(dialogData, "maximized", true);
            this.json.setValue(dialogData, "xpos", wherever);
            this.json.setValue(dialogData, "ypos", wherever);
            this.__doMaximizedAssertions();

            this.json.setValue(dialogData, "maximized", false);
            this.__doUnmaximizedAssertions();
            this.nextTest();
        },

        _testResizeWhileMaximizedGetsIgnored : function () {
            var dialogData = this.data.dialog;
            var delta = 20;

            // nothing should happen after changing width and height -- the Dialog should remain maximized
            this.json.setValue(dialogData, "maximized", true);
            this.json.setValue(dialogData, "width", dialogData.width - delta);
            this.json.setValue(dialogData, "height", dialogData.height - delta);
            this.__doMaximizedAssertions();

            this.json.setValue(dialogData, "maximized", false);
            this.__doUnmaximizedAssertions();
            this.nextTest();
        },

        _testStaysMaximizedOnViewportResize : function () {
            var dialogData = this.data.dialog;

            aria.templates.RefreshManager.stop();
            this.json.setValue(dialogData, "xpos", this.INITIAL_XPOS);
            this.json.setValue(dialogData, "ypos", this.INITIAL_YPOS);
            this.json.setValue(dialogData, "width", this.INITIAL_WIDTH);
            this.json.setValue(dialogData, "height", this.INITIAL_HEIGHT);
            aria.templates.RefreshManager.resume();

            this.json.setValue(dialogData, "maximized", true);

            this.__resizeIframe(20, this.__resizeOnceAgain);
        },
        __resizeIframe : function (delta, continueWith) {
            var initialDimensions = this.data.iframeWrapper;
            this.testIframe.style.width = (initialDimensions.width + delta) + "px";
            this.testIframe.style.height = (initialDimensions.height + delta) + "px";
            this.waitFor({
                condition : function () {
                    return this.__checkMaximizedWidthAssertion();
                },
                callback : {
                    fn : continueWith,
                    scope : this
                }
            });
        },
        __resizeOnceAgain : function () {
            this.__resizeIframe(40, this.__staysMaximizedCheck);
        },
        __staysMaximizedCheck : function () {
            this.__doMaximizedAssertions();

            // now let's check if we can unmaximize
            this.json.setValue(this.data.dialog, "maximized", false);
            this.__doUnmaximizedAssertions();

            this.nextTest();
        },

        _testCanUnmaximizeAfterSectionRefresh : function () {
            this.json.setValue(this.data.dialog, "maximized", true);
            this.json.setValue(this.data, "sectionRefreshTimeStamp", new Date().getTime());
            this.json.setValue(this.data.dialog, "maximized", false);
            this.__doUnmaximizedAssertions();

            this.json.setValue(this.data.dialog, "maximized", true);
            this.__doMaximizedAssertions();

            // reset
            this.json.setValue(this.data.dialog, "maximized", false);
            this.nextTest();
        },

        /**
         * @override
         */
        notifyTemplateTestEnd : function () {
            Aria.$window.document.documentElement.style.backgroundColor = "#fff";
            this.$TemplateTestCase.notifyTemplateTestEnd.call(this);
        },

        __doMaximizedAssertions : function () {
            var dialog = this.__getDialog();
            var skin = dialog._skinObj; // {shadowLeft|Right|Top|Bottom}
            var dialogGeo = this.__getDialogGeometry(); // {x,y,width,height}
            var viewport = this.__getViewportSizeInIframe(); // {width, height}

            var dialogWidthNoShadow = dialogGeo.width - skin.shadowLeft;
            var dialogHeightNoShadow = dialogGeo.height - skin.shadowTop;
            if (!this.isPhantomJs) {
                // dirty hack for PhantomJS, FIXME!
                // for some reason $viewportResized in Dialog::_setBodyOverflow is not executed properly in PhantomJS
                dialogWidthNoShadow -= skin.shadowRight;
                dialogHeightNoShadow -= skin.shadowBottom;
            }
            this.assertEquals(viewport.width, dialogWidthNoShadow, "Viewport width is %1 while dialog width %2");
            this.assertEquals(viewport.height, dialogHeightNoShadow, "Viewport height is %1 while dialog height %2");
            this.assertEquals(dialogGeo.x, -skin.shadowLeft, "Dialog x is %1 while should be %2");
            this.assertEquals(dialogGeo.y, -skin.shadowTop, "Dialog y is %1 while should be %2");

            this.assertEquals(dialog._draggable, null);
            this.assertEquals(dialog._resizable, null);
        },

        __doUnmaximizedAssertions : function () {
            var dialog = this.__getDialog();
            var dialogGeo = this.__getDialogGeometry(); // {x,y,width,height}
            this.assertEquals(dialogGeo.x, this.INITIAL_XPOS, "Dialog x is %1 while the initial was %2");
            this.assertEquals(dialogGeo.y, this.INITIAL_YPOS, "Dialog y is %1 while the initial was %2");
            this.assertEquals(dialogGeo.width, this.INITIAL_WIDTH, "Dialog width is %1 while the initial was %2");
            this.assertEquals(dialogGeo.height, this.INITIAL_HEIGHT, "Dialog height is %1 while the initial was %2");

            this.assertNotEquals(dialog._draggable, null);
            this.assertNotEquals(dialog._resizable, null);
        },

        /**
         * A function to check that Dialog width got changed after viewport resize -- to enable polling in waitFor
         * instead of having to define a callback delay.
         * @return {Boolean}
         */
        __checkMaximizedWidthAssertion : function () {
            var skin = this.__getDialog()._skinObj; // {shadowLeft|Right|Top|Bottom}
            var dialogGeo = this.__getDialogGeometry(); // {x,y,width,height}
            var viewport = this.__getViewportSizeInIframe(); // {width, height}

            var dialogWidthNoShadow = dialogGeo.width - skin.shadowLeft;
            if (!this.isPhantomJs) {
                dialogWidthNoShadow -= skin.shadowRight;
            }
            return viewport.width === dialogWidthNoShadow;
        },

        /**
         * Waits until the Dialog has been fully loaded, including resizable and draggable.
         * @param {Function} continueWith Callback (scoped in "this") to be executed when the dialog is available
         */
        __waitForDialog : function (dialog, continueWith) {
            this.waitFor({
                condition : function () {
                    return dialog._draggable && dialog._resizable;
                },
                callback : {
                    fn : continueWith,
                    scope : this
                }
            });
        },

        __getDialog : function () {
            return this.getWidgetInstance(this.widgetUnderTestId);
        },

        __getDialogGeometry : function () {
            var container = this.getWidgetInstance(this.widgetUnderTestId);
            var geometry = aria.utils.Dom.getGeometry(container.getDom());
            return geometry;
        },

        __getViewportSizeInIframe : function () {
            return this.testWindow.aria.utils.Dom._getViewportSize();
        }
    }
});
