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

/**
 * Test for the "force reload class" feature, which reloads the methods on the prototype of a given class, and the
 * constructors and destructors of that class. The feature is meant to be used primarily for developer's debugging
 * workflow - to have the possibility to hot-reload the class instead of doing full application refresh and having to
 * repeat the whole flow etc.<br>
 * <br>
 * The main entry point is the "forceReload" method which gets as an input an Array<String> of the classpaths to be
 * reloaded.<br>
 * <br>
 * Note: dynamic change of $extends is impossible in IE < 11, hence the test fails there (to make it work, comment out
 * the line with $extends in Foo|BarClassTweaked.js)
 */
Aria.classDefinition({
    $classpath : "test.aria.tools.debug.ForceReloadClassTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.IOFiltersMgr", "aria.utils.Array",
            "test.aria.tools.debug.testFiles.RedirectToTweakedFilter"],
    $constructor : function () {
        /**
         * The classes to be used for this test
         */
        this.classesUnderTestCP = ["test.aria.tools.debug.testFiles.FooClass",
                "test.aria.tools.debug.testFiles.BarClass"];

        /**
         * IOFilter which for the sake of the test redirects requests from `FooClass` to `FooClassTweaked`, to simulate
         * the reload of a file
         */
        this.redirectFilter = new test.aria.tools.debug.testFiles.RedirectToTweakedFilter();

        /**
         * An array which will hold arrays instances of the classes under tests (we create instances right at the
         * beginning, reload them, and verify their prototypes were altered). The keys of this array are
         * String-classpaths.
         */
        this.oldInstances = {};

        /**
         * Used to notify about test end (to simplify things, instead of passing the test name continuously)
         */
        this.currentTestName = null;

        /**
         * Whether the current browser supports __proto__
         */
        this.supportsProto = (aria.core.Browser.isModernIE || !aria.core.Browser.isIE);
        this.$TestCase.constructor.call(this);
    },
    $destructor : function () {

        this.redirectFilter.$dispose();
        this.redirectFilter = null;
        this.$TestCase.$destructor.call(this);
    },
    $prototype : {
        tearDown : function () {
            for (var cp in this.oldInstances) {
                for (var j = 0; j < this.oldInstances[cp].length; j++) {
                    this.oldInstances[cp][j].$dispose();
                }
            }
            this.oldInstances = {};
        },

        testAsyncForceReloadMemCheckYes : function () {
            this.currentTestName = "testAsyncForceReloadMemCheckYes";
            this._startForceReloadTest(true);
        },
        testAsyncForceReloadMemCheckNo : function () {
            this.currentTestName = "testAsyncForceReloadMemCheckNo";
            this._startForceReloadTest(false);
        },

        /**
         * Load the class and assert it's in the original state
         */
        _startForceReloadTest : function (memCheckMode) {
            Aria.memCheckMode = memCheckMode;
            Aria.load({
                classes : this.classesUnderTestCP,
                oncomplete : {
                    fn : this._afterClassesLoaded,
                    scope : this
                }
            });
        },

        /**
         * Force reload the class (use IOFilter to simulate file change) and assert the prototype has been altered
         */
        _afterClassesLoaded : function () {
            // first, create instances of the class for later testing
            for (var i = 0; i < this.classesUnderTestCP.length; i++) {
                var cp = this.classesUnderTestCP[i];
                var classRef = Aria.getClassRef(cp);
                this.oldInstances[cp] = this.oldInstances[cp] || [];
                this.oldInstances[cp].push(new classRef(42));
            }

            this._makeAllAssertionsOriginal();

            aria.core.IOFiltersMgr.addFilter(this.redirectFilter);
            this.forceReload(this.classesUnderTestCP, {
                fn : this._testForceReload,
                scope : this
            });
        },

        /**
         * Check the reload was successful. Load once again the original file to assure more than one reload will work
         */
        _testForceReload : function () {
            this._makeAllAssertionsTweaked();

            aria.core.IOFiltersMgr.removeFilter(this.redirectFilter);
            this.forceReload(this.classesUnderTestCP, {
                fn : this._verifySecondReload,
                scope : this
            });
        },

        /**
         * Check that the second reload was successful too
         */
        _verifySecondReload : function () {
            this._makeAllAssertionsOriginal();

            this.notifyTestEnd(this.currentTestName);
        },

        /**
         * Assertions based on FooClass.js
         */
        _makeAllAssertionsOriginal : function () {
            for (var i = 0; i < this.classesUnderTestCP.length; i++) {
                var cp = this.classesUnderTestCP[i];
                var originalClassRef = Aria.getClassRef(cp);
                var originalClassRealProto = originalClassRef.prototype;

                // check that prototype methods/vars and statics were replaced properly
                this._makeAssertionsOriginal(originalClassRealProto);
                this._makeAssertionsOriginalInheritance(originalClassRealProto);
                this._makeAssertionsOriginalStatic(originalClassRef);

                // check that constructor was replaced properly
                var newInstance = new originalClassRef(42);
                this.assertEquals(newInstance._tweakedConstructorParam, undefined);
                this.assertEquals(newInstance._originalConstructorParam, 42);
                this.oldInstances[cp].push(newInstance);

                // check that all the instances created so far have their prototypes updated too
                for (var j = 0; j < this.oldInstances[cp].length; j++) {
                    this._makeAssertionsOriginal(this.oldInstances[cp][j]);
                }
            }
        },

        _makeAssertionsOriginal : function (obj) {
            this.assertEquals(obj.method1(), "original");
            this.assertEquals(obj.method5, undefined);
            this.assertEquals(obj.method2(), "original");
            this.assertEquals(obj.protoVariable1, "original");
            this._makeAssertionsOriginalStatic(obj);
        },
        _makeAssertionsOriginalStatic : function (obj) {
            this.assertEquals(obj.STATIC1, "original");
            this.assertEquals(obj.STATIC5, undefined);
            this.assertEquals(obj.STATIC2, "original");
        },
        _makeAssertionsOriginalInheritance : function (obj) {
            if (this.supportsProto) {
                this.assertEquals(obj.methodFromQuux, undefined);
                this.assertEquals(obj.STATIC_FROM_QUUX, undefined);
            }
        },

        /**
         * Assertions based on FooClassTweaked.js
         */
        _makeAllAssertionsTweaked : function () {
            for (var i = 0; i < this.classesUnderTestCP.length; i++) {
                var cp = this.classesUnderTestCP[i];
                var originalClassRef = Aria.getClassRef(cp);
                var originalClassRealProto = originalClassRef.prototype;

                // check that prototype methods/vars and statics were replaced properly
                this._makeAssertionsTweaked(originalClassRealProto);
                // check also inheritance on prototype level
                this._makeAssertionsTweakedInheritance(originalClassRealProto);
                // the constructor also exposes statics
                this._makeAssertionsTweakedStatic(originalClassRef);

                // check that constructor was replaced properly
                var newInstance = new originalClassRef(42);
                this.assertEquals(newInstance._tweakedConstructorParam, 42);
                this.assertEquals(newInstance._originalConstructorParam, undefined);
                this.oldInstances[cp].push(newInstance);

                // check that all the instances created so far have their prototypes updated too
                for (var j = 0; j < this.oldInstances[cp].length; j++) {
                    this._makeAssertionsTweaked(this.oldInstances[cp][j]);
                    this._makeAssertionsTweakedInheritance(this.oldInstances[cp][j]);
                }
            }
        },

        _makeAssertionsTweaked : function (obj) {
            this.assertEquals(obj.method1(), "tweaked");
            this.assertEquals(obj.method5(), "tweaked");
            this.assertEquals(obj.method2, undefined);
            this.assertEquals(obj.protoVariable1, "tweaked");
            this._makeAssertionsTweakedStatic(obj);
        },
        _makeAssertionsTweakedStatic : function (obj) {
            this.assertEquals(obj.STATIC1, "tweaked");
            this.assertEquals(obj.STATIC5, "tweaked");
            this.assertEquals(obj.STATIC2, undefined);
        },
        _makeAssertionsTweakedInheritance : function (obj) {
            if (this.supportsProto) {
                this.assertEquals(obj.methodFromQuux(), "quux");
                this.assertEquals(obj.STATIC_FROM_QUUX, "quux");
            }
        },

        // =============================================================================================== //

        /**
         * Initiates the force-reload of a given classpath, and calls the callback once done.
         * @param {Array} classpaths Array of string - classpath of the class to be reloaded
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
