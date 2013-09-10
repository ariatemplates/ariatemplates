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
    $classpath : "test.aria.widgets.container.dialog.movable.test4.MovableDialogTestCaseFour",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Json", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

         this.data = {
            firstDialog : {
                visible : true,
                movable : false,
                xpos : 0,
                ypos : 0
            }
        };

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.movable.test4.MovableDialogTemplateFour",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.assertTrue(this.data.movableDialog === false, "Dialog movable property isn't equal to false");

            aria.core.Timer.addCallback({
                fn : this._activateMovable,
                scope : this,
                delay : 500
            });
        },

        _activateMovable : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));

            this.dialogPos = {
                x : handleGeometry.x,
                y : handleGeometry.y
            };

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

            this.assertTrue(this.data.movableDialog === false, "Dialog movable property isn't equal to false");
            this.synEvent.execute([["drag", options, from]], {
                fn : this._afterDrag,
                scope : this
            });
        },

        _afterDrag : function () {
            var self = this;
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));

            this.assertTrue(this.dialogPos.x === handleGeometry.x, "The Dialog has been moved");
            this.assertTrue(this.dialogPos.y === handleGeometry.y, "The Dialog has been moved");

            aria.utils.Json.setValue(this.data, "movableDialog", !this.data.movableDialog);

            this.assertTrue(this.data.movableDialog === true, "Dialog movable property isn't equal to true");

            aria.core.Timer.addCallback({
                fn : this._secondDrag,
                scope : this,
                delay : 1000
            });
        },

        _secondDrag : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));
            this.dialogPos = {
                x : handleGeometry.x,
                y : handleGeometry.y
            };

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
                fn : this._afterSecondDrag,
                scope : this
            });
        },

        _afterSecondDrag : function () {
            var self = this;
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));

            this.assertTrue(this.dialogPos.x !== handleGeometry.x, "The Dialog is not movable");
            this.assertTrue(this.dialogPos.y !== handleGeometry.y, "The Dialog is not movable");

            aria.utils.Json.setValue(this.data, "movableDialog", !this.data.movableDialog);

            this.assertTrue(this.data.movableDialog === false, "Dialog movable property isn't equal to false");

             aria.core.Timer.addCallback({
                fn : this._thirdDrag,
                scope : this,
                delay : 1000
            });
        },

        _thirdDrag : function () {
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));

            this.dialogPos = {
                x : handleGeometry.x,
                y : handleGeometry.y
            };

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
                fn : this._afterThirdDrag,
                scope : this
            });
        },

        _afterThirdDrag : function () {
            var self = this;
            var handleGeometry = aria.utils.Dom.getGeometry(this._getHandle("firstDialog"));

            this.assertTrue(this.dialogPos.x === handleGeometry.x, "The Dialog has been moved");
            this.assertTrue(this.dialogPos.y === handleGeometry.y, "The Dialog has been moved");

            aria.utils.Json.setValue(this.data, "visibleDialog", false);

            this.assertTrue(this.data.movableDialog === false, "Dialog movable property isn't equal to false");
            aria.utils.Json.setValue(this.data, "movableDialog", !this.data.movableDialog);
            this.assertTrue(this.data.movableDialog === true, "Dialog movable property isn't equal to true");

            this.assertTrue(this.data.visibleDialog === false, "Dialog movable property isn't equal to false");
            aria.utils.Json.setValue(this.data, "visibleDialog", true);
            this.assertTrue(this.data.visibleDialog === true, "Dialog movable property isn't equal to true");

            this.end();
        },

        _getHandle : function (dialogId) {
            return this.getWidgetInstance(dialogId)._titleBarDomElt;
        },

        _getCloseIcon : function (dialogId) {
            var elements = this.getWidgetInstance(dialogId)._titleBarDomElt.children;
            return (elements.length > 1) ? elements[1] : null;
        }
    }
});
