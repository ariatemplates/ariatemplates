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
    $classpath : "test.aria.pageEngine.pageEngine.site.PageProviderSeven",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            var siteConfig = {
                containerId : "at-main"
            };
            this.$callback(callback.onsuccess, siteConfig);

        },

        /**
         * @param {String} pageId Id of the page
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {
            var pageId = pageRequest.pageId;
            if ((!pageId) || (pageId == "aaa")) {
                this.$callback(callback.onsuccess, {
                    pageId : "aaa",
                    contents : {
                        placeholderContents : {
                            "first" : [{
                                        value : "1"
                                    }, {
                                        value : "2"
                                    }, {
                                        value : "3"
                                    }, {
                                        value : "4567"
                                    }],
                            "second" : [{
                                        value : "abcdef"
                                    }, {
                                        value : "ghi"
                                    }],
                            "third" : {
                                value : "jastAStrangeString"
                            }
                        }
                    },
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.MainLayout",
                        placeholders : {
                            "header" : [{
                                        contentId : "second"
                                    }, {
                                        contentId : "fake"
                                    }],
                            "body" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.providerSeven.Body",
                                contentId : "first"
                            },
                            "footer" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.providerSeven.Body",
                                contentId : "third"
                            }
                        }
                    }
                });
            }
        }
    }
});
