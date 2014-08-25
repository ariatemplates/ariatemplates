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


module.exports = Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.main.MainScript',
    $prototype : {
        navigate : function (transition) {
            // TODO: offer the possibility to support callbacks without res arg
            this.flowCtrl.navigate(transition);
        },

        $displayReady : function () {
            this.__connectKeyboardEvents();
            this.flowCtrl.displayReady();
        },

        /**
         * Connect the various keymap objects used by the test runner
         */
        __connectKeyboardEvents : function () {
            var keys = [["F", this.__onSwitchKeyPressed], ["R", this.__onRunKeyPressed],
                    ["E", this.__onEndTestReportKeyPressed]];

            for (var i = 0, l = keys.length; i < l; i++) {
                aria.templates.NavigationManager.addGlobalKeyMap({
                    key : keys[i][0],
                    callback : {
                        fn : keys[i][1],
                        scope : this
                    }
                });
            }
        },

        /**
         * Callback triggered when the user presses the dedicated switch view key
         * @private
         */
        __onSwitchKeyPressed : function () {
            var state = this.data.flow.currentState;
            if (state != this.flowCtrl.STATES.FAILURE) {
                this.moduleCtrl.switchView();
            }
            return true;
        },

        /**
         * Callback triggered when the user presses the dedicated options key
         * @private
         */
        __onOptionsKeyPressed : function () {
            var state = this.data.flow.currentState;
            if (state == this.flowCtrl.STATES.OPTIONS) {
                this.flowCtrl.navigate(this.flowCtrl.STATES.READY);
            } else if (state == this.flowCtrl.STATES.READY) {
                this.flowCtrl.navigate(this.flowCtrl.STATES.OPTIONS);
            }
            return true;
        },

        /**
         * Callback triggered when the user presses the dedicated report key
         * @private
         */
        __onRunKeyPressed : function () {
            var state = this.data.flow.currentState;
            if (state == this.flowCtrl.STATES.READY) {
                this.moduleCtrl.startCampaign();
            } else if (state == this.flowCtrl.STATES.FINISHED || state == this.flowCtrl.STATES.REPORT) {
                this.moduleCtrl.reload();
            }
            return true;
        },

        /**
         * Callback triggered when the user presses the dedicated report key
         * @private
         */
        __onEndTestReportKeyPressed : function () {
            var state = this.data.flow.currentState;
            if (state == this.flowCtrl.STATES.FINISHED) {
                this.flowCtrl.navigate(this.flowCtrl.STATES.REPORT);
            } else if (state == this.flowCtrl.STATES.REPORT) {
                this.flowCtrl.navigate(this.flowCtrl.STATES.FINISHED);
            }
            return true;
        }
    }
});
