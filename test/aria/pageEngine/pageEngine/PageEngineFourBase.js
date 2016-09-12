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
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineFourBase",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBase",
    $constructor : function () {
        this.$PageEngineBase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProvider");
        this._pageReadyListener = {
            fn : this._onPageReady,
            scope : this
        };
        this._pageTransitionListener = {
            fn : this._onPageTransition,
            scope : this
        };

        this._visited = {};
        this._transitionsTracker = [];
        this._navigation = "history";
    },
    $prototype : {

        runTestInIframe : function () {
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

            // Check events
            this._testTransition(1, 0, null, "aaa");

            this._checkPageAAA();
            this._checkUrl(/\/pageEngine\/aaa/);
            this._checkTitle("page_aaa");

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
            this._checkTitle("page_bbb");

            // Check events
            this._testTransition(2, 1, "aaa", "bbb");

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

            // Check events
            this._testTransition(2, 1, "aaa", "bbb");

            var that = this;
            this._checkPageBBB();
            this._checkTitle("page_bbb");

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

            // Check events
            this._testTransition(3, 2, "bbb", "ccc");

            this._checkPageCCC();
            this._checkUrl(/\/pageEngine\/ccc/);
            this._checkTitle("page_ccc");

            if (aria.core.Browser.isOldIE) {
                aria.core.Timer.addCallback({
                    fn : this.end,
                    scope : this,
                    delay : 20
                });
            } else {
                this._testWindow.history.back();

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

            // Check events
            this._testTransition(4, 3, "ccc", "bbb");

            this._checkTitle("page_bbb");
            this._testWindow.history.forward();

            aria.core.Timer.addCallback({
                fn : this._afterFirstForward,
                scope : this,
                delay : 2000
            });
        },

        _afterFirstForward : function () {

            // Check events
            this._testTransition(5, 4, "bbb", "ccc");

            this._checkPageCCC();
            this._checkUrl(/\/pageEngine\/ccc/);
            this._checkTitle("page_ccc");
            this._checkVisited();

        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.site.PageProvider(this._navigation);
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.$addListeners({
                "pageReady" : this._pageReadyListener,
                "beforePageTransition" : this._pageTransitionListener
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
            this.$PageEngineBase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$removeListeners({
                "pageReady" : this._pageReadyListener,
                "beforePageTransition" : this._pageTransitionListener
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

        _onPageTransition : function (args) {
            this._transitionsTracker.push(args);
            if (args.from) {
                // Test that the data model is not changed before the event is raised
                this.assertEquals(this.pageEngine.getData().pageInfo.pageId, args.from);
            }

        },

        _testTransition : function (size, index, from, to) {
            var transitions = this._transitionsTracker;
            if (aria.utils.Type.isNumber(size)) {
                this.assertEquals(transitions.length, size, "The beforePageTransition event has been called the wrong number of times.");
            }
            if (aria.utils.Type.isNumber(index)) {
                var expected = {
                    from : from,
                    to : to
                };
                var actual = {
                    from : transitions[index].from,
                    to : transitions[index].to
                };
                this.assertJsonEquals(expected, actual, "The beforePageTransition event has been called the wrong properties.");
            }
        },

        _checkPageAAA : function () {
            var text = this._testWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/AAAA/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/second Module/) !== null);
            this.assertTrue(text.match(/myPageData/) === null);
        },

        _checkPageBBB : function () {
            var text = this._testWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/Header/) !== null);
            this.assertTrue(text.match(/BBBB/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/third Module/) !== null);
            this.assertTrue(text.match(/myPageData/) !== null);
        },

        _checkPageCCC : function () {
            var text = this._testWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/Header/) !== null);
            this.assertTrue(text.match(/CCCC/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/third Module/) !== null);
            this.assertTrue(text.match(/myPageData/) !== null);
        },

        _checkUrl : function (url) {
            this.assertTrue(this._testWindow.location.href.match(url) !== null);
        },

        _checkModuleInPage : function (pageId, refpath, inPage) {
            var module = this.pageEngine._rootModule.getPageModule(pageId, refpath);
            this.assertEquals(module.isInPage(), inPage, "Module " + refpath + " should " + (inPage ? "not " : "")
                    + "be in the current page.");
        },

        _checkTitle : function (title) {
            var document = this._testWindow.document;
            var titleTagContent = document.getElementsByTagName('title')[0].innerHTML;
            this.assertEquals(title, titleTagContent, "Title tag has not been set correctly");
            this.assertEquals(title, document.title, "document.title has not been set correctly");
        }

    }
});
