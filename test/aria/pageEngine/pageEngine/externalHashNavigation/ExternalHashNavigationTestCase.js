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
    $classpath : "test.aria.pageEngine.pageEngine.externalHashNavigation.ExternalHashNavigationTest",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineTestFive",
    $prototype : {
        _onPageEngineStarted : function (args) {
            this._hashManager = this._testWindow.aria.utils.HashManager;

            this._checkPageAAA();
            this._checkUrl(/\/pageEngine\/aaa/);
            this._checkTitle("page_aaa");

            this._hashManager.setHash("anotherOne");
            this.waitUntilUrl(/#anotherOne$/, this._afterHashChangeOne);
        },

        _afterHashChangeOne : function () {
            this._checkUrl(/anotherOne/);
            this._checkPageAAA();
            this._checkTitle("page_aaa");
            this._hashManager.setHash("anotherTwo");
            this.waitUntilUrl(/#anotherTwo$/, this._afterHashChangeTwo);
        },

        _afterHashChangeTwo : function () {
            this._checkUrl(/anotherTwo/);
            this._checkPageAAA();
            this._checkTitle("page_aaa");

            this.pageEngine.navigate({
                pageId : "bbb"
            }, {
                fn : this._afterSecondPageReady,
                scope : this
            });
        },

        _afterSecondPageReady : function () {
            this._checkPageBBB();
            this._checkTitle("page_bbb");

            this._hashManager.setHash("anotherThree");
            this.waitUntilUrl(/#anotherThree$/, this._afterHashChangeThree);
        },

        _afterHashChangeThree : function () {
            this._checkUrl(/anotherThree/);
            this._checkPageBBB();
            this._checkTitle("page_bbb");

            if (aria.core.Browser.isOldIE) {
                this.end();
            } else {
                this._testWindow.history.back();
                this.waitUntilUrl(/#$/, this._afterFirstBack);
            }
        },

        _afterFirstBack : function () {
            this._checkPageBBB();
            this._checkTitle("page_bbb");

            this._testWindow.history.back();
            this.waitUntilUrl(/#anotherTwo$/, this._afterSecondBack);
        },

        _afterSecondBack : function () {
            this._checkUrl(/anotherTwo/);
            this._checkPageAAA();
            this._checkTitle("page_aaa");

            this._testWindow.history.back();
            this.waitUntilUrl(/#anotherOne$/, this._afterThirdBack);
        },

        _afterThirdBack : function () {
            this._checkUrl(/anotherOne/);
            this._checkPageAAA();
            this._checkTitle("page_aaa");
            this.end();
        },

        waitUntilUrl : function (url, cb) {
            this.waitFor({
                condition : function () {
                    return this._testWindow.location.href.match(url);
                },
                callback : cb
            });
        }

    }
});
