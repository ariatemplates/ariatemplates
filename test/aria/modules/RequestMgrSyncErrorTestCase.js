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
 * Test for the RequestMgr class
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.RequestMgrSyncErrorTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.modules.RequestMgr", "test.aria.modules.IoFilter",
            "aria.modules.requestHandler.environment.RequestHandler"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.defaultTestTimeout = 5000;
        this._flagOne = false;
    },
    $prototype : {

        testAsyncError : function () {
            this._oldRequestHandlerCfg = aria.modules.requestHandler.environment.RequestHandler.getRequestHandlerCfg();
            aria.core.AppEnvironment.setEnvironment({
                requestHandler : {
                    implementation : "test.aria.modules.TestRequestHandler"
                }
            });
            this._addFilter(false);
            aria.modules.RequestMgr.submitJsonRequest({
                moduleName : "xxx",
                actionName : "yyy",
                // set async flag
                async : false
            }, {
                reqData : 123
            }, {
                fn : this._callback,
                scope : this
            });
            this.assertErrorInLogs(aria.modules.RequestMgr.DEPENDENCIES_BROKE_SYNC);
            this._flagOne = true;
        },

        _callback : function () {
            this._removeFilter();
            aria.core.AppEnvironment.setEnvironment({
                requestHandler : this._oldRequestHandlerCfg
            });
            this.assertTrue(this._flagOne, "Request synchronously done: error expected");
            this.notifyTestEnd("testAsyncError");
        },

        _addFilter : function (switchSyncAsync) {
            this._filterInstance = new test.aria.modules.IoFilter("xxx/yyy", switchSyncAsync);
            aria.core.IOFiltersMgr.addFilter(this._filterInstance);
        },

        _removeFilter : function () {
            aria.core.IOFiltersMgr.removeFilter(this._filterInstance);
        }

    }
});
