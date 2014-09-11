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
var ariaCoreJsonValidator = require("../JsonValidator");
var ariaCoreAppEnvironment = require("../AppEnvironment");


/**
 * Base class containing shared methods for all environment classes.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.core.environment.EnvironmentBase",
    $constructor : function () {
        this.$assert(9, this._cfgPackage != null);
        /**
         * Contains the default configuration for the part of the environment managed by this class. This is used to
         * know which are the environment properties managed by this class.
         * @type Object
         */
        this._localDefCfg = {};
        var validCfg = ariaCoreJsonValidator.normalize({
            json : this._localDefCfg,
            beanName : this._cfgPackage
        });
        this.$assert(15, validCfg);

        this._changingEnvironment({
            changedProperties : null,
            asyncCalls : 0,
            callback : null
        });
        ariaCoreAppEnvironment.$on({
            "changingEnvironment" : this._changingEnvironment,
            scope : this
        });
    },
    $destructor : function () {
        ariaCoreAppEnvironment.$unregisterListeners(this);
        this._localDefCfg = null;
    },
    $events : {
        "environmentChanged" : {
            description : "Notifies that the application environment has changed."
        }
    },
    $prototype : {
        /**
         * Classpath of the bean which allows to validate the part of the environment managed by this class. It is meant
         * to be overriden by sub-classes.
         * @type String
         */
        _cfgPackage : null,

        /**
         * Listener for the changingEnvironment event from the aria.core.AppEnvironment. It checks if the changes in the
         * environment are managed by this class and calls _normAndApplyEnv if it is the case.
         * @param {Object} evt event object
         */
        _changingEnvironment : function (evt) {
            var changedProperties = evt.changedProperties;
            var localCfg = this._localDefCfg;
            var doUpdate = (changedProperties == null); // always do an update on reset
            if (changedProperties) {
                // look if the changed keys are part of this local environment
                for (var i = 0, l = changedProperties.length; i < l; i++) {
                    var propName = changedProperties[i];
                    if (propName in localCfg) {
                        doUpdate = true;
                        break;
                    }
                }
            }
            if (doUpdate) {
                evt.asyncCalls++;
                this._normAndApplyEnv(evt.callback);
            }
        },

        /**
         * Normalize the part of the environment managed by this class, then calls _applyEnvironment to apply it if the
         * environment is valid. Normalization is immediate. Applying the environment can be asynchronous. The callback
         * is called either synchronously or asynchronously.
         * @param {aria.core.CfgBeans:Callback} callback Will be called when the environment is applied.
         */
        _normAndApplyEnv : function (callback) {
            var validConfig = ariaCoreJsonValidator.normalize({
                json : ariaCoreAppEnvironment.applicationSettings,
                beanName : this._cfgPackage
            });
            if (validConfig) {
                this._applyEnvironment(callback);
                this.$raiseEvent("environmentChanged");
            } else {
                this.$callback(callback);
            }
        },

        /**
         * Apply the current environment.
         * @param {aria.core.CfgBeans:Callback} callback Will be called after the environment is applied.
         * @protected
         */
        _applyEnvironment : function (callback) {
            this.$callback(callback);
        },

        /**
         * Compares user defined settings, if a setting doesn't exist then the default bean definition is used.
         * @pubic
         * @param {String} name
         * @return {Object} can be a string or an object containing user defined settings or the default bean
         * definitions.
         */
        checkApplicationSettings : function (name) {
            return ariaCoreAppEnvironment.applicationSettings[name];
        }

    }
});
