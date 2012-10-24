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
 * Test case for aria.widgets.container.SplitterTest
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.SplitterTest",
    $extends : "aria.jsunit.WidgetTestCase",
    $dependencies : ["aria.widgets.container.Splitter"],
    $prototype : {

        _genericSplitter : function (cfg, h) {
            var localCfg = aria.utils.Json.copy(cfg);
            var tf = this._createSplitter(cfg);
            var dom = tf.dom;
            var o = tf.o;

            // Test panels
            // var h = this._calcHeight(localCfg, o);

            this.assertTrue(o._splitPanel1.style.height === h.s1);
            this.assertTrue(o._splitPanel2.style.height === h.s2);

            this.outObj.clearAll();
            o.$dispose();

        },
        _inject : function (src, target) {
            for (var prop in src) {
                if (src.hasOwnProperty(prop)) {
                    if (!(prop in target)) {
                        target[prop] = src[prop];
                    }
                }
            }
            return target;
        },
        _createSplitter : function (cfg) {
            var o = new aria.widgets.container.Splitter(cfg, this.outObj.tplCtxt);
            o._widgetMarkupBegin(this.outObj);
            this.outObj.putInDOM();
            o._domElt = this.outObj.testArea;
            o.initWidget();
            // init widget
            // o.initWidget();
            return {
                o : o,
                dom : this.outObj.testArea.childNodes[0]
            };
        },
        testBaseSplitter : function () {
            // Cleanup
            this.outObj.clearAll();
            this.assertTrue(this.outObj.testArea.innerHTML === "" && this.outObj.store === "");
            // create a new splitter object

            var cfg = {
                id : "sampleSplitter",
                sclass : "std",
                orientation : "horizontal",
                size1 : 150,
                size2 : 250,
                height : 400,
                border : false,
                width : 396,
                macro1 : 'PanelOne',
                macro2 : 'PanelTwo'
            };

            this._testBaseNormalMarkup(cfg);

        },
        _testBaseNormalMarkup : function (cfg) {
            var localCfg = aria.utils.Json.copy(cfg);

            var tf = this._createSplitter(cfg);
            this.assertFalse(tf.o === null);
            this.assertFalse(this.outObj.store === "");
            this.assertFalse(this.outObj.testArea.innerHTML === "");

            var o = tf.o;
            var dom = tf.dom;
            this.assertTrue(dom.style.height === cfg.height + "px");
            this.assertTrue(dom.style.width === cfg.width + "px");

            // Test panels
            this.assertTrue(o._splitPanel1.style.height === "147px");
            this.assertTrue(o._splitPanel2.style.height === "247px");

            this.outObj.clearAll();
            o.$dispose();

            // this.notifyTestEnd("testAsyncSplitter");
        },
        testSplitterDifferentHeights : function () {

            var basicProperties = {
                id : "sampleSplitter",
                sclass : "std",
                macro1 : 'PanelOne',
                macro2 : 'PanelTwo',
                width : 396,
                orientation : "horizontal",
                border : true
            };
            this.cfgArr = [{
                        size1 : 200,
                        height : 700
                    }, {
                        size2 : 200,
                        height : 700
                    }, {
                        height : 700
                    }, {
                        size1 : 200,
                        size2 : 300,
                        height : 700
                    }, {
                        size1 : 350,
                        size2 : 350,
                        height : 700
                    }, {
                        size1 : 400,
                        size2 : 400,
                        height : 700
                    }, {
                        size1 : 200,
                        size2 : 300,
                        height : 700,
                        adapt : "size1"
                    }, {
                        size1 : 200,
                        size2 : 300,
                        height : 700,
                        adapt : "size2"
                    }, {
                        size1 : 350,
                        size2 : 350,
                        height : 700,
                        adapt : "size1"
                    }, {
                        size1 : 350,
                        size2 : 350,
                        height : 700,
                        adapt : "size2"
                    }, {
                        size1 : 400,
                        size2 : 400,
                        height : 700,
                        adapt : "size1"
                    }, {
                        size1 : 400,
                        size2 : 400,
                        height : 700,
                        adapt : "size2"
                    }, {
                        size1 : 200,
                        size2 : 300,
                        height : 700,
                        border : false
                    }, {
                        size1 : 350,
                        size2 : 350,
                        height : 700,
                        border : false
                    }, {
                        size1 : 400,
                        size2 : 400,
                        height : 700,
                        border : false
                    }, {
                        size1 : 200,
                        size2 : 300,
                        height : 700,
                        border : false,
                        adapt : "size1"
                    }, {
                        size1 : 350,
                        size2 : 350,
                        height : 700,
                        border : false,
                        adapt : "size1"
                    }, {
                        size1 : 400,
                        size2 : 400,
                        height : 700,
                        border : false,
                        adapt : "size1"
                    }, {
                        size1 : 200,
                        size2 : 300,
                        height : 700,
                        border : false,
                        adapt : "size2"
                    }, {
                        size1 : 350,
                        size2 : 350,
                        height : 700,
                        border : false,
                        adapt : "size2"
                    }, {
                        size1 : 400,
                        size2 : 400,
                        height : 700,
                        border : false,
                        adapt : "size2"
                    }];
            this.outputArr = [{
                        s1 : "200px",
                        s2 : "492px"
                    }, {
                        s1 : "492px",
                        s2 : "200px"
                    }, {
                        s1 : "346px",
                        s2 : "346px"
                    }, {
                        s1 : "276px",
                        s2 : "416px"
                    }, {
                        s1 : "346px",
                        s2 : "346px"
                    }, {
                        s1 : "346px",
                        s2 : "346px"
                    }, {
                        s1 : "392px",
                        s2 : "300px"
                    }, {
                        s1 : "200px",
                        s2 : "492px"
                    }, {
                        s1 : "342px",
                        s2 : "350px"
                    }, {
                        s1 : "350px",
                        s2 : "342px"
                    }, {
                        s1 : "292px",
                        s2 : "400px"
                    }, {
                        s1 : "400px",
                        s2 : "292px"
                    }, {
                        s1 : "277px",
                        s2 : "417px"
                    }, {
                        s1 : "347px",
                        s2 : "347px"
                    }, {
                        s1 : "347px",
                        s2 : "347px"
                    }, {
                        s1 : "394px",
                        s2 : "300px"
                    }, {
                        s1 : "344px",
                        s2 : "350px"
                    }, {
                        s1 : "294px",
                        s2 : "400px"
                    }, {
                        s1 : "200px",
                        s2 : "494px"
                    }, {
                        s1 : "350px",
                        s2 : "344px"
                    }, {
                        s1 : "400px",
                        s2 : "294px"
                    }];

            for (var i = 0, len = this.cfgArr.length; i < len; i++) {
                this._genericSplitter(this._inject(basicProperties, this.cfgArr[i]), this.outputArr[i]);
            }

            // this.notifyTestEnd("testSplitterDifferentHeights");
        }
    }
});