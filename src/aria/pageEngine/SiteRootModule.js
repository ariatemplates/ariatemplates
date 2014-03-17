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
 * Main module controller that is used to load all the application modules as submodules. It is the default module
 * controller for all templates that are not linked to another module in a page definition
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.SiteRootModule",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["aria.pageEngine.SiteRootModuleInterface"],
    $dependencies : ["aria.utils.Path", "aria.pageEngine.utils.PageEngineUtils"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);

        /**
         * Contains instances of common submodules
         * @type Object
         */
        this.commonModules = {};

        /**
         * Contains instances of page-specific submodules
         * @type Object
         */
        this.pageModules = {};

        /**
         * Contains the refpaths of the loaded submodules
         * @type Object
         * @private
         */
        this._modulesPaths = {
            common : [],
            page : {}
        };

        /**
         * Shortcut for page engine utilities
         * @type aria.pageEngine.utils.PageEngineUtils
         * @private
         */
        this._utils = aria.pageEngine.utils.PageEngineUtils;

        /**
         * @type aria.utils.Path
         * @private
         */
        this._pathUtils = aria.utils.Path;

        /**
         * Contains bindings definitions
         * @type Object
         */
        this._bindings = {};

        /**
         * Public interface of the pageEngine that exposes the navigate method
         * @type aria.pageEngine.PageEngineInterface
         * @private
         */
        this._pageEngine = null;

    },
    $destructor : function () {
        this.json.removeListener(this._data, "storage", {
            fn : this._updateModulesData,
            scope : this
        }, true);

        this.unloadAllModules();

        this._data = null;

        this.commonModules = null;
        this.pageModules = null;

        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : 'aria.pageEngine.SiteRootModuleInterface',

        init : function (args, cb) {
            this._data = {
                storage : {
                    appData : args.appData,
                    pageData : {}
                }
            };
            this.json.addListener(this._data, "storage", {
                fn : this._updateModulesData,
                scope : this
            }, false, true);

            this._pageEngine = args.pageEngine;

            this.$callback(cb);
        },

        /**
         * Triggers a navigation in the pageEngine
         * @param {Object} evt
         *
         * <pre>
         * {
         *      name : &quot;navigation&quot;,
         *      page : {aria.pageEngine.CfgBeans.PageNavigationInformation} description of the page to which to navigate
         * }
         * </pre>
         *
         * @param {Object} args
         */
        onSubModuleEvent : function (evt, args) {
            if (evt.name == "navigate") {
                this._pageEngine.navigate(evt.page);
            }
        },

        /**
         * Navigate to a specific page
         * @param {aria.pageEngine.CfgBeans:PageNavigationInformation} pageRequest id and url of the page
         * @param {aria.core.CfgBeans:Callback} cb Callback to be called when the navigation is complete
         */
        navigate : function (page, cb) {
            this._pageEngine.navigate(page, cb);
        },

        /**
         * Get the module controller instance for a specific refpath in a page
         * @param {String} pageId Page identifier
         * @param {String} moduleId Module's refpath as specified in the configuration
         * @return {aria.template.ModuleCtrl} Instance of module controller
         */
        getPageModule : function (pageId, moduleId) {
            var isCommon = (moduleId.indexOf("common:") != -1);
            var refpath = this.buildModuleRefpath(moduleId.replace(/^common:/, ""), isCommon, pageId);
            return this._utils.resolvePath(refpath, this);
        },

        /**
         * @param {String} moduleId id of the module as in the page configuration
         * @param {Boolean} isCommon whether the module is common
         * @param {String} pageId id of the page module
         * @return {String} the module refpath
         */
        buildModuleRefpath : function (moduleId, isCommon, pageId) {
            if (isCommon) {
                return "commonModules." + moduleId;
            }
            return "pageModules." + pageId + "." + moduleId;
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
        loadModules : function (pageId, modulesDescription, callback) {
            var definitions = [];
            var descriptions = [];
            var modules, refpath, isCommon, def;
            var loopArray = [{
                        modules : modulesDescription.page,
                        isCommon : false
                    }, {
                        modules : modulesDescription.common,
                        isCommon : true
                    }];

            for (var j = 0; j < 2; j++) {
                modules = loopArray[j].modules;
                isCommon = loopArray[j].isCommon;
                for (var i = 0, len = modules.length; i < len; i += 1) {
                    refpath = this.buildModuleRefpath(modules[i].refpath, isCommon, pageId);
                    if (this._utils.resolvePath(refpath, this) == null) {
                        def = aria.utils.Json.copy(modules[i]);
                        def.refpath = refpath;
                        definitions.push({
                            classpath : def.classpath,
                            initArgs : this._injectPageEngine(def.initArgs),
                            refpath : refpath
                        });
                        descriptions.push(def);
                        this._addRefpath(pageId, isCommon, refpath);
                    }
                }
            }

            this.loadSubModules(definitions, {
                fn : this.connectBindings,
                scope : this,
                resIndex : -1,
                args : {
                    pageId : pageId,
                    callback : callback,
                    modules : descriptions
                }
            });
        },

        _injectPageEngine : function (initArgs) {
            initArgs = initArgs || {};
            initArgs.pageEngine = this._pageEngine;
            return initArgs;
        },

        /**
         * Unload modules whose refpath in is modRefpaths and disconnects the related bindings
         * @param {Array} modRefpaths refpaths of the modules to unload
         */
        _unloadModules : function (modRefpaths) {
            var refpath;
            for (var i = 0, len = modRefpaths.length; i < len; i++) {
                refpath = modRefpaths[i];
                this._disconnectModuleBindings(refpath);
                this.disposeSubModule(this._utils.resolvePath(refpath, this));
            }
        },

        /**
         * Unload all common modules
         */
        unloadCommonModules : function () {
            var modRefpaths = this._modulesPaths.common || [];
            this._unloadModules(modRefpaths);
            this._modulesPaths.common = [];
        },

        /**
         * Unload all the modules of a specific page
         * @param {String} pageId
         */
        unloadPageModules : function (pageId) {
            var modRefpaths = (pageId && this._modulesPaths.page[pageId]) ? this._modulesPaths.page[pageId] : [];
            this._unloadModules(modRefpaths);
            delete this._modulesPaths.page[pageId];
        },

        /**
         * Unload both common and page-specific modules
         */
        unloadAllModules : function () {
            this.unloadCommonModules();
            var pageModRefpaths = this._modulesPaths.page;
            for (var pageId in pageModRefpaths) {
                if (pageModRefpaths.hasOwnProperty(pageId)) {
                    this.unloadPageModules(pageId);
                }
            }
        },

        /**
         * Store the refpath
         * @param {String} pageId
         * @param {Boolean} isCommon
         * @param {String} refpath
         */
        _addRefpath : function (pageId, isCommon, refpath) {
            var modulesPath = this._modulesPaths;
            if (isCommon) {
                modulesPath.common.push(refpath);
                return;
            }
            modulesPath.page[pageId] = modulesPath.page[pageId] || [];
            modulesPath.page[pageId].push(refpath);
        },

        /**
         * Connect the module bindings to the storage locations (appData, pageData, ...). This method should be called
         * after a page navigation.
         * @param {Object} args Called when the bound value changes
         */
        connectBindings : function (args) {
            var modules = args.modules;

            for (var i = 0; i < modules.length; i += 1) {
                var bindings = modules[i].bind, refpath = modules[i].refpath;
                if (bindings) {
                    for (var bind in bindings) {
                        if (bindings.hasOwnProperty(bind) && !this.json.isMetadata(bind)) {
                            var location = this._getStorage(bindings[bind]);
                            if (location) {

                                var moduleDescription = this._getModuleDataDescription(refpath, bind);
                                this.$assert(2, !!moduleDescription);
                                var listener = {
                                    fn : this._bindModuleChange,
                                    scope : this,
                                    args : {
                                        boundTo : location,
                                        moduleDescription : moduleDescription
                                    }
                                };
                                this.json.addListener(moduleDescription.container, moduleDescription.property, listener, false, true);
                                this._bindings[refpath] = this._bindings[refpath] || {};
                                this._bindings[refpath][bind] = [bindings[bind], listener];
                            }
                        }
                    }
                }
            }
            this._updateModulesData();
            this.$callback(args.callback, args.callback.args);
        },

        /**
         * @param {Array} refpaths [optional] List of refpaths of modules whose bindings have to be disconnected. If not
         * specified, all bindings will be disconnected
         */
        disconnectBindings : function (refpaths) {
            if (refpaths) {
                for (var i = 0, len = refpaths.length; i < len; i++) {
                    this._disconnectModuleBindings(refpaths[i]);
                }
                return;
            }
            // disconnect bindings for all of them
            this.disconnectBindings(this._modulesPaths.common);
            var pageModRefpaths = this._modulesPaths.page;
            for (var pageId in pageModRefpaths) {
                if (pageModRefpaths.hasOwnProperty(pageId)) {
                    this.disconnectBindings(pageModRefpaths[pageId]);
                }
            }
        },

        /**
         * Remove the listener on the module data model and unregisters the binding
         * @param {String} refpath
         * @private
         */
        _disconnectModuleBindings : function (refpath) {
            var bindings = this._bindings[refpath];
            if (bindings) {
                for (var bind in bindings) {
                    if (bindings.hasOwnProperty(bind)) {
                        var moduleDescription = this._getModuleDataDescription(refpath, bind);
                        this.json.removeListener(moduleDescription.container, moduleDescription.property, bindings[bind][1], true);
                    }
                }
                delete this._bindings[refpath];
            }
        },

        /**
         * Synchronize the storage data with the modules data model according to the registered bindings
         */
        _updateModulesData : function () {
            var bindings = this._bindings;
            for (var refpath in bindings) {
                if (bindings.hasOwnProperty(refpath)) {
                    var moduleBindings = bindings[refpath];
                    for (var bind in moduleBindings) {
                        if (moduleBindings.hasOwnProperty(bind)) {
                            var moduleDataDescription = this._getModuleDataDescription(refpath, bind);
                            var location = this._getStorage(moduleBindings[bind][0]);
                            var storedValue = this._utils.resolvePath(location.path, location.storage);
                            this.json.setValue(moduleDataDescription.container, moduleDataDescription.property, storedValue, moduleBindings[bind][1]);
                        }
                    }
                }
            }
        },

        /**
         * Computes the description of a part of the datamodel inside a submodule. It creates the correct path if it is
         * not defined
         * @param {String} refpath Refpath of the module
         * @param {String} bind Path inside the module data model
         * @return {Object} container and property of the specified part of the data model
         * @private
         */
        _getModuleDataDescription : function (refpath, bind) {
            var moduleData = this._utils.resolvePath(refpath, this._data);
            // If the path is not present in the module, set it to null
            if (!this._utils.resolvePath(bind, moduleData)) {
                this._pathUtils.setValue(moduleData, bind, null);
            }
            return this._pathUtils.describe(moduleData, bind);
        },

        /**
         * Get the starage location of a given data binding. The storage is inside the module controller's data model
         * 'storage' region and can be either 'appData' or 'pageData'. Returns an object containing
         * <ul>
         * <li>storage : {Object} The storage location</li>
         * <li>path : {Object} Path to the specified value inside the storage location</li>
         * </ul>
         * @param {String} location Location description as 'storage:path.to.data.value'
         * @return {Object} or null if the location is not found
         * @private
         */
        _getStorage : function (location) {
            var split = location.split(":");
            if (split.length < 2) {
                return null;
            }

            var storage = this._data.storage[split[0]];
            if (!storage) {
                return null;
            }
            split.splice(0, 1);

            return {
                storage : storage,
                path : split.join(":")
            };
        },

        /**
         * Callback for a change in the page module's data model. Propagate the change to the root module's storage
         * location
         * @param {Object} res Description of the change given by the json utility
         * @param {Object} args Contains the description of bindings.
         * @private
         */
        _bindModuleChange : function (res, args) {
            var newValue = args.moduleDescription.container[args.moduleDescription.property];
            var boundTo = args.boundTo;
            if (this._utils.resolvePath(boundTo.path, boundTo.storage) == null) {
                this._pathUtils.setValue(boundTo.storage, boundTo.path, null);
            }
            var dataDesc = this._pathUtils.describe(boundTo.storage, boundTo.path);
            this.json.setValue(dataDesc.container, dataDesc.property, newValue);
        }

    }
});
