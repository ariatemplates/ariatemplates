/*
 * Copyright 2014 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "aria.tools.debug.ReloadClassUtil",
    $singleton : true,
    $dependencies : ["aria.core.DownloadMgr", "aria.core.ClassMgr", "aria.core.Cache", "aria.core.Browser",
            "aria.utils.Array"],
    $prototype : {
        supportsProto : (aria.core.Browser.isModernIE || !aria.core.Browser.isIE),

        /**
         * Initiates the force-reload of a given classpaths, and calls the callback once done.
         * @param {Array} classpaths Array of string - classpaths of the classes to be reloaded
         * @param aria.core.CfgBeans.Callback} callback
         */
        forceReload : function (classpaths, callback) {
            // !! Important development note: getClassRef *writes* to cache (this can be tricky for debugging)
            // Any usage of getClassRef should probably be followed by/preceded by purging the cache

            // Wipe all related cache entries everywhere across the framework
            this.__purgeCacheEntries(classpaths);

            // Hack: nullify the original classpath temporarily, otherwise we won't be able to force reload the class
            aria.utils.Array.forEach(classpaths, function (cp) {
                this.__backupAndNullifyClasspath(cp, "$Original$");
            }, this);

            Aria.load({
                classes : classpaths,
                oncomplete : {
                    fn : this.__forceReloadCb,
                    scope : this,
                    args : {
                        classpaths : classpaths,
                        callback : callback
                    }
                },
                onerror : function () {
                    this.$logError("Unable to reload the classes " + classpaths.join(", "));
                }
            });
        },

        /**
         * Finishes the force-reload and calls the callback.
         * @param {Object} args {classpaths, callback}
         */
        __forceReloadCb : function (args) {
            this.__finishReloading(args.classpaths);
            this.$callback(args.callback);
        },

        __purgeCacheEntries : function (classpaths) {
            aria.utils.Array.forEach(classpaths, function (cp) {
                this.__purgeCacheEntriesCp(cp);
            }, this);
        },

        /**
         * Remove all cache entries (in aria.core.Cache and Aria) associated to the class
         * @param {String} cp classpath of the class to be reloaded
         */
        __purgeCacheEntriesCp : function (cp) {
            var cacheContent = aria.core.Cache.content;

            // var logicalPath = _cache.getFilename(cp);
            // aria.core.DownloadMgr.clearFile(logicalPath, false);
            // TODO can it be other than JS????
            var logicalPath = aria.core.ClassMgr.getBaseLogicalPath(cp) + ".js";
            var url = aria.core.DownloadMgr.resolveURL(logicalPath);

            Aria.cleanGetClassRefCache(cp);
            delete Aria.$classDefinitions[cp];

            if (cacheContent.classes[cp].loader) {
                cacheContent.classes[cp].loader.$dispose();
            }
            delete cacheContent.classes[cp];

            if (cacheContent.files[logicalPath].loader) {
                cacheContent.files[logicalPath].loader.$dispose();
            }
            delete cacheContent.files[logicalPath];

            if (cacheContent.urls[url].loader) {
                cacheContent.urls[url].loader.$dispose;
            }
            delete cacheContent.urls[url];
        },

        __finishReloading : function (classpaths) {
            aria.utils.Array.forEach(classpaths, function (cp) {
                this.__finishReloadingCp(cp);
            }, this);
        },

        /**
         * Obtains the reference to the reloaded class and does everything necessary to update the original class
         * accordingly (remove old methods, copy new methods, update constructors)
         * @param {String} cp classpath of the class to be reloaded
         */
        __finishReloadingCp : function (cp) {
            // cp points to the reloaded version of the class, let's move it to a temporary classpath
            this.__backupAndNullifyClasspath(cp, "$Tmp$");
            // let's put back the original class to its classpath
            this.__restoreClasspath(cp, "$Original$");
            // one last cleaning of the nasty ref cache...
            Aria.cleanGetClassRefCache(cp);

            // obtain references to original and reloaded classes
            var idx = cp.lastIndexOf(".");
            var reloadedClassName = "$Tmp$" + cp.slice(idx + 1);
            var reloadedCp = cp.slice(0, idx) + "." + reloadedClassName;

            var reloadedClassRef = Aria.getClassRef(reloadedCp);
            var reloadedClassClassDef = reloadedClassRef.classDefinition;

            var originalClassRef = Aria.getClassRef(cp);
            var originalClassClassDef = originalClassRef.classDefinition;
            var originalClassRealProto = originalClassRef.prototype;

            this.$assert(originalClassClassDef !== reloadedClassClassDef, 274);

            // remove old entries in prototype and classdef.$prototype
            for (var key in originalClassClassDef.$prototype) {
                delete originalClassRealProto[key];
                delete originalClassClassDef.$prototype[key];
            }

            // inject new entries in prototype and classdef.$prototype
            var reloaded$Proto = reloadedClassClassDef.$prototype;
            for (var key in reloaded$Proto) {
                originalClassRealProto[key] = reloaded$Proto[key];
                originalClassClassDef.$prototype[key] = reloaded$Proto[key];
            }

            // remove old statics
            for (var key in originalClassClassDef.$statics) {
                delete originalClassRef[key];
                delete originalClassRealProto[key];
                delete originalClassClassDef.$statics[key];
            }

            // inject new statics
            for (var key in reloadedClassClassDef.$statics) {
                var newVal = reloadedClassClassDef.$statics[key];
                originalClassRef[key] = newVal;
                originalClassRealProto[key] = newVal;
                originalClassClassDef.$statics[key] = newVal;
            }

            // also override constructors and destructors for memcheckmode
            originalClassClassDef.$constructor = reloadedClassClassDef.$constructor;
            originalClassClassDef.$destructor = reloadedClassClassDef.$destructor;

            // take care of inheritance if possible
            if (originalClassRef.superclass != reloadedClassRef.superclass) {
                // superclass has changed, not so nice an edge case
                if (this.supportsProto) {
                    originalClassRef.superclass = reloadedClassRef.superclass;
                    originalClassRef.prototype.constructor.prototype.__proto__ = reloadedClassRef.prototype.constructor.prototype.__proto__;
                } else {
                    var msg = "[reload tools] A change of parent class ($extends) detected for a class %1. This feature is not supported in IE < 11.";
                    this.$logWarn(msg, [cp]);
                }
            }

            // in !memcheckmode, constructors are called directly, hence the namespace pointed to
            // by a classpath should expose the *new constructor* (but with the *old prototype*)
            var newConstructor = reloadedClassRef;
            newConstructor.prototype = originalClassRef.prototype;
            this.publishAtProperNamespace(newConstructor); // at "cp" namespace
            Aria.cleanGetClassRefCache(cp);

            // clear cache related to the temporary namespace, so that we can reload more than once
            Aria.cleanGetClassRefCache(reloadedCp);
            delete Aria.$classDefinitions[reloadedCp];
            Aria.nspace(reloadedCp)[reloadedClassName] = null;
        },

        publishAtProperNamespace : function (cnstrctr) {
            var cd = cnstrctr.classDefinition;
            Aria.nspace(cd.$package)[cd.$class] = cnstrctr;
        },

        /**
         * Given a string classpath "a.b.c", does `a.b.c = null` on a global scope, but stores a backup first on
         * a.b[prefix + c]
         * @param {String} cp
         * @param {String} prefix must be a valid JS variable name prefix
         */
        __backupAndNullifyClasspath : function (cp, prefix) {
            var dotIdx = cp.lastIndexOf(".");
            var obj = Aria.nspace(cp.slice(0, dotIdx));

            var originalClassName = cp.slice(dotIdx + 1);
            var backupClassName = prefix + originalClassName;

            obj[backupClassName] = obj[originalClassName];
            obj[originalClassName] = null;
        },

        /**
         * Restores the object under given classpath from the backup stored under a.b[prefix+c]
         * @param {String} cp like "a.b.c"
         * @param {String} prefix must be a valid JS variable name prefix
         */
        __restoreClasspath : function (cp, prefix) {
            var dotIdx = cp.lastIndexOf(".");
            var obj = Aria.nspace(cp.slice(0, dotIdx));

            var originalClassName = cp.slice(dotIdx + 1);
            var backupClassName = prefix + originalClassName;

            obj[originalClassName] = obj[backupClassName];
            obj[backupClassName] = null;
        }
    }
});
