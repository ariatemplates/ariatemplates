/**
 * Template Test case for aria.utils.dragdrop.Drag in case the movement is constrained
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.dragdrop.DragConstraintTestCase",
    $extends : "test.aria.utils.dragdrop.DragTestCase",
    $prototype : {

        _startTesting : function () {
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
            this.assertTrue(this.initialGeometry.x - geometry.x === 0, "axis option did not work correctly");
            this.assertTrue(geometry.y - this.initialGeometry.y - 50 < 2);

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
            this.assertTrue(geometry.x - this.initialGeometry.x - 50 < 2, "axis option did not work correctly");
            this.assertTrue(geometry.y - this.initialGeometry.y === 0);

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
            this.assertTrue(geometry.x + geometry.width == boundary.x + boundary.width);
            this.assertTrue(geometry.y + geometry.height == boundary.y + boundary.height);

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
            this.assertTrue(this.initialGeometry.x - geometry.x === 0, "axis option did not work correctly");
            this.assertTrue(geometry.y + geometry.height == boundary.y + boundary.height);

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
            this.assertTrue(this.initialGeometry.y - geometry.y === 0, "axis option did not work correctly");
            this.assertTrue(geometry.x + geometry.width == boundary.x + boundary.width);

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
            this.assertFalse(dom.isInside(geometry, dom.VIEWPORT));

            this.end();
        }
    }
});