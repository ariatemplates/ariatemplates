/**
 * Template Test case for different types of proxies available for dragging
 */
Aria.classDefinition({
	$classpath : "test.aria.utils.dragdrop.DragProxyTestCase",
	$extends : "test.aria.utils.dragdrop.DragTestCase",
	$prototype : {

		_startTesting : function () {
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
					["move", options, from]], {
				fn : this._testGetMovableOne,
				scope : this
			});
		},

		_testGetMovableOne : function () {
			this.assertTrue(this._dragFour.getMovable() == this.element);
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
					["move", options, from]], {
				fn : this._testGetMovableThree,
				scope : this
			});
		},
		_testGetMovableThree : function () {
			var dom = aria.utils.Dom;
			this.assertTrue(this._dragThree.getMovable() != this.element);
			var movableGeometry = dom.getGeometry(this._dragThree.getMovable());
			this.assertTrue(movableGeometry.width === this.geometry.width);
			this.assertTrue(movableGeometry.height === this.geometry.height);
			this.assertTrue(movableGeometry.y === this.geometry.y);
			this.assertTrue(Math.abs(movableGeometry.x - this.geometry.x - 100) < 10);

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
					["move", options, from]], {
				fn : this._testGetMovableFive,
				scope : this
			});
		},
		_testGetMovableFive : function () {
			var dom = aria.utils.Dom;
			var movable = this._dialog.getMovable();
			this.assertTrue(movable != this.element);
			var movableGeometry = dom.getGeometry(movable);
			this.assertTrue(Math.abs(movableGeometry.width - this.geometry.width) < 0.001);
			this.assertTrue(Math.abs(movableGeometry.height - this.geometry.height) < 0.001);
			this.assertTrue(Math.abs(movableGeometry.y - this.geometry.y - 21) < 10);
			this.assertTrue(Math.abs(movableGeometry.x - this.geometry.x - 100) < 10);
			this.assertTrue(movable.innerHTML == this.element.innerHTML);
			this.assertTrue(dom.getStyle(movable, "opacity") == 0.4);

			this.synEvent.execute([["mouseRelease", aria.jsunit.Robot.BUTTON1_MASK]], {
				fn : this.end,
				scope : this
			});
		}
	}
});