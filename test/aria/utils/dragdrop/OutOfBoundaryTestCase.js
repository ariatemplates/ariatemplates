/**
 * Template Test case for the behaviour of drag when the mouse is outside of the boundary
 */
Aria.classDefinition({
    $classpath : "test.aria.utils.dragdrop.OutOfBoundaryTestCase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.dragdrop.Drag", "aria.utils.Dom", "aria.tools.contextual.ContextualMenu"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.utils.dragdrop.DragTestTemplate"
        });
    },
    $prototype : {
        tearDown : function () {
            this._dragOne.$dispose();
            this._dragOne = null;
        },

        runTemplateTest : function () {
            var dom = aria.utils.Dom;
            this._dragOne = new aria.utils.dragdrop.Drag("constrained-draggable", {
                constrainTo : "first-boundary"
            });

            this._testOutOfBoundary();
        },

        _testOutOfBoundary : function () {
            var dom = aria.utils.Dom;
            this.element = dom.getElementById("constrained-draggable");

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
                    ["move", options, from]], {
                fn : this._testOutOfBoundaryCbOne,
                scope : this
            });
        },

        _testOutOfBoundaryCbOne : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(this.element);
            this.assertTrue(Math.abs(geometry.x - this.geometry.x - 100) < 5);
            this.assertTrue(Math.abs(geometry.y - this.geometry.y - 100) < 5);
            this.geometry = geometry;

            this.from = aria.utils.Json.copy(this.options.to);
            this.options.to.x += 200;
            this.synEvent.execute([["move", this.options, this.from]], {
                fn : this._testOutOfBoundaryCbTwo,
                scope : this
            });
        },

        _testOutOfBoundaryCbTwo : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(this.element);
            var testGeo = aria.utils.Json.copy(this.geometry);
            testGeo.x += 200;
            var pos = dom.fitInside(testGeo, dom.getGeometry(dom.getElementById("first-boundary")));

            this.assertTrue(Math.abs(geometry.x - pos.left) < 5);
            this.assertTrue(Math.abs(geometry.y - this.geometry.y) < 5);
            this.geometry = geometry;

            this.from = aria.utils.Json.copy(this.options.to);
            this.options.to.y += 110;
            this.synEvent.execute([["move", this.options, this.from]], {
                fn : this._testOutOfBoundaryCbThree,
                scope : this
            });
        },

        _testOutOfBoundaryCbThree : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(this.element);

            this.assertTrue(Math.abs(geometry.x - this.geometry.x) < 1);
            this.assertTrue(Math.abs(geometry.y - this.geometry.y - 110) < 5);
            this.geometry = geometry;

            this.from = aria.utils.Json.copy(this.options.to);
            this.options.to.x = this.geometry.x + this.geometry.width / 2;
            this.synEvent.execute([["move", this.options, this.from]], {
                fn : this._testOutOfBoundaryCbFour,
                scope : this
            });
        },

        _testOutOfBoundaryCbFour : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(this.element);
            this.assertTrue(Math.abs(geometry.x - this.geometry.x) < 5);
            this.assertTrue(Math.abs(geometry.y - this.geometry.y) < 5);
            this.geometry = geometry;

            this.from = aria.utils.Json.copy(this.options.to);
            this.options.to.x -= 50;
            this.options.to.y -= 50;
            this.synEvent.execute([["move", this.options, this.from]], {
                fn : this._testOutOfBoundaryCbFive,
                scope : this
            });
        },

        _testOutOfBoundaryCbFive : function () {
            var dom = aria.utils.Dom;
            var geometry = dom.getGeometry(this.element);
            this.assertTrue(Math.abs(geometry.x - this.geometry.x + 50) < 5);
            this.assertTrue(Math.abs(geometry.y - this.geometry.y + 50) < 5);
            this.geometry = geometry;

            this.synEvent.execute([["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
                fn : this.end,
                scope : this
            });
        }
    }
});