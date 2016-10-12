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
    $classpath : "test.aria.pageEngine.utils.HashManagerTestCase",
    $extends : "test.aria.pageEngine.utils.NavigationManagerBase",
    $constructor : function () {
        this.$NavigationManagerBase.constructor.call(this);
        this._dependencies = ["aria.pageEngine.utils.HashManager"];
    },
    $prototype : {

        _getNavManagerInstance : function (cb, options) {
            return new this._testWindow.aria.pageEngine.utils.HashManager(cb, options);
        },

        _furtherTests : function () {
            this._initTestVariables();
            this._testWindow.aria.utils.HashManager.setHash("");

            this._navManager = this._getNavManagerInstance({
                fn : this._fakeNavigate,
                scope : this
            }, {
                active : false
            });
            this._testCacheLength(0);

            this._update({
                pageId : "aaa",
                title : "aaa_title",
                url : "aaa_url_new"
            });
            this._testCacheLength(1);
            this._testTitle("aaa_title");
            this._testCacheEntry("aaa_url_new", "aaa");

            this._testWindow.aria.utils.HashManager.setHash("external");

            aria.core.Timer.addCallback({
                fn : this._afterExternalHashSetting,
                scope : this
            });
        },
        _afterExternalHashSetting : function () {
            this._testCacheLength(2);
            this._testTitle("aaa_title");
            this._testCacheEntry("external", "aaa");

            this._update({
                pageId : "bbb",
                title : "bbb_title",
                url : "bbb_url"
            });
            this._testCacheLength(3);
            this._testTitle("bbb_title");
            this._testCacheEntry("bbb_url", "bbb");

            this._testWindow.history.back();
            if (aria.core.Browser.isOldIE) {
                this._endFurtherTest();
            } else {
                aria.core.Timer.addCallback({
                    fn : this._afterFurtherBack,
                    scope : this,
                    delay : 100
                });
            }
        },

        _afterFurtherBack : function () {
            this._testCacheLength(3);
            this._testNavigationLog(0, "aaa");

            this._testWindow.history.forward();

            aria.core.Timer.addCallback({
                fn : this._afterFurtherForward,
                scope : this,
                delay : 100
            });
        },

        _afterFurtherForward : function () {
            this._testCacheLength(3);
            this._testNavigationLog(1, "bbb");
            this._endFurtherTest();
        },

        _endFurtherTest : function () {
            this._navManager.$dispose();
            this.end();
        }
    }
});
