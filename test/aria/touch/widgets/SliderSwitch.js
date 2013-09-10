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
    $classpath : "test.aria.touch.widgets.SliderSwitch",
    $extends : "aria.jsunit.WidgetTestCase",
    // Depend on drag to have synchronous creation of the widget
    $dependencies : ["aria.touch.widgets.Slider", "aria.utils.Dom", "aria.utils.dragdrop.Drag"],
    $prototype : {

        testCreation : function () {
            this._createWidgetAndAssert();
            this._createWidgetAndAssert(0.5, 1);
            this._createWidgetAndAssert(0.4, 0);
            this._createWidgetAndAssert(2.1, 1);
            this._createWidgetAndAssert(-4, 0);
        },
        _createWidgetAndAssert : function (values, expected) {
            var model = {};
            if (values) {
                model.value = values;
            }
            var cfg = {
                width : 100,
                toggleSwitch : true,
                 bind: {
                    value: {
                        inside : model,
                        to : "value"
                    }
                }
            };
            var widget = this.createAndInit("aria.touch.widgets.Slider", cfg);
            if (!expected) {
                expected = 0;
            }
            model.value = (model.value >= 0.5) ? 1 : 0;
            this._assertValue(widget, model, expected);
            widget.$dispose();
            this.outObj.clearAll();
        },

        _assertValue : function (widget, model, expected) {
            this.assertEquals(widget._value, expected, "Widget incorrect with values %1 expecting %2");
            this.assertEquals(model.value, expected, "Model incorrect with values %1 expecting %2");
            var position = parseInt(aria.utils.Dom.getStyle(widget._slider, "left"), 10);
            // 15 is the size of the thumbs
            var leftPos = (widget._railWidth) * expected;
            this.assertEqualsWithTolerance(position, leftPos, 5, "Position of first is %1, expected %2");
        },

        testSetValue : function () {
            var model = {
                value : 0
            };

            var cfg = {
                width : 100,
                toggleSwitch : true,
                 bind: {
                    value: {
                        inside : model,
                        to : "value"
                    }
                }
            };
            var widget = this.createAndInit("aria.touch.widgets.Slider", cfg);

            // correct value
            aria.utils.Json.setValue(model, "value", 0);
            this._assertValue(widget, model, 0);
            aria.utils.Json.setValue(model, "value", 1);
            this._assertValue(widget, model, 1);

            // values in the middle
            aria.utils.Json.setValue(model, "value", 0.2);
            this._assertValue(widget, model, 0);
            aria.utils.Json.setValue(model, "value", 0.8);
            this._assertValue(widget, model, 1);

            widget.$dispose();
            this.outObj.clearAll();
        },

        testSetValueWithThreshold : function () {
            var model = {
                value : 0.9
            };

            var cfg = {
                width : 100,
                toggleSwitch : true,
                switchThreshold : 0.7,
                 bind: {
                    value: {
                        inside : model,
                        to : "value"
                    }
                }
            };
            var widget = this.createAndInit("aria.touch.widgets.Slider", cfg);
            this._assertValue(widget, model, 1);

            // values in the middle
            aria.utils.Json.setValue(model, "value", 0.6);
            this._assertValue(widget, model, 0);
            aria.utils.Json.setValue(model, "value", 0.8);
            this._assertValue(widget, model, 1);

            widget.$dispose();
            this.outObj.clearAll();
        }
    }
});
