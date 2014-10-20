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

/**
 * Fake page processor
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.pageEngineDisposal.PageProvider",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            this.$callback(callback.onsuccess, {
                containerId : "testId"
            });
        },

        /**
         * @param {String} pageId Id of the page
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageId, callback) {
            this.$callback(callback.onsuccess, {
                pageId : "aaa",
                pageComposition : {
                    template : "test.aria.pageEngine.pageEngine.pageEngineDisposal.MainLayout",
                    placeholders : {
                        "newsInfo" : {
                            "contentId" : "pgen_news_and_info"
                        }
                    }
                }
            });
        }
    }
});
