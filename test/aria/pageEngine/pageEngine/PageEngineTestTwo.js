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
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineTestTwo",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProvider");
        this._pageReadyListener = {
            fn : this._onPageReady,
            scope : this
        };
        this._visited = {};
        // this.defaultTestTimeout = 10000;
        this._cssBasePath = "test/templateTests/tests/pageEngine/site/css/";

    },
    $prototype : {

        runTemplateTestInIframe : function () {

            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function (args) {
            var text = this._iframeWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this._testCSSLinkTag(this._cssBasePath + "cssOne.css");
            this._testCSSLinkTag(this._cssBasePath + "cssTwo.css");
            this._testCSSLinkTag(this._cssBasePath + "cssThree.css");
            this._testCSSLinkTag(this._cssBasePath + "cssFour.css");
            this._testCSSLinkTag(this._cssBasePath + "cssFive.css");
            this._testCSSLinkTag(this._cssBasePath + "cssSix.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssSeven.css");

            // this._testCSSLinkTag(1, false);
            this.assertTrue(text.match(/AAAA/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/second Module/) !== null);
            this.assertTrue(text.match(/myPageData/) === null);

            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : this._afterSecondPageReady,
                scope : this
            });

        },

        _afterSecondPageReady : function () {
            this._testCSSLinkTag(this._cssBasePath + "cssOne.css");
            this._testCSSLinkTag(this._cssBasePath + "cssTwo.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssThree.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssFour.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssFive.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssSix.css");
            this._testCSSLinkTag(this._cssBasePath + "cssSeven.css", false);

            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : this._afterSecondPageReadyAgain,
                scope : this
            });

        },

        _afterSecondPageReadyAgain : function () {
            var text = this._iframeWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/Header/) !== null);
            this.assertTrue(text.match(/BBBB/) !== null);
            this.assertTrue(text.match(/first Module/) !== null);
            this.assertTrue(text.match(/third Module/) !== null);
            this.assertTrue(text.match(/myPageData/) !== null);

            this.pageEngine.navigate({
                pageId : "ccc"
            }, {
                fn : this._afterThirdPageReady,
                scope : this
            });

        },

        _afterThirdPageReady : function () {
            this._testCSSLinkTag(this._cssBasePath + "cssOne.css");
            this._testCSSLinkTag(this._cssBasePath + "cssTwo.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssThree.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssFour.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssFive.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssSix.css", false);
            this._testCSSLinkTag(this._cssBasePath + "cssSeven.css", false);

            aria.core.Timer.addCallback({
                fn : this._checkVisited,
                scope : this,
                delay : 20
            });
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._iframeWindow.test.aria.pageEngine.pageEngine.site.PageProvider();
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

        _checkVisited : function () {
            this.assertTrue(this._visited.aaa == 1);
            this.assertTrue(this._visited.bbb == 1);
            this.assertTrue(this._visited.ccc == 1);
            this.end();
        }

    }
});