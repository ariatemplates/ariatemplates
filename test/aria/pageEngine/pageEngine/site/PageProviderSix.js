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
 * Page provider
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.site.PageProviderSix",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $constructor : function (animations) {
        this._animations = animations;
    },
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            var siteConfig = {
                appData : {},
                containerId : "at-main",
                animations : this._animations
            };

            if (this._navigation) {
                siteConfig.navigation = this._navigation;
            }
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
                    url : "/pageEngine/aaa",
                    animation : {
                        animateIn : "slide left",
                        animateOut : "slide left",
                        type : 1
                    },
                    contents : {
                        menus : {
                            mymenu : []
                        },
                        placeholderContents : {}
                    },
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.providerSix.MainLayout",
                        placeholders : {
                            "body" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.providerSix.Body"
                            }
                        },
                        pageData : {
                            name : "aaa"
                        }
                    }
                });
            }
            if (pageId == "bbb") {
                this.$callback(callback.onsuccess, {
                    pageId : "bbb",
                    url : "/pageEngine/bbb",
                    animation : null,
                    contents : {
                        menus : {
                            mymenu : []
                        }
                    },
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.providerSix.MainLayout",
                        placeholders : {
                            "body" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.providerSix.Body"
                            }
                        },
                        pageData : {
                            name : "bbb"
                        }
                    }
                });
            }
            if (pageId == "ccc") {
                this.$callback(callback.onsuccess, {
                    pageId : "ccc",
                    url : "/pageEngine/ccc",
                    animation : {
                        animateOut : "pop",
                        animateIn : "fade",
                        type : 3
                    },
                    contents : {
                        menus : {
                            mymenu : []
                        },
                        placeholderContents : {}
                    },
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.providerSix.MainLayout",
                        placeholders : {
                            "body" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.providerSix.Body"
                            }
                        },
                        pageData : {
                            name : "ccc"
                        }
                    }
                });
            }
        }
    }
});