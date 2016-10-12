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
    $classpath : "test.aria.pageEngine.pageProviders.ProviderPageNoCacheTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.pageProviders.BasePageProvider",
            "test.aria.pageEngine.pageProviders.PageProviderFilter", "aria.core.IOFiltersMgr"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        setUp : function () {
            this._testData = {};
            this._filter = new test.aria.pageEngine.pageProviders.PageProviderFilter(this._testData);
            aria.core.IOFiltersMgr.addFilter(this._filter);
        },

        tearDown : function () {
            aria.core.IOFiltersMgr.removeFilter(this._filter);
            this._filter.$dispose();
            this._testData = null;
        },

        testAsyncPageWithoutCache : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage",
                cache : false
            });

            this._pageProvider.loadPageDefinition(null, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbOne,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbOne : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first"
            });
            this.assertTrue(this._testData.firstPage == 1);
            aria.core.Timer.addCallback({
                fn : this._testAsyncPageWithCacheCbBeforeTwo,
                scope : this
            });

        },
        _testAsyncPageWithCacheCbBeforeTwo : function () {

            this._pageProvider.loadPageDefinition({
                url : "/app/first"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbTwo,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbTwo : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first"
            });
            this.assertTrue(this._testData.firstPage == 2);

            aria.core.Timer.addCallback({
                fn : this._testAsyncPageWithCacheCbBeforeThree,
                scope : this
            });

        },
        _testAsyncPageWithCacheCbBeforeThree : function () {

            this._pageProvider.loadPageDefinition({
                pageId : "firstPage",
                url : "/app/first/new"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbThree,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbThree : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first/new"
            });
            this.assertTrue(this._testData.firstPage == 3);

            aria.core.Timer.addCallback({
                fn : this._testAsyncPageWithCacheCbBeforeFour,
                scope : this
            });

        },
        _testAsyncPageWithCacheCbBeforeFour : function () {

            this._pageProvider.loadPageDefinition({
                url : "/app/first/new"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbFour,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbFour : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first/new"
            });
            this.assertTrue(this._testData.firstPage == 4);
            this._testData.firstPage = 0;

            aria.core.Timer.addCallback({
                fn : this._testAsyncPageWithCacheCbBeforeFive,
                scope : this
            });

        },
        _testAsyncPageWithCacheCbBeforeFive : function () {

            this._pageProvider.loadPageDefinition({
                pageId : "secondPage"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbFive,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbFive : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "secondPage",
                url : "/secondPage"
            });
            this.assertTrue(this._testData.secondPage == 1);
            aria.core.Timer.addCallback({
                fn : this._testAsyncPageWithCacheCbBeforeSix,
                scope : this
            });

        },
        _testAsyncPageWithCacheCbBeforeSix : function () {

            this._pageProvider.loadPageDefinition({
                url : "/secondPage"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbSix,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbSix : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "secondPage",
                url : "/secondPage"
            });
            this.assertTrue(this._testData.secondPage == 2);
            this._testData.secondPage = 0;

            aria.core.Timer.addCallback({
                fn : this._testAsyncPageWithCacheCbBeforeSeven,
                scope : this
            });

        },
        _testAsyncPageWithCacheCbBeforeSeven : function () {

            this._pageProvider.loadPageDefinition({
                pageId : "thirdPage",
                url : "/app/another/page"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbSeven,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbSeven : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "thirdPage",
                url : "/app/another/page"
            });
            this.assertTrue(this._testData.thirdPage == 1);

            aria.core.Timer.addCallback({
                fn : this._testAsyncPageWithCacheCbBeforeEight,
                scope : this
            });

        },
        _testAsyncPageWithCacheCbBeforeEight : function () {

            this._pageProvider.loadPageDefinition({
                url : "/app/third"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageWithCacheCbEight,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageWithCacheCbEight : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "thirdPage",
                url : "/app/third"
            });
            this.assertTrue(this._testData.thirdPage == 2);
            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncPageWithoutCache");
        }

    }

});
