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
var ariaCoreCache = require("./Cache");
var ariaCoreDownloadMgr = require("./DownloadMgr");

/**
 * Manage the class dependency load thanks to ClassLoaders. Classes can be of different types (currently six: "JS",
 * "TPL", "RES", "CSS", "TML" and "TXT"). Before loading a class, it is necessary to know its type (there is no naming
 * convention). This class uses the Cache object to store class definitions (through the DownloadMgr) and indicators
 * telling that a class is being downloaded.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.ClassMgr",
    $singleton : true,
    $events : {
        /**
         * Raised in the listener of the 'complete' event raised by the appropriate classLoader.
         */
        "classComplete" : {
            description : "notifies that the class loader process is done.",
            properties : {
                refClasspath : "{String} classpath of the reference class if any"
            }
        }
    },
    $constructor : function () {

        // TODO implement destructor
        /**
         * Internal reference to aria.core.Cache singleton
         * @private
         * @type aria.core.Cache
         */
        this._cache = null;

        /**
         * Map between extension and handler
         * @private
         * @type Object
         */
        this._classTypes = {
            "JS" : "aria.core.JsClassLoader",
            "TPL" : "aria.core.TplClassLoader",
            "RES" : "aria.core.ResClassLoader",
            "CSS" : "aria.core.CSSClassLoader",
            "TML" : "aria.core.TmlClassLoader",
            "CML" : "aria.core.CmlClassLoader",
            "TXT" : "aria.core.TxtClassLoader"
        };

    },
    $statics : {
        // ERROR MESSAGE:
        CIRCULAR_DEPENDENCY : "Class %1 and %2 have circular dependency",
        MISSING_CLASSLOADER : "The class loader of type %1 needed to load class %2 is missing. Make sure it is packaged."
    },
    $prototype : {
        /**
         * Convert a classpath into the corresponding logical path (without file extension). It simply replaces '.' by
         * '/' in the classpath. It does not add the extension at the end of the classpath.
         * @param {String} classpath Classpath to convert.
         */
        getBaseLogicalPath : function (classpath, classType) {
            // classType is curently ignored
            var parts = classpath.split('.');
            return parts.join("/");
        },

        /**
         * Method called when a class has been loaded completely (e.g. through Aria.loadClass or
         * JsonValidator.__loadBeans)
         * @param {String} classpath
         */
        notifyClassLoad : function (classpath) {
            if (!this._cache) {
                this._cache = ariaCoreCache;
            }
            this.$assert(1, this._cache);

            // get cache item, mark it as loaded and notify loader
            var itm = this._cache.getItem("classes", classpath, true);
            itm.status = this._cache.STATUS_AVAILABLE;
            if (itm.loader) {
                itm.loader.notifyLoadComplete();
            }

            // handle css dependencies registration after load
            // handle css dependency invalidation
            var classRef = Aria.getClassRef(classpath);
            // no class ref for beans
            if (classRef) {
                var classDef = Aria.getClassRef(classpath).classDefinition;
                if (classDef && classDef.$css) {
                    aria.templates.CSSMgr.registerDependencies(classpath, classDef.$css);
                }
            }
        },

        /**
         * Method called when a class could not be loaded completely (e.g. through Aria.loadClass or
         * JsonValidator.__loadBeans)
         * @param {String} classpath
         */
        notifyClassLoadError : function (classpath) {
            if (!this._cache) {
                this._cache = ariaCoreCache;
            }
            this.$assert(1, this._cache);

            // get cache item, mark it as error and notify loader
            var itm = this._cache.getItem("classes", classpath, true);
            itm.status = this._cache.STATUS_ERROR;
            if (itm.loader) {
                itm.loader.notifyLoadError();
            }
        },

        /**
         * Filter out classes which are already loaded from a list of classpaths
         * @param {Array} clsList the list of classpaths
         * @return {Array} the list of missing classes (or null if none is missing)
         */
        filterMissingDependencies : function (clsList, classType) { // TODO: remove classType - temp fix for resources
            // reloading and json injection
            if (!clsList) {
                return null;
            }
            var cache = this._cache, cls, itm, mdp = null, // missing dependency list
            status;
            for (var index = 0, l = clsList.length; index < l; index++) {
                cls = clsList[index];
                itm = cache.getItem("classes", cls, true);
                status = itm.status;
                if (status != cache.STATUS_AVAILABLE) {
                    if (status == cache.STATUS_ERROR) {
                        // dependency unavailable
                        return false; // dependencies not (never!?) ready
                    } else {
                        if (status == cache.STATUS_NEW && Aria.getClassRef(cls) && classType != "RES") {
                            itm.status = cache.STATUS_AVAILABLE;
                        } else {
                            if (!mdp) {
                                mdp = [];
                            }
                            mdp.push(cls);
                        }
                    }
                }
            }
            return mdp;
        },

        /**
         * Load the class dependencies associated to a class.
         * @param {String} classpath class path of the main class for which dependencies have to be loaded (will be used
         * to load the class when all dependencies are ready) The class loader for this class is supposed to exist
         * already, otherwise, an error is logged if this class loader is needed.
         * @param {Object} dpMap Map of the list of classpaths for each file type(js,res,tpl) that have to be loaded
         * prior to main classpath (can be null)
         * @param {Object} callback describes the callback function to call when the class and all its dependencies are
         * loaded: [callback] { fn: Aria.loadClass // mandatory scope: Aria // mandatory args: classpath // optional,
         * parameter to pass to the fn function } The callback function is only called if this function returns false.
         * @return {Boolean} return true if all dependencies are already loaded
         */
        loadClassDependencies : function (classpath, dpMap, callback) {
            if (!this._cache) {
                this._cache = ariaCoreCache;
            }
            this.$assert(2, this._cache);
            this.$assert(72, callback && callback.fn && callback.scope);
            var cache = this._cache,
            // we suppose the class loader already exists, so we don't use a type name for getClassLoader
            loader = this.getClassLoader(classpath);
            if (!loader) {
                // This can happen if an already loaded class (or a class which
                // failed to load) is reloaded with Aria.classDefinition,
                // or Aria.beansDefinition ...
                // in this case, reinit the status, and get a new class loader
                var itm = cache.getItem("classes", classpath, true);
                itm.status = cache.STATUS_LOADING;
                itm = null;
                loader = this.getClassLoader(classpath);
            }
            loader.notifyClassDefinitionCalled();
            if (!dpMap) {
                return true;
            }
            loader.callback = callback;

            var noMissingDep = true;
            for (var ext in dpMap) {
                if (dpMap.hasOwnProperty(ext)) {
                    var missingDep = this.filterMissingDependencies(dpMap[ext]);
                    if (missingDep != null) {
                        noMissingDep = false;
                        // add dependencies of type ext
                        loader.addDependencies(missingDep, ext);
                    }
                }
            }

            if (noMissingDep) {
                // no dependency - but class not completly loaded
                // so we set the status as loading
                var itm = cache.getItem("classes", classpath, true);
                itm.status = cache.STATUS_LOADING;
                return true; // all dependencies are ready
            }

            var circular = loader.getCircular();
            if (circular) {
                this.$logError(this.CIRCULAR_DEPENDENCY, [classpath, circular]);
                return this.notifyClassLoadError(classpath);
            }

            loader.loadDependencies();
            return false; // some dependencies are missing
        },

        /**
         * Create and return a classloader for the specified class (if not already loaded) and store it in the aria
         * Cache to share it with other listeners that would need the same resource
         * @param {String} classpath the classpath of the class for which the loader is requested
         * @param {String} typeName [optional] type of class loader to be created if needed if this parameter is omitted
         * and a new class loader is needed, an error is logged
         * @return {aria.core.ClassLoader} the class loader or null if the class is already loaded
         */
        getClassLoader : function (classpath, typeName, original) {
            var cache = this._cache, itm = cache.getItem("classes", classpath, true), status = itm.status;
            // don't return loader if class already loaded
            if (status == cache.STATUS_AVAILABLE || status == cache.STATUS_ERROR) {
                return null;
            }

            var loader = itm.loader;
            if (!loader) {
                var loaderConstr = (typeName != null ? this._classTypes[typeName] : (require("./ClassLoader")));
                if (typeof loaderConstr === "string") {
                    loaderConstr = Aria.getClassRef(loaderConstr);
                }
                if (!loaderConstr) {
                    this.$logError(this.MISSING_CLASSLOADER, [typeName, classpath]);
                } else {
                    loader = new loaderConstr(classpath, typeName);
                    itm.loader = loader;
                    itm.content = typeName;
                    loader.$on({
                        'complete' : this._onClassLoaderComplete,
                        scope : this
                    });
                }
            }

            // even if we didn't start the loader the class is in its load phase
            itm.status = cache.STATUS_LOADING;
            return loader;
        },

        /**
         * Unload a class (cache/files/urls associated)
         * @param {String} classpath the classpath of the class to be removed
         * @param {Boolean} timestampNextTime if true, the next time the class is loaded, browser and server cache will
         * be bypassed by adding a timestamp to the url
         */
        unloadClass : function (classpath, timestampNextTime) {

            // handle css dependency invalidation
            var classRef = Aria.getClassRef(classpath);
            // no class ref for beans
            if (classRef) {
                var classDef = Aria.getClassRef(classpath).classDefinition;
                if (classDef && classDef.$css) {
                    aria.templates.CSSMgr.unregisterDependencies(classpath, classDef.$css, true, timestampNextTime);
                }
            }

            // clean the class
            Aria.dispose(classpath);
            Aria.cleanGetClassRefCache(classpath);
            var logicalPath = ariaCoreCache.getFilename(classpath);
            if (logicalPath) {
                ariaCoreDownloadMgr.clearFile(logicalPath, timestampNextTime);
            }
            var classesInCache = this._cache.content.classes;
            delete classesInCache[classpath];
        },

        /**
         * Unload class from the cache and destroy it's reference based on class type
         * @param {String} classType class type (RES,JS,TPL)
         * @param {Boolean} dispose True to dispose also the classdefinition. Default false
         */
        unloadClassesByType : function (classType, dispose) {
            var classes = this._cache.content.classes;
            for (var itm in classes) {
                if (classes.hasOwnProperty(itm) && classes[itm].content === classType) {
                    if (dispose) {
                        Aria.dispose(itm);
                        Aria.cleanGetClassRefCache(itm);
                        var logicalPath = ariaCoreCache.getFilename(itm);
                        ariaCoreDownloadMgr.clearFile(logicalPath, true);
                    }

                    delete classes[itm];
                }
            }
        },

        /**
         * Internal method called when a class loader can be disposed
         * @param {aria.core.ClassLoader:complete:event} evt
         * @private
         */
        _onClassLoaderComplete : function (evt) {
            var clspath = evt.refClasspath;
            this.$assert(4, clspath); // could change in the future
            var loader = evt.src;

            loader.$dispose();
            var itm = ariaCoreCache.getItem("classes", clspath);
            if (itm) {
                itm.loader = null; // remove ref to class loader
                delete itm.loader;
            }
            this.$raiseEvent({
                name : "classComplete",
                refClasspath : clspath
            });
        }
    }
});
