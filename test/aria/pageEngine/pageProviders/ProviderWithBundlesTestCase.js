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
    $classpath : "test.aria.pageEngine.pageProviders.ProviderWithBundlesTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.pageProviders.BasePageProvider"],
    $prototype : {

        setUp : function () {
            aria.core.DownloadMgr.updateUrlMap({
                test : {
                    aria : {
                        pageEngine : {
                            testContents : {
                                packagedTestSite : {
                                    "**" : "test/aria/pageEngine/testContents/packagedTestContents.txt"
                                }
                            }
                        }
                    }
                }
            });
        },

        testAsyncPageRetrieve : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/packagedTestSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/packagedTestSite/pages/",
                homePageId : "firstPage"
            });

            this._pageProvider.loadPageDefinition(null, {
                onsuccess : {
                    fn : this._testAsyncPageRetrieveCbOne,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageRetrieveCbOne : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first"
            });
            this._pageProvider.loadPageDefinition({
                url : "/app/first"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageRetrieveCbTwo,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageRetrieveCbTwo : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "firstPage",
                url : "/app/first"
            });
            this._pageProvider.loadPageDefinition({
                pageId : "secondPage"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageRetrieveCbThree,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageRetrieveCbThree : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "secondPage",
                url : "/secondPage"
            });
            this._pageProvider.loadPageDefinition({
                pageId : "thirdPage",
                url : "/app/another/page"
            }, {
                onsuccess : {
                    fn : this._testAsyncPageRetrieveCbFour,
                    scope : this
                },
                onfailure : {}
            });
        },

        _testAsyncPageRetrieveCbFour : function (pageDef) {
            this.assertJsonEquals(pageDef, {
                pageId : "thirdPage",
                url : "/app/another/page"
            });

            this._pageProvider.loadPageDefinition({
                pageId : "fourthPage"
            }, {
                onsuccess : {},
                onfailure : {
                    fn : this._testAsyncPageRetrieveCbFive,
                    scope : this,
                    args : "toTest"
                }
            });
        },

        _testAsyncPageRetrieveCbFive : function (pageDef, args) {
            this.assertEquals(args, "toTest");
            this.assertErrorInLogs(aria.utils.Json.INVALID_JSON_CONTENT);

            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncPageRetrieve");
        }

    }

});
