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
    $classpath : "test.aria.pageEngine.utils.BaseNavigationManagerTest",
    $extends : "test.aria.pageEngine.IframeTestCase",
    $dependencies : ["aria.utils.Object", "aria.storage.LocalStorage"],
    $constructor : function () {
        this.$IframeTestCase.constructor.call(this);
        this._navManager = null;
        this.defaultTestTimeout = 15000;
    },
    $prototype : {

        runTestInIframe : function () {
            this._clearLocalStorage();
            this._firstTest();
        },

        /**
         * Test the correct population of the cache and its usage upon browser navigation. It also uses local storage
         * for later checks
         */
        _firstTest : function () {
            this._initTestVariables();
            var navManager = this._getNavManagerInstance({
                fn : this._fakeNavigate,
                scope : this
            }, {
                active : true,
                suffix : "aa",
                expiresAfter : 50000
            });
            this._navManager = navManager;
            this._testCacheLength(0);

            this._update({
                pageId : "aaa",
                title : "aaa_title",
                url : "aaa_url"
            });

            this._testCacheLength(1);
            this._testTitle("aaa_title");
            this._testCacheEntry("aaa_url", "aaa");

            aria.core.Timer.addCallback({
                fn : this._firstTestAfterFirstUpdate,
                scope : this,
                delay : 100
            });

        },

        _firstTestAfterFirstUpdate : function () {

            this._update({
                pageId : "bbb",
                title : "bbb_title",
                url : ""
            });

            this._testCacheLength(2);
            this._testTitle("bbb_title");
            this._testCacheEntry("", "bbb");

            aria.core.Timer.addCallback({
                fn : this._firstTestAfterUpdateWithOnlyData,
                scope : this,
                delay : 100
            });
        },

        _firstTestAfterUpdateWithOnlyData : function () {
            this._firstTestAfterSecondUpdate();
        },

        _firstTestAfterSecondUpdate : function () {
            if (aria.core.Browser.isOldIE) {
                this._navManager.$dispose();
                this._secondTest();
            } else {
                this._testWindow.history.back();

                aria.core.Timer.addCallback({
                    fn : this._firstTestAfterFirstBack,
                    scope : this,
                    delay : 100
                });
            }
        },

        _firstTestAfterFirstBack : function () {
            this._testCacheLength(2);
            this._testNavigationLog(0, "aaa");

            this._testWindow.history.forward();

            aria.core.Timer.addCallback({
                fn : this._firstTestAfterFirstForward,
                scope : this,
                delay : 100
            });
        },

        _firstTestAfterFirstForward : function () {
            this._testCacheLength(2);
            this._testNavigationLog(1, "bbb");

            this._navManager.$dispose();

            this.reloadIframe({
                fn : this._secondTest,
                scope : this
            });

        },

        /**
         * Basic usage of cache without local storage
         */
        _secondTest : function () {

            this._initTestVariables();

            this._navManager = this._getNavManagerInstance({
                fn : this._fakeNavigate,
                scope : this
            }, {
                active : false,
                suffix : "aa",
                expiresAfter : 50000
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

            this._navManager.$dispose();

            this.reloadIframe({
                fn : this._thirdTest,
                scope : this
            });
        },

        /**
         * Simply test the correct retrieval of information from local storage
         */
        _thirdTest : function () {
            this._initTestVariables();

            this._navManager = this._getNavManagerInstance({
                fn : this._fakeNavigate,
                scope : this
            }, {
                active : true,
                suffix : "aa",
                expiresAfter : 50000
            });

            aria.core.Timer.addCallback({
                fn : this._afterStorageRetrieval,
                scope : this,
                delay : 200
            });
        },

        _afterStorageRetrieval : function () {

            this._testCacheLength(2);
            this._testCacheEntry("aaa_url", "aaa");
            this._testCacheEntry("", "bbb");

            this._navManager.$dispose();

            this.reloadIframe({
                fn : this._fourthTest,
                scope : this
            });
        },

        /**
         * Test the correct application of the suffix
         */
        _fourthTest : function () {
            this._initTestVariables();

            this._navManager = this._getNavManagerInstance({
                fn : this._fakeNavigate,
                scope : this
            }, {
                active : true,
                suffix : "bb",
                expiresAfter : 50000
            });
            this._testCacheLength(0);

            this._navManager.$dispose();

            this.reloadIframe({
                fn : this._fifthTest,
                scope : this
            });
        },

        /**
         * Test the correct application of the expiration time
         */
        _fifthTest : function () {
            aria.core.Timer.addCallback({
                fn : this._afterALittleWait,
                scope : this,
                delay : 100
            });
        },

        _afterALittleWait : function () {
            this._initTestVariables();

            this._navManager = this._getNavManagerInstance({
                fn : this._fakeNavigate,
                scope : this
            }, {
                active : true,
                suffix : "aa",
                expiresAfter : 0
            });
            this._testCacheLength(0);

            this._navManager.$dispose();
            this.reloadIframe({
                fn : this._sixthTest,
                scope : this
            });
        },

        _sixthTest : function () {

            this._initTestVariables();

            this._navManager = this._getNavManagerInstance({
                fn : this._fakeNavigate,
                scope : this
            }, {
                active : true,
                suffix : "aa",
                expiresAfter : 50000
            });
            this._testCacheLength(0);

            this._navManager.$dispose();

            this._clearLocalStorage();

            this._furtherTests();
        },

        _furtherTests : function () {
            this.end();

        },

        // From now on generic test utilities

        _getNavManagerInstance : Aria.empty,

        _fakeNavigate : function (args) {
            if (args.pageId != this._currentPageId) {
                this._navigationLogs.push(args);
                this._currentPageId = args.pageId;
            }
        },

        _update : function (args) {
            this._currentPageId = args.pageId;
            this._navManager.update(args);

        },

        _testCacheLength : function (n) {
            this.assertEquals(n, aria.utils.Object.keys(this._navManager.getCache()).length, "The cache does contains %2 elements instead of %1");
        },

        _testCacheEntry : function (url, pageId) {
            var cache = this._navManager.getCache();
            this.assertTrue(url in cache, "Url " + url + " is not in the cache");
            this.assertEquals(pageId, cache[url].id, "The cache value for " + url
                    + " contains a different page id than " + pageId);
        },

        _testNavigationLog : function (index, pageId) {
            this.assertEquals(this._navigationLogs[index].pageId, pageId, "Navigation log does not contain pageId "
                    + pageId + " at position " + index);
        },

        _clearLocalStorage : function (suffixes) {
            var storage = new aria.storage.LocalStorage();
            storage.clear();
            storage.$dispose();
        },

        _testTitle : function (title) {
            this.assertEquals(title, this._testWindow.document.title, "Document title is not correctly set.");
        },

        _initTestVariables : function () {
            this._navigationLogs = [];
            this._currentPageId = null;
        }

    }
});
