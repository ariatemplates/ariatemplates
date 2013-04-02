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
 * Sample class used to test Module Controller features
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.test.SampleModuleCtrl",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.templates.test.ISampleModuleCtrl"],
    $constructor : function (args) {

        this.$ModuleCtrl.constructor.call(this);

        // sample data model
        this._data = {
            count : 0, // incremented when the incrementCount method is called
            instanceName : ""
        };

        if (args && args.flowController) {
            this.$hasFlowCtrl = args.flowController;
        }
        this.$on({
            "methodCallBegin" : this.onMethodCallBegin,
            scope : this
        });
        this.$on({
            "methodCallEnd" : this.onMethodCallEnd,
            scope : this
        });
        this.eventCallBeginRaised = false;
        this.eventCallEndRaised = false;
    },
    $destructor : function () {
        this.$publicInterface().SampleModuleCtrlDisposed = true;
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.templates.test.ISampleModuleCtrl",
        $hasFlowCtrl : true,

        /**
         * Module initialization method - shall be overridden by sub-classes Note: this method is asynchronous (cf.
         * callback argument)
         * @param {Object} args init arguments (contains a cb entry for the callback)
         */
        init : function (args, cb) {
            if (args) {
                this._data.instanceName = args.instanceName;
                this.$callback(args.callbackInInit, this);
            }
            if (!args || !args.delay) {
                this.$callback(cb, true, this.INIT_CALLBACK_ERROR);
            } else {
                aria.core.Timer.addCallback({
                    fn : function () {
                        this.$callback(cb, true, this.INIT_CALLBACK_ERROR);
                    },
                    scope : this,
                    delay : args.delay
                });
            }
        },

        /**
         * Sample method published in the Module Public Interface (MPI) As any MPI it accepts a single JSON argument to
         * ease backward-compatibility
         */
        incrementCount : function (args, cb) {
            if (args && args.by) {
                this._data.count += args.by;
            } else {
                this._data.count++;
            }
            this.$callback(cb);
        },

        /**
         * Sample method not published in the MPI
         */
        _decrementCount : function () {
            this._data.count--;
        },

        /**
         * Callback for the submitJsonRequest method used in ModuleCtrlTest.
         */
        _submitJsonRequestCallback : function (req, args) {
            this.$callback(this.submitJsonRequestExternalCallback, {
                req : req,
                args : args
            });
        },

        /**
         * Returns module session
         * @return {Object}
         */
        getSession : function () {
            return this._session;
        },

        onSubModuleEvent : function (evt, args) {
            if (evt.name == 'testEvent') {
                // just forward
                this.raiseTestEvent();
            }
        },

        raiseTestEvent : function () {
            this.$raiseEvent("testEvent");
        },

        /**
         * A sample method to test capitalize
         */
        submit : function (args, cb) {
            this.$callback(cb);
        },
        onMethodCallBegin : function () {
            this.eventCallBeginRaised = true;
        },
        onMethodCallEnd : function () {
            this.eventCallEndRaised = true;
        },

        eventCallBack : function (a, b, c, d, e) {
            var arr = [a, b, c, d, e];
            return arr;
        }
    }
});
