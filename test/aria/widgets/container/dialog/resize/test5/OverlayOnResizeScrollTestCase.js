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
    $classpath : "test.aria.widgets.container.dialog.resize.test5.OverlayOnResizeScrollTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.data = {};
        this._robot = aria.jsunit.Robot;

        this.setTestEnv({
            template : "test.aria.widgets.container.dialog.resize.test5.OverlayOnResizeScrollTemplate",
            css : "position:relative;top:400px;border:15px solid blue;",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            Aria.$window.scrollBy(0,150);
            aria.core.Timer.addCallback({
                fn : this._firstDrag,
                scope : this,
                delay : 1000
            });
        },

        _firstDrag : function () {
            var dom = aria.utils.Dom;
            this.assertEquals(dom.getDocumentScrollElement().scrollTop, 150, "The page should have %2 px of scroll, but it has %1 px instead");

            var handleEle = this._getHandle("firstDialog", 1);
            this.handleEle = handleEle.handle;
            this.handleEleParent = handleEle.parent;
            var handleGeometry = dom.getGeometry(this.handleEle);
            var parentGeometry = dom.getGeometry(this.handleEleParent);

            this.assertEquals(parentGeometry.height, 250, "Dialog Widget height is wrong before Resizing. Expected %2, got %1.");
            this.assertEquals(parentGeometry.width, 500, "Dialog Widget height is wrong before Resizing.. Expected %2, got %1");

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

            var seq = [["mouseMove", from], ["mousePress", this._robot.BUTTON1_MASK], ["move", options, from]];

            this.synEvent.execute(seq, {
                fn : this._afterFirstDrag,
                scope : this
            });
        },

        _afterFirstDrag : function () {
            var dom = aria.utils.Dom;
            var handleEle = this._getHandle("firstDialog");
            this.handleEleParent = handleEle.parent;
            var parentGeometry = dom.getGeometry(this.handleEleParent);

            var overlay = dom.getElementsByClassName(Aria.$window.document.body, "xOverlay")[0];
            var overlayGeometry = dom.getGeometry(overlay);

            this.assertEquals(parentGeometry.x, overlayGeometry.x, "The overlay xpos is not the same as the dialog one. Expected %1, got %2.");
            this.assertEquals(parentGeometry.y, overlayGeometry.y - 10, "The overlay ypos is not 10px (resize) more than the dialog one. Expected %1, got %2.");

            this.end();
        },

        _getHandle : function (dialogId, index) {
            var options = {};
            options.parent = this.getWidgetInstance(dialogId)._domElt;
            if (index) {
                options.handle = aria.utils.Dom.getDomElementChild(options.parent, index, false);
            }
            return options;
        }
    }
});
