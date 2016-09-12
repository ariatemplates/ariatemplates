/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath: "test.aria.touch.widgets.DoubleSliderChangeRobotTestCase",
    $extends: "test.aria.touch.widgets.RobotBase",
    $prototype: {
        runTemplateTest: function () {
            this.widget = this.getWidgetInstance("slider");

            var from = this.fromThumb("first");
            var to = this.toSlider("first", 0.8);

            this.drag(from, to, this.dragFirstOverSecond);
        },

        dragFirstOverSecond : function () {
            // Because by default the slider second thumb is at 0.2
            this.expectAround([0.2, 0.2]);

            this.assertEquals(this.templateCtxt.data.callbacks, 1, "Expecting one callback call, got %1");
            this.templateCtxt.data.callbacks = 0;

            // Now move again the thumb back and forth
            var from = this.fromThumb("first");
            var back = this.toSlider("first", 0);
            var forth = this.toSlider("first", 0.5);

            this.dragAndBack(from, back, forth, this.dragFirstBackAndForth);
        },

        dragFirstBackAndForth : function () {
            // We didn't move
            this.expectAround([0.2, 0.2]);

            this.assertEquals(this.templateCtxt.data.callbacks, 0, "Expecting no callback, got %1");

            this.end();
        }
    }
});
