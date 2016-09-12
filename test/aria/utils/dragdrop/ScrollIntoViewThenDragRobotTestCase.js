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
    $classpath : "test.aria.utils.dragdrop.ScrollIntoViewThenDragTest",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.utils.dragdrop.ScrollIntoViewDragTestTemplate"
        });
    },
    $prototype : {

        runTemplateTest : function () {
            // in IE7 there is an issue when setting the scroll element.scrollTop, seems to be an incorrect value
            // resulting in a half scroll and failing tests, to be investigated further..
            if (aria.core.Browser.isIE7) {
                this.end();
            } else {
                this.startDragUpTest();
            }
        },

        // Vertical tests
        startDragUpTest : function () {
            var dom = aria.utils.Dom;
            var scrollElement = dom.getElementById("first-boundary");
            scrollElement.scrollTop = scrollElement.scrollHeight - scrollElement.clientHeight;
            this.initialGeometry = dom.getGeometry(dom.getElementById("constrained-draggable5"));
            var from = {
                x : this.initialGeometry.x + this.initialGeometry.width / 2,
                y : this.initialGeometry.y + this.initialGeometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x,
                    y : from.y - 100
                }
            };

            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from], ["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this._checkDragUp,
                scope : this
            });
        },

        _checkDragUp : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("constrained-draggable5"));
            this.assertEqualsWithTolerance(geometry.y, this.initialGeometry.y - 100, 13); // adding tolerance for IE
            this.startDragDownTest();
        },

        startDragDownTest : function () {
            var dom = aria.utils.Dom;
            this.initialGeometry = dom.getGeometry(dom.getElementById("constrained-draggable5"));
            var from = {
                x : this.initialGeometry.x + this.initialGeometry.width / 2,
                y : this.initialGeometry.y + this.initialGeometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x,
                    y : from.y + 50
                }
            };

            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from], ["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this._checkDragDown,
                scope : this
            });
        },

        _checkDragDown : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("constrained-draggable5"));
            this.assertEqualsWithTolerance(geometry.y, this.initialGeometry.y + 50, 7); // adding tolerance for IE
            this.startDragLeftTest();
        },

        // Horizontal tests
        startDragLeftTest : function () {
            var dom = aria.utils.Dom;
            var scrollElement = dom.getElementById("second-boundary");
            scrollElement.scrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;
            this.initialGeometry = dom.getGeometry(dom.getElementById("constrained-draggable10"));
            var from = {
                x : this.initialGeometry.x + this.initialGeometry.width / 2,
                y : this.initialGeometry.y + this.initialGeometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x - 100,
                    y : from.y
                }
            };

            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from], ["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this._checkDragLeft,
                scope : this
            });
        },

        _checkDragLeft : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("constrained-draggable10"));
            this.assertEqualsWithTolerance(geometry.x, this.initialGeometry.x - 100, 13); // adding tolerance for IE
            this.startDragRightTest();
        },

        startDragRightTest : function () {
            var dom = aria.utils.Dom;
            this.initialGeometry = dom.getGeometry(dom.getElementById("constrained-draggable10"));
            var from = {
                x : this.initialGeometry.x + this.initialGeometry.width / 2,
                y : this.initialGeometry.y + this.initialGeometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 50,
                    y : from.y
                }
            };

            this.synEvent.execute([["mouseMove", from], ["mousePress", aria.jsunit.Robot.BUTTON1_MASK],
                    ["move", options, from], ["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this._checkDragRight,
                scope : this
            });
        },

        _checkDragRight : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("constrained-draggable10"));
            this.assertEqualsWithTolerance(geometry.x, this.initialGeometry.x + 50, 7); // adding tolerance for IE
            this.end();
        }
    }
});
