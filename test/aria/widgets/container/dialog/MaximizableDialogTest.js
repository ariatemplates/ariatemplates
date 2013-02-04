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

        Aria.$window.testData = this.data = {
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
            page : {
                overflowX : true,
                overflowY : true
            },
            iframeWrapper : {
                width : 600,
                height : 600
            }
        };

        Aria.$window.onBeforeTemplateLoadInIframe = function (aria) {
            // override skin's shadows with some non-zero values to check if the shadow handling in the maximized mode
            // works as supposed (defaults are 0 so it won't be really checked)
            var skin = aria.widgets.AriaSkin.skinObject.Dialog.std;
            skin.shadowLeft = 2;
            skin.shadowTop = 2;
        };

        this.setTestEnv({
            // template : "test.aria.widgets.container.dialog.MaximizableDialogTestTpl",
            template : "test.aria.widgets.container.dialog.MaximizableDialogTestIframe",
            data : this.data.iframeWrapper
        });

        this.iframeUnderTestId = "iframeWithDialog";
        this.widgetUnderTestId = "maxiDialog";
        this.isPhantomJs = Aria.$window.navigator.userAgent.indexOf('PhantomJS') != -1;
        this.json = aria.utils.Json;
    },
    $prototype : {
        runTemplateTest : function () {

            // the assumption is that after any test below, the situation will be like the initial one
            this._testsToExecute = [];
            this._testsToExecute.push("_testVisibleMaximizeUnmaximizeMaximize");
            this._testsToExecute.push("_testHiddenMaximize");
            this._testsToExecute.push("_testHiddenUnmaximize");

            // this._testsToExecute.push("_testCenteredMaximizeUnmaximize"); // NEEDS TEST; should remain centered

            // this._testsToExecute.push("_testVisibleAndMaximizedFromStart"); // NEEDS TEST

            this._testsToExecute.push("_testMoveWhileMaximized");
            // this._testsToExecute.push("_testResizeWhileMaximized"); // FEATURE NOT IMPLEMENTED YET

            this._testsToExecute.push("_testStaysMaximizedOnViewportResize");

            this._beforeFirstTest();
        },

        _beforeFirstTest : function () {

            Aria.$window.document.documentElement.style.backgroundColor = "aliceblue";
            // Aria.$window.document.getElementById('TESTAREA').style.height = '';

            // This is an implicit test whether Dialog maxheight is ignored in the maximized mode.
            // If below is true and all other tests pass, then maxheight is correctly ignored.
            this.assertTrue(this.data.dialog.maxheight + 50 < this.data.iframeWrapper.height, "Invalid test config, iframe should be bigger than Dialog maxheight for this test.");

            this.iframe = aria.utils.Dom.getElementById(this.iframeUnderTestId);
            this.waitForIframe(this.iframeUnderTestId, this.widgetUnderTestId, this._iframeReady);
        },

        _iframeReady : function () {
            this.nextTest();
        },

        _testVisibleMaximizeUnmaximizeMaximize : function () {
            var dialogData = this.data.dialog;

            this.json.setValue(dialogData, "visible", true);
            var dialog = this.__getDialog();

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

        _testMoveWhileMaximized : function () {
            var dialogData = this.data.dialog;
            var wherever = 42;

            // nothing should happen
            this.json.setValue(dialogData, "maximized", true);
            this.json.setValue(dialogData, "xpos", wherever);
            this.json.setValue(dialogData, "ypos", wherever);
            this.__doMaximizedAssertions();

            this.nextTest();
        },

        _testResizeWhileMaximized : function () {
            var dialogData = this.data.dialog;
            var delta = 20;

            // nothing should happen
            this.json.setValue(dialogData, "maximized", true);
            this.json.setValue(dialogData, "width", dialogData.width - delta);
            this.json.setValue(dialogData, "height", dialogData.height - delta);
            this.__doMaximizedAssertions();

            this.nextTest();
        },

        _testStaysMaximizedOnViewportResize : function () {
            var dialogData = this.data.dialog;
            this.json.setValue(dialogData, "maximized", true);

            var delta = 20;
            var initialDimensions = this.data.iframeWrapper;
            this.iframe.style.width = (initialDimensions.width + delta) + "px";
            this.iframe.style.height = (initialDimensions.height + delta) + "px";

            aria.core.Timer.addCallback({
                fn : this.__staysMaximizedCheck,
                scope : this,
                delay : 100
            });
        },

        __staysMaximizedCheck : function () {
            this.__doMaximizedAssertions();

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
            var skin = this.__getDialog()._skinObj; // {shadowLeft|Right|Top|Bottom}
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
        },

        __doUnmaximizedAssertions : function () {
            var dialogGeo = this.__getDialogGeometry(); // {x,y,width,height}
            this.assertEquals(dialogGeo.x, this.INITIAL_XPOS, "Dialog x is %1 while the initial was %2");
            this.assertEquals(dialogGeo.y, this.INITIAL_YPOS, "Dialog y is %1 while the initial was %2");
            this.assertEquals(dialogGeo.width, this.INITIAL_WIDTH, "Dialog width is %1 while the initial was %2");
            this.assertEquals(dialogGeo.height, this.INITIAL_HEIGHT, "Dialog height is %1 while the initial was %2");
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
            // var container = this.getWidgetInstance(this.widgetUnderTestId);
            var container = this.getWidgetInstanceInIframe(this.iframe, this.widgetUnderTestId);
            return container;
        },

        __getDialogGeometry : function () {
            // var container = this.getWidgetInstance(this.widgetUnderTestId);
            var container = this.getWidgetInstanceInIframe(this.iframe, this.widgetUnderTestId);
            var geometry = aria.utils.Dom.getGeometry(container.getDom());
            return geometry;
        },

        __getViewportSizeInIframe : function () {
            return this.iframe.contentWindow.aria.utils.Dom._getViewportSize();
        }
    }
});
