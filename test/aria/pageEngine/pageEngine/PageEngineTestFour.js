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
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineTestFour",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProvider");
        this._pageReadyListener = {
            fn : this._onPageReady,
            scope : this
        };
        this._visited = {};
        this._navigation = "history";
    },
    $prototype : {

        runTemplateTestInIframe : function () {
            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function (args) {

            // Check data
            var pageEngineData = this.pageEngine.getData();
            this.assertEquals(pageEngineData.appData.basefacts.one, "first");
            var pageData = aria.utils.Json.copy(pageEngineData.pageData);
            this.assertJsonEquals(pageData, {});
            this.assertEquals(pageEngineData.pageInfo.pageId, "aaa");

            // Check page provider
            this.assertEquals(this.pageEngine.getPageProvider(), this.pageProvider);

            // Check present modules
            this._checkModuleInPage("aaa", "common:m1.m2", true);
            this._checkModuleInPage("aaa", "m3", true);

            this._checkPageAAA();
            this._checkUrl(/\/pageEngine\/aaa/);

            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : this._afterSecondPageReady,
                scope : this
            });

        },

        _afterSecondPageReady : function () {

            // Check data
            var pageEngineData = this.pageEngine.getData();
            this.assertEquals(pageEngineData.appData.basefacts.one, "first");
            var pageData = aria.utils.Json.copy(pageEngineData.pageData);
            this.assertJsonEquals(pageData, {
                message : "myPageData"
            });
            this.assertEquals(pageEngineData.pageInfo.pageId, "bbb");

            // Check page provider
            this.assertEquals(this.pageEngine.getPageProvider(), this.pageProvider);

            // Check present modules
            this._checkModuleInPage("aaa", "common:m1.m2", true);
            this._checkModuleInPage("aaa", "m3", false);
            this._checkModuleInPage("bbb", "m3", true);

            var that = this;
            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : that._afterSecondPageReadyAgain,
                        scope : that,
                        delay : 200
                    });
                }
            });

        },

        _afterSecondPageReadyAgain : function () {
            // Check data
            var pageEngineData = this.pageEngine.getData();
            this.assertEquals(pageEngineData.appData.basefacts.one, "first");
            var pageData = aria.utils.Json.copy(pageEngineData.pageData);
            this.assertJsonEquals(pageData, {
                message : "myPageData"
            });
            this.assertEquals(pageEngineData.pageInfo.pageId, "bbb");

            // Check page provider
            this.assertEquals(this.pageEngine.getPageProvider(), this.pageProvider);

            // Check present modules
            this._checkModuleInPage("aaa", "common:m1.m2", true);
            this._checkModuleInPage("aaa", "m3", false);
            this._checkModuleInPage("bbb", "m3", true);

            var that = this;
            this._checkPageBBB();
            this._checkUrl(/\/pageEngine\/bbb/);

            this.pageEngine.navigate({
                pageId : "ccc"
            }, {
                fn : function () {
                    aria.core.Timer.addCallback({
                        fn : that._afterThirdPageReady,
                        scope : that,
                        delay : 200
                    });
                }
            });

        },

        _afterThirdPageReady : function () {

            // Check data
            var pageEngineData = this.pageEngine.getData();
            this.assertEquals(pageEngineData.appData.basefacts.one, "first");
            var pageData = aria.utils.Json.copy(pageEngineData.pageData);
            this.assertJsonEquals(pageData, {
                message : "myPageData"
            });
            this.assertEquals(pageEngineData.pageInfo.pageId, "ccc");

            // Check present modules
            this._checkModuleInPage("bbb", "common:m1.m2", true);
            this._checkModuleInPage("aaa", "m3", false);
            this._checkModuleInPage("bbb", "m3", false);
            this._checkModuleInPage("ccc", "m3", true);

            this._checkPageCCC();
            this._checkUrl(/\/pageEngine\/ccc/);

            if (aria.core.Browser.isIE) {
                aria.core.Timer.addCallback({
                    fn : this.end,
                    scope : this,
                    delay : 20
                });
            } else {
                this._iframeWindow.history.back();

                aria.core.Timer.addCallback({
                    fn : this._afterFirstBack,
                    scope : this,
                    delay : 2000
                });
            }
        },

        _afterFirstBack : function () {
            this._checkPageBBB();

            // Check data
            var pageEngineData = this.pageEngine.getData();
            this.assertEquals(pageEngineData.appData.basefacts.one, "first");
            var pageData = aria.utils.Json.copy(pageEngineData.pageData);
            this.assertJsonEquals(pageData, {
                message : "myPageData"
            });
            this.assertEquals(pageEngineData.pageInfo.pageId, "bbb");

            // Check page provider
            this.assertEquals(this.pageEngine.getPageProvider(), this.pageProvider);

            // Check present modules
            this._checkModuleInPage("aaa", "common:m1.m2", true);
            this._checkModuleInPage("aaa", "m3", false);
            this._checkModuleInPage("ccc", "m3", false);
            this._checkModuleInPage("bbb", "m3", true);

            this._checkUrl(/\/pageEngine\/bbb/);
            this._iframeWindow.history.forward();

            aria.core.Timer.addCallback({
                fn : this._afterFirstForward,
                scope : this,
                delay : 2000
            });
        },

        _afterFirstForward : function () {
            this._checkPageCCC();
            this._checkUrl(/\/pageEngine\/ccc/);
            this._checkVisited();

        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._iframeWindow.test.aria.pageEngine.pageEngine.site.PageProvider(this._navigation);
            this.pageEngine = new this._iframeWindow.aria.pageEngine.PageEngine();
            this.pageEngine.$addListeners({
                "pageReady" : this._pageReadyListener
            });
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this[args.oncomplete],
                    scope : this
                }
            });

        },

        _checkVisited : function () {
            this.assertTrue(this._visited.aaa == 1);
            this.assertTrue(this._visited.bbb == 2);
            this.assertTrue(this._visited.ccc == 2);
            this.end();
        },
        end : function () {
            this._disposePageEngine();
            this.$PageEngineBaseTestCase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$removeListeners({
                "pageReady" : this._pageReadyListener
            });
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
        },

        _onPageReady : function (args) {
            if (!this._visited[args.pageId]) {
                this._visited[args.pageId] = 0;
            }
            this._visited[args.pageId] = this._visited[args.pageId] + 1;
        },

        _checkPageAAA : function () {
            var text = this._iframeWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/AAAA/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/second Module/) !== null);
            this.assertTrue(text.match(/myPageData/) === null);
        },

        _checkPageBBB : function () {
            var text = this._iframeWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/Header/) !== null);
            this.assertTrue(text.match(/BBBB/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/third Module/) !== null);
            this.assertTrue(text.match(/myPageData/) !== null);
        },

        _checkPageCCC : function () {
            var text = this._iframeWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/Header/) !== null);
            this.assertTrue(text.match(/CCCC/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/third Module/) !== null);
            this.assertTrue(text.match(/myPageData/) !== null);
        },

        _checkUrl : function (url) {
            this.assertTrue(this._iframeWindow.location.href.match(url) !== null);
        },

        _checkModuleInPage : function (pageId, refpath, inPage) {
            var module = this.pageEngine._rootModule.getPageModule(pageId, refpath);
            this.assertEquals(module.isInPage(), inPage, "Module " + refpath + " should " + (inPage ? "not " : "")
                    + "be in the current page.");
        }

    }
});