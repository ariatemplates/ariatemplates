/*
 * Copyright 2017 Amadeus s.a.s.
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
 * Test that resizable dialog is actually resized in the DOM with no refresh when dragging its edges.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.resize.noRefresh.ResizableDialogRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            visible: true,
            xpos: 100,
            ypos: 100,
            width: 400,
            height: 200,
            center: false
        };
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.resize.noRefresh.ResizableDialogTemplate",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.dialogInstance = this.getWidgetInstance("myDialog");
            this.iframe = this.getElementById("myIframe");
            this.execute([
                [this.navigateInIFrame],
                [this.checkGeometry, 100, 100, 400, 200],
                [this.moveHandle, 0 /* n-resize */, 0, -25],
                [this.checkGeometry, 100, 75, 400, 225],
                [this.moveHandle, 1 /* s-resize */, 0, 25],
                [this.checkGeometry, 100, 75, 400, 250],
                [this.moveHandle, 2 /* e-resize */, 25, 0],
                [this.checkGeometry, 100, 75, 425, 250],
                [this.moveHandle, 3 /* w-resize */, -25, 0],
                [this.checkGeometry, 75, 75, 450, 250],
                [this.moveHandle, 4 /* ne-resize */, 25, -25],
                [this.checkGeometry, 75, 50, 475, 275],
                [this.moveHandle, 5 /* nw-resize */, -25, -25],
                [this.checkGeometry, 50, 25, 500, 300],
                [this.moveHandle, 6 /* se-resize */, 25, 25],
                [this.checkGeometry, 50, 25, 525, 325],
                [this.moveHandle, 7 /* sw-resize */, -25, 25],
                [this.checkGeometry, 25, 25, 550, 350]
            ], this.end);
        },

        checkGeometry: function (x, y, width, height, cb) {
            this.waitFor({
                condition: function () {
                    var data = this.data;
                    return data.xpos === x && data.ypos === y && data.width === width && data.height === height;
                },
                callback: function () {
                    var dialogGeometry = aria.utils.Dom.getGeometry(this.dialogInstance.getDom());
                    this.assertEquals(dialogGeometry.x, x);
                    this.assertEquals(dialogGeometry.y, y);
                    this.assertEquals(dialogGeometry.width, width);
                    this.assertEquals(dialogGeometry.height, height);
                    // check that there was no refresh, we are still on the second page in the iframe:
                    this.assertTrue(!!this.getElementById("myIframe").contentWindow.document.getElementById("linkToPage1"), "There was a refresh after resizing!");
                    cb();
                }
            });
        },

        execute: function (array, cb) {
            var self = this;
            var next = function () {
                if (array.length === 0) {
                    self.$callback(cb);
                    return;
                }
                var args = array.shift();
                var fn = args.shift();
                args.push(next); // callback argument
                fn.apply(self, args);
            };
            next();
        },

        navigateInIFrame : function (cb) {
            var iframeLink;
            this.waitFor({
                condition: function () {
                    iframeLink = this.iframe.contentWindow.document.getElementById("linkToPage2");
                    return !!iframeLink;
                },
                callback: function () {
                    var iframeLinkPosition = aria.utils.Dom.getGeometry(iframeLink);
                    var iframePosition = aria.utils.Dom.getGeometry(this.iframe);
                    this.synEvent.execute([
                        ["click", {
                            x: iframePosition.x + iframeLinkPosition.x + iframeLinkPosition.width / 2,
                            y: iframePosition.y + iframeLinkPosition.y + iframeLinkPosition.height / 2
                        }]
                    ], {
                        fn: function () {
                            this.waitFor({
                                condition: function () {
                                    return !!this.iframe.contentWindow.document.getElementById("linkToPage1");
                                },
                                callback: cb
                            });
                        },
                        scope: this
                    });
                }
            });
        },

        moveHandle : function (handleNumber, diffX, diffY, cb) {
            var handle = this.dialogInstance.getResizeHandle(handleNumber);
            var handlePosition = aria.utils.Dom.getGeometry(handle);
            var initialMousePosition = {
                x: handlePosition.x + handlePosition.width / 2,
                y: handlePosition.y + handlePosition.height / 2
            };
            this.synEvent.execute([
                ["drag", {
                    duration: 1000,
                    to: {
                        x: initialMousePosition.x + diffX,
                        y: initialMousePosition.y + diffY
                    }
                }, initialMousePosition]
            ], {
                fn: cb,
                scope: this
            });
        }
    }
});
