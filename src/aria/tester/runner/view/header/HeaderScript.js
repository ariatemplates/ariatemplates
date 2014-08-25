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
var Aria = require("../../../../Aria");
var ariaUtilsArray = require("../../../../utils/Array");


module.exports = Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.header.HeaderScript',
    $prototype : {
        /**
         * Callback triggered when the user clicks on the header button
         */
        _onStartTestsButtonClick : function () {
            var state = this.data.flow.currentState;
            var STATES = this.flowCtrl.STATES;
            if (state == STATES.READY) {
                this.moduleCtrl.startCampaign();
            } else if (state == STATES.ONGOING) {
                this.flowCtrl.navigate(STATES.PAUSING);
            } else if (state == STATES.PAUSED) {
                this.flowCtrl.navigate(STATES.RESUMING);
            } else if (state == STATES.FINISHED) {
                this.reload();
            }
        },

        _onErrorCountClick : function (evt, args) {
            this.flowCtrl.navigate(this.flowCtrl.STATES.REPORT);
        },

        isButtonDisabled : function () {
            var state = this.data.flow.currentState;
            return this.__isButtonDisabledForState(state);
        },

        __isButtonDisabledForState : function (state) {
            var disabledStates = [];
            disabledStates.push(this.flowCtrl.STATES.INIT);
            disabledStates.push(this.flowCtrl.STATES.FAILURE);
            disabledStates.push(this.flowCtrl.STATES.PAUSING);
            disabledStates.push(this.flowCtrl.STATES.RESUMING);
            disabledStates.push(this.flowCtrl.STATES.OPTIONS);

            if (ariaUtilsArray.indexOf(disabledStates, state) != -1) {
                return true;
            }
            return false;
        },

        /**
         * For the current flow state, retrieve the label to use for the action button
         * @return {String} The label to use for the action button
         */
        getButtonLabel : function () {
            var state = this.data.flow.currentState;
            return this.__getButtonLabelForState(state);
        },

        /**
         * Given a state, retrieve the label to use for the action button
         * @private
         * @return {String} The label to use for the action button
         */
        __getButtonLabelForState : function (state) {
            if (state == this.flowCtrl.STATES.READY || state == this.flowCtrl.STATES.OPTIONS) {
                return "Run";
            } else if (state == this.flowCtrl.STATES.INIT || state == this.flowCtrl.STATES.FAILURE
                    || state == this.flowCtrl.STATES.RESUMING) {
                return "Loading";
            } else if (state == this.flowCtrl.STATES.FINISHED || state == this.flowCtrl.STATES.REPORT) {
                return "Reload";
            } else if (state == this.flowCtrl.STATES.ONGOING) {
                return "Pause";
            } else if (state == this.flowCtrl.STATES.PAUSING) {
                return "Pausing";
            } else if (state == this.flowCtrl.STATES.PAUSED) {
                return "Resume";
            } else {
                return "#" + state + "#";
            }
        },

        /**
         *
         */
        reload : function () {
            this.moduleCtrl.reload();
        }
    }
});
