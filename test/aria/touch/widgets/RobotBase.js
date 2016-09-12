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

Aria.classDefinition({
    $classpath : "test.aria.touch.widgets.BaseRobotTest",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        // override the template for this test case
        this.data = {
            slider : [0.1, 0.2],
            callbacks : 0
        };

        /**
         * Hold an instance to the slider widget
         * @type {aria.touch.widgets.DoubleSlider}
         */
        this.widget = null;

        this.setTestEnv({
            template : "test.aria.touch.widgets.DoubleSliderTpl",
            data : this.data
        });
    },
    $prototype : {
        /**
         * Get the coordinates of the middle of a thumb, useful as from in Robot.drag
         */
        fromThumb : function (thumb) {
            var thumb = this.widget["_" + thumb + "Slider"];
            var geometry = aria.utils.Dom.getGeometry(thumb);
            return {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
        },

        /**
         * Get the coordinates of a position in the slider, useful as to in Robot.drag
         */
        toSlider : function (thumb, position) {
            var geometry = aria.utils.Dom.getClientGeometry(this.widget._domElt);
            var offset = thumb === "second" ? this.widget._secondWidth / 2 : -this.widget._firstWidth / 2;
            return {
                x : geometry.x + this.widget._firstWidth + this.widget._railWidth * position + offset,
                y : geometry.y + geometry.height / 2
            };
        },

        drag : function (from, to, callback) {
            var options = {
                duration : 800,
                to : to
            };
            this.synEvent.execute([["drag", options, from]], {
                fn : callback,
                scope : this
            });
        },

        dragAndBack : function (from, intermediate, to, callback) {
            this.synEvent.execute([
                ["mouseMove", from],
                ["mousePress", this.synEvent._robot.BUTTON1_MASK],
                ["move", {
                    duration : 800,
                    to : intermediate
                }, from],
                ["move", {
                    duration : 800,
                    to : to
                }, intermediate],
                ["mouseRelease", this.synEvent._robot.BUTTON1_MASK]
            ], {
                fn : callback,
                scope : this
            });
        },

        expectAround : function (expected) {
            var widgetValue = this.widget.value;
            this.assertEqualsWithTolerance(widgetValue[0], expected[0], 0.005, "Wrong first value in widget, %1 != %2");
            this.assertEqualsWithTolerance(widgetValue[1], expected[1], 0.005, "Wrong second value in widget, %1 != %2");

            var modelValues = this.data.slider;
            this.assertEquals(widgetValue[0], modelValues[0], "Model differs from widget values, %1 != %2");
            this.assertEquals(widgetValue[0], modelValues[0], "Model differs from widget values, %1 != %2");

            var positionFirst = parseInt(aria.utils.Dom.getStyle(this.widget._firstSlider, "left"), 10);
            var positionSecond = parseInt(aria.utils.Dom.getStyle(this.widget._secondSlider, "left"), 10);

            var expectedFirst = this.widget._railWidth * expected[0];
            var expectedSecond = this.widget._railWidth * expected[1] + this.widget._firstWidth;

            this.assertEqualsWithTolerance(positionFirst, expectedFirst, 1, "Position of first is %1, expected %2");
            this.assertEqualsWithTolerance(positionSecond, expectedSecond, 1, "Position of second is %1, expected %2");
        }
    }
});
