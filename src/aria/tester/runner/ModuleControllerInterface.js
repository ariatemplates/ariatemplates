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
var ariaTemplatesIModuleCtrl = require("../../templates/IModuleCtrl");


/**
 * Public API of the runner module
 * @class aria.tester.runner.ModuleControllerInterface
 */
module.exports = Aria.interfaceDefinition({
    $classpath : 'aria.tester.runner.ModuleControllerInterface',
    $extends : ariaTemplatesIModuleCtrl,
    $events : {
        "initSuccessful" : "initSuccessful",
        "preloadEnd" : "preloadEnd",
        "testEnd" : "testEnd",
        "testStateChange" : "testStateChange"
    },
    $interface : {
        "startCampaign" : {
            $type : "Function",
            $callbackParam : 0
        },

        "preloadSuites" : {
            $type : "Function",
            $callbackParam : 0
        },

        "updateTests" : {
            $type : "Function",
            $callbackParam : 0
        },

        "reload" : {
            $type : "Function",
            $callbackParam : 0
        },

        "switchView" : {
            $type : "Function",
            $callbackParam : 0
        },

        "pauseCampaign" : {
            $type : "Function",
            $callbackParam : 0
        },

        "resumeCampaign" : {
            $type : "Function",
            $callbackParam : 0
        }
    }
});
