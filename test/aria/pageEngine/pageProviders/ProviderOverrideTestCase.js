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
    $classpath : "test.aria.pageEngine.pageProviders.ProviderOverrideTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.pageEngine.pageProviders.AnotherProvider"],
    $prototype : {

        testAsyncSiteConfig : function () {
            this._pageProvider = new test.aria.pageEngine.pageProviders.AnotherProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });

            this._pageProvider.loadSiteConfig({
                onsuccess : {
                    fn : this._testSiteConfig,
                    scope : this
                }
            });
        },

        _testSiteConfig : function (siteConfig) {
            this.assertJsonEquals(siteConfig, {
                fake : "site",
                extraProperty : "extra"
            }, "Site configuration was not correctly processed");

            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncSiteConfig");
        },

        testAsyncWithCache : function () {
            this["__currentTestName" + this.$classpath] = "testAsyncWithCache";
            this._pageProvider = new test.aria.pageEngine.pageProviders.AnotherProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });

            this._pageProvider.loadPageDefinition({
                pageId : "firstPage"
            }, {
                onsuccess : {
                    fn : this._testFirstPage,
                    scope : this
                }
            });
        },

        testAsyncWithoutCache : function () {
            this["__currentTestName" + this.$classpath] = "testAsyncWithoutCache";
            this._pageProvider = new test.aria.pageEngine.pageProviders.AnotherProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage",
                cache : false
            });

            this._pageProvider.loadPageDefinition({
                pageId : "firstPage"
            }, {
                onsuccess : {
                    fn : this._testFirstPage,
                    scope : this
                }
            });
        },

        _testFirstPage : function (pageDef) {
            this.assertEquals(pageDef.extraProperty, "extra_firstPage", "The page definition has not been correctly processed");

            this._pageProvider.loadPageDefinition({
                pageId : "secondPage"
            }, {
                onsuccess : {
                    fn : this._testSecondPage,
                    scope : this
                }
            });
        },

        _testSecondPage : function (pageDef) {
            this.assertEquals(pageDef.extraProperty, "extra_secondPage", "The page definition has not been correctly processed");
            this._pageProvider.loadPageDefinition({
                pageId : "firstPage"
            }, {
                onsuccess : {
                    fn : this._testFirstPageAgain,
                    scope : this
                }
            });
        },

        _testFirstPageAgain : function (pageDef) {
            this.assertEquals(pageDef.extraProperty, "extra_firstPage", "The page definition has not been correctly processed");

            aria.core.Timer.addCallback({
                fn : this._beforeTestFirstPageAgainAndAgain,
                scope : this
            });
        },

        _beforeTestFirstPageAgainAndAgain : function () {
            this._pageProvider.loadPageDefinition({
                pageId : "firstPage"
            }, {
                onsuccess : {
                    fn : this._testFirstPageAgainAndAgain,
                    scope : this
                }
            });
        },

        _testFirstPageAgainAndAgain : function (pageDef) {
            this.assertEquals(pageDef.extraProperty, "extra_firstPage", "The page definition has not been correctly processed");

            this._pageProvider.$dispose();
            this.notifyTestEnd(this["__currentTestName" + this.$classpath]);
        }
    }

});
