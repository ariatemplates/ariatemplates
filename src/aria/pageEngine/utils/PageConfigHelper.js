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
 * Helper class that helps with returning information from a given page configuration object
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.PageConfigHelper",
    $dependencies : ["aria.pageEngine.utils.PageEngineUtils", "aria.utils.Type", "aria.utils.Array"],
    $constructor : function (pageConfig) {
        /**
         * Page definition
         * @type aria.pageEngine.CfgBeans:PageDefinition
         * @protected
         */
        this._pageConfig = pageConfig;

        /**
         * Page Engine utilities
         * @type aria.pageEngine.utils.PageEngineUtils
         * @protected
         */
        this._utils = aria.pageEngine.utils.PageEngineUtils;

        /**
         * Copy of the list of modules from the page definition
         * @type aria.pageEngine.CfgBeans:PageComposition.modules
         * @protected
         */
        this._pageModules = aria.utils.Json.copy(this._pageConfig.pageComposition.modules) || {};

        this._utils.addKeyAsProperty(this._pageModules, "refpath");
    },
    $prototype : {

        /**
         * Copy the menus into the application data
         * @return {aria.pageEngine.CfgBeans:PageContents.menus}
         * @private
         */
        getMenus : function () {
            return this._pageConfig.contents.menus;
        },

        /**
         * Extract the dependencies of a page. It'll go through all submodule and placeholders and return the list of
         * classpaths to be loaded in the page
         * @return {Object} It contains the properties:<br/>
         * <ul>
         * <li>templates : Array containing the classpaths of the templates to load</li>
         * <li>classes : Array containing the classpaths of the module controllers to load</li>
         * <li>modules : Object containing page-specific and common modules refpaths</li>
         * </ul>
         */
        getPageDependencies : function (lazy) {
            var dependencies = {
                templates : [],
                classes : [],
                modules : {
                    page : [],
                    common : []
                },
                css : []
            };
            var pageComposition = this._pageConfig.pageComposition;
            var placeholders = pageComposition.placeholders || {};
            var typeUtils = aria.utils.Type;

            if (!lazy) {
                this._utils.addIfMissing(pageComposition.template, dependencies.templates);
                if (pageComposition.css) {
                    dependencies.css = pageComposition.css.slice(0);
                }
            }

            for (var placeholderName in placeholders) {
                if (placeholders.hasOwnProperty(placeholderName)) {
                    var singlePlaceholderArray = placeholders[placeholderName];

                    if (!typeUtils.isArray(singlePlaceholderArray)) {
                        singlePlaceholderArray = [singlePlaceholderArray];
                    }

                    for (var i = 0; i < singlePlaceholderArray.length; i += 1) {
                        this._addPlaceholderDependencies(singlePlaceholderArray[i], dependencies, lazy);
                    }
                }
            }
            return dependencies;
        },

        /**
         * Extract the dependencies from a placeholder definition and add them to dependencies argument
         * @param {aria.pageEngine.CfgBeans:Placeholder} placeholder
         * @param {Object} dependencies
         * @private
         */
        _addPlaceholderDependencies : function (placeholder, dependencies, lazy) {
            var modules = this._pageModules, refpath, moduleDesc, typeUtils = aria.utils.Type;
            if (!typeUtils.isObject(placeholder)) {
                return;
            }
            var isLazy = (placeholder.lazy);
            if ((lazy && !isLazy) || (!lazy && isLazy)) {
                return;
            }
            if ("module" in placeholder) {
                refpath = placeholder.module;
                if (refpath.match(/^common:/)) {
                    this._utils.addIfMissing(refpath.replace(/^common:/, ""), dependencies.modules.common);
                } else {
                    moduleDesc = modules[refpath];
                    if (moduleDesc) {
                        this._utils.addIfMissing(moduleDesc.classpath, dependencies.classes);
                        this._utils.addIfMissing(refpath, dependencies.modules.page);
                    }
                }
            }
            if ("template" in placeholder) {
                this._utils.addIfMissing(placeholder.template, dependencies.templates);
            }
            if ("css" in placeholder) {
                this._utils.wiseConcat(dependencies.css, placeholder.css);
            }
        },

        /**
         * @param {Array} refpaths
         * @return {Array} Contains objects of type {aria.templates.ModuleCtrl.SubModuleDefinition}
         */
        getPageModulesDescriptions : function (refpaths) {
            var modules = this._pageModules;
            var filteredMods = [], i, len, currentDesc;
            if (refpaths) {
                for (i = 0, len = refpaths.length; i < len; i++) {
                    currentDesc = modules[refpaths[i]];
                    if (currentDesc) {
                        filteredMods.push(currentDesc);
                    }
                }
                return filteredMods;
            }
            return aria.utils.Array.extractValuesFromMap(modules);
        },

        /**
         * Compute the id of the placeholders who have at least on lazy content
         * @return {Array} ids of the lazy placeholders.
         */
        getLazyPlaceholdersIds : function () {
            var output = [], isLazy, typeUtils = aria.utils.Type;
            var placeholders = this._pageConfig.pageComposition.placeholders || {};
            for (var placeholderName in placeholders) {
                if (placeholders.hasOwnProperty(placeholderName)) {
                    isLazy = false;
                    var singlePlaceholderArray = placeholders[placeholderName];

                    if (!typeUtils.isArray(singlePlaceholderArray)) {
                        singlePlaceholderArray = [singlePlaceholderArray];
                    }

                    for (var i = 0; i < singlePlaceholderArray.length; i += 1) {
                        if (singlePlaceholderArray[i].lazy) {
                            isLazy = true;
                        }
                    }
                    if (isLazy) {
                        output.push(placeholderName);
                    }
                }
            }
            return output;
        }

    }
});
