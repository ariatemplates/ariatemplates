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
 * Test for the timeouts in `sendJsonRequest` and `submitJsonRequest` methods of RequestMgr class. The tests here only
 * use `sendJsonRequest`, but the interface of `submitJsonRequest` is the same and under the hood (indirectly) it calls
 * the former method.
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.RequestMgrTimeoutTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.modules.RequestMgr", "aria.core.IOFiltersMgr",
            "aria.modules.requestHandler.JSONRequestHandler"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.filterPath = "test.aria.modules.test.StaticResponseFilter";
        this.defaultTestTimeout = 1000;
    },
    $prototype : {

        /**
         * Save parameters of the Request Manager before each test to restore them later.
         */
        setUp : function () {
            this._saved = {
                filters : aria.core.IOFiltersMgr._filters,
                handler : aria.modules.RequestMgr._requestHandler
            };

            aria.modules.RequestMgr._requestHandler = new aria.modules.requestHandler.JSONRequestHandler();

            aria.core.IOFiltersMgr._filters = null;
            aria.core.IOFiltersMgr.addFilter({
                classpath : this.filterPath
            });
        },

        /**
         * Restore saved parameters of the Request Manager after each test.
         */
        tearDown : function () {
            aria.core.IOFiltersMgr.removeFilter(this.filterPath);
            aria.core.IOFiltersMgr._filters = this._saved.filters;

            aria.modules.RequestMgr._requestHandler.$dispose();
            aria.modules.RequestMgr._requestHandler = this._saved.handler;
        },

        /**
         * Set very low timeout; check that the callback is called with error=true
         */
        testAsyncHaveTimeoutLegacy : function () {
            aria.modules.RequestMgr.sendJsonRequest({
                moduleName : "xxx",
                actionName : "yyy",
                timeout : 1
            }, {
                reqData : "test"
            }, {
                fn : this._haveTimeoutOkCbWithError,
                scope : this
            });
        },

        _haveTimeoutOkCbWithError : function (resp) {
            this.assertEquals(resp.error, true, "This request should have timed out.");
            this.notifyTestEnd("testAsyncHaveTimeoutLegacy");
        },

        /**
         * Set high enough timeout and check that the success callback is called without errors.
         */
        testAsyncNoTimeout : function () {
            aria.modules.RequestMgr.sendJsonRequest({
                moduleName : "xxx",
                actionName : "yyy",
                timeout : 1000
            }, {
                reqData : "test"
            }, {
                fn : this._noTimeoutOkCb,
                scope : this,
                onerror : this._noTimeoutErrorCb
            });
        },

        _noTimeoutOkCb : function (resp) {
            this.assertTrue(resp.error == null);
            this.assertTrue(resp.response != null);
            this.assertEquals(resp.response.hello, "world");

            this.notifyTestEnd("testAsyncHaveTimeoutWithErrorCb");
        },

        _noTimeoutErrorCb : function (resp) {
            this.fail("This function should NOT have been called");
        }
    }
});
