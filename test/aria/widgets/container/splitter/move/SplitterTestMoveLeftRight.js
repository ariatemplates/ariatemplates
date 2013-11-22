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
    $classpath : "test.aria.widgets.container.splitter.move.SplitterTestMoveLeftRight",
    $extends : "aria.jsunit.RobotTestCase",
    $constructor : function () {
        this.$RobotTestCase.constructor.call(this);
        this.defaultTestTimeout = aria.core.Browser.isSafari ? 150000 : 40000;
    },
    $prototype : {
        // TODO change all those delays into waitFor({condition, callback})
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._afterWidgetLoad,
                scope : this,
                delay : 500
            });
        },
        _afterWidgetLoad : function () {
            var link = this.getWidgetInstance("link1").getDom();
            this.splitter = this.getWidgetInstance("sampleSplitterElem");
            var self = this;
            this.synEvent.click(link, {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : self._afterIncBtnClick,
                        scope : self,
                        delay : 500
                    });
                },
                scope : this
            });
        },
        _afterIncBtnClick : function () {
            this.assertEquals(this.__getWidth1(), 250);
            this.assertEquals(this.__getWidth2(), 142);

            var link = this.getWidgetInstance("link2").getDom();
            var self = this;
            this.synEvent.click(link, {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : self._afterDecBtnClick,
                        scope : self,
                        delay : 500
                    });
                },
                scope : this
            });

        },
        _afterDecBtnClick : function () {
            this.assertEquals(this.__getWidth1(), 200);
            this.assertEquals(this.__getWidth2(), 192);

            var args = {
                destPosX : 100,
                callback : {
                    scope : this,
                    fn : this._testMoveRight
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 500
            });
        },
        _doDragging : function (args) {
            var dom = aria.utils.Dom;
            var elem = this.splitter._draggable.element;
            var geometry = dom.getGeometry(elem);
            var from = {
                x : geometry.x,
                y : geometry.y + 100
            };
            var options = {
                duration : 2500,
                to : {
                    x : from.x + (args.destPosX),
                    y : from.y
                }
            };
            this.synEvent.execute([["drag", options, from]], args.callback);
        },

        _testMoveRight : function () {
            this.assertTrue(this.__getWidth1() > 290);
            this.assertTrue(this.__getWidth2() < 100);

            var args = {
                destPosX : -100,
                callback : {
                    scope : this,
                    fn : this._testMoveLeft
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 500
            });
        },
        _testMoveLeft : function () {
            this.assertTrue(this.__getWidth1() < 210);
            this.assertTrue(this.__getWidth2() > 180);
            var args = {
                destPosX : this.__getWidth2() + 20,
                callback : {
                    scope : this,
                    fn : this._testMoveFullRight
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 500
            });
        },
        _testMoveFullRight : function () {
            this.assertEquals(this.__getWidth1(), this.splitter._width);
            this.assertEquals(this.__getWidth2(), 0);

            var args = {
                destPosX : (-(this.splitter._width + 20)),
                callback : {
                    scope : this,
                    fn : this._testMoveFullLeft
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 500
            });
        },
        _testMoveFullLeft : function () {
            this.assertEquals(this.__getWidth1(), 0);
            this.assertEquals(this.__getWidth2(), this.splitter._width);
            this.end();
        },

        __getWidth1 : function () {
            return parseInt(this.splitter._splitPanel1.style.width, 10);
        },
        __getWidth2 : function () {
            return parseInt(this.splitter._splitPanel2.style.width, 10);
        }
    }
});
