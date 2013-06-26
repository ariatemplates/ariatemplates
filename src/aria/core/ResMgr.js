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
 * Resources Manager. It keeps the list of loaded resources in order to reload them in case of locale change.
 */
Aria.classDefinition({
    $classpath : "aria.core.ResMgr",
    $dependencies : ["aria.core.environment.Environment"],
    $singleton : true,
    $constructor : function () {
        this.devMode = true;
        this.currentLocale = aria.core.environment.Environment.getLanguage();
        this.loadedResources = {};
    },
    $destructor : function () {
        this.currentLocale = null;
        this.loadedResources = null;
    },
    $prototype : {

        /**
         * Resource Manager initialization method.
         * @param {Object} arg single config argument - to be defined by the sub-class
         */
        $init : function (arg) {},

        /**
         * Private method for loading multiple resource files
         * @param {Object} resources The list of resource sets to be loaded
         * @param {aria.core.CfgBeans:Callback} callback the callback description
         * @private
         */
        __loadResourceFiles : function (resources, cb) {
            var clsPaths = [];

            for (var itm in resources) {
                if (resources.hasOwnProperty(itm)) {
                    clsPaths.push(itm);
                }
            }

            Aria.load({
                resources : clsPaths,
                oncomplete : {
                    fn : this.__resourceFileLoaded,
                    scope : this,
                    args : {
                        cb : cb
                    }
                },
                onerror : {
                    fn : this.__resourceFileLoadError,
                    scope : this,
                    args : {
                        cb : cb
                    }
                }
            });

            clsPaths = null;

        },

        /**
         * Internal method for switching the resource sets locale (should be only called from Environment)
         * To switch the language call the aria.core.environment.Environment.setLanguage method
         * @param {String} newLocale The new locale i.e. "en-US"
         * @param {aria.core.CfgBeans:Callback} callback Callback to be called when resource files are loaded and locale changed
         */
        changeLocale : function (newLocale, cb) {
            this.currentLocale = newLocale;
            aria.core.ClassMgr.unloadClassesByType("RES");
            this.__loadResourceFiles(this.loadedResources, cb);
        },

        /**
         * Public method for storing the classpaths/locales of resource files that has been loaded
         * @param {String} resClassPath The classpath of the resource file than has loaded
         */
        addResFile : function (resClassPath) {
            this.loadedResources[resClassPath] = this.currentLocale;
        },

        /**
         * Gets the current locale of a resource set
         * @param {String} resClassPath Classpath of the resource set
         * @return {String} Resource locale
         */
        getResourceLocale : function (resClassPath) {
            return this.loadedResources[resClassPath];
        },

        /**
         * Gets the fallback locale for a specific locale
         * @param {String} resClassPath Classpath of the resource set
         * @return {String} Resource fallback locale
         */
        getFallbackLocale : function (resClassPath) {
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
        },

        /**
         * Callback method called after resource files had been reloaded on locale change
         * @param {Object} args Arguments passed to the callback
         * [args] {
         *         cb: {aria.core.CfgBeans:Callback} The callback method to be called  // optional
         * }
         * @private
         */
        __resourceFileLoaded : function (args) {
            this.$callback(args.cb);
        },

        /**
         * Callback method called when an error in the process of reloading resource files occurres
         * @param {Object} args Arguments passed to the callback
         * [args] {
         *         cb: {aria.core.CfgBeans:Callback} The callback method to be called after the error is processed  // optional
         * }
         * @private
         */
        __resourceFileLoadError : function (args) {
            //TODO: implement fallback mechanism, log error
            this.$callback(args.cb);
        }
    }
});