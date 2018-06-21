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
    $classpath : "test.aria.utils.dragdrop.DragProxyRobotTestCase",
    $extends : "test.aria.utils.dragdrop.AbstractDragRobotBase",
    $prototype : {

        /**
         * @override
         */
        startDragTest : function () {
            this._testGetMovable();
        },

        _testGetMovable : function () {
            var dom = aria.utils.Dom;
            this.element = dom.getElementById("free-draggable");

            var geometry = dom.getGeometry(this.element);
            this.geometry = geometry;
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 100,
                    y : from.y + 100
                }
            };
            this.from = from;
            this.options = options;
            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from], ["pause", 1000]], {
                fn : this._testGetMovableOne,
                scope : this
            });
        },

        _testGetMovableOne : function () {
            this.assertEquals(this._dragFour.getMovable(), this.element);
            this.synEvent.execute([["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this._testGetMovableTwo,
                scope : this
            });
        },

        _testGetMovableTwo : function () {
            var dom = aria.utils.Dom;
            this.element = dom.getElementById("horizontal-draggable");

            var geometry = dom.getGeometry(this.element);
            this.geometry = geometry;
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 100,
                    y : from.y
                }
            };
            this.from = from;
            this.options = options;
            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from], ["pause", 1000]], {
                fn : this._testGetMovableThree,
                scope : this
            });
        },
        _testGetMovableThree : function () {
            var dom = aria.utils.Dom;
            this.assertTrue(this._dragThree.getMovable() != this.element);
            var movableGeometry = dom.getGeometry(this._dragThree.getMovable());
            this.assertEquals(movableGeometry.width, this.geometry.width);
            this.assertEquals(movableGeometry.height, this.geometry.height);
            this.assertEquals(movableGeometry.y, this.geometry.y);
            this.assertEquals(movableGeometry.x, this.geometry.x + 100);

            this.synEvent.execute([["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this._testGetMovableFour,
                scope : this
            });
        },

        _testGetMovableFour : function () {

            var dom = aria.utils.Dom;
            this.element = dom.getElementById("dialog-container");
            this.geometry = dom.getGeometry(this.element);
            var geometry = dom.getGeometry(dom.getElementById("dialog-title"));

            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 100,
                    y : from.y + 21
                }
            };
            this.from = from;
            this.options = options;
            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from], ["pause", 1000]], {
                fn : this._testGetMovableFive,
                scope : this
            });
        },
        _testGetMovableFive : function () {
            var dom = aria.utils.Dom;
            var movable = this._dialog.getMovable();
            this.assertTrue(movable != this.element);
            var movableGeometry = dom.getGeometry(movable);
            this.assertEquals(movableGeometry.width, this.geometry.width);
            this.assertEquals(movableGeometry.height, this.geometry.height);
            this.assertEquals(movableGeometry.y - this.geometry.y, 21);
            this.assertEquals(movableGeometry.x - this.geometry.x, 100);
            this.assertEquals(movable.innerHTML, this.element.innerHTML);
            this.assertEqualsWithTolerance(parseFloat(dom.getStyle(movable, "opacity")), 0.4, 0.0000001);

            this.synEvent.execute([["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this.end,
                scope : this
            });
        }
    }
});
