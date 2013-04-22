/**
 * Helper class that helps with returning information from a given page configuration object
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.PageConfigHelper",
    $dependencies : ["aria.pageEngine.utils.PageEngineUtils", "aria.utils.Type", "aria.utils.Array"],
    $constructor : function (pageConfig) {
        this._pageConfig = pageConfig;
        this._utils = aria.pageEngine.utils.PageEngineUtils;
        this._utils.addKeyAsProperty(this._pageConfig.pageComposition.modules, "refpath");
    },
    $prototype : {

        /**
         * Copy the menus into the application data
         * @return {aria.pageEngine.CfgBeans.PageContents.$properties.menus}
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
         * @param {aria.pageEngine.CfgBeans.Placeholder} placeholder
         * @param {Object} dependencies
         * @private
         */
        _addPlaceholderDependencies : function (placeholder, dependencies, lazy) {
            var modules = this._pageConfig.pageComposition.modules || {}, refpath, moduleDesc, typeUtils = aria.utils.Type;
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
            var modules = this._pageConfig.pageComposition.modules || {};
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
