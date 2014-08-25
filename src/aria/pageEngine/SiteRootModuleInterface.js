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
var ariaTemplatesIModuleCtrl = require("../templates/IModuleCtrl");


/**
 * Public API of the Application Manager
 * @class aria.pageEngine.ApplicationMgrInterface
 */
module.exports = Aria.interfaceDefinition({
    $classpath : 'aria.pageEngine.SiteRootModuleInterface',
    $extends : ariaTemplatesIModuleCtrl,
    $events : {
        "pageReady" : "Raised when the page is ready to be displayed."
    },
    $interface : {

        /**
         * Get the module controller instance for a specific refpath in a page
         * @param {String} pageId Page identifier
         * @param {String} moduleId Module's refpath as specified in the configuration
         * @return {aria.template.ModuleCtrl} Instance of module controller
         */
        getPageModule : {
            $type : "Function"
        },

        /**
         * Load a list of page sub modules. These modules exists only in this page and should be loaded and initialized
         * connecting their datamodel to the defined bindings
         * @param {String} pageId Id of the page, used to prefix a refpath
         * @param {Object} modulesDescriptions
         * <ul>
         * <li> page: List of page-specific modules described by aria.templates.CfgBeans.SubModuleDefinition</li>
         * <li> common: List of common modules described by aria.templates.CfgBeans.SubModuleDefinition</li>
         * </ul>
         * @param {aria.core.CfgBeans:Callback} callback Called after the submodules are initialized
         */
        loadModules : {
            $type : "Function",
            $callbackParam : 2
        },

        /**
         * Unload all common modules
         */
        unloadCommonModules : {
            $type : "Function"
        },

        /**
         * Unload all the modules of a specific page
         * @param {String} pageId
         */
        unloadPageModules : {
            $type : "Function"
        },

        /**
         * Unload both common and page-specific modules
         */
        unloadAllModules : {
            $type : "Function"
        },

        /**
         * Navigate to a specific page
         * @param {aria.pageEngine.CfgBeans:PageNavigationInformation} pageRequest id and url of the page
         */
        navigate : {
            $type : "Function"
        }
    }
});
