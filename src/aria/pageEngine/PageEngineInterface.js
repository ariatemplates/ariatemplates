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
var Aria = require("../Aria");


/**
 * Public API of the page engine available in templates and modules
 */
module.exports = Aria.interfaceDefinition({
    $classpath : "aria.pageEngine.PageEngineInterface",
    $events : {
        "pageReady" : {
            description : "Raised when the page has been displayed",
            properties : {
                "pageId" : "Identifier of the page."
            }
        },
        "beforePageTransition" : {
            description : "Raised before displaying a new page, after its dependencies have already been loaded",
            properties : {
                "from" : "Id of the page that the pageEngine is navigating away from.",
                "to" : "Id of the page that the pageEngine is navigating to."
            }
        }
    },
    $interface : {

        /**
         * Navigate to a specific page
         * @param {aria.pageEngine.CfgBeans:PageNavigationInformation} pageRequest id and url of the page
         * @param {aria.core.CfgBeans:Callback} cb To be called when the navigation is complete
         */
        navigate : {
            $type : "Function",
            $callbackParam : 1
        },

        /**
         * Return the data of the application
         * @return {Object}
         *
         * <pre>
         * {
         *     appData : {Object} application data,
         *     pageData : {Object} data specific to the current page,
         *     pageInfo : {aria.pageEngine.CfgBeans.PageNavigationInformation} information on the current page
         * }
         * </pre>
         */
        getData : {
            $type : "Function"
        },

        /**
         * Exposed methods of module controllers as services
         * @return {aria.pageEngine.CfgBeans:Module.services} Map containing exposed module controller methods
         */
        getServices : {
            $type : "Function"
        },

        /**
         * Return instance of the pageProvider
         * @return {aria.pageEngine.CfgBeans:Start.pageProvider}
         */
        getPageProvider : {
            $type : "Function"
        },

        /**
         * Tell whether a certain module is currently present on the page
         * @param {aria.tamplates.ModuleCtrl} module
         * @return {Boolean}
         */
        isModuleInPage : {
            $type : "Function"
        }

    }
});
