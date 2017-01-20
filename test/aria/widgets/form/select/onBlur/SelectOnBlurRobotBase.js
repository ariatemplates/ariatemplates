/*
 * Copyright 2017 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.select.onBlur.SelectOnBlurRobotBase",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Array", "aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.data = {
            widgets : [],
            options : [{
                        label : "Type A",
                        value : "A"
                    }, {
                        label : "Type B",
                        value : "B"
                    }, {
                        label : "Type C",
                        value : "C"
                    }, {
                        label : "Type D",
                        value : "D"
                    }, {
                        label : "Type E",
                        value : "E"
                    }, {
                        label : "Type F",
                        value : "F"
                    }, {
                        label : "Type G",
                        value : "G"
                    }]
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.select.onBlur.SelectOnBlur",
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.execute(aria.utils.Array.map(this.data.widgets, function (widgetData) {
                return [this.widgetTest, widgetData];
            }, this), this.end);
        },

        widgetTest: function (widgetData, cb) {
            var beforeElement = this.getElementById(widgetData.id + "Before");
            var afterElement = this.getElementById(widgetData.id + "After");
            var widgetInstance = this.getWidgetInstance(widgetData.id);
            var widgetDom = widgetInstance.getDom();
            var widgetGeometry = aria.utils.Dom.getGeometry(widgetDom);
            var clickedValue;
            this.execute([
                [this.checkValue, widgetData, "A"],
                [this.click, beforeElement], [this.waitForDomEltFocus, beforeElement],
                [this.type, "[tab]"], [this.waitForDomEltBlur, beforeElement],
                [this.type, "[down]"], [this.pause, 500],
                [this.checkBlurEvents, widgetData, 0],
                [this.type, "[tab]"], [this.waitForDomEltFocus, afterElement],
                [this.checkValue, widgetData, "B"],
                [this.checkBlurEvents, widgetData, 1],

                [this.click, {
                    // click on the icon
                    x: widgetGeometry.x + widgetGeometry.width - 8,
                    y: widgetGeometry.y + widgetGeometry.height / 2
                }], [this.pause, 500],
                [this.click, {
                    // click on the option just below the position of the field
                    x: widgetGeometry.x + widgetGeometry.width / 2,
                    y: widgetGeometry.y + widgetGeometry.height * 1.5
                }], [this.pause, 500],
                [this.checkBlurEvents, widgetData, 1], // no change yet in the number of blur events
                [this.click, afterElement], [this.waitForDomEltFocus, afterElement],
                [this.checkBlurEvents, widgetData, 2],
                // check that the value changed, and keep the new value in clickedValue
                // depending on the browser, options are not displayed at the same place, so we cannot know
                // on which option we clicked
                [function (cb) {
                    clickedValue = widgetData.value;
                    this.assertNotEquals(clickedValue, "B");
                    cb();
                }],

                [this.click, {
                    // click on the icon
                    x: widgetGeometry.x + widgetGeometry.width - 8,
                    y: widgetGeometry.y + widgetGeometry.height / 2
                }], [this.pause, 500],
                [this.checkBlurEvents, widgetData, 2], // no change yet in the number of blur events
                [this.click, {
                    // click again on the icon
                    x: widgetGeometry.x + widgetGeometry.width - 8,
                    y: widgetGeometry.y + widgetGeometry.height / 2
                }], [this.pause, 500],
                [this.click, {
                    // click in the middle of the widget
                    x: widgetGeometry.x + widgetGeometry.width / 2,
                    y: widgetGeometry.y + widgetGeometry.height / 2
                }], [this.pause, 500],
                [this.checkBlurEvents, widgetData, 2], // no change yet in the number of blur events
                // on some browsers, for the native select element, it is needed to click twice:
                // once to close the (native) popup and once to change the focus:
                [this.click, beforeElement], [this.click, beforeElement], [this.waitForDomEltFocus, beforeElement],
                [this.checkBlurEvents, widgetData, 3], // one more blur
                [function (cb) {
                    // check that the value did not change:
                    this.assertEquals(widgetData.value, clickedValue);
                    cb();
                }]
            ], cb);
        },

        checkBlurEvents: function (widgetData, expectedNumber, cb) {
            this.assertEquals(widgetData.blurEvents, expectedNumber);
            cb();
        },

        checkValue: function (widgetData, expectedValue, cb) {
            this.assertEquals(widgetData.value, expectedValue);
            cb();
        },

        pause: function (delay, cb) {
            setTimeout(cb, delay);
        },

        click: function (item, cb) {
            this.synEvent.click(item, cb);
        },

        type: function (text, cb) {
            this.synEvent.type(null, text, cb);
        },

        execute: function (array, cb) {
            var self = this;
            var next = function () {
                if (array.length === 0) {
                    self.$callback(cb);
                    return;
                }
                var args = array.shift();
                var fn = args.shift();
                args.push(next); // callback argument
                fn.apply(self, args);
            };
            next();
        }
    }
});
