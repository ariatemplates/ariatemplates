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

var asyncRequire = require('noder-js/asyncRequire').create(module);
var promise = require('noder-js/promise');
var environment = require('./environment/Environment');

var currentEntry = null;
var resources = {};

var isCorrectResource = function (requirement, available) {
    return (requirement.server === available.server)
            && (requirement.requestedLocale === available.requestedLocale || requirement.requestedLocale === available.loadedLocale);
};

var normalizeBaseLogicalPath = function (logicalPath) {
    try {
        var resolved = require.resolve(logicalPath + ".js");
        logicalPath = resolved.replace(/\.js$/, "");
    } catch (e) {}
    return logicalPath;
};

var loadFile = function (logicalPath, args) {
    var downloadMgr = require('./DownloadMgr');
    var defer = promise.defer();
    downloadMgr.loadFile(logicalPath, {
        fn : function (evt) {
            if (evt.downloadFailed) {
                return defer.reject(new Error("Download of '" + logicalPath + "' failed."));
            }
            defer.resolve(downloadMgr.getFileContent(logicalPath));
        },
        scope : downloadMgr
    }, args);
    return defer.promise;
};

/**
 * Resources Manager. It keeps the list of loaded resources in order to reload them in case of locale change.
 */
var resMgr = module.exports = Aria.classDefinition({
    $classpath : "aria.core.ResMgr",
    $singleton : true,
    $constructor : function () {
        /**
         * Current locale.
         * @type String
         */
        this.currentLocale = environment.getLanguage();
        /**
         * loadedResources is deprecated and should not be used anymore. Please use resources instead.
         * @deprecated
         */
        this.loadedResources = {};
        /**
         * Map of loaded resources (and pending to be loaded). The key in the map is the normalized base logical path.
         * The value in the map is an object describing the state of the resource.
         * @type Object
         */
        this.resources = resources;
    },
    $destructor : function () {
        this.currentLocale = null;
        this.loadedResources = null;
        this.resources = null;
    },
    $statics : {
        DEPRECATED_METHOD : "%1 is deprecated.",
        BYPASSING_LOADER : "Unexpected call to Aria.resourcesDefinition for %1. The resource loader was not properly used.",
        UNEXPECTED_CLASSPATH : "Unexpected classpath %1 for resource %2."
    },
    $prototype : {

        /**
         * Load the given resource.
         * @param {String} serverModuleName
         * @param {String} baseStaticFilePath
         * @param {Boolean} reload whether to reload the resource if it is already loaded
         */
        loadResource : function (serverModuleName, baseLogicalPath, reload) {
            baseLogicalPath = normalizeBaseLogicalPath(baseLogicalPath);
            var entry = resources[baseLogicalPath];
            if (!entry) {
                entry = resources[baseLogicalPath] = {
                    baseLogicalPath : baseLogicalPath,
                    logicalPaths : {}
                };
            }

            var toBeLoaded = {
                server : serverModuleName && !environment.isDevMode(),
                moduleName : serverModuleName,
                requestedLocale : this.currentLocale,
                loadedLocale : this.currentLocale,
                logicalPath : null
            };

            if (!reload) {
                if (entry.loading) {
                    if (isCorrectResource(toBeLoaded, entry.loading)) {
                        return entry.loading.promise;
                    }
                } else {
                    if (entry.loaded && isCorrectResource(toBeLoaded, entry.loaded)) {
                        return entry.loaded.promise;
                    }
                }
            }

            entry.loading = toBeLoaded;

            var downloadResource = function () {
                var locale = toBeLoaded.loadedLocale;
                toBeLoaded.logicalPath = baseLogicalPath + (locale ? "_" + locale : "") + ".js";

                // process server resource set
                if (serverModuleName) {
                    // if in dev mode, use static resource definition file with no specific locale
                    // otherwise, call the server with the url built by the request manager
                    if (toBeLoaded.server) {
                        return asyncRequire('../modules/RequestMgr').thenSync(function (requestMgr) {
                            var defer = promise.defer();
                            requestMgr.createI18nUrl(serverModuleName, locale, function (url) {
                                entry.logicalPaths[toBeLoaded.logicalPath] = true;
                                loadFile(toBeLoaded.logicalPath, {
                                    fullLogicalPath : url
                                }).thenSync(defer.resolve, defer.reject);
                            });
                            return defer.promise;
                        });
                    } else {
                        toBeLoaded.logicalPath = baseLogicalPath + ".js";
                    }
                }
                entry.logicalPaths[toBeLoaded.logicalPath] = true;
                return loadFile(toBeLoaded.logicalPath);
            };

            var downloadFallback = function () {
                var locale = toBeLoaded.loadedLocale;
                if (!serverModuleName && locale) {
                    var splitLocale = locale.split("_");
                    if (splitLocale.length == 2) {
                        locale = splitLocale[0];
                    } else {
                        locale = "";
                    }
                    toBeLoaded.loadedLocale = locale;
                    return newDownload();
                }
                throw new Error("Failed to load resource " + baseLogicalPath);
            };

            var processResponse = function (content) {
                if (!/Aria\.resourcesDefinition\(/.exec(content)) {
                    return downloadFallback();
                }
                if (entry.loading !== toBeLoaded) {
                    // something else is being loaded or was loaded
                    return entry.loading ? entry.loading.promise : entry.loaded.promise;
                }
                var savedCurrentEntry = currentEntry;
                try {
                    currentEntry = entry;
                    Aria["eval"](content, toBeLoaded.logicalPath);
                    if (currentEntry) {
                        throw new Error("Aria.resourcesDefinition not called");
                    }
                    entry.loaded = toBeLoaded;
                    delete entry.loading;
                    return entry.content;
                } finally {
                    currentEntry = savedCurrentEntry;
                }
            };

            var newDownload = function () {
                return downloadResource().thenSync(processResponse, downloadFallback);
            };

            return toBeLoaded.promise = newDownload();
        },

        getResource : function (baseLogicalPath) {
            baseLogicalPath = normalizeBaseLogicalPath(baseLogicalPath);
            var res = resources[baseLogicalPath];
            if (res) {
                return res.content;
            }
        },

        getResourceLogicalPath : function (baseLogicalPath) {
            baseLogicalPath = normalizeBaseLogicalPath(baseLogicalPath);
            var res = resources[baseLogicalPath];
            if (res) {
                return (res.loaded || res.loading || {}).logicalPath;
            }
        },

        unloadResource : function (baseLogicalPath, cleanCache, timestampNextTime) {
            baseLogicalPath = normalizeBaseLogicalPath(baseLogicalPath);
            var res = resources[baseLogicalPath];
            if (res) {
                delete resources[baseLogicalPath];
                var content = res.content;
                if (content) {
                    var classpath = content.$classpath;
                    Aria.dispose(content);
                    Aria.cleanGetClassRefCache(classpath);
                    delete this.loadedResources[classpath];
                }
                delete res.loading;
                delete res.loaded;
                if (cleanCache) {
                    var downloadMgr = require('./DownloadMgr');
                    var pathsToClean = res.logicalPaths;
                    for (var path in pathsToClean) {
                        if (pathsToClean.hasOwnProperty(path)) {
                            downloadMgr.clearFile(path, timestampNextTime);
                        }
                    }
                }
                return true;
            }
            return false;
        },

        /**
         * This method is the $onunload method of resources. It is called from Aria.dispose for resource classes.
         */
        _unloadResource : function () {
            // WARNING: when this method is called, this !== resMgr
            resMgr.unloadResource(Aria.getLogicalPath(this.$classpath));
        },

        /**
         * Do not call this method directly. Please use Aria.resourcesDefinition instead.
         */
        resourcesDefinition : function (res) {
            var expectedBaseLogicalPath = normalizeBaseLogicalPath(Aria.getLogicalPath(res.$classpath));
            var entry;
            if (currentEntry && currentEntry.baseLogicalPath === expectedBaseLogicalPath) {
                entry = currentEntry;
                currentEntry = null;
            } else {
                entry = {
                    loading : {
                        loadedLocale : "unknown"
                    }
                };
                if (currentEntry) {
                    this.$logError(this.UNEXPECTED_CLASSPATH, [res.$classpath, currentEntry.baseLogicalPath]);
                } else {
                    this.$logError(this.BYPASSING_LOADER, [res.$classpath]);
                }
            }

            var resClassRef = entry.content || Aria.getClassRef(res.$classpath);

            // if resource class has been already instantiated do json injection only
            if (resClassRef) {
                // inject resources for new locale
                var proto = resClassRef.classDefinition.$prototype;
                aria.utils.Json.inject(res.$resources, proto, true);
                // injecting in $prototype is not sufficient because simple values
                // are not updated on the singleton instance. That's why we are doing the
                // following loop:
                for (var i in proto) {
                    if (proto.hasOwnProperty(i)) {
                        resClassRef[i] = proto[i];
                    }
                }
            } else {
                // WRITING WITH BRACKETS ON PURPOSE (for documentation)
                resClassRef = Aria['classDefinition']({
                    $classpath : res.$classpath,
                    $singleton : true,
                    $prototype : res.$resources,
                    $onunload : this._unloadResource
                });
            }
            this.loadedResources[resClassRef.$classpath] = entry.loading.loadedLocale;
            entry.content = resClassRef;
        },

        /**
         * Internal method for switching the resource sets locale (should be only called from Environment) To switch the
         * language call the aria.core.environment.Environment.setLanguage method
         * @param {String} newLocale The new locale i.e. "en-US"
         * @param {aria.core.CfgBeans:Callback} callback Callback to be called when resource files are loaded and locale
         * changed
         */
        changeLocale : function (newLocale, cb) {
            this.currentLocale = newLocale;
            var tasks = [];
            for (var key in resources) {
                if (resources.hasOwnProperty(key)) {
                    var entry = resources[key];
                    var loadParams = entry.loading || entry.loaded;
                    tasks.push(this.loadResource(loadParams.moduleName, key));
                }
            }
            var self = this;
            promise.when(tasks).thenSync(function () {
                self.$callback(cb);
            });
        },

        /**
         * [Deprecated] Public method for storing the classpaths/locales of resource files that has been loaded
         * @param {String} resClassPath The classpath of the resource file than has loaded
         * @deprecated
         */
        addResFile : function (resClassPath, locale) {
            this.$logWarn(this.DEPRECATED_METHOD, ["addResFile"]);
            this.loadedResources[resClassPath] = locale || this.currentLocale;
        },

        /**
         * [Deprecated] Gets the current locale of a resource set
         * @param {String} resClassPath Classpath of the resource set
         * @return {String} Resource locale
         * @deprecated
         */
        getResourceLocale : function (resClassPath) {
            this.$logWarn(this.DEPRECATED_METHOD, ["getResourceLocale"]);
            return this.loadedResources[resClassPath];
        },

        /**
         * [Deprecated] Gets the fallback locale for a specific locale
         * @param {String} resClassPath Classpath of the resource set
         * @return {String} Resource fallback locale
         * @deprecated
         */
        getFallbackLocale : function (resClassPath) {
            this.$logWarn(this.DEPRECATED_METHOD, ["getFallbackLocale"]);
            var currResLocale = this.loadedResources[resClassPath];

            var res;

            if (currResLocale == null) {
                currResLocale = this.currentLocale;
            }

            var x = currResLocale.split("_");
            if (x.length == 2) {
                res = x[0];
            } else {
                res = "";
            }

            this.loadedResources[resClassPath] = res;

            return {
                currResLocale : currResLocale,
                newResLocale : res
            };
        }
    }
});
