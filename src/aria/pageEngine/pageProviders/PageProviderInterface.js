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


/**
 * Public API of a page provider
 */
module.exports = Aria.interfaceDefinition({
    $classpath : 'aria.pageEngine.pageProviders.PageProviderInterface',
    $events : {
        "pageDefinitionChange" : {
            description : "Raised when the definition of a page changes.",
            properties : {
                "pageId" : "Identifier of the page that has changed"
            }
        }
    },
    $interface : {

        /**
         * @param {aria.pageEngine.CfgBeans:ExtendedCallback} callback
         */
        loadSiteConfig : function (callback) {},

        /**
         * @param {aria.pageEngine.CfgBeans:PageNavigationInformation} pageRequest
         * @param {aria.pageEngine.CfgBeans:ExtendedCallback} callback
         */
        loadPageDefinition : function (pageRequest, callback) {}

    }
});
