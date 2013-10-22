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
var Aria = require("../../Aria");
require("./EnvironmentBaseCfgBeans");
var ariaCoreAppEnvironment = require("../AppEnvironment");

/**
 * Public API for retrieving, applying application variables.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.environment.Environment",
    $singleton : true,
    $extends : (require("./EnvironmentBase")),
    $statics : {
        // ERROR MESSAGES:
        INVALID_LOCALE : "Error: the locale '%1' is not in correct format"
    },
    $constructor : function () {
        this.$EnvironmentBase.constructor.call(this);
        // hook for JsonValidator and logs, which were loaded before
        this.$on({
            "debugChanged" : function () {
                (require("../JsonValidator"))._options.checkEnabled = this.isDebug();
                var logs = (require("../Log"));
                // PTR 05038013: aria.core.Log may not be available
                if (logs) {
                    logs.setLoggingLevel("*", this.isDebug() ? logs.LEVEL_DEBUG : logs.LEVEL_ERROR);
                }
            },
            scope : this
        });
    },
    $events : {
        "debugChanged" : {
            description : "Notifies that debug mode has changed."
        }
    },
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.core.environment.EnvironmentBaseCfgBeans.AppCfg",

        /**
         * Apply the current environment.
         * @protected
         * @param {aria.core.CfgBeans:Callback} callback Will be called after the environment variables are applied
         */
        _applyEnvironment : function (callback) {
            var debug = this.isDebug();
            if (debug != Aria.debug) {
                // always usefull as a shortcut
                Aria.debug = debug;
                this.$raiseEvent("debugChanged");
            }
            if (aria.core.ResMgr) {
                // the resource manager may not be already loaded
                require("../ResMgr").changeLocale(this.getLanguage(), callback);
            } else {
                this.$callback(callback);
            }
        },

        /**
         * Get language
         * @public
         * @return {String} language (lower case) and region (upper case) separated by an underscore.
         */
        getLanguage : function () {
            var language = this.checkApplicationSettings("language");
            return language.primaryLanguage.toLowerCase() + "_" + language.region.toUpperCase();
        },

        /**
         * Get region (ex: US)
         * @public
         * @return {String} The region
         */
        getRegion : function () {
            var region = this.checkApplicationSettings("language");
            return region.region;
        },

        /**
         * Sets the current application locale (ex: en_US)
         * @public
         * @param {String} locale New locale
         * @param {aria.core.CfgBeans:Callback} cb Method to be called after the locale is changed. The callback is
         * called with a boolean (true: errors, false: no errors)
         */
        setLanguage : function (locale, cb) {
            var err = false;
            if (locale == null) {
                err = true;
            } else {
                var s = locale.split("_");
                if (locale === "" || (locale.length === 5 && s !== null && s.length === 2) || locale.length == 2) {
                    ariaCoreAppEnvironment.setEnvironment({
                        "language" : {
                            "primaryLanguage" : s[0],
                            "region" : s[1]
                        }
                    }, cb);
                    // setEnvironment will automatically call ResMgr.changeLocale, so there is no need to do it here
                    // aria.core.ResMgr.changeLocale(locale, cb);
                } else {
                    err = true;
                }
            }
            if (err) {
                this.$logError(this.INVALID_LOCALE, [locale]);
                this.$callback(cb, true);
            }
        },

        /**
         * Enable debug mode, and notify listeners.
         * @public
         * @param {Boolean} mode
         */
        setDebug : function (mode) {
            var debug = this.isDebug();
            if (debug !== mode && (mode === true || mode === false)) {
                ariaCoreAppEnvironment.setEnvironment({
                    "appSettings" : {
                        "debug" : mode
                    }
                }, null, true);
            }
        },

        /**
         * Enable dev mode, and notify listeners.
         * @public
         * @param {Boolean} mode
         */
        setDevMode : function (mode) {
            var dev = this.isDevMode();
            if (dev !== mode && (mode === true || mode === false)) {
                ariaCoreAppEnvironment.setEnvironment({
                    "appSettings" : {
                        "devMode" : mode
                    }
                }, null, true);
            }
        },

        /**
         * Get the value indicating if app is in dev mode
         * @public
         * @return {Boolean} devMode flag value
         */
        isDevMode : function () {
            var settings = this.checkApplicationSettings("appSettings");
            if (settings && settings.devMode) {
                return true;
            }
            return false;
        },

        /**
         * Return true if debug mode is on.
         * @public
         * @return {Boolean}
         */
        isDebug : function () {
            var settings = this.checkApplicationSettings("appSettings");
            if (settings && settings.debug) {
                return true;
            }
            return false;
        }
    }
});
