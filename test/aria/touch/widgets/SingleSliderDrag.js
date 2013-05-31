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
    $classpath : "test.aria.touch.widgets.SingleSliderDrag",
    $extends : "test.aria.touch.widgets.SliderHelper",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            this.widget = this.getWidgetInstance("slider");
            var from = this.fromThumb("slider");
            var to = this.toSlider(0.5);
            this.drag(from, to, this._dragFirst);

        },

        _dragFirst : function () {
            this._assertValue(0.6);
            var from = this.fromThumb("slider");
            var to = this.toSlider(1);
            this.drag(from, to, this._dragMiddle);
        },

        _dragMiddle : function () {
            this._assertValue(1);
            var from = this.fromThumb("slider");
            var to = this.toSlider(0.5);
            to.x = (from.x * 0.5);
            this.drag(from, to, this._dragOutside);

        },

        _dragOutside : function () {
            this._assertValue(0.4);
            var from = this.fromThumb("slider");
            var to = this.toSlider(2);
            to.y += 100;
            this.drag(from, to, this._dragendTest);
        },
        _dragendTest : function () {
            this._assertValue(1);
            this.end();
        },

        _assertValue : function (val) {
            var widgetValue = this.widget._value;
            var expected = val;
            this.assertEqualsWithTolerance(widgetValue, expected, 0.05, "Wrong thumb value in widget, %1 != %2");
            var modelValue = this.data.slider;
            this.assertEquals(widgetValue, modelValue, "Model differs from widget values, %1 != %2");
            var railWidth = this.widget._railWidth;
            var leftpos = parseInt((railWidth * modelValue), 10);
            var leftposTab = parseInt(aria.utils.Dom.getStyle(this.widget._slider, "left"), 10);
            this.assertEqualsWithTolerance(leftpos, leftposTab, 5, "Position of thumb is %1, expected %2");

        }

    }
});