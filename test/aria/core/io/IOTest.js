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
         * The Content-Type header should be taken from aria.core.IO.postHeaders if not present directly in the request
         */
        testAsyncDefaultHeaders_ContentType : function () {
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                method : "POST",
                data : "my post data",
                callback : {
                    fn : this._defaultHeaders_ContentType_Response,
                    scope : this
                }
            };
            var valid = aria.core.JsonValidator.normalize({
                json : request,
                beanName : "aria.core.CfgBeans.IOAsyncRequestCfg"
            }, true);
            this.assertTrue(valid);

            // asyncRequest will normalize the request internally, let's check it on a clone ourselves
            var normalizedRequest = aria.utils.Json.copy(request, false);
            aria.core.IO.__normalizeRequest(normalizedRequest);
            this.assertEquals(normalizedRequest.headers["Content-Type"], "application/x-www-form-urlencoded; charset=UTF-8");

            aria.core.IO.asyncRequest(request);
        },

        _defaultHeaders_ContentType_Response : function (res) {
            this.assertEquals(res.status, 200);
            this.notifyTestEnd("testAsyncDefaultHeaders_ContentType");
        },

        /**
         * Test overriding Content-Type in headers property in aria.core.CfgBeans.IOAsyncRequestCfg.<br>
         * This should override the default value from aria.core.IO.postHeaders
         */
        testAsyncConfigureHeaders_ContentType : function () {
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt",
                method : "POST",
                data : "my post data",
                headers : {
                    "Content-Type" : "text/plain"
                },
                callback : {
                    fn : this._configureHeaders_ContentType_Response,
                    scope : this
                }
            };
            var valid = aria.core.JsonValidator.normalize({
                json : request,
                beanName : "aria.core.CfgBeans.IOAsyncRequestCfg"
            }, true);
            this.assertTrue(valid);
            this.assertEquals(request.headers["Content-Type"], "text/plain");

            // asyncRequest will normalize the request internally, let's check it on a clone ourselves
            var normalizedRequest = aria.utils.Json.copy(request, false);
            aria.core.IO.__normalizeRequest(normalizedRequest);
            this.assertEquals(normalizedRequest.headers["Content-Type"], "text/plain");

            aria.core.IO.asyncRequest(request);
        },
        _configureHeaders_ContentType_Response : function (res) {
            this.assertEquals(res.status, 200);
            this.notifyTestEnd("testAsyncConfigureHeaders_ContentType");
        },

        /**
         * Test HEAD Request Method.
         */
        testAsyncHead : function () {
            // Firefox 3.6 mistakenly reuses cached previous POST responses for this HEAD request, hence making the test
            // fail. As a workaround, we append a query string here.
            var request = {
                url : this.urlRoot + "aria/core/test/TestFile.txt?ts=" + (+new Date()),
                method : "HEAD",
                callback : {
                    fn : this._asyncHeadResponse,
                    scope : this
                }
            };
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
            };
            aria.core.IO.asyncRequest(request);
        },

        /**
         * Callback for testAsyncOptions.
         */
        _asyncOptionsResponse : function (res) {
            this.assertTrue(res.status === 200);
            this.notifyTestEnd("testAsyncOptionsRequest");
        },

        /**
         * Synchronous test to test a file download Note: the file path is given from the index file (i.e. test
         * namespace)
         */
        testSyncFileDownload : function () {
            this.url = this.urlRoot + "aria/core/test/TestFile.txt";
            this.syncFlag = false;
            var reqId = aria.core.IO.asyncRequest({
                url : this.url,
                async : false,
                callback : {
                    fn : this._onsuccessSyncCb,
                    scope : this,
                    onerror : this._onerrorSyncCb,
                    args : {
                        x : 123
                    }
                }
            });

            this.assertTrue(this.syncFlag, "Sync flag has not been set to true");
        },
        _onsuccessSyncCb : function (res, args) {
            this.assertEquals(res.responseText, "[Some Test Content]", "Response text is %1 instead of %2");
            this.syncFlag = true;
        },
        _onerrorSyncCb : function () {
            this.fail("Unexpected error callback called (2)");
        }
    }
});
