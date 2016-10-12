/*
 * Copyright 2013 Amadeus s.a.s.
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
 * This is a test of the module reload feature for a custom sub-module.
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.moduleReload.ModuleReload2TestCase",
    $extends : "test.aria.modules.moduleReload.ModuleReload1Base",
    $dependencies : ["aria.core.environment.Customizations"],
    $prototype : {

        setUp : function () {
            this.$ModuleReload1Base.setUp.call(this);
            this.normalChildModuleLoaded = false;
            // set a custom module:
            aria.core.environment.Customizations.setCustomizations({
                modules : {
                    "test.aria.modules.moduleReload.ParentModule" : [{
                                classpath : "test.aria.modules.moduleReload.ChildModule",
                                initArgs : {
                                    custom : true,
                                    testCase : this
                                },
                                refpath : "custom:customSubModule"
                            }]
                }
            });
        },

        _getSubTplWidget : function () {
            return this.getWidgetInstance("customSubTemplate");
        },

        _checkRaiseEvent : function (moduleCtrlPublic) {
            // check raising the event. This makes sure a custom sub-module is not reloaded as a normal sub-module.
            this.expectingTestEvent = null;
            moduleCtrlPublic.raiseTestEvent(this.expectingTestEvent);
        },

        /**
         * Called from the child module controller init method.
         * @param {Object} args
         * @param {aria.core.JsObject.Callback} cb
         */
        childModuleCtrlInit : function (args, cb) {
            if (args.custom) {
                // only take into account the custom module
                this.$ModuleReload1Base.childModuleCtrlInit.call(this, args, cb);
            } else {
                // check that the normal child module is not reloaded
                this.assertFalse(this.normalChildModuleLoaded);
                this.normalChildModuleLoaded = true;
                this.$callback(cb);
            }
        }
    }
});
