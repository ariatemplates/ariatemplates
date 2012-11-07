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
 * Test for the IO class, limited to the jsonp part
 */
Aria.classDefinition({
    $classpath : "test.aria.core.io.JSONPTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.core.test.IOFilterSample"],
    $prototype : {
        tearDown : function () {
            aria.core.IO.$unregisterListeners(this);

            // Check that we didn't forget any timer on IO
            var timers = 0, id;
            for (id in aria.core.IO._poll) {
                if (aria.core.IO._poll.hasOwnProperty(id)) {
                    timers += 1;
                }
            }
            for (id in aria.core.IO._timeOut) {
                if (aria.core.IO._timeOut.hasOwnProperty(id)) {
                    timers += 1;
                }
            }
            this.assertEquals(timers, 0, "Undisposed pending timers on aria.core.IO");

            // Check that we don't have pending requests
            var requests = 0;
            for (id in aria.core.IO.pendingRequests) {
                if (aria.core.IO.pendingRequests.hasOwnProperty(id)) {
                    requests += 1;
                }
            }

            this.assertEquals(requests, 0, "Undisposed pending requests on aria.core.IO");
        },

        /**
         * Test a missing file, error callback should be called
         */
        testAsyncError : function () {
            aria.core.IO.jsonp({
                url : "jsonp_that_doesnt_exist",
                timeout : 1000,
                callback : {
                    fn : this._onTestErrorSuccess,
                    scope : this,
                    onerror : this._onTestErrorError,
                    onerrorScope : this,
                    args : "Call1"
                }
            });
        },
        _onTestErrorSuccess : function () {
            try {
                this.fail("Success function shouldn't be called");
            } catch (er) {}

            this.notifyTestEnd("testAsyncError");
        },
        _onTestErrorError : function (request, cbArgs) {
            try {
				this.assertTrue(!!request.url, "Missing request url");
                this.assertTrue(request.url.indexOf("jsonp_that_doesnt_exist") === 0, "Wrong URL: " + request.url);
                this.assertEquals(cbArgs, "Call1", "Arguments different from expected");
            } catch (er) {}

            this.notifyTestEnd("testAsyncError");
        },

        /**
         * Generic error callback for jsonp requests that shouldn't fail
         * @param {Object} response Response object
         * @param {String} testName Name of the test that failed
         */
        onTestGenericError : function (response, testName) {
            try {
                this.fail(response.url + " shouldn't fail.");
            } catch (er) {}

            this.notifyTestEnd(testName);
        },

        /**
         * Test that a local request works.
         */
        testAsyncLocal : function () {
            var url = aria.core.DownloadMgr.resolveURL("test/aria/core/test/SampleString.jsonp");
            var reqId = aria.core.IO.jsonp({
                url : url,
                timeout : 1000,
                callback : {
                    fn : this._onTestLocalStringSuccess,
                    scope : this,
                    onerror : this.onTestGenericError,
                    onerrorScope : this,
                    args : {
                        testName : "testAsyncLocal",
                        url : url
                    }
                }
            });

            aria.core.IO.evalJsonPforTestSampleString = function (json) {
                aria.core.transport.JsonP["_jsonp" + reqId].call(aria.core.transport.JsonP, json);
            };
        },
        _onTestLocalStringSuccess : function (response, args) {
            var testName = args.testName;
            try {
				this.assertTrue(!!response.url, "Missing response url");
                this.assertTrue(response.url.indexOf(args.url) === 0, "Wrong URL: " + response.url);
                this.assertEquals(response.responseJSON, "something", "Wrong Response: " + response.responseJSON);
            } catch (er) {}

            delete aria.core.IO["evalJsonPforTestSampleString"];

            this.notifyTestEnd(testName);
        },

        /**
         * Test that a local request works.
         */
        testAsyncLocalObject : function () {
            var url = aria.core.DownloadMgr.resolveURL("test/aria/core/test/SampleObject.jsonp");
            // We need to add some functions on IO because we don't have a server
            var reqId = aria.core.IO.jsonp({
                url : url,
                timeout : 1000,
                callback : {
                    fn : this._onTestLocalObjectSuccess,
                    scope : this,
                    onerror : this.onTestGenericError,
                    onerrorScope : this,
                    args : {
                        testName : "testAsyncLocalObject",
                        url : url
                    }
                }
            });

            aria.core.IO.evalJsonPforTestSampleObject = function (json) {
                aria.core.transport.JsonP["_jsonp" + reqId].call(aria.core.transport.JsonP, json);
            };
        },
        _onTestLocalObjectSuccess : function (response, args) {
            var testName = args.testName;
            try {
				this.assertTrue(!!response.url, "Missing response url");
                this.assertTrue(response.url.indexOf(args.url) === 0, "Wrong URL: " + response.url);
                this.assertEquals(response.responseJSON.something, "complex", "Wrong Response: "
                        + response.responseJSON);
            } catch (er) {}

            delete aria.core.IO["evalJsonPforTestSampleObject"];

            this.notifyTestEnd(testName);
        },

        /**
         * Test that a local request works.
         */
        testAsyncRemote : function () {
            aria.core.IO.jsonp({
                url : "http://search.twitter.com/search.json?q=ariatemplates&rpp=1",
                timeout : 5000,
                callback : {
                    fn : this._onTestRemoteSuccess,
                    scope : this,
                    onerror : this.onTestGenericError,
                    onerrorScope : this,
                    args : "testAsyncRemote"
                }
            });
        },
        _onTestRemoteSuccess : function (response, testName) {
            try {
                this.assertTrue(response.url.indexOf("http://search.twitter.com/search.json?q=ariatemplates") === 0, "Wrong URL: "
                        + response.url);
                this.assertEquals(response.responseJSON.query, "ariatemplates");
            } catch (er) {}

            this.notifyTestEnd(testName);
        },

        /**
         * Test redirecting a JSON-P request to a static file.
         */
        testAsyncRedirectJSONPToFile : function () {
            var oSelf = this;
            var request;
            var filterParam = {
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        try {
                            oSelf.assertTrue(req == request);
                            oSelf.assertTrue(req.jsonp != null);
                            this.redirectToFile(req, "test/aria/core/test/TestFile.json");
                            oSelf.assertTrue(req.jsonp == null);
                        } catch (e) {
                            this.handleAsyncTestError(e, false);
                        }
                    }
                }
            };
            aria.core.IOFiltersMgr.addFilter(filterParam);
            request = {
                url : "http://search.twitter.com/search.json?q=ariatemplates&rpp=1",
                timeout : 5000,
                callback : {
                    fn : function (res) {
                        try {
                            this.assertTrue(res == request.res);
                            this.assertTrue(res.responseText != null);
                            var json = res.responseJSON;
                            this.assertTrue(json != null);
                            this.assertTrue(json.result == "OK");
                            this.assertTrue(json.content == "[Some content]");
                        } catch (e) {
                            this.handleAsyncTestError(e, false);
                        }
                        aria.core.IOFiltersMgr.removeFilter(filterParam);
                        this.notifyTestEnd("testAsyncRedirectJSONPToFile");
                    },
                    scope : this,
                    onerror : function () {
                        this.fail("The request should not have failed.");
                    },
                    onerrorScope : this
                }
            };
            aria.core.IO.jsonp(request);
        },

        /**
         * Test redirecting an XHR request to JSON-P.
         */
        testAsyncRedirectXHRToJSONP : function () {
            var oSelf = this;
            var request;
            var filterParam = {
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        try {
                            oSelf.assertTrue(req == request);
                            oSelf.assertTrue(req.jsonp == null);
                            req.url = "http://search.twitter.com/search.json?q=ariatemplates&rpp=1";
                            req.jsonp = "callback";
                        } catch (e) {
                            this.handleAsyncTestError(e, false);
                        }
                    }
                }
            };
            aria.core.IOFiltersMgr.addFilter(filterParam);
            request = {
                expectedResponseType : "text",
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/TestFile.json"),
                timeout : 5000,
                callback : {
                    fn : function (res) {
                        try {
                            this.assertTrue(res == request.res);
                            this.assertEquals(res.responseJSON.query, "ariatemplates");
                            this.assertTrue(res.responseText != null);
                            var json = aria.utils.Json.load(res.responseText, this);
                            this.assertEquals(json.query, "ariatemplates");
                        } catch (e) {
                            this.handleAsyncTestError(e, false);
                        }
                        aria.core.IOFiltersMgr.removeFilter(filterParam);
                        this.notifyTestEnd("testAsyncRedirectJSONPToFile");
                    },
                    scope : this,
                    onerror : function () {
                        this.fail("The request should not have failed.");
                    },
                    onerrorScope : this
                }
            };
            aria.core.IO.asyncRequest(request);
        },

        /**
         * Test redirecting a FileLoader request to JSON-P.
         */
        testAsyncRedirectFileLoaderToJSONP : function () {
            var fileToBeRequested = "test/aria/core/test/fileRedirectedToJsonP.txt"
            var oSelf = this;
            var filterCalled = false;
            var filter = new test.aria.core.test.IOFilterSample({
                onRequest : function (req) {
                    try {
                        var sender = req.sender;
                        if (sender && sender.classpath == "aria.core.FileLoader"
                                && sender.logicalPaths[0] == fileToBeRequested) {
                            oSelf.assertFalse(filterCalled);
                            filterCalled = true;
                            req.jsonp = "callback";
                            req.url = aria.core.DownloadMgr.resolveURL("test/aria/core/test/SampleString.jsonp");
                            aria.core.IO.evalJsonPforTestSampleString = function (json) {
                                aria.core.transport.JsonP["_jsonp" + req.id].call(aria.core.transport.JsonP, json);
                            };
                        }
                    } catch (e) {
                        this.handleAsyncTestError(e, false);
                    }
                }
            });
            aria.core.IOFiltersMgr.addFilter(filter);
            aria.core.DownloadMgr.clearFile(fileToBeRequested, true); // make sure the file is not in the cache
            aria.core.DownloadMgr.loadFile(fileToBeRequested, {
                fn : function (res) {
                    try {
                        delete aria.core.IO["evalJsonPforTestSampleString"];
                        this.assertTrue(filterCalled);
                        this.assertFalse(res.downloadFailed);
                        var fileContent = aria.core.DownloadMgr.getFileContent(fileToBeRequested);
                        this.assertTrue(fileContent == "something");
                    } catch (e) {
                        this.handleAsyncTestError(e, false);
                    }
                    aria.core.IOFiltersMgr.removeFilter(filter);
                    this.notifyTestEnd("testAsyncRedirectFileLoaderToJSONP");
                },
                scope : this
            });
        }
    }
});