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
    $classpath : "test.aria.modules.RequestMgrTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.modules.urlService.PatternURLCreationImpl", "aria.modules.RequestMgr",
            "test.aria.modules.test.MockRequestHandler", "aria.templates.ModuleCtrl",
            "aria.modules.requestHandler.RequestHandler", "aria.modules.urlService.environment.UrlService",
            "aria.modules.requestHandler.XMLRequestHandler", "aria.modules.requestHandler.JSONRequestHandler"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.defaultTestTimeout = 5000;
    },
    $prototype : {

        /**
         * Save parameters of the Request Manager before each test to restore them later.
         */
        setUp : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var requestMgr = aria.modules.RequestMgr;
            this._saved = {
                session : {
                    id : requestMgr.session.id,
                    paramName : requestMgr.session.paramName
                },
                params : requestMgr._params,
                filters : ioFiltersMgr._filters,
                handler : requestMgr._requestHandler
            };
            requestMgr._params = null;
            ioFiltersMgr._filters = null;
        },

        /**
         * Restore saved parameters of the Request Manager after each test.
         */
        tearDown : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var requestMgr = aria.modules.RequestMgr;
            requestMgr.session = this._saved.session;
            requestMgr._params = this._saved.params;
            requestMgr._requestHandler = this._saved.handler;
            ioFiltersMgr._filters = this._saved.filters;
        },

        /**
         * Test that filters are properly loaded and called, and then removed and disposed
         */
        testAsyncFilters : function () {
            var requestMgr = aria.modules.RequestMgr;
            requestMgr._requestHandler = new aria.modules.requestHandler.XMLRequestHandler();

            var ioFiltersMgr = aria.core.IOFiltersMgr;

            ioFiltersMgr.addFilter({
                classpath : "test.aria.modules.test.SampleRequestFilter",
                initArgs : {
                    txt : 'Sample Init Argument',
                    testCase : this
                }
            });
            this.assertTrue(ioFiltersMgr._filters.length == 1);

            if (!ioFiltersMgr.isFilterPresent("test.aria.modules.test.SampleRequestFilter")) {
                aria.core.IOFiltersMgr.addFilter({
                    classpath : "test.aria.modules.test.SampleRequestFilter",
                    initArgs : "Another Init Argument"
                });
            }
            this.assertTrue(ioFiltersMgr._filters.length == 1);
            this.__requestPath = null;

            requestMgr.submitJsonRequest({
                moduleName : "xxx",
                actionName : "yyy"
                // changed by SampleRequestFilter
            }, {
                reqData : 123
            }, {
                fn : this._testAsyncFiltersResponse,
                scope : this
            });
        },

        _testAsyncFiltersResponse : function () {
            try {
                var requestMgr = aria.modules.RequestMgr;
                requestMgr._requestHandler.$dispose();
                var ioFiltersMgr = aria.core.IOFiltersMgr;
                // this should be changed by the filter
                this.assertTrue(this.__requestPath == "xxx/yyy", "Filter did not changed __requestPath");
                delete this.__requestPath;
                this.assertTrue(this.__responseData == "aria-response", "Filter did not changed __responseData");
                delete this.__responseData;

                // test filter removal. proper disposal should be done.
                ioFiltersMgr.removeFilter('test.aria.modules.test.SampleRequestFilter');
                this.assertTrue(ioFiltersMgr._filters == null);
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd("testAsyncFilters");
        },

        /**
         * Test addParam, removeParam, getParam
         */
        testParams : function () {
            // set a new url service
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : ["http://test/${moduleName}/${actionName};jsessionid=${sessionId}"]
                }
            }, null, true);

            var requestMgr = aria.modules.RequestMgr, url;

            // Add some parameters
            requestMgr.addParam("number", "12");
            requestMgr.addParam("text", "twelve");

            // Undefined text
            requestMgr.addParam("text");

            url = requestMgr.createRequestDetails({
                moduleName : "tpls",
                actionName : "doTest1"
            }, {
                id : "x"
            });

            this.assertEquals(url.url, "http://test/tpls/doTest1;jsessionid=x?number=12", "got " + url.url);

            // Try overriding a parameter
            requestMgr.addParam("text", "twelve");
            this.assertEquals(requestMgr.getParam('text'), "twelve", "Wrong value for param text");

            requestMgr.addParam("number", null);

            url = requestMgr.createRequestDetails({
                moduleName : "tpls",
                actionName : "doTest2"
            }, {
                id : "x"
            });

            this.assertEquals(url.url, "http://test/tpls/doTest2;jsessionid=x?text=twelve", "wrong url. got " + url.url);

            // However false should be left as false
            requestMgr.addParam("text", null);
            requestMgr.addParam("number", null);
            requestMgr.addParam("boolean", false);

            url = requestMgr.createRequestDetails({
                moduleName : "tpls",
                actionName : "doTest3"
            }, {
                id : "x"
            });
            this.assertEquals(url.url, "http://test/tpls/doTest3;jsessionid=x?boolean=false", "boolean missing. got %1");

            // try removing the last param
            requestMgr.removeParam("boolean");

            url = requestMgr.createRequestDetails({
                moduleName : "tpls",
                actionName : "doTest3"
            }, {
                id : "x"
            });
            this.assertEquals(url.url, "http://test/tpls/doTest3;jsessionid=x", "boolean not remove. got " + url.url);
        },

        /**
         * Test JSON requests, events, and handler interface.
         */
        testAsyncSubmitJsonRequest : function () {
            var requestMgr = aria.modules.RequestMgr;
            requestMgr._requestHandler = new aria.modules.requestHandler.XMLRequestHandler();

            // init flags
            this.errorEvent = 0;

            // creates a mock handker
            this.mockHandler = new test.aria.modules.test.MockRequestHandler(this);

            requestMgr.$on({
                error : this._eventError,
                scope : this
            });

            // There are no event listeners anymore, we need a filter
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            ioFiltersMgr.addFilter("test.aria.modules.test.SampleRequestFilter");

            // first request
            requestMgr.submitJsonRequest({
                moduleName : "test",
                actionName : "testRequestManager",
                requestHandler : this.mockHandler
            }, {
                myData : "value"
            }, {
                fn : this._onJsonRequestResponse,
                scope : this
            });
        },

        _eventError : function (evt) {
            try {
                // flag that response event was raised
                this.errorEvent++;
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },

        _onJsonRequestResponse : function (res) {
            try {
                aria.core.JsonValidator.normalize({
                    json : res,
                    beanName : "aria.modules.RequestBeans.ProcessedResponse"
                });

                // test all events were called
                this.assertTrue(this.errorEvent === 0, "There should be no error");

                // test final data
                this.assertTrue(res.response && res.response.mockData, "Missing mock data");

                // remove listener so that other tests are not impacted
                aria.modules.RequestMgr.$unregisterListeners(this);
                aria.modules.RequestMgr._requestHandler.$dispose();
                this.mockHandler.$dispose();
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            aria.core.IOFiltersMgr.removeFilter('test.aria.modules.test.SampleRequestFilter');
            this.notifyTestEnd("testAsyncSubmitJsonRequest");
        },

        /**
         * Test failing JSON requests, events, and handler interface.
         */
        testAsyncFailingSubmitJsonRequest : function () {
            var requestMgr = aria.modules.RequestMgr; // init flags
            this.requestEvent = 0;
            this.responseEvent = 0;
            this.errorEvent = 0; // creates a mock handker
            this.mockHandler = new test.aria.modules.test.MockRequestHandler(this);
            requestMgr.$on({
                error : this._eventFailingError,
                scope : this
            }); // first request
            requestMgr.submitJsonRequest({
                moduleName : "test",
                actionName : "testRequestManager",
                requestHandler : this.mockHandler
            }, {
                myData : "value"
            }, {
                fn : this._onJsonFailingRequestResponse,
                scope : this
            });
        },

        _eventFailingError : function (evt) {
            try {
                // flag that response event was raised
                this.errorEvent++;
                this.assertTrue(!!evt.requestUrl, "missing requestUrl");
                this.assertTrue(!!evt.requestObject, "missing requestObject");
                this.assertTrue(!!evt.httpError, "missing httpError");
                this.assertTrue(!!evt.errorData, "missing errorData");
            } catch (ex) {
                this.handleAsyncTestError(ex);
            }
        },
        _onJsonFailingRequestResponse : function (res) {
            try {
                aria.core.JsonValidator.normalize({
                    json : res,
                    beanName : "aria.modules.RequestBeans.ProcessedResponse"
                }, true); // test all events were called
                this.assertTrue(this.errorEvent == 1, "Missing error event"); // test final data
                this.assertTrue(res.response == null, "Wrong data are returned from mock handler");
                this.assertTrue(res.error, "Missing error flag in datas");
                this.assertTrue(res.errorData.mockErrorData, "Missing error data"); // remove listener so that other
                // tests are not impacted
                aria.modules.RequestMgr.$unregisterListeners(this);
                this.mockHandler.$dispose();
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd("testAsyncFailingSubmitJsonRequest");
        },

        /**
         * Test application parameter update for urlService and requestHandler
         */
        testAsyncUpdateEnvironment : function () {
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "test.aria.modules.test.CustomImplementation",
                    args : []
                },
                requestHandler : {
                    implementation : "test.aria.modules.test.MockRequestHandler"
                }
            });

            var rm = aria.modules.RequestMgr;
            rm.submitJsonRequest({
                moduleName : "module",
                actionName : "testAsyncUpdateEnvironment"
            }, null, {
                fn : this._onUpdateEnvironment,
                scope : this
            });
        },

        _onUpdateEnvironment : function (res) {
            try {
                this.assertTrue(res.error, "Missing error");
                this.assertTrue(res.errorData.mockErrorData, "Missing mock error data");
                // Resets the environment so that the requestHandler is properly disposed.
                aria.core.AppEnvironment.setEnvironment({
                    urlService : {},
                    requestHandler : {}
                });
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd("testAsyncUpdateEnvironment");
        },

        /**
         * Test requestHandler defined at module level
         */
        testAsyncModuleRequest : function () {
            // Changing the url service to make sure the request we are about to do targets an existing file (and not
            // a folder).
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [Aria.rootFolderPath + "test/${moduleName}/${actionName}/TemplateOK.tpl"]
                }
            }, null, true);
            var module = new aria.templates.ModuleCtrl();
            module.$requestHandler = new test.aria.modules.test.MockRequestHandler(this);
            module.submitJsonRequest('test', {}, {
                fn : this._onModuleRequest,
                scope : this,
                args : module
            });

        },

        _onModuleRequest : function (res, module) {
            try {
                // handler was used
                this.assertTrue(res.response.mockData, "Missing mock data");
                module.$requestHandler.$dispose();
                module.$dispose();
                // dispose raises an error as factory was skipped > clean error with an assert
                this.assertErrorInLogs(aria.templates.ModuleCtrlFactory.MODULECTRL_BYPASSED_FACTORY, "Well, I hijacked the factory, no ?");
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd("testAsyncModuleRequest");
        },

        _computeRelativePath : function (destination) {
            var currentPath = Aria.$frameworkWindow.location.pathname.split('/');
            // Remove protocol and host name:
            var match = /^https?:\/\/[^/]+(\/.*)$/.exec(destination);
            if (!match) {
                // destination is already relative
                return destination;
            }
            destination = match[1].split('/');
            var i, l1, l2;
            for (i = 0, l1 = currentPath.length, l2 = destination.length; i < l1 - 1 && i < l2 - 1; i++) {
                if (currentPath[i] != destination[i]) {
                    break;
                }
            }
            var finalPath = [];
            for (var j = l1 - 2; j >= i; j--) {
                finalPath.push('..');
            }
            for (var j = i; j < l2; j++) {
                finalPath.push(destination[j]);
            }
            return finalPath.join('/');
        },

        testAsyncRelativePath : function () {
            // This test suite can be run from different places. So a relative path must be built programmatically...
            var relativePath = this._computeRelativePath(Aria.rootFolderPath + 'test/aria/modules/test/${actionName}');
            aria.core.AppEnvironment.setEnvironment({
                urlService : {
                    implementation : "aria.modules.urlService.PatternURLCreationImpl",
                    args : [relativePath]
                }
            }, null, true);

            var rm = aria.modules.RequestMgr;
            rm._requestHandler = new aria.modules.requestHandler.XMLRequestHandler();
            rm.submitJsonRequest({
                moduleName : "",
                actionName : "SampleResponse.xml"
            }, null, {
                fn : this._onRelativePath,
                scope : this
            });
        },

        _onRelativePath : function (evt) {
            try {
                aria.modules.RequestMgr._requestHandler.$dispose();
                this.assertTrue(!!evt.response);
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }

            this.notifyTestEnd("testAsyncRelativePath");
        },

        /*
         * PTR 05168918: Test that the request data is properly converted to string
         */
        testAsyncJsonDataConversion : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var requestMgr = aria.modules.RequestMgr;
            var handler = new aria.modules.requestHandler.RequestHandler();
            ioFiltersMgr.addFilter('test.aria.modules.test.AnotherSampleRequestFilter');

            // first request
            requestMgr.submitJsonRequest({
                moduleName : "test",
                actionName : "testRequestManager",
                requestHandler : handler
            }, {
                myData : {
                    a : "value"
                }
            }, {
                fn : this._testAsyncJsonDataConversionCb,
                scope : this,
                args : {
                    handler : handler
                }
            }, null, null, handler);
        },

        _testAsyncJsonDataConversionCb : function (res, args) {
            this.assertTrue(res.responseText.indexOf("\"myData\"") != -1);
            this.assertTrue(res.responseText.indexOf("\"a\"") != -1);
            aria.core.IOFiltersMgr.removeFilter('test.aria.modules.test.AnotherSampleRequestFilter');
            args.handler.$dispose();
            this.notifyTestEnd("testAsyncJsonDataConversion");
        },

        /**
         * Test that metadata are removed from the postData
         */
        testAsyncRemoveMetadata : function () {
            // Objects taken from the datamodel often contains metadata
            var toBeSent = {
                normal : "string"
            };

            toBeSent[Aria.FRAMEWORK_PREFIX + "meta"] = "meta";

            // Create a stub for IO
            var originalIORequest = aria.core.IO.asyncRequest;
            var requestMgrSentRequest = 0;
            var currentTest = this;
            aria.core.IO.asyncRequest = function (args) {
                originalIORequest.apply(this, arguments);
                // This method can be called both to load the request handler (if not already loaded) and to actually
                // submit the data
                // The assert must be done on the right request, which comes from the request manager)
                if (args.sender.classpath == "aria.modules.RequestMgr") {
                    requestMgrSentRequest++;
                    currentTest.assertEquals(-1, args.data.indexOf(Aria.FRAMEWORK_PREFIX), "Metadata in json request");
                }
            };
            try {
                var mockHandler = new test.aria.modules.test.MockRequestHandler(this);
                mockHandler.processSuccess = function () {
                    try {
                        currentTest.assertEquals(1, requestMgrSentRequest, "The request manager did not call IO.asyncRequest exactly once.");
                        aria.core.IO.asyncRequest = originalIORequest;
                        mockHandler.$dispose();
                        currentTest._endtestAsyncRemoveMetadata();
                    } catch (e) {
                        currentTest.handleAsyncTestError(e);
                    }
                };
                mockHandler.processFailure = mockHandler.processSuccess;
                aria.modules.RequestMgr.submitJsonRequest({
                    moduleName : "test",
                    actionName : "testRemoveMetadata",
                    requestHandler : mockHandler
                }, toBeSent);

            } catch (ex) {
                aria.core.IO.asyncRequest = originalIORequest;
                throw ex;
            }
        },

        _endtestAsyncRemoveMetadata : function () {
            aria.core.Timer.addCallback({
                fn : this.notifyTestEnd,
                scope : this,
                args : "testAsyncRemoveMetadata",
                delay : 100
            });
        },

        /**
         * Tests that calling createRequestDetails passing in a service give the same result as calling it passing an
         * action as argument.
         */
        testCreateRequestDetailsForService : function () {
            var requestMgr = aria.modules.RequestMgr, url;

            var urlAction = requestMgr.createRequestDetails({
                moduleName : "tpls",
                actionName : "doTest1"
            }, {
                id : "x"
            });

            var urlService = requestMgr.createRequestDetails({
                moduleName : "tpls",
                serviceSpec : {
                    actionName : "doTest1"
                }
            }, {
                id : "x"
            });

            this.assertEquals(urlAction.url, urlService.url);
        },

        testAsyncFailure : function () {
            aria.modules.RequestMgr.submitJsonRequest({
                moduleName : "test",
                actionName : "testFailure"
            }, null, {
                fn : this.afterFailureRequest,
                scope : this
            });
        },

        afterFailureRequest : function (response, originalIORequest) {
            aria.modules.RequestMgr._requestHandler.$dispose();
            this.assertTrue(response.error, "There should be an error");
            this.assertTrue(!!response.response, "There should be a server response");
            this.assertTrue(!!response.response.responseText, "The response should contain a responseText");

            this.notifyTestEnd("testAsyncFailure");
        },

        testAsyncFailureJSON : function () {
            var handler = new aria.modules.requestHandler.JSONRequestHandler();

            // mock IO
            var originalHandleResponse = aria.core.IO._handleResponse;
            aria.core.IO._handleResponse = function (error, request, response) {
                if (request.url.indexOf("testFailure") > -1) {
                    response.responseText = '{"json":"object"}';

                    aria.core.IO._handleResponse = originalHandleResponse;
                }
                originalHandleResponse.apply(aria.core.IO, arguments);
            };

            aria.modules.RequestMgr.submitJsonRequest({
                moduleName : "test",
                actionName : "testFailure",
                requestHandler : handler
            }, null, {
                fn : this.afterFailureRequestJSON,
                scope : this,
                args : handler
            });
        },

        afterFailureRequestJSON : function (response, handler) {
            handler.$dispose();

            this.assertTrue(response.error, "There should be an error");
            this.assertTrue(!!response.response, "There should be a server response");
            this.assertTrue(!!response.response.responseText, "The response should contain a responseText");
            this.assertTrue(!!response.response.responseJSON, "The response should contain a responseJSON");
            this.assertEquals(response.response.responseJSON.json, "object", "responseJSON should be a JSON");

            this.notifyTestEnd("testAsyncFailureJSON");
        }

    }
});
