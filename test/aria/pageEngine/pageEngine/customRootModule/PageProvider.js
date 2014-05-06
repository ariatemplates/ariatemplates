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
    $classpath : "test.aria.pageEngine.pageEngine.customRootModule.PageProvider",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            var siteConfig = {
                appData : {
                    message : "realAppData"
                },
                containerId : "at-main",
                storage : {
                    active : false
                },
                commonModules : {
                    "m1" : {
                        classpath : "test.aria.pageEngine.pageEngine.customRootModule.modules.TestModule",
                        initArgs : {
                            id : "m1"
                        }
                    }
                }
            };
            this.$callback(callback.onsuccess, siteConfig);
        },

        /**
         * @param {aria.pageEngine.CfgBeans:PageRequest} pageId Id of the page
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {
            this.$callback(callback.onsuccess, {
                pageId : "aaa",
                url : "/pageEngine/aaa",
                title : "page_aaa",
                pageComposition : {
                    template : "test.aria.pageEngine.pageEngine.site.templates.MainLayout",
                    modules : {
                        "m2" : {
                            classpath : "test.aria.pageEngine.pageEngine.customRootModule.modules.TestModule",
                            initArgs : {
                                id : "m2"
                            }
                        }
                    },
                    placeholders : {
                        "header" : {
                            module : "common:m1",
                            template : "test.aria.pageEngine.pageEngine.site.templates.Body"
                        },
                        "body" : {
                            module : "m2",
                            template : "test.aria.pageEngine.pageEngine.site.templates.Body"
                        }
                    }
                }
            });
        }
    }
});
