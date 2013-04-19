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
    $classpath : "test.aria.pageEngine.pageProviders.BaseProviderSiteTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.pageProviders.BasePageProvider",
            "aria.pageEngine.pageProviders.BasePageProviderBeans"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
    },
    $prototype : {

        testAsyncWrongSiteRetrieve : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/wrongsite.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });

            this._pageProvider.loadSiteConfig({
                onsuccess : {},
                onfailure : {
                    fn : this._onSiteConfigFailure,
                    scope : this
                }
            });
        },

        _onSiteConfigFailure : function () {
            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncWrongSiteRetrieve");
        },

        testAsyncCorrectSiteRetrieve : function () {
            this._pageProvider = new aria.pageEngine.pageProviders.BasePageProvider({
                siteConfigLocation : "test/aria/pageEngine/testContents/testSite/site.json",
                pageBaseLocation : "test/aria/pageEngine/testContents/testSite/pages/",
                homePageId : "firstPage"
            });
            this._pageProvider.loadSiteConfig({
                onsuccess : {
                    fn : this._onSiteConfigSuccess,
                    scope : this
                },
                onfailure : {}
            });
        },

        _onSiteConfigSuccess : function (siteConfig) {
            this.assertTrue(siteConfig.fake == "site");
            this._pageProvider.$dispose();
            this.notifyTestEnd("testAsyncCorrectSiteRetrieve");
        }

    }

});
