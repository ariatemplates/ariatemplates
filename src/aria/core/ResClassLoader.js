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
 * @class aria.core.ResClassLoader ClassLoader for resource files.
 * @extends aria.core.ClassLoader
 */
Aria.classDefinition({
    $classpath : 'aria.core.ResClassLoader',
    $extends : 'aria.core.ClassLoader',
    $constructor : function (classpath, classtype) {
        this.$ClassLoader.constructor.apply(this, arguments);
        this.serverResource = false;

        // store info about resource files loaded
        if (this._refClasspath) {
            aria.core.ResMgr.addResFile(this._refClasspath);
        }
    },
    $statics : {
        REGEXP : /Aria\.resourcesDefinition\(/,

        // ERROR MESSAGES:
        RESOURCE_NOT_FOUND : "Error: the resource file '%1' for '%2' locale was not found",
        RESOURCE_NOT_RESOLVED : "Error: No resource file for '%1' could be found"
    },
    $destructor : function () {
        this.serverResource = null;
        this.$ClassLoader.$destructor.call(this);
    },
    $prototype : {
        /**
         * Called when the .js resource file is received. This method simply does an eval of the .js file.
         * @param {String} classdef Content of the .js file
         * @param {String} lp Logical path of the .js file
         * @protected
         */
        _loadClass : function (classdef, lp) {
            var resClassRef = Aria.getClassRef(this._refClasspath);
            // load the class only once, on reload the resources will be injected
            if (!this._classDefinitionCalled) {
                Aria["eval"](classdef, lp);
                if (!resClassRef && !this._classDefinitionCalled) {
                    this.$logError(this.MISSING_CLASS_DEFINITION, [this.getRefLogicalPath(), this._refClasspath]);
                    aria.core.ClassMgr.notifyClassLoadError(this._refClasspath);
                }
            }
        },
        /**
         * Internal callback called when the class definition file has been downloaded
         * @param {aria.core.FileLoader.$events.fileReady} evt
         * @protected
         */
        _onClassDefinitionReceive : function (evt) {
            var lp = this.getRefLogicalPath(), classdef = aria.core.DownloadMgr.getFileContent(lp), error = false;

            if (!classdef || !this.REGEXP.test(classdef)) {
                // a problem occured..
                // get replacement locale for resource file
                var res = aria.core.ResMgr.getFallbackLocale(this._refClasspath);

                if (this.handleError) {
                    this.$logWarn(this.RESOURCE_NOT_FOUND, [this._refClasspath, res.currResLocale]);
                }

                if (!this.serverResource) {
                    var regex = new RegExp("(_[a-z][a-z](_[A-Z][A-Z])??)?.js");
                    var newRefLogicalPath = this._refLogicalPath.replace(regex, (res.newResLocale !== "" ? "_" : "")
                            + res.newResLocale)
                            + ".js";

                    if (this._refLogicalPath !== newRefLogicalPath) {
                        this._refLogicalPath = newRefLogicalPath;

                        this._isLoadingRefDefinition = false;
                        this.$ClassLoader.loadClassDefinition.call(this);
                    } else {
                        error = true;
                    }
                } else {
                    error = true;
                }

                if (error) {
                    this.$logError(this.RESOURCE_NOT_RESOLVED, [this._refClasspath]);
                    aria.core.ClassMgr.notifyClassLoadError(this._refClasspath);
                }

                regex = newRefLogicalPath = null;
            } else {
                this.$ClassLoader._onClassDefinitionReceive.call(this, evt);
            }

            lp = classdef = null;
        },

        /**
         * Load the class definition associated to the ref class path. However the full logical path is not yet defined,
         * build it with an asynchronous call
         */
        loadClassDefinition : function () {
            // If this class is already loading, don't do it twice
            if (this._isLoadingRefDefinition) {
                return;
            }

            // Check for dev mode
            var devMode = aria.core.environment.Environment.isDevMode();
            // Get the locale
            var resLocale = aria.core.ResMgr.currentLocale;

            // Build the callback for the asynchronous method
            var callback = {
                fn : this.__loadParentDefinition,
                scope : this
            };

            // This method is asynchronous
            this.__buildLogicalPath(this._refClasspath, this._refLogicalPath, callback, resLocale, devMode);
        },

        /**
         * Build the complete logical path given the reference classpath and the initial logical path If a locale is
         * specified it is appended to the logical path unless we are in dev mode. If devMode is true the full path is
         * built by aria.modules.RequestMgr.createI18nUrl that is asynchronous. This method calls the callback passing
         * as arguments an object containing
         *
         * <pre>
         * {
         * logical : logical path,
         * serverResource : Boolean if the full logical path was created by aria.modules.RequestMgr,
         * full : full logical path, different from null if serverResource is true
         * }
         * </pre>
         *
         * @param {String} refClasspath Reference classpath
         * @param {String} logicalPath Logical file path
         * @param {aria.core.JsObject.Callback} callback Callback called when the full path is ready
         * @param {Boolean} devMode Development mode
         * @param {String} resLocale Current locale
         * @private
         */
        __buildLogicalPath : function (refClasspath, logicalPath, callback, locale, devMode) {
            var result = {
                logical : logicalPath,
                serverResource : false,
                full : null
            };
            var asynch = false;

            // process server resource set
            if (refClasspath.match(/\.Res$/)) {
                // if not in dev mode call the server for a resource file
                // otherwise use static resource definition file with no specific locale
                if (!devMode) {
                    var s = refClasspath.split(".");
                    var moduleName;
                    if (s && s.length > 1) {
                        moduleName = s[s.length - 2];
                    } else {
                        // TODO: Log module name could not be resolved
                    }
                    logicalPath += (!locale ? "" : "_") + locale + ".js";

                    result.serverResource = true;

                    // This call is asynchronous
                    result.logical = logicalPath;
                    callback.args = result;
                    // It will add callback.args.full
                    if (aria.modules && aria.modules.RequestMgr) {
                        aria.modules.RequestMgr.createI18nUrl(moduleName, locale, callback);
                    } else {
                        Aria.load({
                            classes : ['aria.modules.RequestMgr'],
                            oncomplete : function () {
                                aria.modules.RequestMgr.createI18nUrl(moduleName, locale, callback);
                            }
                        });
                    }
                    return;
                } else {
                    logicalPath += ".js";
                }
            } else {
                logicalPath += (!locale ? "" : "_") + locale + ".js";
            }

            result.logical = logicalPath;
            callback.args = result;

            this.$callback(callback);
        },

        /**
         * Callback for __buildLogicalPath. It is called when the full url is ready and is part of the overridden
         * loadClassDefinition
         * @param {Object} args Objects containing the logical paths of the resource
         */
        __loadParentDefinition : function (evt, args) {
            this._refLogicalPath = args.logical;
            this.serverResource = args.serverResource;
            this._fullLogicalPath = args.full;

            // Go on with the parent loadClassDefinition
            this.$ClassLoader.loadClassDefinition.call(this);
        }

    }
});
