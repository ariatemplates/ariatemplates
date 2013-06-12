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
 * Template Test case for aria.utils.dragdrop.Drag
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.dragdrop.DragBasicTest",
    $extends : "test.aria.utils.dragdrop.AbstractDragTestCase",
    $prototype : {
        startDragTest : function () {
            this._testGetDraggable();
        },
        _testGetDraggable : function () {
            var dom = aria.utils.Dom;

            this.assertEquals(this._dialog.getDraggable(), dom.getElementById("dialog-title"));
            this.assertEquals(this._dragOne.getDraggable(), dom.getElementById("constrained-draggable"));
            this.assertEquals(this._dragTwo.getDraggable(), dom.getElementById("vertical-draggable"));
            this.assertEquals(this._dragThree.getDraggable(), dom.getElementById("horizontal-draggable"));
            this.assertEquals(this._dragFour.getDraggable(), dom.getElementById("free-draggable"));

            this._testGetElement();
        },
        _testGetElement : function () {
            var dom = aria.utils.Dom;

            this.assertEquals(this._dialog.getElement(), dom.getElementById("dialog-container"));
            this.assertEquals(this._dragOne.getElement(), dom.getElementById("constrained-draggable"));
            this.assertEquals(this._dragTwo.getElement(), dom.getElementById("vertical-draggable"));
            this.assertEquals(this._dragThree.getElement(), dom.getElementById("horizontal-draggable"));
            this.assertEquals(this._dragFour.getElement(), dom.getElementById("free-draggable"));

            this._testDisposeWhileDragging();
        },

        _testDisposeWhileDragging : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("horizontal-draggable"));
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 100,
                    y : from.y + 500
                }
            };

            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from]], {
                fn : this._testDisposeWhileDraggingCbOne,
                scope : this
            });
        },

        _testDisposeWhileDraggingCbOne : function () {
            this._dragThree.$dispose();
            this._dragThree = new aria.utils.dragdrop.Drag(aria.utils.Dom.getElementById("horizontal-draggable"), {
                proxy : {
                    type : "Overlay"
                },
                constrainTo : "third-boundary",
                axis : "x"
            });
            this.synEvent.execute([["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this.end,
                scope : this
            });
        }
    }
});
