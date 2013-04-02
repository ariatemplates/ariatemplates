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
 * EnableMethodEventInterceptorTest Controller test class
 */
Aria.classDefinition({
    $classpath : 'test.aria.templates.EnableMethodEventInterceptorTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ['aria.templates.ModuleCtrlFactory'],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.defaultTestTimeout = 2000;
    },
    $prototype : {

        testAsyncDefaultInterceptor : function () {
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "test.aria.templates.test.SampleModuleCtrl"
            }, {
                fn : this._testAsyncDefaultInterceptorCb,
                scope : this
            });
        },

        _testAsyncDefaultInterceptorCb : function (res) {
            try {
                var mc = res.moduleCtrlPrivate;
                this.assertTrue(mc.__$interceptors != null);
                this.assertErrorInLogs(mc.DEPRECATED_METHOD_EVENTS);
                mc.incrementCount();
                aria.core.Timer.addCallback({
                    fn : this._endTestAsyncEnableInterceptor,
                    scope : this,
                    args : {
                        "mc" : mc,
                        "testName" : "testAsyncDefaultInterceptor"
                    },
                    delay : 16
                });
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },

        testAsyncDisableInterceptor : function () {
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "test.aria.templates.test.DisableMethodEventsModuleCtrl"
            }, {
                fn : this._testAsyncDisableInterceptorCb,
                scope : this
            });
        },

        _testAsyncDisableInterceptorCb : function (res) {
            try {
                var mc = res.moduleCtrlPrivate;
                this.assertTrue(!mc.__$interceptors);
                mc.testMethod();
                aria.core.Timer.addCallback({
                    fn : this._endTestAsyncDisableInterceptor,
                    scope : this,
                    args : {
                        "mc" : mc
                    },
                    delay : 16
                });
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },
        _endTestAsyncDisableInterceptor : function (args) {
            this.assertFalse(args.mc.unexpectedMethodCallBegin);
            this.assertFalse(args.mc.unexpectedMethodCallEnd);
            args.mc.$dispose();
            this.notifyTestEnd("testAsyncDisableInterceptor");
        },

        testAsyncEnableInterceptor : function () {
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "test.aria.templates.test.EnableMethodEventsModuleCtrl"
            }, {
                fn : this._testAsyncEnableInterceptorCb,
                scope : this
            });
        },

        _testAsyncEnableInterceptorCb : function (res) {
            try {
                var mc = res.moduleCtrlPrivate;
                this.assertTrue(mc.__$interceptors != null);
                mc.testMethod();
                aria.core.Timer.addCallback({
                    fn : this._endTestAsyncEnableInterceptor,
                    scope : this,
                    args : {
                        "mc" : mc,
                        "testName" : "testAsyncEnableInterceptor"
                    },
                    delay : 16
                });
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },
        _endTestAsyncEnableInterceptor : function (args) {
            this.assertTrue(args.mc.eventCallBeginRaised);
            this.assertTrue(args.mc.eventCallEndRaised);
            args.mc.$dispose();
            this.notifyTestEnd(args.testName);
        }

    }
});
