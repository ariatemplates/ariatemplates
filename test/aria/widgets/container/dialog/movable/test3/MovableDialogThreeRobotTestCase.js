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

Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.movable.test3.MovableDialogThreeRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {
            firstDialog : {
                visible : true,
                xpos : 0,
                ypos : 0
            }
        };

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.movable.test3.MovableDialogTemplateThree",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.currXPos = this.data.firstDialog.xpos;
            this.currYPos = this.data.firstDialog.ypos;

            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));

            this.assertFalse(handleGeometry.x !== this.data.firstDialog.xpos, "Dialog Widget is Positioned wrongly before drag started");
            this.assertFalse(handleGeometry.y !== this.data.firstDialog.ypos, "Dialog Widget is Positioned wrongly before drag started");

            aria.core.Timer.addCallback({
                fn : this._dragDialog,
                scope : this,
                delay : 500
            });
        },

        _dragDialog : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));
            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : 2000,
                to : {
                    x : from.x + 150,
                    y : from.y + 150
                }
            };

            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterDrag,
                scope : this
            });
        },

        _afterDrag : function () {
            // Simulate click on the refresh section button
            var btn = this.getWidgetInstance("refreshInnerSection").getDom();
            var self = this;
            this.synEvent.click(btn, {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : self._afterClick,
                        scope : self
                    });
                },
                scope : this
            });
        },

        _afterClick : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));
            this.assertFalse(handleGeometry.x !== this.data.firstDialog.xpos, "Dialog Widget is Positioned wrongly after Dragging");
            this.assertFalse(handleGeometry.y !== this.data.firstDialog.ypos, "Dialog Widget is Positioned wrongly after Dragging");

            this.end();
        },

        _getHandle : function (dialogId) {
            return this.getWidgetInstance(dialogId)._titleBarDomElt;
        }
    }
});
