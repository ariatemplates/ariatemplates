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
 * @dependencies ["aria.core.Cache", "aria.core.DownloadMgr"]
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.ClassMgr",
    $singleton : true,
    $events : {
        /**
         * Deprecated, no longer raised.
         */
        "classComplete" : "This event is deprecated, it is no longer raised."
    },
    $statics : {
        NODER_MIGRATION : "With the migration to noder-js, aria.core.ClassMgr.%1 is no longer supported.",
        DEPRECATED_METHOD : "aria.core.ClassMgr.%1 is deprecated."
    },
    $prototype : {
        /**
         * Convert a classpath into the corresponding logical path (without file extension). It simply replaces '.' by
         * '/' in the classpath. It does not add the extension at the end of the classpath.
         * @param {String} classpath Classpath to convert.
         */
        getBaseLogicalPath : function (classpath, classType) {
            this.$logWarn(this.DEPRECATED_METHOD, ["getBaseLogicalPath", "Aria.getLogicalPath"]);
            return Aria.getLogicalPath(classpath);
        },

        /**
         * With the migration to noder-js, notifyClassLoad is no longer supported.
         */
        notifyClassLoad : function (classpath) {
            this.$logError(this.NODER_MIGRATION, ["notifyClassLoad"]);
        },

        /**
         * With the migration to noder-js, notifyClassLoadError is no longer supported.
         */
        notifyClassLoadError : function () {
            this.$logError(this.NODER_MIGRATION, ["notifyClassLoadError"]);
        },

        /**
         * With the migration to noder-js, filterMissingDependencies is no longer supported.
         */
        filterMissingDependencies : function () {
            this.$logError(this.NODER_MIGRATION, ["filterMissingDependencies"]);
        },

        /**
         * With the migration to noder-js, loadClassDependencies is no longer supported.
         */
        loadClassDependencies : function () {
            this.$logError(this.NODER_MIGRATION, ["loadClassDependencies"]);
        },

        /**
         * With the migration to noder-js, getClassLoader is no longer supported.
         */
        getClassLoader : function (classpath, typeName, original) {
            this.$logError(this.NODER_MIGRATION, ["getClassLoader"]);
        },

        /**
         * With the migration to noder-js, $on is no longer supported.
         */
        $on : function () {
            this.$logError(this.NODER_MIGRATION, ["$on"]);
        },

        /**
         * With the migration to noder-js, $once is no longer supported.
         */
        $once : function () {
            this.$logError(this.NODER_MIGRATION, ["$once"]);
        },

        /**
         * With the migration to noder-js, $addListeners is no longer supported.
         */
        $addListeners : function () {
            this.$logError(this.NODER_MIGRATION, ["$addListeners"]);
        },

        /**
         * Unload a class (cache/files/urls associated)
         * @param {String} classpath the classpath of the class to be removed
         * @param {Boolean} timestampNextTime if true, the next time the class is loaded, browser and server cache will
         * be bypassed by adding a timestamp to the url
         */
        unloadClass : function (classpath, timestampNextTime) {
            this.$logWarn(this.DEPRECATED_METHOD, ["unloadClass"]);

            var classRef = Aria.getClassRef(classpath);
            // no class ref for beans
            if (classRef) {
                var classDef = classRef.classDefinition;
                if (classDef && classDef.$css) {
                    aria.templates.CSSMgr.unregisterDependencies(classpath, classDef.$css, true, timestampNextTime);
                }
            }

            var resMgr = aria.core.ResMgr;
            if (resMgr) {
                // if the classpath refers to a resource, make sure it is fully unloaded
                resMgr.unloadResource(Aria.getLogicalPath(classpath), true, timestampNextTime);
            }

            // clean the class
            Aria.dispose(classpath);
            Aria.cleanGetClassRefCache(classpath);
            var logicalPath = ariaCoreCache.getFilename(classpath);
            if (logicalPath) {
                ariaCoreDownloadMgr.clearFile(logicalPath, timestampNextTime);
                delete require.cache[require.resolve(logicalPath)];
            }
        },

        /**
         * With the migration to noder-js, unloadClassesByType is no longer supported.
         */
        unloadClassesByType : function (classType, dispose) {
            this.$logWarn(this.NODER_MIGRATION, ["unloadClassesByType"]);
        }
    }
});
