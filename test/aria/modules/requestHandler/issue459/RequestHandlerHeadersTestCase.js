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
 * Test for the RequestHandler Request Headers
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.requestHandler.issue459.RequestHandlerHeadersTestCase",
    $extends : "aria.jsunit.TestCase",
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        this.listenersCalled = 0;
        this.requestListener = {
            request : this._testRequestHeaders,
            scope : this
        };
        aria.core.IO.$on(this.requestListener);
    },
    $destructor : function () {
        aria.core.IO.$removeListeners(this.requestListener);

        this.$TestCase.$destructor.call(this);
    },
    $dependencies : ["aria.modules.RequestMgr", "aria.modules.requestHandler.RequestHandler",
            "aria.modules.requestHandler.JSONRequestHandler",
            "test.aria.modules.requestHandler.issue459.MockRequestHandler", "aria.templates.ModuleCtrlFactory"],
    $prototype : {
        testRequestHandlerHeaders : function () {
            var handler = new aria.modules.requestHandler.RequestHandler();
            var requestHeaders = handler.getRequestHeaders();
            this.assertEquals(requestHeaders["Content-Type"], "application/x-www-form-urlencoded; charset=UTF-8", "Request Headers are not set properly");
            handler.$dispose();
        },

        testJSONRequestHandlerHeaders : function () {
            var handler = new aria.modules.requestHandler.JSONRequestHandler();
            var requestHeaders = handler.getRequestHeaders();
            this.assertEquals(requestHeaders["Content-Type"], "application/json", "Request Headers are not set properly");
            handler.$dispose();
        },

        testMockRequestHandlerHeaders : function () {
            var handler = new test.aria.modules.requestHandler.issue459.MockRequestHandler();
            var requestHeaders = handler.getRequestHeaders();
            this.assertEquals(requestHeaders["Content-Type"], "mockHeaders", "Request Headers are not set properly");
            handler.$dispose();
        },

        /**
         * This test relies on events raised by aria.core.IO
         */
        testAsyncRequestHeaders : function () {
            var handler = new aria.modules.requestHandler.JSONRequestHandler();
            var reqObject = {
                moduleName : "test",
                actionName : "testFailure",
                requestHandler : handler
            };

            aria.modules.RequestMgr.submitJsonRequest(reqObject, {
                name : "requestheaders  "
            }, {
                fn : this.afterFailureRequestJSON,
                scope : this,
                args : {
                    handler : handler
                }
            });
        },

        afterFailureRequestJSON : function (response, args) {
            var handler = args.handler;
            handler.$dispose();
            this.assertEquals(this.listenersCalled, 1, "Expecting a request from IO, got %1");
            this.listenersCalled = 0;

            this.notifyTestEnd("testAsyncRequestHeaders");
        },

        testAsyncModuleCtrlHeaders : function () {
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "test.aria.templates.test.SampleModuleCtrl"
            }, {
                fn : this._afterCreateModuleCtrl,
                scope : this
            }, true);
        },

        _afterCreateModuleCtrl : function (res) {
            var moduleCtrl = res.moduleCtrlPrivate;
            moduleCtrl.$requestHandler = new test.aria.modules.requestHandler.issue459.MockRequestHandler();
            moduleCtrl.submitJsonRequest("testModuleCtrl", {
                name : "reqheaders"
            }, {

                fn : this._moduleCtrlCallback,
                scope : this,
                args : {
                    handler : moduleCtrl.$requestHandler,
                    moduleCtrl : moduleCtrl
                }
            });
        },

        _moduleCtrlCallback : function (res, args) {
            args.handler.$dispose();
            args.moduleCtrl.$dispose();

            this.assertEquals(this.listenersCalled, 1, "Expecting a request from IO, got %1");
            this.listenersCalled = 0;

            this.notifyTestEnd("testAsyncModuleCtrlHeaders");
        },

        _testRequestHeaders : function (request) {
            if (request.req.url === "test/aria/templates/test/testModuleCtrl") {
                this.listenersCalled += 1;
                this.assertEquals(request.req.headers["Content-Type"], "mockHeaders", "Request Headers are not set properly");
            }
            if (request.req.url === "test/testFailure") {
                this.listenersCalled += 1;
                this.assertEquals(request.req.headers["Content-Type"], "application/json", "Request Headers are not set properly");
            }
        }
    }
});
