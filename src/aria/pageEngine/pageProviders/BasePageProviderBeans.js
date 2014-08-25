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
var Aria = require("../../Aria");
var ariaCoreJsonTypes = require("../../core/JsonTypes");


/**
 * Beans to describe the parameters used in aria.pageEngine.pageProviders.BasePageProvider
 */
module.exports = Aria.beanDefinitions({
    $package : "aria.pageEngine.pageProviders.BasePageProviderBeans",
    $description : "Definition of the beans used in aria.pageEngine.pageProviders.BasePageProvider",
    $namespaces : {
        "json" : ariaCoreJsonTypes
    },
    $beans : {
        "Config" : {
            $type : "json:Object",
            $description : "Argument given to the constructor.",
            $properties : {
                "siteConfigLocation" : {
                    $type : "json:String",
                    $description : "Location of the file that contains the site configuration.",
                    $mandatory : true
                },
                "pageBaseLocation" : {
                    $type : "json:String",
                    $description : "Location of the folder that contains all the page definitions. Each file containing a page definition has to be called [pageId].json.",
                    $mandatory : true
                },
                "cache" : {
                    $type : "json:Boolean",
                    $description : "Whether to cache page definitions or to re-retrieve them from the speciefied url when navigating to them.",
                    $default : true
                },
                "homePageId" : {
                    $type : "json:String",
                    $description : "Id of the home page. It will be used as a default page.",
                    $mandatory : true
                }
            }
        }
    }
});
