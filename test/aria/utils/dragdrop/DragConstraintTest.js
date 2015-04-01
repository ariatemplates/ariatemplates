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
 * Template Test case for aria.utils.dragdrop.Drag in case the movement is constrained
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.dragdrop.DragConstraintTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.dragdrop.Drag", "aria.utils.Dom", "aria.tools.contextual.ContextualMenu"],
    $prototype : {
        $constructor : function () {
            this.$RobotTestCase.constructor.call(this);
        },

        tearDown : function () {
            this._dialog.$dispose();
            this._dragOne.$dispose();
            this._dragTwo.$dispose();
            this._dragThree.$dispose();
            this._dragFour.$dispose();
            this._dialog = null;
            this._dragOne = null;
            this._dragTwo = null;
            this._dragThree = null;
            this._dragFour = null;
        },

        runTemplateTest : function () {
            var dom = aria.utils.Dom;
            this._dialog = new aria.utils.dragdrop.Drag("dialog-container", {
                handle : "dialog-title",
                cursor : "pointer",
                proxy : {
                    type : "CloneOverlay",
                    cfg : {
                        opacity : 0.4
                    }
                },
                constrainTo : aria.utils.Dom.VIEWPORT
            });
            this._dragOne = new aria.utils.dragdrop.Drag("constrained-draggable", {
                proxy : {
                    type : "CloneOverlay"
                },
                constrainTo : "first-boundary"
            });
            this._dragTwo = new aria.utils.dragdrop.Drag("vertical-draggable", {
                cursor : "move",
                constrainTo : dom.getElementById("second-boundary"),
                axis : "y"
            });
            this._dragThree = new aria.utils.dragdrop.Drag(dom.getElementById("horizontal-draggable"), {
                proxy : {
                    type : "Overlay"
                },
                constrainTo : "third-boundary",
                axis : "x"
            });
            this._dragFour = new aria.utils.dragdrop.Drag("free-draggable");
            this.startDragTest();
        },

        /**
         * @override
         */
        startDragTest : function () {
            this._testAxisConstrainedMovement();
        },

        _testAxisConstrainedMovement : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("vertical-draggable"));
            this.initialGeometry = geometry;
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 50,
                    y : from.y + 50
                }
            };

            this.synEvent.execute([["initRobot"], ["drag", options, from]], {
                fn : this._testAxisConstrainedMovementCbOne,
                scope : this
            });
        },
        _testAxisConstrainedMovementCbOne : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("vertical-draggable"));
            this.assertEquals(this.initialGeometry.x, geometry.x, "constraint to axis did not work correctly");
            this.assertEquals(geometry.y - this.initialGeometry.y, 50);

            geometry = dom.getGeometry(dom.getElementById("horizontal-draggable"));

            this.initialGeometry = geometry;
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 50,
                    y : from.y + 50
                }
            };

            this.synEvent.drag(options, from, {
                fn : this._testAxisConstrainedMovementCbTwo,
                scope : this
            });
        },

        _testAxisConstrainedMovementCbTwo : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("horizontal-draggable"));
            this.assertEquals(geometry.x, this.initialGeometry.x + 50);
            this.assertEquals(geometry.y, this.initialGeometry.y, "constraint to axis did not work correctly");

            this._testBoundaryConstrainedMovement();
        },

        /**
         * Test that the movement of the draggable is constrained
         */
        _testBoundaryConstrainedMovement : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("constrained-draggable"));
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 300,
                    y : from.y + 300
                }
            };

            this.synEvent.drag(options, from, {
                fn : this._testBoundaryConstrainedMovementCbOne,
                scope : this
            });
        },

        _testBoundaryConstrainedMovementCbOne : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("constrained-draggable"));
            var boundary = dom.getGeometry(dom.getElementById("first-boundary"));
            this.assertTrue(dom.isInside(geometry, boundary));
            this.assertEquals(geometry.x + geometry.width, boundary.x + boundary.width);
            this.assertEquals(geometry.y + geometry.height, boundary.y + boundary.height);

            geometry = dom.getGeometry(dom.getElementById("vertical-draggable"));
            this.initialGeometry = geometry;
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 300,
                    y : from.y + 300
                }
            };

            this.synEvent.drag(options, from, {
                fn : this._testBoundaryConstrainedMovementCbTwo,
                scope : this
            });
        },

        _testBoundaryConstrainedMovementCbTwo : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("vertical-draggable"));
            var boundary = dom.getGeometry(dom.getElementById("second-boundary"));
            this.assertTrue(dom.isInside(geometry, boundary));
            this.assertEquals(this.initialGeometry.x, geometry.x, "constraint to axis did not work correctly");
            this.assertEquals(geometry.y + geometry.height, boundary.y + boundary.height);

            geometry = dom.getGeometry(dom.getElementById("horizontal-draggable"));
            this.initialGeometry = geometry;
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 300,
                    y : from.y + 300
                }
            };

            this.synEvent.drag(options, from, {
                fn : this._testBoundaryConstrainedMovementCbThree,
                scope : this
            });
        },

        _testBoundaryConstrainedMovementCbThree : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("horizontal-draggable"));
            var boundary = dom.getGeometry(dom.getElementById("third-boundary"));
            this.assertTrue(dom.isInside(geometry, boundary));
            this.assertEquals(this.initialGeometry.y, geometry.y, "constraint to axis did not work correctly");
            this.assertEquals(geometry.x + geometry.width, boundary.x + boundary.width);

            this._testViewportConstrained();
        },

        _testViewportConstrained : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("dialog-title"));
            var dialog = dom.getGeometry(dom.getElementById("dialog-container"));
            var to = dom.fitInViewport({
                left : 2500,
                top : 2500
            }, {
                width : dialog.width,
                height : dialog.height
            });
            var from = {
                x : geometry.x + 3,
                y : geometry.y + 3
            };
            var options = {
                duration : 1000,
                to : {
                    x : to.left + dialog.width / 2,
                    y : to.top + dialog.height / 2
                }
            };

            this.synEvent.drag(options, from, {
                fn : this._testViewportConstrainedCbOne,
                scope : this
            });
        },

        _testViewportConstrainedCbOne : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("dialog-container"));
            this.assertTrue(dom.isInside(geometry, dom.VIEWPORT));

            // case in which there is no constraint
            geometry = dom.getGeometry(dom.getElementById("free-draggable"));
            var to = dom.fitInViewport({
                left : 2500,
                top : 2500
            }, {
                width : geometry.width,
                height : geometry.height
            });
            var from = {
                x : geometry.x + 1,
                y : geometry.y + 1
            };
            var options = {
                duration : 3000,
                to : {
                    x : to.left + geometry.width / 2,
                    y : to.top + geometry.height / 2
                }
            };

            this.synEvent.drag(options, from, {
                fn : this._testViewportConstrainedCbTwo,
                scope : this
            });
        },

        _testViewportConstrainedCbTwo : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(dom.getElementById("free-draggable"));

            if (!aria.core.Browser.isPhantomJS) {
                // Can't be tested with PhantowJS because of http://code.google.com/p/phantomjs/issues/detail?id=581
                this.assertFalse(dom.isInside(geometry, dom.VIEWPORT));
            }

            this.end();
        }
    }
});
