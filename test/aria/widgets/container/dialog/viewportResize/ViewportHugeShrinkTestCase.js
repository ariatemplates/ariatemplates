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
    $classpath : "test.aria.widgets.container.dialog.viewportResize.ViewportHugeShrinkTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {

        this.$TemplateTestCase.constructor.call(this);

        this.data = {
            dialog : {
                width : 111,
                height : 111,
                xpos : 555,
                ypos : 555
            },
            iframeWrapper : {
                width : 700,
                height : 700
            }
        };

        var frameDim = this.data.iframeWrapper;
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.viewportResize.ViewportHugeShrinkTemplate",
            data : this.data,
            css : "overflow:hidden; width:" + frameDim.width + "px; height:" + frameDim.height + "px",
            iframe : true
        });

        this.widgetUnderTestId = "theDialog";
    },
    $prototype : {

        /*
         * The aim of this test is to check what happens when the viewport is dramatically shrinked, so that the
         * Dialog's [x,y] coords before resize were bigger than new viewport's width & height. (e.g. dialog was
         * positioned at 555x555, and the new window size is much smaller and doesn't contain this reference point).
         *
         * The core of the possible issues is that if something goes wrong during the execution of popup handling logic,
         * the popup, which is temporarily positioned in a remote place at [-15000, -15000], might not be moved back
         * to the viewport.
         */
        runTemplateTest : function () {
            // in Chrome, overflow:hidden on iframe is not enough, need to set it on <HTML> inside iframe
            this.testWindow.document.documentElement.style.overflow = "hidden";
            this._testIsInViewportAfterHugeViewportShrink();
        },

        _testIsInViewportAfterHugeViewportShrink : function () {
            this.__resizeIframe(-400, this.__checkVisibility);
        },
        __checkVisibility : function () {
            var geometry = this.__getDialogGeometry();

            // calling AT in an iframe to use iframe's viewport in computations
            var inViewport = this.testWindow.aria.utils.Dom.isInViewport({
                top : geometry.y,
                left : geometry.x
            }, {
                width : geometry.width,
                height : geometry.height
            });

            this.assertTrue(inViewport, "Dialog is not in the viewport after window resize");
            this.end();
        },

        __resizeIframe : function (delta, continueWith) {
            var initialDimensions = this.data.iframeWrapper;
            this.testIframe.style.width = (initialDimensions.width + delta) + "px";
            this.testIframe.style.height = (initialDimensions.height + delta) + "px";
            this.waitFor({
                condition : function () {
                    return this.__getDialog(); // wait until the dialog is re-instantiated
                },
                callback : {
                    fn : continueWith,
                    scope : this
                }
            });
        },

        /**
         * @override
         */
        notifyTemplateTestEnd : function () {
            Aria.$window.document.documentElement.style.backgroundColor = "#fff";
            this.$TemplateTestCase.notifyTemplateTestEnd.call(this);
        },

        __getDialog : function () {
            return this.getWidgetInstance(this.widgetUnderTestId);
        },

        __getDialogGeometry : function () {
            var container = this.getWidgetInstance(this.widgetUnderTestId);
            var geometry = aria.utils.Dom.getGeometry(container.getDom());
            return geometry;
        }
    }
});
