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

Aria.classDefinition({
    $classpath : 'aria.tester.runner.ModuleControllerFlow',
    $extends : 'aria.tester.runner.BaseFlow',
    $statics : {
        STATES : {
            INIT : "init",
            READY : "ready",
            FAILURE : "failure",
            OPTIONS: "options",
            ONGOING : "ongoing",
            PAUSED : "paused",
            PAUSING : "pausing",
            FINISHED : "finished",
            REPORT : "report"
        }
    },
    $implements: ['aria.tester.runner.ModuleControllerFlowInterface'],
    $constructor:function() {
        this.$BaseFlow.constructor.call(this);
        this.flowData={
            currentState:this.STATES.INIT,
            /**
             * Declare all the valid transitions for this flow
             * init --> ready --> ongoing --> finished
             * init --> failure
             * ongoing --> failure
             * ongoing --> pausing --> paused --> ongoing
             */
            validTransitions : [
                [this.STATES.INIT, this.STATES.READY],
                [this.STATES.INIT, this.STATES.FAILURE, true],
                [this.STATES.READY, this.STATES.ONGOING],
                [this.STATES.ONGOING, this.STATES.FAILURE],
                [this.STATES.ONGOING, this.STATES.PAUSING],
                [this.STATES.PAUSING, this.STATES.PAUSED],
                [this.STATES.PAUSED, this.STATES.ONGOING],
                [this.STATES.ONGOING, this.STATES.FINISHED, true],
                [this.STATES.FINISHED, this.STATES.INIT],
                [this.STATES.FINISHED, this.STATES.REPORT, true],
                [this.STATES.REPORT, this.STATES.INIT]
            ]
        };
    },
    $prototype: {
        $publicInterfaceName: 'aria.tester.runner.ModuleControllerFlowInterface',

        // Intercepting method called at the end of the module controller initialization:
        oninitCallback : function (param) {
            this.$BaseFlow.oninitCallback.call(this, param); // call the method of the parent which sets this.data

            // Go to failure if the module raised an error flag
            if (!this.data.campaign.loadSuccessful) {
                this.navigate(this.STATES.FAILURE);
            } else {
                this.moduleCtrl.preloadSuites();
            }
        },

        /**
         * The flow between init and ready is a bit complex because we have to wait for two
         * parallel activities to be finished : view has to be ready, tests have to be preloaded
         * The Main template script will notify the flow when the view is ready.
         * The Module controller will do the same (through interceptors) for the preload.
         * We have to synchronize both activities for which we use two booleans : _isDisplayReady and _isPreloadFinished
         * Later on we could improve a bit the flow in order to manage this kind of complex transitions
         */
        displayReady : function () {
            if (!this._isDisplayReady) {
                this._isDisplayReady = true;
                if (this._isPreloadFinished) {
                    this.navigate(this.STATES.READY);
                }
            }
        },

        /**
         * @see displayReady
         */
        onpreloadSuitesCallback : function () {
            this._isPreloadFinished = true;
            if (this._isDisplayReady) {
                this.navigate(this.STATES.READY);
            }
        },

        /**
         * Triggered when the campaign is launched
         * The application switches to ongoing mode. Most of the UI is disabled
         */
        onstartCampaignCallBegin : function () {
            this.navigate(this.STATES.ONGOING)
        },

        /**
         * Triggered when the campaign is finished
         */
        onstartCampaignCallback : function () {
            this.navigate(this.STATES.FINISHED);
        },

        /**
         * Callback triggered when
         */
        onreloadCallback : function () {
            this.navigate(this.STATES.INIT);
            this.moduleCtrl.init();
        },

        /**
         * @see aria.tester.runner.BaseFlow
         * @param {String} state
         */
        onStateChange : function (state) {
            if (state == this.STATES.READY) {
                this._onReadyState();
            }
        },

        /**
         * @private
         */
        _onReadyState : function () {
            if (this.data.campaign.autorun === true) {
                this.moduleCtrl.startCampaign();
            }
        }
    }
});
