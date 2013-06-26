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
 * Simple flow controller for test.
 */
Aria.classDefinition({
    $classpath : 'test.aria.templates.test.SampleModuleCtrlFlow',
    $extends : 'aria.templates.FlowCtrl',
    $constructor : function () {
        this.$FlowCtrl.constructor.call(this);
    },
    $destructor : function () {
        this._testCb = null;
        this.$FlowCtrl.$destructor.call(this);
    },
    $prototype : {
        oninitCallBegin : function (param) {
            var initArgs = param.args[0];
            if (initArgs) {
                this._testCb = initArgs["flow:testCallback"];
            }
            this.$callback(this._testCb, {
                method : "oninitCallBegin",
                param : param
            });
        },

        oninitCallback : function (param) {
            this.$FlowCtrl.oninitCallback.call(this, param); // call the parent
            this.$callback(this._testCb, {
                method : "oninitCallback",
                param : param
            });
        },

        oninitCallEnd : function (param) {
            this.$callback(this._testCb, {
                method : "oninitCallEnd",
                param : param
            });
        },

        onincrementCountCallBegin : function (param) {
            this.$callback(this._testCb, {
                method : "onincrementCountCallBegin",
                param : param
            });
        },

        onincrementCountCallEnd : function (param) {
            this.$callback(this._testCb, {
                method : "onincrementCountCallEnd",
                param : param
            });
        },

        onincrementCountCallback : function (param) {
            this.$callback(this._testCb, {
                method : "onincrementCountCallback",
                param : param
            });
        },
        onSubmitCallback : function (param) {
            var initArgs = param.args[0];
            if (initArgs) {
                this._testCb = initArgs["flow:testCallback"];
            }
            this.$callback(this._testCb, {
                method : "onSubmitCallback",
                param : param
            });
        }
    }
});
