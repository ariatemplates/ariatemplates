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
    $classpath : "test.aria.touch.widgets.SliderHelper",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Device", "aria.utils.FireDomEvent"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        // override the template for this test case
        this.data = {
            slider : 0.2
        };

        /**
         * Hold an instance to the slider widget
         * @type {aria.touch.widgets.DoubleSlider}
         */
        this.widget = null;

        this.widgetGeometry = null;

        this.setTestEnv({
            template : "test.aria.touch.widgets.SingleSliderTpl",
            data : this.data
        });
    },
    $prototype : {
        /**
         * Get the coordinates of the middle of a thumb, useful as from in Robot.drag
         */
        fromThumb : function (thumb) {
            var thumb = this.widget["_" + thumb];
            this.widgetGeometry = aria.utils.Dom.getGeometry(thumb);
            return {
                x : this.widgetGeometry.x + this.widgetGeometry.width / 2,
                y : this.widgetGeometry.y + this.widgetGeometry.height / 2
            };
        },

        /**
         * Get the coordinates of a position in the slider, useful as to in Robot.drag
         */
        toSlider : function (position) {
            var railWidth = this.widget._railWidth;
            var offset = 0;
            return {
                x : this.widgetGeometry.x + (railWidth * position),
                y : this.widgetGeometry.y + this.widgetGeometry.height / 2
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
        click : function (position, callback) {
            if (aria.utils.Device.isTouch()) {
                // PhantomJS reports itself as a touch device, although it's not
                var element = Aria.$window.document.elementFromPoint(position.x, position.y);
                var eventOptions = {
                    clientX : position.x,
                    clientY : position.y
                };
                aria.utils.FireDomEvent.fireEvent("touchstart", element, eventOptions);

                aria.core.Timer.addCallback({
                    scope : this,
                    fn : function () {
                        aria.utils.FireDomEvent.fireEvent("touchend", element, eventOptions);
                        aria.core.Timer.addCallback({
                            fn : callback,
                            scope : this,
                            delay : 50
                        });
                    },
                    delay : 100
                });
            } else {
                this.synEvent.execute([["click", position]], {
                    fn : callback,
                    scope : this
                });
            }
        }
    }
});
