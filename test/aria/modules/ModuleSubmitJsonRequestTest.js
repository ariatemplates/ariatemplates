/*
 * Copyright 2014 Amadeus s.a.s.
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
 * Tests that the different options passed to ModuleCtrl.submitJsonRequest are correctly used in the request and have
 * the desired effects.
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.ModuleSubmitJsonRequestTest",
    $extends : "aria.jsunit.ModuleCtrlTestCase",
    $dependencies : ["aria.core.IOFilter", "aria.core.IOFiltersMgr", "aria.utils.Function"],
    $prototype : {
        $controller : "test.aria.modules.test.SampleModuleCtrl",

        setUp : function () {
            this.filter = new aria.core.IOFilter();
            this.filter.onRequest = aria.utils.Function.bind(this.filterOnRequest, this);
            aria.core.IOFiltersMgr.addFilter(this.filter);
        },

        filterOnRequest : function (req) {
            this.assertFalse(this.reqSent);
            this.reqSent = true;
            this.onRequest(req);
            this.filter.redirectToFile(req, "test/aria/modules/test/SampleResponse.json");
        },

        tearDown : function () {
            if (this.filter) {
                aria.core.IOFiltersMgr.removeFilter(this.filter);
                this.filter.onRequest = null;
                this.filter = null;
            }
            this.onRequest = null;
        },

        callSubmitJsonRequest : function (action, data, options, args) {
            var moduleCtrl = this.$moduleCtrlPrivate;
            this.onRequest = args.onRequest;
            this.reqSent = false;
            moduleCtrl.submitJsonRequest(action, data, {
                scope : this,
                fn : this._onResponse,
                args : args
            }, options);
        },

        _onResponse : function (res, args) {
            this.assertTrue(this.reqSent);
            if (args.expectResponseSuccess) {
                this.assertEquals(res.response.hello, "world");
            }
            if (args.onResponse) {
                args.onResponse.call(this, res);
            }
            this.notifyTestEnd();
        },

        testAsyncShortTimeout : function () {
            this.callSubmitJsonRequest("timeout", {}, {
                timeout : 1
            }, {
                onRequest : function (req) {
                    this.assertEquals(req.url, "/test?moduleName=test/aria/modules/test&actionName=timeout&sessionId=");
                    this.assertEquals(req.timeout, 1);
                },
                onResponse : function (res) {
                    this.assertTrue(res.error);
                }
            });
        },

        testAsyncLongTimeout : function () {
            this.callSubmitJsonRequest("timeout", {}, {
                timeout : 10000
            }, {
                onRequest : function (req) {
                    this.assertEquals(req.url, "/test?moduleName=test/aria/modules/test&actionName=timeout&sessionId=");
                    this.assertEquals(req.timeout, 10000);
                },
                expectResponseSuccess : true
            });
        },

        testAsyncHeader : function () {
            var myCustomValue = "MyValue-" + Math.random();
            this.callSubmitJsonRequest("header", {}, {
                headers : {
                    "X-My-Custom-Header" : myCustomValue
                }
            }, {
                onRequest : function (req) {
                    this.assertEquals(req.url, "/test?moduleName=test/aria/modules/test&actionName=header&sessionId=");
                    // coming from submitJsonRequest:
                    this.assertEquals(req.headers["X-My-Custom-Header"], myCustomValue);
                    // coming from the request handler:
                    this.assertEquals(req.headers["Content-Type"], "application/json");
                },
                expectResponseSuccess : true
            });
        }
    }
});
