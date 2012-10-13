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
 * Test for the IO class
 */
Aria.classDefinition({
    $classpath : "test.aria.core.io.IOTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Object"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.urlRoot = Aria.rootFolderPath + 'test/';
    },
    $prototype : {
        /**
         * Specify that this test needs to be run on a visible document. This is required in IE because the flash plugin
         * (which is used in this test) is not initialized if the document inside which it is inserted is not visible.
         * @type Boolean
         */
        needVisibleDocument : true,

        setUp : function () {
            aria.core.IO.$on({
                '*' : this.checkEvent,
                'request' : this.onEvent,
                'response' : this.onEvent,
                scope : this
            });
            this.eventsState = 0;
        },
        tearDown : function () {

            aria.core.IO.$unregisterListeners(this);
            this.url = null;

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

            this.assertEquals(timers, 0, "Undisposed timers on aria.core.IO");
        },
        onEvent : function (evt) {
            if (evt.req.url == this.url) {
                // we only catch events which come for the specified URL
                try {
                    if (evt.name == 'request') {
                        this.assertTrue(this.eventsState === 0);
                        this.eventsState = 1;
                    } else if (evt.name == 'response') {
                        this.assertTrue(this.eventsState == 1);
                        this.eventsState = 2;
                    }
                } catch (ex) {}
            }
        },
        /**
         * Asynchronous test to test a file download Note: the file path is given from the index file (i.e. test
         * namespace)
         */
        testAsyncFileDownload : function () {
            this.url = this.urlRoot + "aria/core/test/TestFile.txt";
            var reqId = aria.core.IO.asyncRequest({
                url : this.url,
                callback : {
                    fn : this._onsuccessCb1,
                    scope : this,
                    onerror : this._onerrorCb1,
                    args : {
                        x : 123
                    }
                }
            });
        },
        _onsuccessCb1 : function (res, args) {
            try {
                // async callback have to run in try/catch statements
                this.assertTrue(res.url == this.url);
                this.assertTrue(res.status == '200');
                this.assertTrue(res.responseText == '[Some Test Content]');
                this.assertTrue(res.error === null);
                this.assertTrue(args.x == 123);
                this.assertTrue(this.eventsState == 2); // check that events were correctly sent
                // TODO: check callback cleanup
            } catch (ex) {}
            this.notifyTestEnd("testAsyncFileDownload");
        },
        _onerrorCb1 : function () {
            try {
                // async callback have to run in try/catch statements
                this.fail("Unexpected error callback called (1)");
            } catch (ex) {}
            this.notifyTestEnd("testAsyncFileDownload");
        },

        /**
         * Error validation in case of invalid URL
         */
        testAsyncUrlError : function () {
            this.url = "%BAD_REQUEST_TEST%";
            var reqId = aria.core.IO.asyncRequest({
                url : this.url,
                callback : {
                    fn : this._onsuccessCb2,
                    scope : this,
                    onerror : this._onerrorCb2,
                    args : {
                        x2 : 123
                    }
                }
            });
        },
        _onsuccessCb2 : function (res, args) {
            try {
                // async callback have to run in try/catch statements
                this.fail("Unexpected success callback called (2)");
            } catch (ex) {}
            this.notifyTestEnd("testAsyncUrlError");
        },
        _onerrorCb2 : function (res, args) {
            try {
                // async callback have to run in try/catch statements
                this.assertTrue(res.url == this.url);
                // on some browsers (IE 8, Opera), a bad request is not even sent to the server, so there is no status
                this.assertTrue(res.status != 200);
                // depending on the server software, the text of the error may change:
                this.assertTrue(res.error !== "");
                this.assertTrue(args.x2 == 123);
                this.assertTrue(this.eventsState == 2); // check that events were correctly sent
            } catch (ex) {}
            this.notifyTestEnd("testAsyncUrlError");
        },

        /**
         * Asynchronous XDR test - to test timeout simply reduce the timeout parameter and trigger the failure handler:
         * timeout : 100 - to test xdr increase the timeout and trigger the success handler: timeout : 60000
         */
        testAsyncXdr : function () {
            var oScope = this;
            // Event handler for the success event
            this.handleSuccess = function (o) {
                try {
                    oScope.assertTrue(o.responseText !== null);

                    // There shouln't be pending requests
                    var pending = aria.utils.Object.keys(aria.core.IO.pendingRequests);
                    oScope.assertTrue(pending.length === 0, "Pending requests inside aria.core.IO");
                } catch (ex) {}
                oScope.notifyTestEnd("testAsyncXdr", true);
            };

            // Event handler for the failure event
            this.handleFailure = function (o) {
                try {
                    oScope.assertFalse(o === 'undefined');
                } catch (ex) {}
                oScope.notifyTestEnd("testAsyncXdr", true);
            };

            // Set up the callback object used for the transaction.
            this.callback = {
                fn : this.handleSuccess,
                scope : this,
                onerror : this.handleFailure,
                onerrorScope : this,
                timeout : 100
            };

            // Make request
            aria.core.IO.asyncRequest({
                method : 'GET',
                url : "http://pipes.yahooapis.com/pipes/pipe.run?_id=giWz8Vc33BG6rQEQo_NLYQ&_render=json",
                callback : this.callback
            });

            try {
                this.assertLogsEmpty();
            } catch (ex) {
                this.notifyTestEnd("testAsyncXdr");
            }
        },

        /**
         * Asynchronous failing XDR test
         */
        testAsyncFailingXdr : function () {
            // Make request
            aria.core.IO.asyncRequest({
                // this request should fail as there is no crossdomain.xml file in http://www.google.com/
                method : 'GET',
                url : "http://www.google.com/",
                callback : {
                    fn : this._failingXdrHandleSuccess,
                    scope : this,
                    onerror : this._failingXdrHandleFailure,
                    onerrorScope : this
                }
            });

            try {
                this.assertLogsEmpty();
            } catch (ex) {
                this.notifyTestEnd("testAsyncFailingXdr");
            }
        },

        // Event handler for the success event
        _failingXdrHandleSuccess : function (o) {
            try {
                this.fail("This request should not succeed");
            } catch (ex) {}
            this.notifyTestEnd("testAsyncFailingXdr");
        },

        // Event handler for the success event
        _failingXdrHandleFailure : function (o) {
            this.notifyTestEnd("testAsyncFailingXdr");
        },

        /**
         * Test the abort function. An abort happens when the callback timeout is shorter than the request's timeout.
         */
        testAsyncAbort : function () {
            aria.core.IO.$onOnce({
                "abortEvent" : {
                    fn : function (evt) {
                        // Yeld
                        aria.core.Timer.addCallback({
                            fn : this._onTestAbortEvent,
                            scope : this,
                            args : evt,
                            dalay : 100
                        });
                    },
                    scope : this
                }
            });

            aria.core.IO.asyncRequest({
                method : "GET",
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                callback : {
                    fn : this._onTestAbortSuccess,
                    scope : this,
                    onerror : this._onTestAbortError,
                    onerrorScope : this
                },
                timeout : 1
            });
        },

        _onTestAbortSuccess : function () {
            try {
                this.fail("Success function shouldn't be called");
            } catch (er) {}

            this.notifyTestEnd("testAsyncAbort");
        },

        _onTestAbortEvent : function (evt) {
            this.assertTrue(this.__abortCallbackCalled, "Error callback was not called");
            this.assertEquals(evt.name, "abortEvent", "Abort callback received a weird event");
            this.assertTrue(!!evt.o, "Missing transaction object");
            this.assertTrue(evt.o.transaction >= 1, "Invalid transaction identifier");
            this.notifyTestEnd("testAsyncAbort");
        },

        _onTestAbortError : function () {
            this.__abortCallbackCalled = true;
        },

        /**
         * Test postHeader property in aria.core.CfgBeans.IOAsyncRequestCfg.
         */
        testAsyncConfigurePostHeader : function () {
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                method : "POST",
                postData : "my post data",
                postHeader : "text/plain",
                callback : {
                    fn : this._configurePostHeaderResponse,
                    scope : this
                }
            }
            var valid = aria.core.JsonValidator.normalize({
                json : request,
                beanName : "aria.core.CfgBeans.IOAsyncRequestCfg"
            }, true);
            this.assertTrue(valid);
            this.assertTrue(request.postHeader === "text/plain");
            aria.core.IO.asyncRequest(request);
        },

        /**
         * Test no postHeader property in aria.core.CfgBeans.IOAsyncRequestCfg.
         */
        testAsyncNoPostHeader : function () {
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                method : "POST",
                postData : "my post data",
                callback : {
                    fn : this._noPostHeaderResponse,
                    scope : this
                }
            }
            var valid = aria.core.JsonValidator.normalize({
                json : request,
                beanName : "aria.core.CfgBeans.IOAsyncRequestCfg"
            }, true);
            this.assertTrue(valid);
            this.assertTrue(request.postHeader === "application/x-www-form-urlencoded; charset=UTF-8");
            this.assertTrue(request.contentTypeHeader === "application/x-www-form-urlencoded; charset=UTF-8");
            aria.core.IO.asyncRequest(request);
        },

        /**
         * Test contentTypeHeader, data properties in aria.core.CfgBeans.IOAsyncRequestCfg.
         */
        testAsyncConfigureContentTypeHeader : function () {
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                method : "POST",
                data : "my post",
                contentTypeHeader : "text/plain",
                callback : {
                    fn : this._configureContentTypeHeaderResponse,
                    scope : this
                }
            }
            var valid = aria.core.JsonValidator.normalize({
                json : request,
                beanName : "aria.core.CfgBeans.IOAsyncRequestCfg"
            }, true);
            this.assertTrue(valid);
            this.assertTrue(request.contentTypeHeader === "text/plain");
            aria.core.IO.asyncRequest(request);
        },

        /**
         * Callback for testAsyncConfigurePostHeader.
         */
        _configurePostHeaderResponse : function (res) {
            this.assertTrue(res.status === 200);
            this.notifyTestEnd("testAsyncConfigurePostHeader");
        },

        /**
         * Callback for testAsyncNoPostHeader.
         */
        _noPostHeaderResponse : function (res) {
            this.assertTrue(res.status === 200);
            this.notifyTestEnd("testAsyncNoPostHeader");
        },

        /**
         * Callback for testAsyncConfigureContentTypeHeader.
         */
        _configureContentTypeHeaderResponse : function (res) {
            this.assertTrue(res.status === 200);
            this.notifyTestEnd("testAsyncConfigureContentTypeHeader");
        },
        /**
         * Test HEAD Request Method.
         */
        testAsyncHead : function () {
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                method : "HEAD",
                callback : {
                    fn : this._asyncHeadResponse,
                    scope : this
                }
            }
            aria.core.IO.asyncRequest(request);
        },

        /**
         * Callback for testAsyncHead.
         */
        _asyncHeadResponse : function (res) {
            this.assertTrue(res.responseText === "");
            this.assertTrue(res.status === 200);
            this.notifyTestEnd("testAsyncHead");
        },
        /**
         * Test OPTIONS Request Method.
         */
        testAsyncOptionsRequest : function () {
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                method : "OPTIONS",
                callback : {
                    fn : this._asyncOptionsResponse,
                    scope : this
                }
            }
            aria.core.IO.asyncRequest(request);
        },

        /**
         * Callback for testAsyncOptions.
         */
        _asyncOptionsResponse : function (res) {
            this.assertTrue(res.status === 200);
            this.notifyTestEnd("testAsyncOptionsRequest");
        }
    }
});