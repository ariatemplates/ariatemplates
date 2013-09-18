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
 * Helper class that helps with returning information from the site configuration object
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.SiteConfigHelper",
    $dependencies : ["aria.utils.Dom", "aria.pageEngine.utils.PageEngineUtils", "aria.utils.Array"],
    $constructor : function (siteConfig) {

        /**
         * Site configuration object
         * @type aria.pageEngine.CfgBeans:Site
         */
        this.siteConfig = siteConfig;

        /**
         * List of content Processors instances
         * @type Object
         * @private
         */
        this._contentProcessorsInstances = {};

        aria.pageEngine.utils.PageEngineUtils.addKeyAsProperty(this.siteConfig.commonModules, "refpath");
    },
    $destructor : function () {
        this.disposeContentProcessorsInstances();
    },

    $statics : {
        CONTAINER_ID_CANT_BE_BODY_ID : "The 'containerId' page engine config entry must not be the id of BODY element",
        MISSING_PROCESS_METHOD : "The processContent method is not implemented"
    },
    $prototype : {

        /**
         * Container of the application managed by the pageEngine
         * @return {HTMLElement}
         */
        getRootDiv : function () {
            var rootDivId = this.getRootDivId();
            var domElt = aria.utils.Dom.getElementById(rootDivId);
            if (domElt === Aria.$window.document.body) {
                this.$logError(this.CONTAINER_ID_CANT_BE_BODY_ID);
            } else if (!domElt) {
                domElt = Aria.$window.document.createElement("DIV");
                domElt.id = rootDivId;
                Aria.$window.document.body.appendChild(domElt);
            }
            return domElt;
        },

        /**
         * Id of the container of the application managed by the pageEngine
         * @return {String}
         */
        getRootDivId : function () {
            return this.siteConfig.containerId;
        },

        /**
         * Application data
         * @return {Object}
         */
        getAppData : function () {
            return this.siteConfig.appData;
        },

        /**
         * Returns the classpaths of the registered content processors
         * @return {Array}
         */
        getListOfContentProcessors : function () {
            var classes = [];
            for (var cp in this.siteConfig.contentProcessors) {
                if (this.siteConfig.contentProcessors.hasOwnProperty(cp)) {
                    classes.push(this.siteConfig.contentProcessors[cp]);
                }
            }
            return classes;
        },

        /**
         * Instances of the registered content processors
         * @return {Object}
         */
        getContentProcessorInstances : function () {
            var processors = {}, typeUtils = aria.utils.Type;
            for (var cp in this.siteConfig.contentProcessors) {
                if (this.siteConfig.contentProcessors.hasOwnProperty(cp)) {
                    var classRef = Aria.getClassRef(this.siteConfig.contentProcessors[cp]);
                    // check if it is a singleton or not
                    var instance = (typeUtils.isFunction(classRef)) ? new classRef() : classRef;
                    // check that it implements the processContent method
                    if (instance.processContent) {
                        processors[cp] = instance;
                    } else {
                        this.$logError(this.MISSING_PROCESS_METHOD, this.siteConfig.contentProcessors[cp]);
                    }
                }
            }
            this._contentProcessorsInstances = processors;
            return processors;
        },

        disposeContentProcessorsInstances : function () {
            var typeUtils = aria.utils.Type;
            var instances = this._contentProcessorsInstances;
            for (var cp in instances) {
                if (instances.hasOwnProperty(cp)) {
                    var classRef = Aria.getClassRef(this.siteConfig.contentProcessors[cp]);
                    if (typeUtils.isFunction(classRef)) {
                        instances[cp].$dispose();
                    }
                }
            }
        },

        /**
         * @param {Object} filters<br/>
         * <ul>
         * <li>priority : Integer specifying that only modules with such priority should be selected</li>
         * <li>repaths : Array containing the desired refpaths</li>
         * </ul>
         * If not specified, all common modules will be returned
         * @return {Array} Contains objects of type {aria.templates.ModuleCtrl.SubModuleDefinition}
         */
        getCommonModulesDescription : function (filters) {
            var commonModules = this.siteConfig.commonModules;
            if (!filters) {
                return aria.utils.Array.extractValuesFromMap(commonModules);
            }
            var priority = filters.priority;
            var refpaths = filters.refpaths;
            var filteredMods = [], currentDesc;
            if (refpaths) {
                for (var i = 0, len = refpaths.length; i < len; i++) {
                    currentDesc = commonModules[refpaths[i]];
                    if (currentDesc && (!priority || priority == currentDesc.priority)) {
                        filteredMods.push(currentDesc);
                    }
                }
                return filteredMods;
            }
            for (var rp in commonModules) {
                if (commonModules.hasOwnProperty(rp)) {
                    currentDesc = commonModules[rp];
                    if (!priority || priority == currentDesc.priority) {
                        filteredMods.push(currentDesc);
                    }
                }
            }
            return filteredMods;
        },

        /**
         * Return the class that handles page navigation
         * @return {String} class that handles page navigation
         */
        getNavigationManagerClass : function () {
            var navigationType = this.siteConfig.navigation;
            if (navigationType) {
                if (navigationType == "history") {
                    return "aria.pageEngine.utils.HistoryManager";
                }
                if (navigationType == "hash") {
                    return "aria.pageEngine.utils.HashManager";
                }
            }
            return null;
        },

        /**
         * @param {aria.core.CfgBeans:Callback} cb Callback to be called on page change
         * @param {aria.core.CfgBeans:Site.storage} options Options for local storage
         * @return {Object} Instance of the class that manages page navigation
         */
        getNavigationManager : function (cb, options) {
            var navigationType = this.siteConfig.navigation;
            if (navigationType) {
                if (navigationType == "history") {
                    return new aria.pageEngine.utils.HistoryManager(cb, options);
                }
                if (navigationType == "hash") {
                    return new aria.pageEngine.utils.HashManager(cb, options);
                }
            }
            return null;
        },

        /**
         * @return {Array} Array of the css files that have to be loaded at site level
         */
        getSiteCss : function () {
            return this.siteConfig.css || [];
        }
    }
});
