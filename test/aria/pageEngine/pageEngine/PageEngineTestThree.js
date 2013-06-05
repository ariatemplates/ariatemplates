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
 * Test for content processors
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineTestThree",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProviderTwo");
    },
    $prototype : {

        runTestInIframe : function () {
            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function (args) {
            var text = this._testWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/Header for page AAAACP1CP2/) !== null);
            this.assertTrue(text.match(/Footer One for page AAAACP1CP2/) !== null);
            this.assertTrue(text.match(/Footer Two for page AAAACP/) === null);
            this.assertTrue(text.match(/The page engine works like a charmCP2/) !== null);

            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : this._afterSecondPageReady,
                scope : this
            });

        },

        _afterSecondPageReady : function () {
            var text = this._testWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/Footer One for page BBBBCP2/) !== null);
            this.assertTrue(text.match(/Footer Two for page BBBBCP1CP2/) !== null);
            this.assertTrue(text.match(/The page engine works like a charmCP/) === null);
            aria.core.Timer.addCallback({
                fn : this.end,
                scope : this,
                delay : 20
            });
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.site.PageProviderTwo();
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this[args.oncomplete],
                    scope : this
                }
            });

        },

        end : function () {
            this._disposePageEngine();
            this.$PageEngineBaseTestCase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
        }

    }
});