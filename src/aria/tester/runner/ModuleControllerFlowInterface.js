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
var ariaTemplatesIFlowCtrl = require("../../templates/IFlowCtrl");


module.exports = Aria.interfaceDefinition({
    $classpath : 'aria.tester.runner.ModuleControllerFlowInterface',
    $extends : ariaTemplatesIFlowCtrl,
    $events : {
        "stateChange" : "raised when the current flow state changed"
    },
    $interface : {
        /**
         * List of available states
         * @type Object
         */
        STATES : {
            $type : "Object"
        },

        /**
         * Notify the flow that the display is ready Permission used to allow certain flow transitions
         */
        displayReady : {
            $type : "Function"
        },

        /**
         * Triggers the transition from one state to another Navigation will only be performed if authorized by the flow
         * @see isValidTransition
         * @param {String} state
         */
        navigate : {
            $type : "Function"
        },

        /**
         * Tells if a transition is authorized
         */
        isTransitionValid : {
            $type : "Function"
        }
    }
});
