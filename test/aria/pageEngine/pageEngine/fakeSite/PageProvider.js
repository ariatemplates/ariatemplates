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
    $classpath : "test.aria.pageEngine.pageEngine.fakeSite.PageProvider",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $constructor : function (config) {
        this._failOnSite = config.failOnSite;
        this._incorrectSite = config.incorrectSite;
        this._missingSiteDependencies = config.missingSiteDependencies;
        this._failOnPage = config.failOnPage;
        this._incorrectPage = config.incorrectPage;
        this._missingPageDependencies = config.missingPageDependencies;
    },
    $destructor : function () {},
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            if (this._failOnSite) {
                this.$callback(callback.onfailure);
                return;
            }
            if (this._incorrectSite) {
                this.$callback(callback.onsuccess, {
                    invalid : "config"
                });
                return;
            }
            if (this._missingSiteDependencies) {
                this.$callback(callback.onsuccess, {
                    containerId : "at-main",
                    commonModules : {
                        "m1" : {
                            classpath : "invalid.Classpath"
                        }
                    }
                });
                return;
            }
            this.$callback(callback.onsuccess, {
                containerId : "at-main"
            });

        },

        /**
         * @param {String} pageId Id of the page
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageId, callback) {
            if (this._failOnPage) {
                this.$callback(callback.onfailure);
            }
            if (this._incorrectPage) {
                this.$callback(callback.onsuccess, {
                    pagdsdseId : "aaa",
                    pageComposition : {
                        template : "pagengine.site.tpls.layouts.MainLayout",
                        placeholders : {
                            "newsInfo" : {
                                "contentId" : "pgen_news_and_info"
                            }
                        }
                    }
                });
            }
            if (this._missingPageDependencies) {
                this.$callback(callback.onsuccess, {
                    pageId : "aaa",
                    pageComposition : {
                        template : "invalid.MainLayout",
                        placeholders : {
                            "newsInfo" : {
                                "contentId" : "pgen_news_and_info"
                            }
                        }
                    }
                });
            }
        }
    }
});