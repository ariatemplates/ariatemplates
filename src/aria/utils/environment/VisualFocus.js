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
var Promise = require("noder-js/promise");
var asyncRequire = require("noder-js/asyncRequire");
require("./VisualFocusCfgBeans");
var ariaCoreEnvironmentEnvironmentBase = require("../../core/environment/EnvironmentBase");

// This module is not yet fully loaded, but will be in the next tick:
var thisModuleIsLoaded = Promise.done.then(Aria.empty);

var loadVisualFocus = function () {
    // make sure this module is fully loaded before loading VisualFocus (which has a dependency on this module)
    return thisModuleIsLoaded.thenSync(function () {
        return asyncRequire(require.resolve("../VisualFocus"));
    });
};

/**
 * Contains getters for the Visual Focus environment.
 * @class aria.utils.environment.Date
 * @extends aria.core.environment.EnvironmentBase
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.environment.VisualFocus",
    $extends : ariaCoreEnvironmentEnvironmentBase,
    $singleton : true,
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class.
         * @type String
         */
        _cfgPackage : "aria.utils.environment.VisualFocusCfgBeans.AppCfg",

        /**
         * Get the specified outline style for visual focus
         * @public
         * @return {String} outline style
         */
        getAppOutlineStyle : function () {
            return this.checkApplicationSettings("appOutlineStyle");
        },

        /**
         * Apply the current environment.
         * @param {aria.core.CfgBeans:Callback} callback Will be called after the environment is applied.
         * @protected
         */
        _applyEnvironment : function (callback) {
            var appOutlineStyle = this.checkApplicationSettings("appOutlineStyle");
            // load aria.utils.VisualFocus if needed
            if (appOutlineStyle) {
                var whenLoaded = loadVisualFocus();
                if (callback) {
                    var self = this;
                    whenLoaded = whenLoaded.thenSync(function () {
                        self.$callback(callback);
                    });
                }
                whenLoaded.done();
            } else {
                this.$callback(callback);
            }
        }
    }
});
