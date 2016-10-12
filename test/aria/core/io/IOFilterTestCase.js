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
 * Test for the IOFilter class.
 */
Aria.classDefinition({
    $classpath : "test.aria.core.io.IOFilterTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.IOFilter"],
    $prototype : {
        testSetJsonPostData : function () {
            var filter = new aria.core.IOFilter();
            var req = {
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/TestFile.txt", true),
                method : "POST",
                data : "notChanged"
            };
            filter.setJsonPostData(req, {});
            this.assertTrue(req.data == "{}");
            filter.$dispose();

            // Test for PTR 05168918: keys must be enclosed in ""
            filter = new aria.core.IOFilter();
            req = {
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/TestFile.txt", true),
                method : "POST",
                data : "notChanged"
            };
            filter.setJsonPostData(req, {
                a : {
                    b : "c"
                }
            });
            this.assertTrue(req.data.indexOf("\"a\"") != -1);
            this.assertTrue(req.data.indexOf("\"b\"") != -1);
            filter.$dispose();
        },

        testAsyncEndToEndJsonPostData : function () {
            var filter = new aria.core.IOFilter();
            filter.onRequest = function (req) {
                this.setJsonPostData(req, "better");
            };
            aria.core.IOFiltersMgr.addFilter(filter);

            var req = {
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/TestFile.txt", true),
                method : "GET",
                data : "notChanged",
                callback : {
                    fn : function () {
                        this.notifyTestEnd("testAsyncEndToEndJsonPostData");
                    },
                    scope : this
                }
            };

            // mock the actual send function
            var originalSend = aria.core.IO._asyncRequest;
            var counter = 0;
            var postData;
            aria.core.IO._asyncRequest = function (requestObject) {
                counter += 1;
                postData = requestObject.req.data;
                return originalSend.apply(this, arguments);
            };
            aria.core.IO.asyncRequest(req);
            aria.core.IO._asyncRequest = originalSend;

            aria.core.IOFiltersMgr.removeFilter(filter);
            filter.$dispose();
            this.assertEquals(counter, 1, "Expecting the async request to be called once, got %2");
            this.assertEquals(postData, '"better"');
        },

        testAsyncCheckErrorInFilter : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var oSelf = this;
            var onRequestCalled = false;
            var onResponseCalled = false;
            var myRequest = {
                sender : {
                    classpath : this.$classpath
                },
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/TestFile.txt", true),
                callback : {
                    fn : function (res) {
                        this.assertTrue(res == myRequest.res);
                        // check that the exception raised by onResponse was reported in the logs:
                        this.assertErrorInLogs(aria.core.IOFilter.FILTER_RES_ERROR);
                        this.assertLogsEmpty(); // the previous error should be the only error in the logs
                        // check the file was correctly requested, even if there were exceptions
                        this.assertTrue(res.responseText == "[Some Test Content]");
                        ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                        this.notifyTestEnd("testAsyncCheckErrorInFilter");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        oSelf.assertFalse(onRequestCalled);
                        oSelf.assertTrue(req == myRequest);
                        onRequestCalled = true;
                        oSelf.assertLogsEmpty(); // make sure logs are empty before raising the exception
                        this.callInvalidMethod(); // raise an exception
                    },
                    onResponse : function (req) {
                        oSelf.assertTrue(onRequestCalled);
                        oSelf.assertFalse(onResponseCalled);
                        oSelf.assertTrue(req == myRequest);
                        // check that the exception raised by onRequest was reported in the logs:
                        oSelf.assertErrorInLogs(this.FILTER_REQ_ERROR);
                        oSelf.assertLogsEmpty(); // the previous error should be the only error in the logs
                        onResponseCalled = true;
                        this.callInvalidMethod(); // raise an exception
                    }
                }
            });
            aria.core.IO.asyncRequest(myRequest);
        },

        testAsyncCheckRedirectToFile : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var oSelf = this;
            var onRequestCalled = false;
            var onResponseCalled = false;
            var myRequest = {
                sender : {
                    classpath : this.$classpath
                },
                url : "/originalRequest",
                callback : {
                    fn : function (res) {
                        this.assertTrue(res == myRequest.res);
                        this.assertTrue(onResponseCalled);
                        this.assertTrue(res.responseText == "[Changed Content]");
                        ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                        this.notifyTestEnd("testAsyncCheckRedirectToFile");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        oSelf.assertFalse(onRequestCalled);
                        oSelf.assertTrue(req == myRequest);
                        onRequestCalled = true;
                        this.redirectToFile(req, "test/aria/core/test/TestFile.txt");
                    },
                    onResponse : function (req) {
                        oSelf.assertTrue(onRequestCalled);
                        oSelf.assertFalse(onResponseCalled);
                        oSelf.assertTrue(req == myRequest);
                        oSelf.assertTrue(req.res.responseText == "[Some Test Content]");
                        req.res.responseText = "[Changed Content]";
                        onResponseCalled = true;
                    }
                }
            });
            aria.core.IO.asyncRequest(myRequest);
        },

        /**
         * Test to check filter delays.
         */
        testAsyncFilterDelays : function () {
            var delayApplied = false;
            aria.core.IOFiltersMgr.addFilter({
                classpath : 'aria.core.IOFilter',
                initArgs : {
                    requestDelay : 1000,
                    responseDelay : 1000
                }
            });
            aria.core.Timer.addCallback({
                fn : function () {
                    delayApplied = true;
                },
                delay : 2000,
                scope : this
            });
            aria.core.IO.asyncRequest({
                sender : {
                    classpath : this.$classpath
                },
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/TestFile.txt", true),
                callback : {
                    scope : this,
                    fn : function (evt) {
                        try {
                            this.assertTrue(delayApplied, "Delay not applied");
                            aria.core.IOFiltersMgr.removeFilter('aria.core.IOFilter');
                            this.assertTrue(aria.core.IOFiltersMgr._filters === null);
                        } catch (ex) {
                            this.handleAsyncTestError(ex, false);
                        }
                        this.notifyTestEnd("testAsyncFilterDelays");
                    }

                }
            });
        },

        /**
         * Test to check PUT request method
         */
        testAsyncCheckPutRequest : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var oSelf = this;
            var onRequestCalled = false;
            var onResponseCalled = false;
            var myRequest = {
                sender : {
                    classpath : this.$classpath
                },
                method : "PUT",
                url : "aria/core/test/TestFile.txt",
                callback : {
                    fn : function (res) {
                        this.assertTrue(res == myRequest.res);
                        this.assertTrue(onResponseCalled);
                        ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                        this.notifyTestEnd("testAsyncCheckPutRequest");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        oSelf.assertFalse(onRequestCalled);
                        oSelf.assertTrue(req == myRequest);
                        oSelf.assertTrue(req.method == "PUT");
                        onRequestCalled = true;
                    },
                    onResponse : function (req) {
                        oSelf.assertTrue(onRequestCalled);
                        oSelf.assertFalse(onResponseCalled);
                        oSelf.assertTrue(req == myRequest);
                        delete req.res.error;
                        req.res.status = 200;
                        onResponseCalled = true;
                    }
                }
            });
            aria.core.IO.asyncRequest(myRequest);
        },
        /**
         * Test to check DELETE request method
         */
        testAsyncCheckDeleteRequest : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var oSelf = this;
            var onRequestCalled = false;
            var onResponseCalled = false;
            var myRequest = {
                sender : {
                    classpath : this.$classpath
                },
                method : "DELETE",
                url : "aria/core/test/TestFile.txt",
                callback : {
                    fn : function (res) {
                        this.assertTrue(res == myRequest.res);
                        this.assertTrue(onResponseCalled);
                        ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                        this.notifyTestEnd("testAsyncCheckDeleteRequest");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        oSelf.assertFalse(onRequestCalled);
                        oSelf.assertTrue(req == myRequest);
                        oSelf.assertTrue(req.method == "DELETE");
                        onRequestCalled = true;
                    },
                    onResponse : function (req) {
                        oSelf.assertTrue(onRequestCalled);
                        oSelf.assertFalse(onResponseCalled);
                        oSelf.assertTrue(req == myRequest);
                        delete req.res.error;
                        req.res.status = 200;
                        onResponseCalled = true;
                    }
                }
            });
            aria.core.IO.asyncRequest(myRequest);
        },
        /**
         * Test to check TRACE request method
         */
        testAsyncCheckTraceRequest : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var oSelf = this;
            var onRequestCalled = false;
            var onResponseCalled = false;
            var myRequest = {
                sender : {
                    classpath : this.$classpath
                },
                method : "TRACE",
                url : "aria/core/test/TestFile.txt",
                callback : {
                    fn : function (res) {
                        this.assertTrue(res == myRequest.res);
                        this.assertTrue(onResponseCalled);
                        ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                        this.notifyTestEnd("testAsyncCheckTraceRequest");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        oSelf.assertFalse(onRequestCalled);
                        oSelf.assertTrue(req == myRequest);
                        oSelf.assertTrue(req.method == "TRACE");
                        onRequestCalled = true;
                    },
                    onResponse : function (req) {
                        oSelf.assertTrue(onRequestCalled);
                        oSelf.assertFalse(onResponseCalled);
                        oSelf.assertTrue(req == myRequest);
                        delete req.res.error;
                        req.res.status = 200;
                        onResponseCalled = true;
                    }
                }
            });
            aria.core.IO.asyncRequest(myRequest);
        },
        /**
         * Test to check CONNECT request method
         */
        testAsyncCheckConnectRequest : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var oSelf = this;
            var onRequestCalled = false;
            var onResponseCalled = false;
            var myRequest = {
                sender : {
                    classpath : this.$classpath
                },
                method : "CONNECT",
                url : "aria/core/test/TestFile.txt",
                callback : {
                    fn : function (res) {
                        this.assertTrue(res == myRequest.res);
                        this.assertTrue(onResponseCalled);
                        ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                        this.notifyTestEnd("testAsyncCheckConnectRequest");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        oSelf.assertFalse(onRequestCalled);
                        oSelf.assertTrue(req == myRequest);
                        oSelf.assertTrue(req.method == "CONNECT");
                        onRequestCalled = true;
                    },
                    onResponse : function (req) {
                        oSelf.assertTrue(onRequestCalled);
                        oSelf.assertFalse(onResponseCalled);
                        oSelf.assertTrue(req == myRequest);
                        delete req.res.error;
                        req.res.status = 200;
                        onResponseCalled = true;
                    }
                }
            });
            aria.core.IO.asyncRequest(myRequest);
        },
        /**
         * Test to check PATCH request method
         */
        testAsyncCheckPatchRequest : function () {
            var ioFiltersMgr = aria.core.IOFiltersMgr;
            var oSelf = this;
            var onRequestCalled = false;
            var onResponseCalled = false;
            var myRequest = {
                sender : {
                    classpath : this.$classpath
                },
                method : "PATCH",
                url : "aria/core/test/TestFile.txt",
                callback : {
                    fn : function (res) {
                        this.assertTrue(res == myRequest.res);
                        this.assertTrue(onResponseCalled);
                        ioFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                        this.notifyTestEnd("testAsyncCheckPatchRequest");
                    },
                    scope : this,
                    onerror : function (res) {
                        this.fail("The error callback should not be called.");
                    }
                }
            };
            ioFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        oSelf.assertFalse(onRequestCalled);
                        oSelf.assertTrue(req == myRequest);
                        oSelf.assertTrue(req.method == "PATCH");
                        onRequestCalled = true;
                    },
                    onResponse : function (req) {
                        oSelf.assertTrue(onRequestCalled);
                        oSelf.assertFalse(onResponseCalled);
                        oSelf.assertTrue(req == myRequest);
                        delete req.res.error;
                        req.res.status = 200;
                        onResponseCalled = true;
                    }
                }
            });
            aria.core.IO.asyncRequest(myRequest);
        }
    }
});
