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
var ariaEmbedIContentProvider = require("../embed/IContentProvider");
var ariaPageEnginePageEngineInterface = require("./PageEngineInterface");
require("./CfgBeans");
require("./SiteRootModule");
var ariaTemplatesModuleCtrlFactory = require("../templates/ModuleCtrlFactory");
var ariaCoreJsonValidator = require("../core/JsonValidator");
var ariaPageEngineUtilsSiteConfigHelper = require("./utils/SiteConfigHelper");
var ariaPageEngineUtilsPageConfigHelper = require("./utils/PageConfigHelper");
var ariaEmbedPlaceholderManager = require("../embed/PlaceholderManager");
var ariaUtilsType = require("../utils/Type");
require("../utils/String");
var ariaPageEngineUtilsPageEngineUtils = require("./utils/PageEngineUtils");
var ariaUtilsCSSLoader = require("../utils/CSSLoader");
var ariaUtilsJson = require("../utils/Json");
var ariaCoreBrowser = require("../core/Browser");
var ariaUtilsArray = require("../utils/Array");
var ariaCoreTimer = require("../core/Timer");

/**
 * Page engine bootstrap singleton to be used to start the site given a configuration file
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.pageEngine.PageEngine",
    $implements : [ariaEmbedIContentProvider, ariaPageEnginePageEngineInterface],
    $constructor : function () {
        /**
         * Start configuration
         * @type aria.pageEngine.CfgBeans:Start
         * @protected
         */
        this._config = null;

        /**
         * Instance of class that implements aria.pageEngine.pageProviders.PageProviderInterface
         * @type aria.pageEngine.CfgBeans:Start.pageProvider
         * @protected
         */
        this._pageProvider = null;

        /**
         * Navigation manager
         * @type aria.pageEngine.utils.HashManager|aria.pageEngine.utils.HistoryManager
         * @protected
         */
        this._navigationManager = null;

        var browser = ariaCoreBrowser;

        /**
         * Whether animations are compatible with the browser
         * @type Boolean
         * @protected
         */
        this._animationsDisabled = (browser.isOldIE && browser.majorVersion < 10)
                || (browser.isFirefox && browser.majorVersion < 4);

        /**
         * Manages animations in page transitions
         * @type aria.pageEngine.utils.AnimationsManager
         * @protected
         */
        this._animationsManager = null;

        /**
         * Wrapper around the site configuration for easier manipulation
         * @type aria.pageEngine.utils.SiteConfigHelper
         * @protected
         */
        this._siteConfigHelper = null;

        /**
         * Private instance of the root module controller.
         * @type aria.pageEngine.SiteRootModule
         * @protected
         */
        this._rootModule = null;

        /**
         * Map of page configurations. The key is the pageId and the value is the configuration object given by the page
         * configuration helper
         * @type Object
         * @protected
         */
        this._pageConfigs = {};

        /**
         * List of the standard .css files that are loaded in the current page
         * @type Array
         * @protected
         */
        this._currentPageCSS = [];

        /**
         * List of the standard .css files that were loaded in the previous page
         * @type Array
         * @protected
         */
        this._previousPageCSS = [];

        /**
         * Map of the content processors
         * @type Object
         */
        this.contentProcessors = {};

        /**
         * Identifier of the current page
         * @type String
         */
        this.currentPageId = null;

        /**
         * Generic utilities of the page engine
         * @type aria.pageEngine.utils.PageEngineUtils
         * @protected
         */
        this._utils = ariaPageEngineUtilsPageEngineUtils;

        /**
         * Public interface that is available to templates
         * @type aria.pageEngine.PageEngineInterface
         * @protected
         */
        this._wrapper = this.$interface("aria.pageEngine.PageEngineInterface");

        /**
         * Whether a template is loaded inside the container div
         * @type Boolean
         * @protected
         */
        this._isTemplateLoaded = false;

        /**
         * Indicates the active div (1: firstDiv, 0: secondDiv)
         * @type Number
         * @protected
         */
        this._activeDiv = 1;

        /**
         * First div
         * @type HTMLElement
         * @protected
         */
        this._firstDiv = null;

        /**
         * Second div
         * @type HTMLElement
         * @protected
         */
        this._secondDiv = null;

        /**
         * Object containing the data model of the application. It contains appData, pageData and pageInfo:
         *
         * <pre>
         * {
         *     appData : {Object} application data,
         *     pageData : {Object} data specific to the current page,
         *     pageInfo : {aria.pageEngine.CfgBeans.PageNavigationInformation} information on the current page
         * }
         * </pre>
         *
         * @type Object
         * @protected
         */
        this._data = {};

        /**
         * Contains the public interfaces of all the modules that are currently in the page
         * @type Array
         * @protected
         */
        this._modulesInPage = [];

        /**
         * Listener called when the page provider raises a pageChange event
         * @type aria.core.CfgBeans:Callback
         * @protected
         */
        this._onPageDefinitionChangeListener = {
            fn : this._onPageDefinitionChange,
            scope : this
        };
    },
    $destructor : function () {
        ariaEmbedPlaceholderManager.unregister(this);
        if (this._navigationManager) {
            this._navigationManager.$dispose();
        }
        if (this._isTemplateLoaded) {
            // To be done before disposing the animations manager
            Aria.disposeTemplate(this._getContainer());
        }
        if (this._animationsManager) {
            this._animationsManager.$dispose();
        }
        this._firstDiv = null;
        if (this._secondDiv) {
            this._secondDiv.parentNode.removeChild(this._secondDiv);
            this._secondDiv = null;
        }
        var siteConfigHelper = this._siteConfigHelper,
            pageConfigHelper = this._pageConfigHelper,
            cssLoader = ariaUtilsCSSLoader;
        if (siteConfigHelper) {
            cssLoader.remove(siteConfigHelper.getSiteCss());
            siteConfigHelper.$dispose();

        }
        if (pageConfigHelper) {
            pageConfigHelper.$dispose();
            pageConfigHelper = null;
        }
        cssLoader.remove(this._previousPageCSS);
        cssLoader.remove(this._currentPageCSS);
        this._modulesInPage = null;
        if (this._rootModule) {
            this._rootModule.$dispose();
            this._rootModule = null;
        }
        if (this._pageProvider) {
            this._pageProvider.$removeListeners({
                "pageDefinitionChange" : this._onPageDefinitionChangeListener
            });
        }
        this._onPageDefinitionChangeListener = null;

    },
    $statics : {
        SITE_CONFIG_NOT_AVAILABLE : "Unable to retrieve the site configuration",
        INVALID_SITE_CONFIGURATION : "The configuration object of the application is not valid",
        PAGE_NOT_AVAILABLE : "Unable to retrieve page %1",
        INVALID_PAGE_DEFINITION : "The page definition does not match the bean aria.pageEngine.CfgBeans.PageDefinition",
        MISSING_DEPENDENCIES : "Unable to download Page Engine dependencies",
        INVALID_ROOTMODULE_PARENT : "Custom root module controller should extend aria.pageEngine.SiteRootModule"
    },
    $prototype : {

        /**
         * Start the page engine by loading the site configuration
         * @param {aria.pageEngine.CfgBeans:Start} config json configuration
         */
        start : function (config) {

            this._config = config;
            this._pageProvider = config.pageProvider;
            ariaEmbedPlaceholderManager.register(this);
            this._pageProvider.$addListeners({
                "pageDefinitionChange" : this._onPageDefinitionChangeListener
            });

            this._pageProvider.loadSiteConfig({
                onsuccess : {
                    fn : this._loadRootModule,
                    scope : this
                },
                onfailure : this._getErrorCallbackConfig([this.SITE_CONFIG_NOT_AVAILABLE])
            });

        },

        /**
         * Callback for the site configuration module controller. Initialize whatever is needed by the root module
         * controller, like the data model and the router
         * @param {aria.pageEngine.CfgBeans:Site} siteConfig Site configuration
         */
        _loadRootModule : function (siteConfig) {
            var valid = this.isConfigValid(siteConfig, "aria.pageEngine.CfgBeans.Site", this.INVALID_SITE_CONFIGURATION);
            if (!valid) {
                return;
            }
            var helper = new ariaPageEngineUtilsSiteConfigHelper(siteConfig);
            this._siteConfigHelper = helper;

            // Initialization
            var appData = helper.getAppData();
            appData.menus = appData.menus || {};

            var initArgs = {
                appData : appData,
                pageEngine : this._wrapper
            };

            var rootModuleConfig = this._config.rootModule;
            if (rootModuleConfig) {
                var customControllerClasspath = rootModuleConfig.classpath;
                if (rootModuleConfig.initArgs) {
                    ariaUtilsJson.inject(initArgs, rootModuleConfig.initArgs);
                }
                var that = this;
                Aria.load({
                    classes : [customControllerClasspath],
                    oncomplete : function () {
                        if (Aria.getClassRef(customControllerClasspath).classDefinition.$extends !== "aria.pageEngine.SiteRootModule") {
                            that._errorCallback([that.INVALID_ROOTMODULE_PARENT]);
                            return;
                        }
                        that._createModuleCtrl(rootModuleConfig);
                    },
                    onerror : this._getErrorCallbackConfig([this.MISSING_DEPENDENCIES])
                });
            } else {
                this._createModuleCtrl({
                    classpath : "aria.pageEngine.SiteRootModule",
                    initArgs : initArgs
                });
            }

        },

        /**
         * Internal method to create the site root module controller
         * @param {aria.templates.CfgBeans:InitModuleCtrl} rootModuleConfig
         * @protected
         */
        _createModuleCtrl : function (rootModuleConfig) {
            ariaTemplatesModuleCtrlFactory.createModuleCtrl(rootModuleConfig, {
                fn : this._loadSiteDependencies,
                scope : this
            });
        },

        /**
         * Load any dependency global for the site, like common modules. This is a callback of a createModuleCtrl
         * @param {Object} loadModule Module controller description
         */
        _loadSiteDependencies : function (loadModule) {
            this._rootModule = loadModule.moduleCtrlPrivate;
            this._data = this._rootModule.getData().storage;
            var siteHelper = this._siteConfigHelper;

            ariaUtilsCSSLoader.add(siteHelper.getSiteCss());

            var classesToLoad = siteHelper.getListOfContentProcessors();
            var navigationManagerClass = siteHelper.getNavigationManagerClass();

            if (navigationManagerClass) {
                classesToLoad.push(navigationManagerClass);
            }
            if (siteHelper.siteConfig.animations) {
                classesToLoad.push("aria.pageEngine.utils.AnimationsManager");
            }
            var commonModulesToLoad = siteHelper.getCommonModulesDescription({
                priority : 1
            });

            this._utils.wiseConcat(classesToLoad, this._utils.extractPropertyFromArrayElements(commonModulesToLoad, "classpath"));

            Aria.load({
                classes : classesToLoad,
                oncomplete : {
                    fn : this._loadGlobalModules,
                    scope : this,
                    args : commonModulesToLoad
                },
                onerror : this._getErrorCallbackConfig([this.MISSING_DEPENDENCIES])
            });

        },

        /**
         * Load the global modules with priority 1
         * @param {Array} commonModulesToLoad Array containing objects of type
         * aria.templates.ModuleCtrl.SubModuleDefinition
         * @protected
         */
        _loadGlobalModules : function (commonModulesToLoad) {
            this._rootModule.loadModules(null, {
                page : [],
                common : commonModulesToLoad
            }, {
                fn : this._onSiteReady,
                scope : this
            });
        },

        /**
         * Trigger the navigation to the first page
         * @protected
         */
        _onSiteReady : function () {
            var helper = this._siteConfigHelper;
            this.contentProcessors = helper.getContentProcessorInstances();
            this._firstDiv = helper.getRootDiv();
            if (!this._animationsDisabled && helper.siteConfig.animations) {
                this._animationsManager = new aria.pageEngine.utils.AnimationsManager();
                this._secondDiv = this._animationsManager.createHiddenDiv(this._firstDiv);
            }
            this._navigationManager = helper.getNavigationManager({
                fn : "navigate",
                scope : this
            }, helper.siteConfig.storage);
            this.navigate({
                url : this._navigationManager ? this._navigationManager.getUrl() : null,
                pageId : this._navigationManager ? this._navigationManager.getPageId() : null,
                replace : true
            }, this._config.oncomplete);
        },

        /**
         * Navigate to a specific page
         * @param {aria.pageEngine.CfgBeans:PageNavigationInformation} pageRequest
         * @param {aria.core.CfgBeans:Callback} cb To be called when the navigation is complete
         */
        navigate : function (pageRequest, cb) {
            var pageId = pageRequest.pageId;
            var forceReload = pageRequest.forceReload;
            if (!forceReload && pageId && pageId == this.currentPageId) {
                this.$callback(cb);
                if (this._navigationManager) {
                    this._navigationManager.update(pageRequest);
                    ariaUtilsJson.setValue(this._data, "pageInfo", pageRequest);
                }
            } else {
                this._previousPageCSS = this._currentPageCSS;
                this._currentPageCSS = [];
                this._pageProvider.loadPageDefinition(pageRequest, {
                    onsuccess : {
                        fn : this._getPageDependencies,
                        scope : this,
                        args : {
                            pageRequest : pageRequest,
                            cb : cb
                        }
                    },
                    onfailure : this._getErrorCallbackConfig([this.PAGE_NOT_AVAILABLE, pageId])
                });
            }
        },

        /**
         * Callback for loading the page dependencies after loading the page description while doing navigation.
         * @param {aria.pageEngine.CfgBeans:PageDefinition} cfg Page configuration
         * @param {Object} args Contains the pageId and the callback
         */
        _getPageDependencies : function (cfg, args) {
            var valid = this.isConfigValid(cfg, "aria.pageEngine.CfgBeans.PageDefinition", this.INVALID_PAGE_DEFINITION);
            if (!valid) {
                this.$callback(args.cb);
                return;
            }

            var pageConfigHelper = this._getPageConfigHelper(cfg);
            ariaUtilsJson.inject(pageConfigHelper.getMenus(), this._siteConfigHelper.getAppData().menus);
            this._pageConfigHelper = pageConfigHelper;
            this._lazyContent = true;
            this._loadPageDependencies({
                lazy : false,
                pageId : cfg.pageId,
                cb : {
                    fn : this._displayPage,
                    scope : this,
                    args : {
                        cb : args.cb,
                        pageConfig : cfg,
                        pageRequest : args.pageRequest
                    }
                }
            });

        },

        /**
         * @param {aria.pageEngine.CfgBeans:PageDefinition} cfg
         * @return {Object} instance of page config helper
         * @protected
         */
        _getPageConfigHelper : function (cfg) {
            return new ariaPageEngineUtilsPageConfigHelper(cfg);
        },

        /**
         * Loads page dependencies, namely classes and templates
         * @param {Object} args
         *
         * <pre>
         * {
         *      lazy : {Boolean} true if lazy page dependencies have to be loaded,
         *      pageId : {String} id of the page,
         *      cb : {aria.core.CfgBeans:Callback} to be called after dependencies are loaded
         * }
         * </pre>
         *
         * @protected
         */
        _loadPageDependencies : function (args) {
            if (!this._pageConfigHelper) {
                this.$callback(args.cb);
                return;
            }
            var dependencies = this._pageConfigHelper.getPageDependencies(args.lazy);
            var pageCommonModules = this._siteConfigHelper.getCommonModulesDescription({
                priority : 2,
                refpaths : dependencies.modules.common
            });
            this._utils.wiseConcat(dependencies.classes, this._utils.extractPropertyFromArrayElements(pageCommonModules, "classpath"));
            var pageSpecificModules = this._pageConfigHelper.getPageModulesDescriptions(dependencies.modules.page);

            this._currentPageCSS = this._currentPageCSS.concat(dependencies.css);
            ariaUtilsCSSLoader.add(dependencies.css);
            delete dependencies.css;

            dependencies.oncomplete = {
                scope : this,
                fn : this._loadPageModules,
                args : {
                    pageId : args.pageId,
                    cb : args.cb,
                    subModules : {
                        common : pageCommonModules,
                        page : pageSpecificModules
                    }
                }
            };
            dependencies.onerror = this._getErrorCallbackConfig([this.MISSING_DEPENDENCIES]);
            Aria.load(dependencies);
        },

        /**
         * Load any module that is needed by the page
         * @param {Object} args Contains the pageId and the callback
         * @protected
         */
        _loadPageModules : function (args) {
            var subModules = args.subModules;
            this._rootModule.loadModules(args.pageId, subModules, args.cb);
        },

        /**
         * Normalize a configuration. It logs an error in case of validation failure
         * @param {Object} cfg Configuration to validate
         * @param {String} beanName name of the bean
         * @param {String} error Error message to log along with the validation errors
         * @return {Boolean}
         */
        isConfigValid : function (cfg, beanName, error) {
            try {
                ariaCoreJsonValidator.normalize({
                    json : cfg,
                    beanName : beanName
                }, true);
            } catch (ex) {
                this._utils.logMultipleErrors(error, ex.errors, this);
                if (this._config.onerror) {
                    this.$callback(this._config.onerror, [error]);
                }
                return false;
            }
            return true;
        },

        /**
         * Load the page page template in the DOM
         * @param {Object} args Contains the pageId and the callback
         * @protected
         */
        _displayPage : function (args) {
            if (!this._pageConfigHelper) {
                this.$callback(args.cb);
                return;
            }
            var pageConfig = args.pageConfig, cfg = pageConfig.pageComposition, pageId = pageConfig.pageId;
            this.$raiseEvent({
                name : "beforePageTransition",
                from : this.currentPageId,
                to : pageId
            });
            this.currentPageId = pageId;
            this._pageConfigs[pageId] = pageConfig;
            var pageRequest = args.pageRequest;
            pageRequest.url = pageConfig.url;
            pageRequest.pageId = pageConfig.pageId;
            pageRequest.title = pageConfig.title;

            var json = ariaUtilsJson;
            json.setValue(this._data, "pageData", cfg.pageData);
            json.setValue(this._data, "pageInfo", pageRequest);

            var cfgTemplate = {
                classpath : cfg.template,
                div : this._getContainer(!pageConfig.animation),
                moduleCtrl : this._rootModule
            };

            this._modulesInPage = [];
            // if the div does not change, let's dispose the previous template first
            if (cfgTemplate.div == this._getContainer() && this._isTemplateLoaded) {
                Aria.disposeTemplate(this._getContainer());
            }
            Aria.loadTemplate(cfgTemplate, {
                fn : this._afterTemplateLoaded,
                scope : this,
                args : {
                    pageConfig : pageConfig,
                    cb : args.cb,
                    div : cfgTemplate.div,
                    pageRequest : pageRequest
                }
            });
        },

        /**
         * Callback called after template is loaded inside the DOM
         * @param {Object} success Status about the loadTemplate action
         * @param {Object} args Contains params about the page
         * @protected
         */
        _afterTemplateLoaded : function (success, args) {
            if (this._navigationManager) {
                this._navigationManager.update(args.pageRequest);
            }

            var browser = ariaCoreBrowser;
            if (browser.isOldIE && browser.majorVersion < 8) {
                ariaCoreTimer.addCallback({
                    fn : function () {
                        args.div.style.zoom = 0;
                        args.div.style.zoom = 1;
                        args.div = null;
                    },
                    scope : this,
                    delay : 0
                });
            }

            this._isTemplateLoaded = true;

            if (this._animationsManager && args.pageConfig.animation) {
                this._animationsManager.$on({
                    "animationend" : {
                        fn : this._pageTransitionComplete,
                        args : args
                    },
                    scope : this
                });
                this._animationsManager.startPageTransition(this._getContainer(false), this._getContainer(), args.pageConfig.animation);
            } else {
                this._finishDisplay(args);
            }
        },

        /**
         * Callback called after page transition is completed
         * @param {Object} args Contains params about the page
         * @param {Object} params Contains params about the page
         * @protected
         */
        _pageTransitionComplete : function (args, params) {
            this._animationsManager.$removeListeners({
                "animationend" : this._pageTransitionComplete,
                scope : this
            });
            this._activeDiv = (this._activeDiv + 1) % 2;
            Aria.disposeTemplate(this._getContainer(false));
            this._finishDisplay(params);
        },

        /**
         * Raise the page ready event and starts the load of the dependencies
         * @param {Object} params Contains params about the page
         * @protected
         */
        _finishDisplay : function (params) {
            ariaUtilsCSSLoader.remove(this._previousPageCSS);
            this.$raiseEvent({
                name : "pageReady",
                pageId : params.pageConfig.pageId
            });
            if (params.cb) {
                this.$callback(params.cb);
            }
            this._loadPageDependencies({
                lazy : true,
                pageId : params.pageConfig.pageId,
                cb : {
                    fn : this._afterLazyDependenciesLoad,
                    scope : this
                }
            });
        },

        /**
         * Return the element in which the page is shown right now or the other one, according to the argument
         * @param {Boolean} active Whether the active HEMLElement should be returned, namely the element in which the
         * page is loaded. It defaults to true
         * @return {HTMLElement} Container of a page
         * @protected
         */
        _getContainer : function (active) {
            if (!this._animationsManager) {
                return this._firstDiv;
            }
            active = !(active === false);
            if (active) {
                return this._activeDiv === 0 ? this._firstDiv : this._secondDiv;
            } else {
                return this._activeDiv === 1 ? this._firstDiv : this._secondDiv;
            }
        },

        /**
         * Trigger a content change in order to notify placeholder widgets
         * @protected
         */
        _afterLazyDependenciesLoad : function () {
            if (!this._pageConfigHelper) {
                return;
            }
            var lazyPlaceholders = this._pageConfigHelper.getLazyPlaceholdersIds();
            this._lazyContent = false;
            this.$raiseEvent({
                name : "contentChange",
                contentPaths : lazyPlaceholders
            });

            this._pageConfigHelper.$dispose();
        },

        /**
         * Main content provider method
         * @param {String} placeholderPath path of the placeholder
         * @return {Array} List of content descriptions accepted by placeholders
         */
        getContent : function (placeholderPath) {
            var outputContent;
            var typeUtil = ariaUtilsType;
            var pageConfig = this._pageConfigs[this.currentPageId];
            if (pageConfig) {
                var placeholders = pageConfig.pageComposition.placeholders;
                var content = placeholders[placeholderPath] || [];
                outputContent = [];
                var plainContent;
                if (!typeUtil.isArray(content)) {
                    content = [content];
                }

                for (var i = 0, ii = content.length; i < ii; i++) {
                    var item = content[i];
                    if (typeUtil.isObject(item)) {
                        if (this._lazyContent && item.lazy) {
                            outputContent.push({
                                loading : true,
                                width : item.lazy.width || null,
                                height : item.lazy.height || null,
                                color : item.lazy.color || null,
                                innerHTML : item.lazy.innerHTML || null
                            });
                        } else {
                            if (item.template) {
                                outputContent.push(this._getTemplateCfg(item, pageConfig));
                            } else if (item.contentId) {
                                plainContent = this._getPlaceholderContents(pageConfig, item.contentId);
                                outputContent = outputContent.concat(plainContent);
                            }
                        }
                    } else {
                        outputContent.push(item);
                    }
                }
            }
            return outputContent;
        },

        /**
         * Extract the template configuration to be given to the Placeholder widget
         * @param {aria.pageEngine.CfgBeans:Placeholder} item
         * @param {aria.pageEngine.CfgBeans:PageDefinition} pageConfig
         * @return {aria.html.beans.TemplateCfg:Properties}
         * @protected
         */
        _getTemplateCfg : function (item, pageConfig) {
            var templateCfg = {
                classpath : item.template
            };
            var args = item.args || [];
            var extraArg = {};
            if (item.contentId) {
                extraArg.contents = this._getPlaceholderContents(pageConfig, item.contentId);
            }
            args.push(extraArg);

            templateCfg.args = args;
            if (item.module) {
                var module = this._rootModule.getPageModule(this.currentPageId, item.module);
                templateCfg.moduleCtrl = module;
                this._modulesInPage.push(module);
            }
            return templateCfg;
        },

        /**
         * Retrieve the contents corresponding to a certain contentId from the page definition
         * @param {aria.pageEngine.CfgBeans:PageDefinition} pageConfig
         * @param {String} contentId
         * @return {Array} Array of strings corresponding to processed content
         * @protected
         */
        _getPlaceholderContents : function (pageConfig, contentId) {
            var outputContent = [];
            var content = pageConfig.contents.placeholderContents
                    ? pageConfig.contents.placeholderContents[contentId]
                    : null;
            if (!content) {
                return outputContent;
            }
            if (!ariaUtilsType.isArray(content)) {
                content = [content];
            }
            for (var i = 0, length = content.length; i < length; i++) {
                outputContent = outputContent.concat(this.processContent(content[i]));
            }
            return outputContent;
        },

        /**
         * Process according to the content type
         * @param {aria.pageEngine.CfgBeans:Content} content
         * @return {String} processed content
         */
        processContent : function (content) {
            var contentType = content.contentType;

            if (contentType && contentType in this.contentProcessors) {
                return this.processContent(this.contentProcessors[contentType].processContent(content));
            }
            return content.value || "";
        },

        /**
         * Logs an error and calls the onerror callback if specified in the configuration
         * @param {Array} msg Parameters to pass to the $logError method or to the error method provided in the
         * configuration
         * @protected
         */
        _errorCallback : function (msg) {
            var config = this._config;
            this.$logError.apply(this, msg);
            if (config.onerror) {
                this.$callback(config.onerror, msg);
            }
        },

        /**
         * @param {Array} msg Parameters to pass to the $logError method or to the error method provided in the
         * @return {aria.core.CfgBeans:Callback}
         * @protected
         */
        _getErrorCallbackConfig : function (msg) {
            return {
                fn : this._errorCallback,
                scope : this,
                args : msg,
                resIndex : -1
            };
        },

        /**
         * Actual method called after a pageChange event is raised by the page provider
         * @param {Object} event
         * @protected
         */
        _onPageDefinitionChange : function (event) {
            var pageId = event.pageId;
            if (this.currentPageId == pageId) {
                this._rootModule.unloadPageModules(pageId);
                this.navigate({
                    pageId : pageId,
                    url : this._navigationManager ? this._navigationManager.getUrl() : null,
                    forceReload : true
                });
            }
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
        getData : function () {
            return this._data;
        },

        /**
         * Return instance of the pageProvider
         * @return {aria.pageEngine.CfgBeans:Start.pageProvider}
         */
        getPageProvider : function () {
            return this._pageProvider;
        },

        /**
         * Exposed methods of module controllers as services
         * @return {aria.pageEngine.CfgBeans:Module.services} Map containing exposed module controller methods
         */
        getServices : function () {
            return this._rootModule.services;
        },

        /**
         * Tell whether a certain module is currently present on the page
         * @param {aria.tamplates.ModuleCtrl} module
         * @return {Boolean}
         */
        isModuleInPage : function (module) {
            return ariaUtilsArray.contains(this._modulesInPage, module.$publicInterface());
        }
    }
});
