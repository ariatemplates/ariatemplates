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
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineTestSix",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProviderSix");
        this._animations = true;
        this._headChildCount = -1;
    },
    $prototype : {

        runTestInIframe : function () {
            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function () {
            if (this.pageEngine._animationsDisabled) {
                this.end();
            } else {
                // Check page aaa
                this._checkPageAAA();

                this.pageEngine.navigate({
                    pageId : "bbb"
                }, {
                    fn : this._afterSecondPageReady,
                    scope : this
                });
            }
        },

        _afterSecondPageReady : function () {
            // Check page bbb
            this._checkPageBBB();

            this.pageEngine.navigate({
                pageId : "ccc"
            }, {
                fn : this._afterThirdPageReady,
                scope : this
            });
        },

        _afterThirdPageReady : function () {
            // Check page ccc
            this._checkPageCCC();
            this.end();
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.site.PageProviderSix(this._animations);
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
        },

        _checkPageAAA : function () {
            var elt = this._testWindow.aria.utils.Dom.getElementById("at-main");
            var firstDiv = elt.innerHTML;
            var secondDiv = elt.nextSibling.innerHTML;

            this.assertTrue(firstDiv.match(/Page Name: aaa/) !== null);
            this.assertTrue(secondDiv === "");

            //Issue722
            this._headChildCount = this._testWindow.document.getElementsByTagName("head")[0].childElementCount;
        },

        _checkPageBBB : function () {
            var elt = this._testWindow.aria.utils.Dom.getElementById("at-main");
            var firstDiv = elt.innerHTML;
            var secondDiv = elt.nextSibling.innerHTML;
            this.assertTrue(firstDiv.match(/Page Name: bbb/) !== null);
            this.assertTrue(secondDiv === "");

            //Issue722
            this.assertEquals(this._testWindow.document.getElementsByTagName("head")[0].childElementCount, this._headChildCount);
        },

        _checkPageCCC : function () {
            var elt = this._testWindow.aria.utils.Dom.getElementById("at-main");
            var firstDiv = elt.innerHTML;
            var secondDiv = elt.nextSibling.innerHTML;
            this.assertTrue(firstDiv === "");
            this.assertTrue(secondDiv.match(/Page Name: ccc/) !== null);

            //Issue722
            this.assertEquals(this._testWindow.document.getElementsByTagName("head")[0].childElementCount, this._headChildCount);
        }
    }
});
