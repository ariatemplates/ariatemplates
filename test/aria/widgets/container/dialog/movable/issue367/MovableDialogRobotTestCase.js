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
 * Test case for aria.widgets.container.Dialog movable dialog with scroll bars
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.movable.issue367.MovableDialogRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {
            firstDialog : {
                visible : true,
                xpos : 100,
                ypos : 500
            }
        };

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.movable.issue367.MovableDialogTemplate",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            if ((aria.core.Browser.isSafari || aria.core.Browser.isChrome)
                    && (Aria.$window.document.compatMode == "CSS1Compat")) {
                this.originalscrollAmount = Aria.$frameworkWindow.document.body.scrollTop;
                Aria.$frameworkWindow.document.body.scrollTop = 30;
            } else {
                this.originalscrollAmount = Aria.$frameworkWindow.document.documentElement.scrollTop;
                Aria.$frameworkWindow.document.documentElement.scrollTop = 30;
            }

            aria.core.Timer.addCallback({
                fn : this._dragDialog,
                scope : this,
                delay : 1000
            });

        },

        _dragDialog : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("myid"));
            var docScroll = this.getWidgetInstance("myid");
            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 50,
                    y : from.y + 50
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterDrag,
                scope : this
            });
        },

        _afterDrag : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("myid"));
            this.assertEquals(handleGeometry.x, this.data.firstDialog.xpos, "Dialog Widget horizontally  Positioned wrongly after Dragging");
            this.assertEquals(handleGeometry.y, this.data.firstDialog.ypos, "Dialog Widget vertically Positioned wrongly after Dragging");
            this._endofTest();

        },

        _endofTest : function () {
            if ((aria.core.Browser.isSafari || aria.core.Browser.isChrome)
                    && (Aria.$window.document.compatMode == "CSS1Compat")) {
                Aria.$frameworkWindow.document.body.scrollTop = this.originalscrollAmount;
            } else {
                Aria.$frameworkWindow.document.documentElement.scrollTop = this.originalscrollAmount;
            }
            this.notifyTemplateTestEnd();
        },
        _getHandle : function (dialogId) {
            return this.getWidgetInstance(dialogId)._titleBarDomElt;
        }
    }
});
