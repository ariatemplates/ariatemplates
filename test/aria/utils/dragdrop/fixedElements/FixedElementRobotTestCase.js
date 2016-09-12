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
 * Template Test case for different types of proxies available for dragging
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.dragdrop.fixedElements.FixedElementRobotTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.dragdrop.Drag", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.utils.dragdrop.fixedElements.FixedElementTestTemplate"
        });
    },
    $prototype : {

        tearDown : function () {
            this._draggable1.$dispose();
            this._draggable2.$dispose();
            this._draggable1 = null;
            this._draggable2 = null;
            this._draggableFixed = null;
            this._draggableAbsolute = null;
        },

        runTemplateTest : function () {
            var dom = aria.utils.Dom;
            this._draggableFixed = dom.getElementById("draggable-fixed");
            this._draggableAbsolute = dom.getElementById("draggable-absolute");

            this._initDrag();
            this._testDraggable(this._draggableFixed, false);
        },

        _initDrag : function () {
            var dom = aria.utils.Dom;
            this._draggable1 = new aria.utils.dragdrop.Drag(this._draggableFixed, {
               cursor : 'move',
               constrainTo : Aria.$window.document.body,
               handle : dom.getElementsByClassName(this._draggableFixed, 'title-bar')[0]
            });

            this._draggable2 = new aria.utils.dragdrop.Drag(this._draggableAbsolute, {
               cursor : 'move',
               constrainTo : Aria.$window.document.body,
               handle : dom.getElementsByClassName(this._draggableAbsolute, 'title-bar')[0]
            });
        },

        _testDraggable : function (draggable, end) {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(draggable);
            var geometryChild = (aria.core.Browser.isIE7 || aria.core.Browser.isIE8) ? dom.getGeometry(draggable.firstChild) : dom.getGeometry(draggable.firstElementChild);

            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometryChild.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x - 10,
                    y : from.y + 100
                }
            };
            var assertCb = {
                fn : this._testAsserts,
                scope : this,
                args : {draggable : draggable, geometry : geometry, endTest : end}
            };

            this.synEvent.drag(options, from, assertCb);
        },

        _testAsserts : function (_, args) {
            var geometry = args.geometry;
            var endTest = args.endTest;
            var newGeometry = aria.utils.Dom.getGeometry(args.draggable);

            this.assertNotEquals(geometry.x, newGeometry.x, "The element did not move horizontally. Starting xPos = " + geometry.x + ", Ending xPos = " + newGeometry.x + ".");
            this.assertNotEquals(geometry.y, newGeometry.y, "The element did not move vertically. Starting yPos = " + geometry.y + ", Ending yPos = " + newGeometry.y + ".");

            if (!endTest) {
                this._testDraggable(this._draggableAbsolute, true);
            } else {
                this.end();
            }
        }
    }
});
