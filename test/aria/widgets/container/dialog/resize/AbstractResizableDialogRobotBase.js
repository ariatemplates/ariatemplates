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
 * Abstract class for resize dialog test.
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.dialog.resize.AbstractResizableDialogRobotBase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.domSelector = aria.utils.Dom;
        this.data = {
            firstDialog : {
                visible : true,
                height : 250,
                width : 500,
                x : 0,
                y : 0
            }
        };

        this.handleEle = "";
        this.handleEleParent = "";
        this.isIE9orNewer = aria.core.Browser.isIE9 || aria.core.Browser.isIE10;
        this.tolerance = this.isIE9orNewer ? 10 : 2;
        this.toleranceShadow = this.isIE9orNewer ? 11 : 5;
        this.movementDuration = 500;
        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.resize.test2.ResizableDialogTemplate",
            data : this.data
        });
    },
    $prototype : {
        startResizeTest : function () {
            aria.core.Timer.addCallback({
                fn : this._afterFirstDialogShow,
                scope : this,
                delay : 1000
            });
        },

        _afterFirstDialogShow : function () {
            var dom = aria.utils.Dom;
            var handleEle = this._getHandle("firstDialog", 1);
            this.handleEle = handleEle.handle;
            this.handleEleParent = handleEle.parent;
            var handleGeometry = dom.getGeometry(this.handleEle);
            var parentGeometry = dom.getGeometry(this.handleEleParent);

            this.data.firstDialog.x = parentGeometry.x;
            this.data.firstDialog.y = parentGeometry.y;

            this.assertEquals(parentGeometry.height, 250, "Dialog Widget height is wrong before Resizing. Expected %2, got %1.");
            this.assertEqualsWithTolerance(parentGeometry.width, 500, this.tolerance, "Dialog Widget height is wrong before Resizing.. Expected %2, got %1");

            var from = {
                x : handleGeometry.x + handleGeometry.width / 2,
                y : handleGeometry.y + handleGeometry.height / 2
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x + 0,
                    y : from.y + 10
                }
            };

            this.data.firstDialog.height -= 10;
            this.data.firstDialog.y += 10;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._NResize,
                scope : this
            });
        },

        _NResize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.tolerance, "The dialog height is not corrrectly set, expected %1, actual %2.");
            this.assertEqualsWithTolerance(this.data.firstDialog.y, parentGeometry.y, this.tolerance, "The dialog ypos position is not corrrectly set, expected %1, actual %2.");

            var from = {
                x : parentGeometry.x + parentGeometry.width / 2,
                y : parentGeometry.y
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x + 0,
                    y : from.y - 10
                }
            };
            this.data.firstDialog.height += 10;
            this.data.firstDialog.y -= 10;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkNSize,
                scope : this
            });

        },

        _checkNSize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            var partialMsg = " is not correct after top resize: expected %1, actual %2.";

            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.tolerance, ("The dialog height" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.y, parentGeometry.y, this.tolerance, ("The dialog ypos" + partialMsg));
            this._NWresize();
        },

        _NWresize : function () {
            var handleEle = this._getHandle("firstDialog", 6);
            this.handleEle = handleEle.handle;
            var position = aria.utils.Dom.getGeometry(this.handleEle);

            var from = {
                x : position.x,
                y : position.y
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x + 10,
                    y : from.y + 10
                }
            };
            this.data.firstDialog.height -= 10;
            this.data.firstDialog.width -= 10;
            this.data.firstDialog.y += 10;
            this.data.firstDialog.x += 10;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkNWSize,
                scope : this
            });

        },
        _checkNWSize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            var partialMsg = " is not correct after top west resize: expected %1, actual %2.";

            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.tolerance, ("The dialog height" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.width, parentGeometry.width, this.tolerance, ("The dialog width" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.x, parentGeometry.x, this.tolerance, ("The dialog x position" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.y, parentGeometry.y, this.tolerance, ("The dialog y position" + partialMsg));
            this._NEresize();

        },
        _NEresize : function () {
            var handleEle = this._getHandle("firstDialog", 5);
            this.handleEle = handleEle.handle;
            var position = aria.utils.Dom.getGeometry(this.handleEle);

            var from = {
                x : position.x + 5,
                y : position.y
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x - 10,
                    y : from.y + 10
                }
            };
            this.data.firstDialog.height -= 10;
            this.data.firstDialog.width -= 10;
            this.data.firstDialog.y += 10;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkNESize,
                scope : this
            });

        },
        _checkNESize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            var partialMsg = " is not correct after top east resize: expected %1, actual %2.";

            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.tolerance, ("The dialog height" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.width, parentGeometry.width, this.toleranceShadow, ("The dialog width" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.y, parentGeometry.y, this.tolerance, ("The dialog y position" + partialMsg));
            this._SEresize();

        },
        _SEresize : function () {
            var handleEle = this._getHandle("firstDialog", 7);
            this.handleEle = handleEle.handle;
            var position = aria.utils.Dom.getGeometry(this.handleEle);

            var from = {
                x : position.x + 5,
                y : position.y + 2
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x - 10,
                    y : from.y - 10
                }
            };
            // to compensate shadow
            this.data.firstDialog.height -= 8;
            this.data.firstDialog.width -= 8;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkSESize,
                scope : this
            });

        },
        _checkSESize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            var partialMsg = " is not correct after bottom east resize: expected %1, actual %2.";

            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.toleranceShadow, ("The dialog height" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.width, parentGeometry.width, this.toleranceShadow, ("The dialog width " + partialMsg));
            this._SWresize();

        },

        _SWresize : function () {
            var handleEle = this._getHandle("firstDialog", 8);
            this.handleEle = handleEle.handle;
            var position = aria.utils.Dom.getGeometry(this.handleEle);

            var from = {
                x : position.x + 4,
                y : position.y + 1
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x + 10,
                    y : from.y - 10
                }
            };
            this.data.firstDialog.height -= 10;
            this.data.firstDialog.width -= 10;
            this.data.firstDialog.x += 10;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkSWSize,
                scope : this
            });

        },
        _checkSWSize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            var partialMsg = " is not correct after bottom west resize: expected %1, actual %2.";

            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.toleranceShadow, ("The dialog height" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.width, parentGeometry.width, this.toleranceShadow, ("The dialog width" + partialMsg));
            this.assertEqualsWithTolerance(this.data.firstDialog.x, parentGeometry.x, this.tolerance, ("The dialog xpos" + partialMsg));
            this._Wresize();

        },
        _Wresize : function () {
            var handleEle = this._getHandle("firstDialog", 4);
            this.handleEle = handleEle.handle;
            var position = aria.utils.Dom.getGeometry(this.handleEle);

            var from = {
                x : position.x,
                y : position.y + position.height / 2
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x + 10,
                    y : from.y
                }
            };
            // for shadow
            this.data.firstDialog.width -= 8;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkWSize,
                scope : this
            });

        },
        _checkWSize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            this.assertEqualsWithTolerance(this.data.firstDialog.width, parentGeometry.width, this.toleranceShadow, "The dialog width is not correct after west resize. Expected %1, actual %2.");
            this._Eresize();

        },
        _Eresize : function () {
            var handleEle = this._getHandle("firstDialog", 3);
            this.handleEle = handleEle.handle;
            var position = aria.utils.Dom.getGeometry(this.handleEle);

            var from = {
                x : position.x,
                y : position.y + position.height / 2
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x - 10,
                    y : from.y
                }
            };
            this.data.firstDialog.width -= 10;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkESize,
                scope : this
            });

        },
        _checkESize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            this.assertEqualsWithTolerance(this.data.firstDialog.width, parentGeometry.width, this.toleranceShadow, "The dialog width is not correct after east resize. Expected %1, actual %2.");
            this._SResize();

        },

        _SResize : function () {
            var handleEle = this._getHandle("firstDialog", 2);
            this.handleEle = handleEle.handle;
            var position = aria.utils.Dom.getGeometry(this.handleEle);

            var from = {
                x : position.x + position.width / 2,
                y : position.y
            };
            var options = {
                duration : this.movementDuration,
                to : {
                    x : from.x,
                    y : from.y - 10
                }
            };
            // for shadow
            this.data.firstDialog.height -= 8;

            this.synEvent.execute([["drag", options, from]], {
                fn : this._checkSSize,
                scope : this
            });

        },

        _checkSSize : function () {
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = aria.utils.Dom.getGeometry(this.handleEleParent);
            this.assertEqualsWithTolerance(this.data.firstDialog.height, parentGeometry.height, this.toleranceShadow, "The dialog height is not correct after south resize. Expected %1, actual %2.");

            this._end();
        },
        _getHandle : function (dialogId, index) {
            var options = {};
            var dialogInstance = this.getWidgetInstance(dialogId);
            options.parent = dialogInstance._domElt;
            if (index) {
                options.handle = dialogInstance.getResizeHandle(index - 1);
            }
            return options;
        },

        _end : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
