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

/**
 * Template Test case for aria.widgets.container.Splitter
 */
Aria.classDefinition({
    $classpath : "test.aria.widgets.container.splitter.move.SplitterTestMoveUpDown",
    $extends : "aria.jsunit.RobotTestCase",
    $dependencies : ["aria.core.Browser"],
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        if (aria.core.Browser.isIE7 || aria.core.Browser.isPhantomJS || aria.core.Browser.isSafari) {
            this.defaultTestTimeout = 40000;
        } else if (aria.core.Browser.isIE8) {
            this.defaultTestTimeout = 30000;
        }
    },
    $prototype : {
        runTemplateTest : function () {
            this.waitFor({
                condition : function () {
                    var widget = this.getWidgetInstance("btnInc");
                    return widget && widget.getDom() && this.getWidgetInstance("sampleSplitterElem");
                },
                callback : {
                    fn : this._afterWidgetLoad,
                    scope : this
                }
            });
        },
        _afterWidgetLoad : function () {
            var btn = this.getWidgetInstance("btnInc").getDom();
            this.splitter = this.getWidgetInstance("sampleSplitterElem");
            this.synEvent.click(btn, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            var splitter = this.splitter;
                            return splitter._splitPanel1.style.height == "250px"
                                    && splitter._splitPanel2.style.height == "142px";
                        },
                        callback : {
                            fn : this._afterIncBtnClick,
                            scope : this
                        }
                    });
                },
                scope : this
            });
        },
        _afterIncBtnClick : function () {
            this.assertEquals(this.splitter._splitPanel1.style.height, "250px", "splitPanel1 should be %2 height instead of %1");
            this.assertEquals(this.splitter._splitPanel2.style.height, "142px", "splitPanel1 should be %2 height instead of %1");

            var btn = this.getWidgetInstance("btnDec").getDom();
            this.synEvent.click(btn, {
                fn : function () {
                    this.waitFor({
                        condition : function () {
                            var splitter = this.splitter;
                            return splitter._splitPanel1.style.height == "200px"
                                    && splitter._splitPanel2.style.height == "192px";
                        },
                        callback : {
                            fn : this._afterDecBtnClick,
                            scope : this
                        }
                    });
                },
                scope : this
            });

        },
        _doDragging : function (args) {
            var dom = aria.utils.Dom;
            var elem = this.splitter._draggable.element;
            var geometry = dom.getGeometry(elem);
            var from = {
                x : geometry.x + 100,
                y : geometry.y
            };
            var options = {
                duration : 500,
                to : {
                    x : from.x,
                    y : from.y + (args.destPosY)
                }
            };
            var self = this;
            this.synEvent.execute([["drag", options, from]], function () {
                self.waitFor(args.waitFor);
            });
        },

        _afterDecBtnClick : function () {
            this.assertEquals(this.splitter._splitPanel1.style.height, "200px", "splitPanel1 should be %2 height instead of %1");
            this.assertEquals(this.splitter._splitPanel2.style.height, "192px", "splitPanel1 should be %2 height instead of %1");

            var args = {
                destPosY : 100,
                waitFor : {
                    condition : function () {
                        var splitter = this.splitter;
                        return parseInt(splitter._splitPanel1.style.height, 10) > 200
                                && parseInt(splitter._splitPanel2.style.height, 10) < 194;
                    },
                    callback : {
                        fn : this._testMoveDown,
                        scope : this
                    }
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 50
            });
        },

        _testMoveDown : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) > 200);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) < 194);

            var args = {
                destPosY : -100,
                waitFor : {
                    condition : function () {
                        var splitter = this.splitter;
                        return parseInt(splitter._splitPanel1.style.height, 10) < 290
                                && parseInt(splitter._splitPanel2.style.height, 10) > 94;
                    },
                    callback : {
                        fn : this._testMoveUp,
                        scope : this
                    }
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 50
            });
        },
        _testMoveUp : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) < 290);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) > 94);

            var args = {
                destPosY : (parseInt(this.splitter._splitPanel2.style.height, 10) + 20),
                waitFor : {
                    condition : function () {
                        var splitter = this.splitter;
                        return parseInt(splitter._splitPanel1.style.height, 10) == this.splitter._height
                                && parseInt(splitter._splitPanel2.style.height, 10) === 0;
                    },
                    callback : {
                        fn : this._testMoveFullDown,
                        scope : this
                    }
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 50
            });
        },
        _testMoveFullDown : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) == this.splitter._height);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) === 0);

            var args = {
                destPosY : (-(this.splitter._height + 20)),
                waitFor : {
                    condition : function () {
                        var splitter = this.splitter;
                        return parseInt(splitter._splitPanel1.style.height, 10) === 0
                                && parseInt(splitter._splitPanel2.style.height, 10) == this.splitter._height;
                    },
                    callback : {
                        fn : this._testMoveFullUp,
                        scope : this
                    }
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 50
            });
        },
        _testMoveFullUp : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) === 0);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) == this.splitter._height);
            this.end();
        }
    }
});
