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
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        // override the template for this test case
        this.data = {
            slider : [0, 0]

        };
        this._widgetParent = null;
        this.setTestEnv({
            template : "test.aria.touch.widgets.DoubleSliderTpl",
            data : this.data
        });
    },
    $destructor : function () {
        this._widgetParent = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._testValue,
                scope : this,
                delay : 500
            });
        },

        _testValue : function () {
            var val = [0, 0.3];
            aria.utils.Json.setValue(this.data, "slider", val);
            aria.core.Timer.addCallback({
                fn : this._checkValue,
                scope : this,
                delay : 500
            });

        },
        _checkValue : function () {
            var domUtils = aria.utils.Dom;
            this._widgetParent = domUtils.getElementById('Slider');
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left = domUtils.getStyle(childSpan[1], "left");
            left = parseInt(left.substring(0, left.indexOf("px")), 10);
            this.assertTrue(left > 95, "Valid bean invalid");
            this._testValue2();
        },
        _testValue2 : function () {
            var val = [0.4, 0.8];
            aria.utils.Json.setValue(this.data, "slider", val);
            aria.core.Timer.addCallback({
                fn : this._checkValue2,
                scope : this,
                delay : 500
            });

        },
        _checkValue2 : function () {
            var domUtils = aria.utils.Dom;
            var childSpan = domUtils.getDomElementsChildByTagName(this._widgetParent, "span");
            var left1 = domUtils.getStyle(childSpan[1], "left");
            var left2 = domUtils.getStyle(childSpan[2], "left");
            left1 = parseInt(left1.substring(0, left1.indexOf("px")), 10);
            left2 = parseInt(left2.substring(0, left2.indexOf("px")), 10);
            this.assertTrue(left1 > 230, "Valid bean invalid");
            this.assertTrue(left2 > 105, "Valid bean invalid");
            this.end();
        }
    }
});