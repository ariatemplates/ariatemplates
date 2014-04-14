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
    $classpath : "test.aria.pageEngine.pageEngine.site.PageProviderServices",
    $implements : ["aria.pageEngine.pageProviders.PageProviderInterface"],
    $constructor : function (navigation) {

        this._navigation = navigation;

    },
    $prototype : {

        /**
         * @param {aria.pageEngine.CfgBeans.ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {
            var siteConfig = {
                containerId : "at-main",
                storage : {
                    active : false
                },
                commonModules : {
                    "module1" : {
                        classpath : "test.aria.pageEngine.pageEngine.site.modules.ModuleServices1",
                        services : {
                            "SiteModuleServicesProperty" : "exposedProperty",
                            "SiteModuleServicesScope" : "exposedPropertyThroughMethod",
                            "SiteModuleServicesMethod1" : "exposedMethod",
                            "SiteModuleServicesMethod3" : "exposedMethod",
                            "SiteModuleServicesMethod5" : "exposedMethodNotOnInterface"
                        }
                    },
                    "module2" : {
                        classpath : "test.aria.pageEngine.pageEngine.site.modules.ModuleServices2",
                        services : {
                            "SiteModuleServicesMethod2" : "exposedMethod",
                            "SiteModuleServicesMethod3" : "exposedMethod",
                            "SiteModuleServicesMethod4" : "exposedMethodDoesNotExist"
                        }
                    }
                }
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
            if ((!pageId)) {
                this.$callback(callback.onsuccess, {
                    pageId : "ModuleServices1",
                    contents : {},
                    pageComposition : {
                        template : "test.aria.pageEngine.pageEngine.site.templates.ModuleServicesTemplate",
                        modules : {
                            "module1" : {
                                classpath : "test.aria.pageEngine.pageEngine.site.modules.ModuleServices1",
                                services : {
                                    "PageModuleServicesMethod1" : "exposedMethod"
                                }
                            }
                        },
                        placeholders : {
                            "myPlaceholder" : {
                                template : "test.aria.pageEngine.pageEngine.site.templates.ModuleServicesTemplate",
                                module : "module1"
                            }
                        }
                    }
                });
            }
        }
    }
});
