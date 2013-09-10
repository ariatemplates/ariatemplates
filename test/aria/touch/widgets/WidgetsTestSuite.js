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
 * Test suite for Touch Widgets
 */
Aria.classDefinition({
    $classpath : "test.aria.touch.widgets.WidgetsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.touch.widgets.DoubleSlider");
        this.addTests("test.aria.touch.widgets.DoubleSliderError");
        this.addTests("test.aria.touch.widgets.DoubleSliderSetValue");
        this.addTests("test.aria.touch.widgets.DoubleSliderChange");
        this.addTests("test.aria.touch.widgets.SingleSliderValue");
        this.addTests("test.aria.touch.widgets.SingleSliderDrag");
        this.addTests("test.aria.touch.widgets.SliderSwitch");
        this.addTests("test.aria.touch.widgets.SliderSwitchDrag");
        this.addTests("test.aria.touch.widgets.ButtonTouch");
        this.addTests("test.aria.touch.widgets.dialog.closeOnClick.DialogTestCase");
        this.addTests("test.aria.touch.widgets.dialog.events.DialogEventsTestCase");
        this.addTests("test.aria.touch.widgets.dialog.events.DialogAnimationsTestCase");
    }
});