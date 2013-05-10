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
    $classpath : "test.aria.touch.widgets.DoubleSlider",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        // override the template for this test case
        this.data = {
            slider : [0.1, 0.2]

        };
        this._widgetParent = null;
        this.setTestEnv({
            template : "test.aria.touch.widgets.DoubleSliderTpl",
            data : this.data
        });
        this.domUtils = aria.utils.Dom;
        this._testIndex = 0;
        this._params = [[], [0, 0.3], [0.4, 0.8], [0.8, 0.2], [-0.8, 1.2]];
        this._results = [[70, 25], [95, 0], [227, 105], [227, 105], [227, 105], [252, 105], [252, 235], [252, 235]];
    },
    $destructor : function () {
        this._widgetParent = null;
        this.domUtils = null;
        this._testIndex = null;
        this.$RobotTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._setValue1,
                scope : this,
                delay : 200
            });
        },

        _setValue1 : function () {
            var domUtils = this.domUtils;
            this._widgetParent = domUtils.getElementById('Slider');
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this._testValues(this._results[this._testIndex], left1, left2);
            this._testIndex++;
            var val = this._params[this._testIndex];
            aria.utils.Json.setValue(this.data, "slider", val);
            aria.core.Timer.addCallback({
                fn : this._setValue2,
                scope : this,
                delay : 200
            });

        },
        _setValue2 : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this._testValues(this._results[this._testIndex], left1, left2);
            this._testIndex++;

            var val = this._params[this._testIndex];
            aria.utils.Json.setValue(this.data, "slider", val);
            aria.core.Timer.addCallback({
                fn : this._setValue3,
                scope : this,
                delay : 200
            });
        },
        _setValue3 : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);

            this._testValues(this._results[this._testIndex], left1, left2);
            this._testIndex++;
            var val = this._params[this._testIndex];
            aria.utils.Json.setValue(this.data, "slider", val);
            aria.core.Timer.addCallback({
                fn : this._setValue4,
                scope : this,
                delay : 200
            });
        },
        _setValue4 : function () {
            // The postion shouldn't change for value
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this._testValues(this._results[this._testIndex], left1, left2);
            this._testIndex++;
            var val = this._params[this._testIndex];
            aria.utils.Json.setValue(this.data, "slider", val);
            aria.core.Timer.addCallback({
                fn : this._setValue5,
                scope : this,
                delay : 200
            });

        },
        _setValue5 : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this._testValues(this._results[this._testIndex], left1, left2);
            this._testIndex++;
            this._checkDrag();
        },
        _checkDrag : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var geometry = domUtils.getGeometry(childSpan[1]);
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 25,
                    y : from.y + 0
                }
            };
            this.synEvent.execute([["drag", options, from]], {
                fn : this._testDragHandleOne,
                scope : this
            });
        },
        _testDragHandleOne : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this._testValues(this._results[this._testIndex], left1, left2);
            this._testIndex++;
            this._checkDragTwo();

        },
        _checkDragTwo : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var geometry = domUtils.getGeometry(childSpan[2]);
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 150,
                    y : from.y + 0
                }
            };
            this.synEvent.execute([["drag", options, from]], {
                fn : this._testDragHandleTwo,
                scope : this
            });

        },
        _testDragHandleTwo : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this._testValues(this._results[this._testIndex], left1, left2);
            this._testIndex++;
            this._checkVerticalDrag();

        },
        _checkVerticalDrag : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var geometry = domUtils.getGeometry(childSpan[2]);
            var from = {
                x : geometry.x + geometry.width / 2,
                y : geometry.y + geometry.height / 2
            };
            var options = {
                duration : 1000,
                to : {
                    x : from.x + 0,
                    y : from.y + 50
                }
            };
            this.synEvent.execute([["drag", options, from]], {
                fn : this._testVerticalDrag,
                scope : this
            });

        },
        _testVerticalDrag : function () {
            var domUtils = this.domUtils;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this._testValues(this._results[this._testIndex], left1, left2);
            this.end();

        },
        _testValues : function (Value, firstHandle, secondHandle) {
            this.assertTrue(firstHandle >= Value[0], "Invalid Slider first Handle Position");
            this.assertTrue(secondHandle >= Value[1], "Invalid Slider second Handle Position");
        }

    }
});