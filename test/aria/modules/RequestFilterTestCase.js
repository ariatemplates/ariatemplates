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
 * Test case for the RequestFilter class.
 */
Aria.classDefinition({
    $classpath : "test.aria.modules.RequestFilterTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.modules.test.RequestFilterTester", "aria.modules.RequestMgr", "aria.core.IOFiltersMgr"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);

        // The test testAsyncFilterDelays is going to take some time, change the default test timeout
        // the test uses two delay filters around an invalid requests of ~20.000 ms
        this.defaultTestTimeout = 30000;
    },
    $prototype : {
        /**
         * Test that the request filter behaves correctly when specifying a target package.
         */
        testsWithTargetPkg : function () {
            var requestFilter = new test.aria.modules.test.RequestFilterTester("test.aria.modules.test");
            // one request inside the filtered package:
            var req = {
                url : Aria.rootFolderPath + "test/aria/modules/test/myAction",
                sender : {
                    classpath : "aria.modules.RequestMgr",
                    requestObject : {
                        actionName : "myAction",
                        moduleName : "test.aria.modules.test"
                    }
                },
                method : "POST",
                data : "data"
            };
            requestFilter.__onRequest(req);
            // check that the request was kept:
            this.assertTrue(requestFilter.requestCalls.length == 1);
            this.assertTrue(requestFilter.requestCalls[0].url == req.url);

            // keep the converted request for the tests with _redirectToFile
            req = requestFilter.requestCalls[0];

            requestFilter.requestCalls = [];

            // check the call of _redirectToFile:
            requestFilter.redirectToFile(req, "myFile.xml", true);
            this.assertTrue(req.url == Aria.rootFolderPath + "myFile.xml");
            this.assertTrue(req.method == "GET");

            requestFilter.redirectToFile(req, "myFile.xml");
            this.assertTrue(req.url.replace(/\?timestamp=\d*$/, '?ts') == Aria.rootFolderPath + "myFile.xml?ts");
            this.assertTrue(req.method == "GET");

            // another request outside the filtered package:
            req = {
                url : Aria.rootFolderPath + "outside/test/aria/modules/test/myAction",
                sender : {
                    classpath : "aria.modules.RequestMgr",
                    requestObject : {
                        actionName : "myAction",
                        moduleName : "outside.test.aria.modules.test"
                    }
                },
                method : "POST",
                data : "data"
            };
            requestFilter.__onRequest(req);
            // check that the request was not kept:
            this.assertTrue(requestFilter.requestCalls.length == 1);

            requestFilter.$dispose();
        },

        /**
         * Test that the request filter behaves correctly when no target package is specified.
         */
        testsWithNoTargetPkg : function () {
            // no target package:
            var requestFilter = new test.aria.modules.test.RequestFilterTester(null);
            // one request inside the filtered package:
            var req = {
                url : Aria.rootFolderPath + "test/aria/modules/test/myAction",
                sender : {
                    classpath : "aria.modules.RequestMgr",
                    requestObject : {
                        actionName : "myAction",
                        moduleName : "test.aria.modules.test"
                    }
                },
                method : "POST",
                data : "data"
            };
            requestFilter.__onRequest(req);
            // check that the request was kept:
            this.assertTrue(requestFilter.requestCalls.length == 1);
            this.assertTrue(requestFilter.requestCalls[0].url == req.url);

            // keep the converted request for the tests with _redirectToFile
            req = requestFilter.requestCalls[0];

            // no action property here
            requestFilter.requestCalls = [];

            // check the call of _redirectToFile:
            requestFilter.redirectToFile(req, "myFile.xml", true);
            this.assertEquals(req.url, Aria.rootFolderPath + "myFile.xml");
            this.assertTrue(req.method == "GET");

            requestFilter.redirectToFile(req, "myFile.xml");
            this.assertEquals(req.url.replace(/\?timestamp=\d*$/, '?ts'), Aria.rootFolderPath + "myFile.xml?ts");
            this.assertTrue(req.method == "GET");

            requestFilter.$dispose();
        },

        /**
         * Test for handling filter delays.
         */
        testAsyncFilterDelays : function () {
            var rm = aria.modules.RequestMgr;
            var args = {};
            aria.core.IOFiltersMgr.addFilter({
                classpath : 'test.aria.modules.test.SampleDelayFilter',
                initArgs : {
                    testCase : this,
                    requestDelay : 1000,
                    responseDelay : 1000
                }
            });
            aria.core.Timer.addCallback({
                fn : this._onFilterDelayCheck,
                delay : 2000,
                scope : this,
                args : args
            });

            // Reduce the default timeout for shorter tests
            aria.core.IO.defaultTimeout = 4000;

            rm.submitJsonRequest({
                moduleName : "whatsoever",
                actionName : ""
            }, {
                myData : "value"
            }, {
                fn : this._onFilterDelaysResponse,
                scope : this,
                args : args
            });
        },
        /**
         * This method must be called before _onFilterDelaysResponse for the test to succeed.
         */
        _onFilterDelayCheck : function (args) {
            args.onFilterDelayCheckCalled = true;
        },
        /**
         * Callback used to handle the response for testAsyncFilterDelays
         */
        _onFilterDelaysResponse : function (evt, args) {
            // Put back the original timeout
            aria.core.IO.defaultTimeout = aria.core.IO.classDefinition.$prototype.defaultTimeout;

            try {
                var rm = aria.modules.RequestMgr;
                this.assertTrue(args.onFilterDelayCheckCalled, "Delay not applied");
                aria.core.IOFiltersMgr.removeFilter('test.aria.modules.test.SampleDelayFilter');
                this.assertTrue(aria.core.IOFiltersMgr._filters === null);
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd("testAsyncFilterDelays");
        }
    }
});
