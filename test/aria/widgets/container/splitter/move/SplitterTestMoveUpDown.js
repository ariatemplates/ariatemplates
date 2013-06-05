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
    $prototype : {
        runTemplateTest : function () {
            aria.core.Timer.addCallback({
                fn : this._afterWidgetLoad,
                scope : this,
                delay : 1000
            });
        },
        _afterWidgetLoad : function () {
            var btn = this.getWidgetInstance("btnInc").getDom();
            this.splitter = this.getWidgetInstance("sampleSplitterElem");
            var self = this;
            this.synEvent.click(btn, {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : self._afterIncBtnClick,
                        scope : self,
                        delay : 1000
                    });
                },
                scope : this
            });
        },
        _afterIncBtnClick : function () {
            this.assertTrue(this.splitter._splitPanel1.style.height === "250px");
            this.assertTrue(this.splitter._splitPanel2.style.height === "142px");

            var btn = this.getWidgetInstance("btnDec").getDom();
            var self = this;
            this.synEvent.click(btn, {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : self._afterDecBtnClick,
                        scope : self,
                        delay : 1000
                    });
                },
                scope : this
            });

        },
        _afterDecBtnClick : function () {
            this.assertTrue(this.splitter._splitPanel1.style.height === "200px");
            this.assertTrue(this.splitter._splitPanel2.style.height === "192px");

            var args = {
                destPosY : 100,
                callback : {
                    scope : this,
                    fn : this._testMoveDown
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 1000
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
                duration : 2500,
                to : {
                    x : from.x,
                    y : from.y + (args.destPosY)
                }
            };
            this.synEvent.execute([["drag", options, from]], args.callback);
        },

        _testMoveDown : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) > 200);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) < 194);

            var args = {
                destPosY : -100,
                callback : {
                    scope : this,
                    fn : this._testMoveUp
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 1000
            });
        },
        _testMoveUp : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) < 290);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) > 94);

            var args = {
                destPosY : (parseInt(this.splitter._splitPanel2.style.height, 10) + 20),
                callback : {
                    scope : this,
                    fn : this._testMoveFullDown
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 1000
            });
        },
        _testMoveFullDown : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) == this.splitter._height);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) === 0);

            var args = {
                destPosY : (-(this.splitter._height + 20)),
                callback : {
                    scope : this,
                    fn : this._testMoveFullUp
                }
            };
            aria.core.Timer.addCallback({
                fn : this._doDragging,
                args : args,
                scope : this,
                delay : 1000
            });
        },
        _testMoveFullUp : function () {
            this.assertTrue(parseInt(this.splitter._splitPanel1.style.height, 10) === 0);
            this.assertTrue(parseInt(this.splitter._splitPanel2.style.height, 10) == this.splitter._height);
            this.end();
        }
    }
});