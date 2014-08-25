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
var ariaTemplatesFlowCtrl = require("../../templates/FlowCtrl");
var ariaUtilsJson = require("../../utils/Json");


module.exports = Aria.classDefinition({
    $classpath : 'aria.tester.runner.BaseFlow',
    $extends : ariaTemplatesFlowCtrl,
    $constructor : function () {
        this.$FlowCtrl.constructor.call(this);
    },
    $prototype : {
        // Intercepting method called at the end of the module controller initialization:
        oninitCallback : function (param) {
            this.$FlowCtrl.oninitCallback.call(this, param); // call the method of the parent which sets this.data
            // the flow data is stored in the data model, to be accessible by templates:
            this.data.flow = this.flowData;
        },

        // navigate is published in the Flow interface
        navigate : function (targetState) {
            var flowData = this.data.flow;
            var currentState = flowData.currentState;

            if (!this.isTransitionValid(currentState, targetState)) {
                return this.$logError("FLOW_INVALID_TRANSITION", [targetState]);
            }

            var json = ariaUtilsJson;

            // change current state to new state
            json.setValue(flowData, "currentState", targetState);

            // Call the internal callback on valid state transitions
            this.onStateChange(targetState);

            // raise event to notify templates that current state changed
            this.$raiseEvent("stateChange");
        },

        /**
         * Will be called after each valid transition change To be overrided by children classes
         * @param {String} state
         */
        onStateChange : function (state) {},

        /**
         * Tells if a transition is valid. Note: this information is also available in the data model
         * @param {String} targetState the state targetted by the transition
         * @return {Boolean} true if the transition is authorized
         */
        isTransitionValid : function (currentState, targetState) {
            var transitionMap = this._getTransitionMap();

            return (transitionMap[currentState] && transitionMap[currentState][targetState]);
        },

        /**
         * @return {Object}
         */
        _getTransitionMap : function () {
            var transitionMap = {};
            var addValidTransition = function (startState, endState) {
                if (!transitionMap[startState]) {
                    transitionMap[startState] = {};
                }
                transitionMap[startState][endState] = true;
            };

            var flowData = this.flowData;
            var validTransitions = flowData.validTransitions;
            for (var i = 0; i < validTransitions.length; i++) {
                var validTransition = validTransitions[i];
                addValidTransition(validTransition[0], validTransition[1]);

                // reverse transition
                if (validTransition[2]) {
                    addValidTransition(validTransition[1], validTransition[0]);
                }
            }
            return transitionMap;
        }
    }
});
