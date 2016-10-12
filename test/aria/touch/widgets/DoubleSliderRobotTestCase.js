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
    $classpath : "test.aria.touch.widgets.DoubleSliderRobotTestCase",
    $extends : "test.aria.touch.widgets.RobotBase",
    $prototype : {
        runTemplateTest : function () {
            this.widget = this.getWidgetInstance("slider");

            var from = this.fromThumb("second");
            var to = this.toSlider("second", 0.5);

            this.drag(from, to, this.dragSecondToMiddle);
        },

        dragSecondToMiddle : function () {
            this.expectAround([0.1, 0.5]);

            var from = this.fromThumb("first");
            // Try to move the first thumb past the second
            var to = this.toSlider("first", 0.9);

            this.drag(from, to, this.dragFirstPastSecond);
        },

        dragFirstPastSecond : function () {
            this.expectAround([0.5, 0.5]);

            var from = this.fromThumb("second");
            // Move out of the slider
            var to = this.toSlider("second", 1.5);
            // and adjust also y to get out of slide area
            to.y += 100;

            this.drag(from, to, this.dragOutsideWidget);
        },

        dragOutsideWidget : function () {
            this.expectAround([0.5, 1]);

            var from = this.fromThumb("first");
            var to = this.toSlider("first", 0.2);

            this.drag(from, to, this.dragFirstToAPosition);
        },

        dragFirstToAPosition : function () {
            this.expectAround([0.2, 1]);

            var from = this.fromThumb("second");
            var to = this.toSlider("second", 0);

            this.drag(from, to, this.dragSecondBeforeFirst);
        },

        dragSecondBeforeFirst : function () {
            this.expectAround([0.2, 0.2]);
            this.end();
        }
    }
});
