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
 * Main module for external tools such as template highlighting
 * @class aria.tools.ToolsModule
 */
Aria.classDefinition({
    $classpath : 'aria.tools.ToolsModule',
    $extends : 'aria.templates.ModuleCtrl',
    $implements : ['aria.tools.IToolsModule'],
    $constructor : function () {

        /**
         * Tools submodule descriptions to be loaded, and associated view templates.
         * @type Array
         */
        this.subModulesList = [{
                    refpath : "inspector",
                    classpath : "aria.tools.inspector.InspectorModule",
                    display : "aria.tools.inspector.InspectorDisplay"
                }, {
                    refpath : "logger",
                    classpath : "aria.tools.logger.LoggerModule",
                    display : "aria.tools.logger.LoggerDisplay"
                }];

        /**
         * Bridge to the main window
         * @type aria.utils.Bridge
         */
        this.bridge = null;

        // call parent constructor
        this.$ModuleCtrl.constructor.call(this);

    },
    $prototype : {
        $publicInterfaceName : "aria.tools.IToolsModule",

        /**
         * Module initialization method
         * @param {Object} initArgs init argument expected to contain a single property "bridge" giving a reference to
         * the main window Bridge object.
         * @param {aria.core.JsObject.Callback} cb callback called when the initialization is finished
         */
        init : function (args, cb) {

            this.bridge = args.bridge;

            // add bridge to submodules init parameters
            for (var i = 0, l = this.subModulesList.length; i < l; i++) {
                if (!this.subModulesList[i].initArgs) {
                    this.subModulesList[i].initArgs = {};
                    this.subModulesList[i].initArgs.bridge = this.bridge;
                }
            }

            // load subnodules
            this.loadSubModules(this.subModulesList, {
                fn : this.onSubModulesReady,
                scope : this
            });
            this.$ModuleCtrl.init.call(this, args, cb);
        },

        /**
         * Called when sub-modules are ready, this method raises the modulesReady event.
         */
        onSubModulesReady : function () {
            this.$raiseEvent("modulesReady");
        },

        /**
         * OVERRIDE Internal callback called anytime a sub-module event is triggered
         * @param {Object} evt the event object (depends on the submodule event)
         * @param {Object} args some helpful info - e.g. args.smRef (sub-module reference)
         */
        onSubModuleEvent : function (evt, args) {
            // debugger;
        }
    }
});
