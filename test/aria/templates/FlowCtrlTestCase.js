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
 * Test case for flow controllers.
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.FlowCtrlTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.ModuleCtrlFactory"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        // track calls of flow methods
        this.flowMethodsCalled = {};

        // this.defaultTestTimeout = 2000;
    },
    $prototype : {
        /**
         * Creates a module controller. A callback is provided to initArgs. This method will be stored in the flow and
         * called on each flow event.
         */
        testAsyncCreatingFlowCtrl : function () {
            // creates a module, does not call its init method
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "test.aria.templates.test.SampleModuleCtrl"
            }, {
                fn : this._moduleCtrlCreated,
                scope : this
            }, true);
        },

        /**
         * Callback called on each flow event
         * @param {Object} res
         */
        _flowCtrlCb : function (res) {
            this.assertTrue(res.method == "on" + res.param.method + res.param.step);
            this.assertTrue(!this.flowMethodsCalled[res.method], "this method should not have been called twice.");
            this.flowMethodsCalled[res.method] = true;
        },
        /**
         * Callback called on each flow event
         * @param {Object} res
         */
        _flowCtrlSubmitCb : function (res) {
            var methodName = aria.utils.String.capitalize(res.param.method);
            this.assertTrue(!this.flowMethodsCalled[res.method], "this method should not have been called twice.");
            this.flowMethodsCalled[res.method] = true;
        },

        /**
         * Check the content of the callback when creating a module controller
         * @protected
         * @param {Object} args
         */
        _moduleCtrlCreated : function (args) {
            this.assertTrue(!args.error, "an error happened will creating the module controller");

            var moduleCtrl = args.moduleCtrl;
            var moduleCtrlPrivate = args.moduleCtrlPrivate;

            this.assertTrue(!!moduleCtrl, "Missing module controller");
            this.assertTrue(moduleCtrl === moduleCtrlPrivate.$publicInterface(), "public and private module controllers does not match");

            // call for the init : this should trigger the flow
            moduleCtrl.init({
                "flow:testCallback" : {
                    scope : this,
                    fn : this._flowCtrlCb
                },
                delay : 50
            }, {
                fn : this._initCallback,
                scope : this
            });

            this.assertTrue(this.flowMethodsCalled.oninitCallBegin, "oninitCallBegin was not called");
            this.assertTrue(this.flowMethodsCalled.oninitCallEnd, "oninitCallEnd was not called");

            aria.core.Timer.addCallback({
                fn : this._afterModuleInitCallback,
                scope : this,
                delay : 100,
                args : moduleCtrlPrivate
            });

            moduleCtrl.submit({
                "flow:testCallback" : {
                    scope : this,
                    fn : this._flowCtrlSubmitCb
                },
                delay : 50
            }, {
                fn : this._initCallback,
                scope : this
            });

        },

        /**
         * Init callback. Set a flag to be checked later
         * @private
         */
        _initCallback : function () {
            this.initCalled = true;
        },

        /**
         * Called after the init, to check that asynchronous callback flow event has been raised\
         * @param {Object} moduleCtrl
         * @protected
         */
        _afterModuleInitCallback : function (moduleCtrlPrivate) {
            this.assertTrue(this.initCalled, "init callback was not called");
            this.assertTrue(this.flowMethodsCalled.oninitCallback, "oninitCallback was not called");
            moduleCtrlPrivate.$dispose();
            this.notifyTestEnd("testAsyncCreatingFlowCtrl");
        },

        /**
         * Test module creation with a specific flow
         */
        testAsyncSpecificFlow : function () {
            // creates a module. The special flow is given to the contructor of the sample module
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "test.aria.templates.test.SampleModuleCtrl",
                initArgs : {
                    test : this
                },
                constructorArgs : {
                    flowController : "test.aria.templates.test.SampleModuleSpecialCtrlFlow"
                }
            }, {
                fn : this._moduleCtrlSpecialFlowCreated,
                scope : this
            });
        },

        /**
         * Check that the special flag as been set to true on init
         * @protected
         * @param {Object} args
         */
        _moduleCtrlSpecialFlowCreated : function (args) {
            this.assertTrue(this.special, "Special flow is not used");
            args.moduleCtrlPrivate.$dispose();
            this.notifyTestEnd("testAsyncSpecificFlow");
        }

    }
});
