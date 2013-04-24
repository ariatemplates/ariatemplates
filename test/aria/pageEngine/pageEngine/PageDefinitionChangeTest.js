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
    $classpath : "test.aria.pageEngine.pageEngine.PageDefinitionChangeTest",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProviderThree");
        this._pageReadyListener = {
            fn : this._onPageReady,
            scope : this
        };
        this._visited = {};
        this._counter = 0;
    },
    $prototype : {

        runTemplateTestInIframe : function () {
            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function (args) {
            this._checkPageAAA();

            this.pageProvider.raisePageDefinitionChangeEvent();

        },

        _afterPageDefinitionChange : function () {
            this._checkPageBBB();
            this._checkVisited();
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._iframeWindow.test.aria.pageEngine.pageEngine.site.PageProviderThree();
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
            this.assertTrue(this._visited.aaa == 2);
            aria.core.Timer.addCallback({
                fn : this.end,
                scope : this
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
            this._counter++;
            if (this._counter == 2) {
                this._afterPageDefinitionChange();
            }
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
        }

    }
});