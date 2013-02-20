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
 * Store for application variables.
 * @singleton
 */
Aria.classDefinition({
    $classpath : "aria.core.AppEnvironment",
    $dependencies : ["aria.utils.Object"],
    $singleton : true,
    $events : {
        "changingEnvironment" : {
            description : "Notifies that the environment has changed and should be normalized (immediately) and applied (perhaps asynchronously) by listeners.",
            properties : {
                changedProperties : "If null, it means the environment is reset. Otherwise, it contains the list of properties which changed in the environment. This allows listeners to react only when needed.",
                asyncCalls : "This number should be incremented by listeners which need to do something asynchronous to apply the environment.",
                callback : "This is is the callback to be called by listeners which need to do something asynchronous to apply the environment (and have incremented asyncCalls)."
            }
        },
        "environmentChanged" : {
            description : "Notifies that the environment has changed. This event is raised just after changingEnvironment, so that the environment has been normalized by all loaded specific environment classes. Note that asynchronous operations to apply the environment are not done yet when this event is raised.",
            properties : {
                changedProperties : "If null, it means the environment is reset. Otherwise, it contains the list of properties which changed in the environment. This allows listeners to react only when needed."
            }
        }
    },
    $prototype : {
        /**
         * Stores the application settings.
         * @type Object
         */
        applicationSettings : {},

        /**
         * Stores the application variables. Please refer to documentation for parameter types.
         * @public
         * @param {Object} cfg Configuration object
         * @param {aria.core.JsObject.Callback} cb Method to be called after the setting is done
         * @param {Boolean} update flag to update existing application settings, when false will overwrite existing with
         * new settings.
         */
        setEnvironment : function (cfg, callback, update) {
            update = !!update;
            var keys = aria.utils.Object.keys(cfg);
            if (update) {
                aria.utils.Json.inject(cfg, this.applicationSettings, true);
            } else {
                if (keys.length === 0) {
                    // reset stored application settings
                    this.applicationSettings = {};
                    keys = null;
                } else {
                    for (var i = 0; i < keys.length; i++) {
                        var keyName = keys[i];
                        this.applicationSettings[keyName] = cfg[keyName];
                    }
                }
            }
            var evt = {
                name : "changingEnvironment",
                changedProperties : keys,
                asyncCalls : 1
            };
            evt.callback = {
                fn : function () {
                    evt.asyncCalls--;
                    if (evt.asyncCalls <= 0) {
                        evt.callback.fn = null;
                        evt = null;
                        keys = null;
                        this.$callback(callback);
                    }
                },
                scope : this
            };
            this.$raiseEvent(evt);
            this.$raiseEvent({
                name : "environmentChanged",
                changedProperties : keys
            });
            this.$callback(evt.callback);
        },

        /**
         * Added for backward compatibility, this should be handled by the setEnvironment method.
         * @param {Object} cfg
         * @param {Function} callback
         */
        updateEnvironment : function (cfg, callback) {
            this.setEnvironment(cfg, callback, true);
        }
    }
});
