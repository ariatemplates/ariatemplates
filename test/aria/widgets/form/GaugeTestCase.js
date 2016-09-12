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
 * Test case for aria.widgets.form.GaugeTest
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.form.GaugeTestCase",
    $dependencies : ["aria.jsunit.helpers.OutObj"],
    $extends : "aria.jsunit.WidgetTestCase",
    $prototype : {
        _createGauge : function (cfg) {
            return {
                o : this.createAndInit("aria.widgets.form.Gauge", cfg),
                dom : this.outObj.testArea.childNodes[0]
            };
        },
        _destroyGauge : function (_inst) {
            _inst.$dispose();
            this.outObj.clearAll();
        },
        testAsyncBaseNormalMarkup : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The first test hence becomes asynchronous
            Aria.load({
                classes : ["aria.widgets.form.Gauge"],
                oncomplete : {
                    fn : this._testBaseNormalMarkup,
                    scope : this
                }
            });
        },

        _testBaseNormalMarkup : function () {

            var tf = this._createGauge({
                minValue : -100,
                maxValue : 100,
                currentValue : 8,
                width : 275,
                gaugeWidth : 200,
                sclass : "std"
            });

            var o = tf.o;
            var dom = tf.dom;

            // test top level dom span
            this.assertEquals(dom.tagName, "SPAN");
            this.assertEquals(dom.childNodes.length, 1);
            // display:inline-block has been moved from inline style to the CSS file
            // this.assertTrue(dom.style.display === "inline-block");

            // test progress bar container
            var progCont = dom.childNodes[0];
            this.assertEquals(progCont.tagName, "DIV");

            var floatVal = progCont.style.cssFloat || progCont.style.styleFloat;
            this.assertEquals(floatVal, "left");
            this.assertEquals(progCont.className, "xGauge_std");

            // test progress bar
            var progBar = progCont.childNodes[0];
            this.assertEquals(progBar.tagName, "DIV");
            this.assertEquals(progBar.className, "xGauge_progress_std");
            this.assertEquals(progBar.style.width, "54%");

            this._destroyGauge(o);

            this.notifyTestEnd("testAsyncBaseNormalMarkup");
        },
        testBinding : function () {
            var data = {
                currentValue : 8
            };
            var array = [8];

            // var tf = this._createTextInput({label:"TESTLABEL", bind: {value : {to : 0, inside: array}}});

            // test that bindings work with arrays and objects:
            var tf = this._createGauge({
                minValue : -100,
                maxValue : 100,
                width : 275,
                gaugeWidth : 200,
                sclass : "std",
                bind : {
                    currentValue : {
                        to : 0,
                        inside : array
                    }
                }
            });

            var o = tf.o;
            this.assertTrue(o._cfg.currentValue == 8);
            this._destroyGauge(o);

            tf = this._createGauge({
                minValue : -100,
                maxValue : 100,
                width : 275,
                gaugeWidth : 200,
                sclass : "std",
                bind : {
                    currentValue : {
                        to : "currentValue",
                        inside : data
                    }
                }
            });

            o = tf.o;
            this.assertTrue(o._cfg.currentValue == 8);
            this._destroyGauge(o);
        },

        testAsyncLabelMarkup : function () {

            // Need to load the widget class at test execution time because otherwise aria.widgets.AriaSkinInterface is
            // not defined. The last test hence becomes asynchronous (as it will be executed first in IE)
            Aria.load({
                classes : ["aria.widgets.form.Gauge"],
                oncomplete : {
                    fn : this._testLabelMarkup,
                    scope : this
                }
            });
        },

        _testLabelMarkup : function () {

            var tf = this._createGauge({
                minValue : -100,
                maxValue : 100,
                currentValue : 8,
                width : 275,
                gaugeWidth : 200,
                labelWidth : 70,
                sclass : "std"
            });

            var o = tf.o;
            var dom = tf.dom;

            // test top level dom span
            this.assertEquals(dom.tagName, "SPAN");
            this.assertEquals(dom.childNodes.length, 2);
            // display:inline-block has been moved from inline style to the CSS file
            // this.assertTrue(dom.style.display === "inline-block");

            // test label
            var label = dom.childNodes[0];
            var floatVal = label.style.cssFloat || label.style.styleFloat;
            this.assertEquals(label.tagName, "SPAN");
            this.assertEquals(floatVal, "left");

            // test progress bar container
            var progCont = dom.childNodes[1];
            this.assertEquals(progCont.tagName, "DIV");

            floatVal = progCont.style.cssFloat || progCont.style.styleFloat;
            this.assertEquals(floatVal, "left");
            this.assertEquals(progCont.className, "xGauge_std");

            // test progress bar
            var progBar = progCont.childNodes[0];
            this.assertEquals(progBar.tagName, "DIV");
            this.assertEquals(progBar.className, "xGauge_progress_std");
            this.assertEquals(progBar.style.width, "54%");

            this._destroyGauge(o);

            this.notifyTestEnd("testAsyncLabelMarkup");
        }
    }
});
