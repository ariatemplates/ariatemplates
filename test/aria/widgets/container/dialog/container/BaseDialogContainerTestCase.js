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
    $classpath : "test.aria.widgets.container.dialog.container.BaseDialogContainerTestCase",
    $dependencies : ["aria.utils.Type"],
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {};
        this.setTestEnv({
            iframe: true,
            template : "test.aria.widgets.container.dialog.container.DialogContainer",
            css: "left:0px;top:0px;border:0px;width:1200px;height:700px;",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.testWindow.scrollTo(0, 1492);
            this.getElementById("home").scrollTop = 1503;
            this.start();
        },

        start: function () {},

        resizeViewport : function (width, height, cb) {
            var iframeStyle = this.testIframe.style;
            iframeStyle.width = Math.floor(width) + "px";
            iframeStyle.height = Math.floor(height) + "px";
            setTimeout(cb, 100);
        },

        waitForFocus : function (id, callback) {
            var self = this;
            return function () {
                self.waitForDomEltFocus(self.getElementById(id), callback);
            };
        },

        // Adding the following function here, as it is not available in TemplateTestCase in the 1.4-17 branch
        /**
         * Waits for the given DOM element to have the focus.
         * @param {HTMLElement} domElt : DOM element
         * @param {Function} cb : callback which will be called when the DOM element has the focus
         */
        waitForDomEltFocus : function (domElt, cb) {
            this.waitFor({
                condition : function () {
                    return domElt === this.testDocument.activeElement;
                },
                callback : cb
            });
        },

        waitForIdVisible : function (id, callback) {
            var self = this;
            return function () {
                self.waitFor({
                    condition: function () {
                        var elt = self.getElementById(id);
                        var geometry = self.testWindow.aria.utils.Dom.getGeometry(elt);
                        return !! geometry;
                    },
                    callback: callback
                });
            };
        },

        getDialogGeometry : function (id) {
            var dialogWidget = this.getWidgetInstance(id);
            var domElt = dialogWidget.getDom();
            return this.getGeometry(domElt);
        },

        getDialogMaskGeometry : function (id) {
            var dialogWidget = this.getWidgetInstance(id);
            var domElt = dialogWidget._popup.modalMaskDomElement;
            return this.getGeometry(domElt);
        },

        getGeometry : function (domElt) {
            if (aria.utils.Type.isString(domElt)) {
                domElt = this.getElementById(domElt);
            }
            return this.testWindow.aria.utils.Dom.getGeometry(domElt);
        },

        getClientGeometry : function (domElt) {
            if (aria.utils.Type.isString(domElt)) {
                domElt = this.getElementById(domElt);
            }
            return this.testWindow.aria.utils.Dom.getClientGeometry(domElt);
        },

        assertCentered : function (geometry1, geometry2) {
            var posX = geometry1.x + (geometry1.width - geometry2.width) / 2;
            var posY = geometry1.y + (geometry1.height - geometry2.height) / 2;
            this.assertPixelEquals(posX, geometry2.x);
            this.assertPixelEquals(posY, geometry2.y);
        },

        assertSameGeometry : function (geometry1, geometry2) {
            this.assertPixelEquals(geometry1.x, geometry2.x);
            this.assertPixelEquals(geometry1.y, geometry2.y);
            this.assertPixelEquals(geometry1.width, geometry2.width);
            this.assertPixelEquals(geometry1.height, geometry2.height);
        },

        getDialogTitleBar : function (id) {
            var dialogWidget = this.getWidgetInstance(id);
            return dialogWidget._titleBarDomElt;
        },

        getDialogMaximizeButton : function (id) {
            var titleBar = this.getDialogTitleBar(id);
            var child = titleBar.lastChild;
            while (child && ! (/maximize/.test(child.className))) {
                child = child.previousSibling;
            }
            return child;
        },

        moveDialog : function (id, newPositionOffset, callback) {
            var dialogTitleBar = this.getDialogTitleBar(id);
            var dialogTitleBarGeometry = this.getGeometry(dialogTitleBar);
            var dialogTitleCenter = {
                x : dialogTitleBarGeometry.x + dialogTitleBarGeometry.width / 2,
                y : dialogTitleBarGeometry.y + dialogTitleBarGeometry.height / 2
            };
            var destination = {
                x : dialogTitleCenter.x + newPositionOffset.x,
                y : dialogTitleCenter.y + newPositionOffset.y
            };
            this.synEvent.drag({
                to: destination
            }, dialogTitleCenter, callback);
        },

        assertDisplayMatchesDataModel : function (containerGeometry, dialogName) {
            var dialogGeometry = this.getDialogGeometry(dialogName + "Dialog");
            if (this.data[dialogName + "Maximized"]) {
                this.assertSameGeometry(containerGeometry, dialogGeometry);
            } else {
                this.assertPixelEquals(dialogGeometry.x - containerGeometry.x, this.data[dialogName + "X"]);
                this.assertPixelEquals(dialogGeometry.y - containerGeometry.y, this.data[dialogName + "Y"]);
                if (this.data[dialogName + "Width"] !== -1) {
                    this.assertPixelEquals(dialogGeometry.width, this.data[dialogName + "Width"]);
                }
                if (this.data[dialogName + "Height"] !== -1) {
                    this.assertPixelEquals(dialogGeometry.height, this.data[dialogName + "Height"]);
                }
                if (this.data[dialogName + "Center"]) {
                    this.assertCentered(containerGeometry, dialogGeometry);
                }
            }

            // checks that the dialog stays inside the container:
            this.assertTrue(dialogGeometry.x >= containerGeometry.x);
            this.assertTrue(dialogGeometry.y >= containerGeometry.y);
            this.assertTrue(dialogGeometry.x + dialogGeometry.width <= containerGeometry.x + containerGeometry.width);
            this.assertTrue(dialogGeometry.y + dialogGeometry.height <= containerGeometry.y + containerGeometry.height);
            return dialogGeometry;
        },

        // aria.core.Browser is part of the core, that's why it is possible to use it directly:
        assertPixelEquals : aria.core.Browser.isOldIE ? function (x, y) {
            this.assertEqualsWithTolerance(x, y, 1);
        } : function (x, y) {
            this.assertEquals(Math.floor(x), Math.floor(y));
        }
    }
});
