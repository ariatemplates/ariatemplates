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
 * This test shows how one can intercept (for logging purposes etc.) the HTTP requests that either failed (404 or other
 * error code) or timed out.
 */
Aria.classDefinition({
    $classpath : "test.aria.core.io.FailedRequestsInterceptionTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.core.IO"],
    $prototype : {
        showLogs : false, // change to true to have errors printed to console

        tearDown : function () {
            if (this.listenersCfg) {
                aria.core.IO.$removeListeners(this.listenersCfg);
                this.listenersCfg = null;
            }

            aria.core.IO.defaultTimeout = aria.core.IO.classDefinition.$prototype.defaultTimeout;
        },

        /**
         * This test method shows how to use aria.core.IO::abortEvent event to handle IO timeouts (file not fetched from
         * the server within the specified timeout; default timeout in AT is 60 seconds but can be changed by setting
         * aria.core.IO.defaultTimeout value)
         */
        testAsyncHandleTimeout : function () {
            aria.core.IO.defaultTimeout = 1;

            // when a request is aborted due to timeout, the 'abortEvent' event is raised by 'aria.core.IO' class
            this.listenersCfg = {
                "abortEvent" : {
                    scope : this,
                    fn : function (evt) {
                        this.__logErrorDetails('timeout', evt);
                        this.downloadAbortEventRaised = true;
                    }
                }
            };
            aria.core.IO.$addListeners(this.listenersCfg);

            this.downloadAbortEventRaised = false;
            aria.core.IO.asyncRequest({
                url : "/middleware/echo?delay=100&content=[Some Test Content]",
                method : "GET",
                callback : {
                    fn : this.__failTest,
                    scope : this,
                    onerror : function () {
                        this.assertTrue(this.downloadAbortEventRaised);
                        this.notifyTestEnd("testAsyncHandleTimeout");
                    },
                    onerrorScope : this
                }
            });
        },

        /**
         * This test method shows how to use aria.core.IO::response event to catch 404 and other HTTP error response
         * status codes
         */
        testAsyncHandle404 : function () {
            // Set custom listener for 'response' event of 'aria.core.IO' in which we call the callback
            // when the HTTP response code of the response signifies an error
            this.listenersCfg = {
                "response" : {
                    fn : function (evt) {
                        var status = evt.req.res.status;
                        var ok = status >= 200 && status < 300 || status === 304;
                        if (!ok) {
                            this.__logErrorDetails('httpStatus', evt);
                            this.downloadFailedEventRaised = true;
                        }
                    },
                    scope : this
                }
            };
            aria.core.IO.$addListeners(this.listenersCfg);

            this.downloadFailedEventRaised = false;
            // Let's ask for a non-existing file. We expect the 'onerror' callback to be raised, but before, the
            // 'response' event of aria.core.IO should be raised and trigger our error logging function
            aria.core.IO.asyncRequest({
                url : aria.core.DownloadMgr.resolveURL("test/aria/core/test/NonExistingFile.txt", true),
                method : "GET",
                callback : {
                    fn : this.__failTest,
                    scope : this,
                    onerror : function () {
                        // 'response' event is raised before success / error callback
                        this.assertTrue(this.downloadFailedEventRaised);
                        this.notifyTestEnd("testAsyncHandle404");
                    },
                    onerrorScope : this
                }
            });
        },

        __failTest : function () {
            this.fail("The success callback should not have been called!");
        },

        __logErrorDetails : function (reason, evt) {
            if (this.showLogs) {
                this.$logWarn("Download error!");
                this.$logWarn("----------------");
                this.$logWarn("Reason: " + reason); // "httpStatus" or "timeout"
                this.$logWarn("Method: " + evt.req.method); // "GET"
                this.$logWarn("URL: " + evt.req.url); // "../test/aria/core/test/NonExistingFile.txt"

                if (evt.req.res) {
                    this.$logWarn("Status: " + evt.req.res.status); // 404
                    this.$logWarn("Error message: " + evt.req.res.error); // "404 Not Found"
                }
            }
        }
    }
});
