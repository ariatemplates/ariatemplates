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
    $classpath : "test.aria.touch.widgets.SliderSwitchDrag",
    $extends : "test.aria.touch.widgets.SliderHelper",
    $dependencies : ["aria.utils.Dom"],
    $prototype : {
        runTemplateTest : function () {
            this.widget = this.getWidgetInstance("switch");
            this.dataKey = "switchVal";
            var from = this.fromThumb("slider");
            var to = this.toSlider(0.7);
            this.drag(from, to, this._dragOn);
        },

        _dragOn : function () {
            this._assertValue(1);
            var from = this.fromThumb("slider");
            var to = this.toSlider(0.6);
            to.x = (from.x * 0.5);
            this.drag(from, to, this._dragOff);
        },

        _dragOff : function () {
            this._assertValue(0);
            var from = this.fromThumb("slider");
            var to = this.toSlider(0.4);
            this.drag(from, to, this._dragLess);
        },

        _dragLess : function () {
            this._assertValue(0);
            var switchwid = this.widget.getDom();
            var pos = aria.utils.Dom.getGeometry(switchwid);
            pos.x = pos.x + pos.width * 0.6;
            this.click(pos, this._afterFirstClick);
        },

        _afterFirstClick : function () {
            this._assertValue(1);
            var switchwid = this.widget.getDom();
            var pos = aria.utils.Dom.getGeometry(switchwid);
            pos.x = pos.x + pos.width * 0.2;
            this.click(pos, this._afterSecondClick);
        },

        _afterSecondClick : function () {
            this._assertValue(0);
            this.checkNearClick();
        },

        _assertValue : function (val) {
            var widgetValue = this.widget._value;
            var expected = val;
            this.assertEqualsWithTolerance(widgetValue, expected, 0.05, "Wrong thumb value in widget, %1 != %2");
            var modelValue = this.data[this.dataKey];
            this.assertEquals(widgetValue, modelValue, "Model differs from widget values, %1 != %2");
            var railWidth = this.widget._railWidth;
            var leftpos = parseInt((railWidth * modelValue), 10);
            var leftposTab = parseInt(aria.utils.Dom.getStyle(this.widget._slider, "left"), 10);
            this.assertEqualsWithTolerance(leftpos, leftposTab, 5, "Position of thumb is %1, expected %2");
        },

        checkNearClick : function () {
            // When clicking the thumb, if tapToMove is true I expect the value to change
            var switchwid = this.widget.getDom();
            var pos = aria.utils.Dom.getGeometry(switchwid);
            pos.x = pos.x + pos.width * 0.15;
            this.click(pos, this._afterThumbClickOne);
        },

        _afterThumbClickOne : function () {
            this._assertValue(1);
            // Also when clicking on tapToToggle I expect the value to change
            this.widget = this.getWidgetInstance("switchToggle");
            this.dataKey = "switchVal2";
            var switchwid = this.widget.getDom();
            var pos = aria.utils.Dom.getGeometry(switchwid);
            pos.x = pos.x + pos.width * 0.15;
            this.click(pos, this._afterThumbClickTwo);
        },

        _afterThumbClickTwo : function () {
            this._assertValue(1);
            this.end();
        }

    }
});
