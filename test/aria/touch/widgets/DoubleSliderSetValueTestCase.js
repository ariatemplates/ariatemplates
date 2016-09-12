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
 * Check the initialization of a DoubleSlideWidget
 */
Aria.classDefinition({
    $classpath : "test.aria.touch.widgets.DoubleSliderSetValueTestCase",
    $extends : "aria.jsunit.WidgetTestCase",
    // Depend on drag to have synchronous creation of the widget
    $dependencies : ["aria.touch.widgets.DoubleSlider", "aria.utils.Dom", "aria.utils.dragdrop.Drag"],
    $prototype : {
        /**
         * Check that the thumbs are in the correct position after initialization
         */
        testCreation : function () {
            this.createAndAssert();
            this.createAndAssert([0, 0]);
            this.createAndAssert([1, 1], [1, 1]);
            this.createAndAssert([0.5, 0.7], [0.5, 0.7]);
            this.createAndAssert([0.9, 0.1], [0.1, 0.9]);
            this.createAndAssert([2, 0.5], [0.5, 1]);
            this.createAndAssert([-2, 5], [0, 1]);
        },

        createAndAssert : function (values, expected) {
            var model = {};
            if (values) {
                model.values = values;
            }
            var cfg = {
                width : 400,
                bind : {
                    value : {
                        inside : model,
                        to : "values"
                    }
                }
            };
            var widget = this.createAndInit("aria.touch.widgets.DoubleSlider", cfg);

            if (!expected) {
                expected = [0, 0];
            }
            this.expectAt(widget, model, expected);

            widget.$dispose();
            this.outObj.clearAll();
        },

        expectAt : function (widget, model, expected) {
            this.assertJsonEquals(widget.value, expected, "Widget incorrect with values %1 expecting %2");
            this.assertJsonEquals(model.values, expected, "Model incorrect with values %1 expecting %2");

            var positionFirst = parseInt(aria.utils.Dom.getStyle(widget._firstSlider, "left"), 10);
            var positionSecond = parseInt(aria.utils.Dom.getStyle(widget._secondSlider, "left"), 10);

            var expectedFirst = widget._railWidth * expected[0];
            var expectedSecond = widget._railWidth * expected[1] + widget._firstWidth;
            this.assertEqualsWithTolerance(positionFirst, expectedFirst, 1, "Position of first is %1, expected %2");
            this.assertEqualsWithTolerance(positionSecond, expectedSecond, 1, "Position of second is %1, expected %2");
        },

        /**
         * Test the setValue on the data model modifies the thumb position accordingly
         * @return {[type]} [description]
         */
        testSetValue : function () {
            var model = {
                values : [0.1, 0.4]
            };
            var cfg = {
                width : 400,
                bind : {
                    value : {
                        inside : model,
                        to : "values"
                    }
                }
            };
            var widget = this.createAndInit("aria.touch.widgets.DoubleSlider", cfg);

            // correct value
            aria.utils.Json.setValue(model, "values", [0.2, 0.4]);
            this.expectAt(widget, model, [0.2, 0.4]);

            // reversed numbers
            aria.utils.Json.setValue(model, "values", [0.6, 0]);
            this.expectAt(widget, model, [0, 0.6]);

            // out of bound
            aria.utils.Json.setValue(model, "values", [1, -2]);
            this.expectAt(widget, model, [0, 1]);

            widget.$dispose();
            this.outObj.clearAll();
        }
    }
});
