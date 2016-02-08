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

Aria.classDefinition({
    $classpath : "test.aria.core.io.FormSubmit",
    $extends : "test.aria.core.io.BaseIOTest",
    $dependencies : ["test.aria.core.test.IOFilterSample", "aria.utils.Dom", "aria.utils.String", "aria.utils.Xml"],
    $constructor : function () {
        this.$BaseIOTest.constructor.call(this);
        this.request = {};
    },
    $prototype : {
        /**
         * Adds listeners when test is run
         */
        setUp : function () {
            aria.core.IO.$on({
                '*' : this.checkEvent,
                'request' : this.onEvent,
                'response' : this.onEvent,
                scope : this
            });
            this.eventsState = 0;
        },

        /**
         * Resets any transport configuration, removes any listeners, and removes timers.
         */
        tearDown : function () {
            // make sure the form is removed from the DOM:
            aria.utils.Dom.replaceHTML("TESTAREA", "");

            aria.core.IO.$unregisterListeners(this);
            this.url = null;
            this.request = {};
            this.$BaseIOTest.tearDown.call(this);
        },

        /**
         * Event catcher for a specific url.
         * @param {Object} evt
         */
        onEvent : function (evt) {
            if (evt.req.url == this.url) {
                // we only catch events which come for the specified URL
                try {
                    if (evt.name == 'request') {
                        this.assertTrue(this.eventsState === 0);
                        this.eventsState = 1;
                    } else if (evt.name == 'response') {
                        this.assertTrue(this.eventsState === 1);
                        this.eventsState = 2;
                    }
                } catch (ex) {}
            }
        },

        /**
         * Used to test failed call of asyncFormSubmit (no form)
         */
        testAsyncFormSubmissionWithoutForm : function () {
            this._setFormRequestObject("testAsyncFormSubmissionWithoutForm", {
                success : false
            });
            this.request.callback.onerror = this._testAsyncFormSubmissionWithoutForm;
            aria.core.IO.asyncFormSubmit(this.request);
        },

        /**
         * Attempts to make a form submission when there is no html form defined in the page.
         */
        _testAsyncFormSubmissionWithoutForm : function () {
            this.assertErrorInLogs(aria.core.IO.MISSING_FORM);
            this.notifyTestEnd("testAsyncFormSubmissionWithoutForm");
        },

        /**
         * Makes a form submission using an html form element in the request
         */
        testAsyncFormSubmissionWithForm : function () {
            this._injectForm();
            this._setFormRequestObject("testAsyncFormSubmissionWithForm", {
                success : true
            });
            this.request.form = aria.utils.Dom.getElementById(this.request.formId);
            delete this.request.formId;
            aria.core.IO.asyncFormSubmit(this.request);
        },

        /**
         * Makes a form submission, expecting an XML response.
         */
        testAsyncFormSubmissionXmlResponse : function () {
            this._injectForm();
            this._setFormRequestObject("testAsyncFormSubmissionXmlResponse", {
                success : true,
                expectsXml : true
            });
            this.request.url = Aria.rootFolderPath + "test/aria/core/test/TestFile.xml";
            aria.core.IO.asyncFormSubmit(this.request);
        },

        /**
         * Makes a form submission using a form name in the request
         */
        testAsyncFormSubmissionWithFormId : function () {
            this._injectForm();
            this._setFormRequestObject("testAsyncFormSubmissionWithFormId", {
                success : true
            });
            aria.core.IO.asyncFormSubmit(this.request);
        },

        /**
         * Uses a timeout to test the request abort
         */
        testAsyncFormSubmissionWithTimeout : function () {
            this._injectForm();
            aria.core.IO.$onOnce({
                "abortEvent" : {
                    fn : this._ioAbortWithTimeout,
                    scope : this,
                    args : {
                        testName : "testAsyncFormSubmissionWithTimeout"
                    }
                }
            });

            aria.core.IO.asyncFormSubmit({
                formId : "simulateAsyncFormSubmit",
                callback : {
                    fn : this._failWithTimeout,
                    onerror : this._abortWithTimeout,
                    scope : this,
                    args : {
                        testName : "testAsyncFormSubmissionWithTimeout"
                    }
                },
                timeout : 1
            });
        },

        _failWithTimeout : function (args) {
            this.assertTrue(false, "Form shouldn't be submitted");
        },

        _abortWithTimeout : function (response, args) {
            this.assertEquals(response.status, 0);
            this.assertEquals(response.statusText, aria.core.IO.TIMEOUT_ERROR);
            this.assertEquals(response.req.formId, "simulateAsyncFormSubmit");
            this.assertTrue(this.__abortEventCalled, "Evento was not raised");

            // Wait a little buit just to check that the response callback is not called
            aria.core.Timer.addCallback({
                fn : function () {
                    this.notifyTestEnd(args.testName);
                },
                scope : this
            });
        },

        _ioAbortWithTimeout : function () {
            this.__abortEventCalled = true;
        },

        /**
         * Uses a filter for the request and the response to change the type of request to use a different transport.
         * Also changes the timeout, url, and the response status.
         */
        testAsyncFormSubmissionWithFilter : function () {
            this._injectForm();
            this._setFormRequestObject("testAsyncFormSubmissionWithFilter", {
                success : false
            });

            // add a filter to change the type of request to use a different transport
            aria.core.IOFiltersMgr.addFilter({
                classpath : "test.aria.core.test.IOFilterSample",
                initArgs : {
                    onRequest : function (req) {
                        delete req.form;// remove formId will be treated as a file request using the local
                        // transport
                        req.timeout = 1000;// change timeout from the default of 6 secs to 1 sec to speed up the test
                        req.url = req.url + "x";// change url to a non existent file
                    },
                    onResponse : function (req) {
                        req.res.status = -1;// changing the response status
                    }
                }
            });
            aria.core.IO.asyncFormSubmit(this.request);
        },

        /**
         * Helper to set the request object
         * @param {String} testName
         * @protected
         */
        _setFormRequestObject : function (testName, expectedResult) {
            this.request = {
                formId : "simulateAsyncFormSubmit",
                callback : {
                    fn : this._testFormHandlerSuccess,
                    onerror : this._testFormHandlerError,
                    scope : this,
                    args : {
                        testName : testName,
                        expectedResult : expectedResult
                    }
                }
            };
        },

        /**
         * Helper to create the mock form
         * @protected
         */
        _injectForm : function () {
            aria.utils.Dom.replaceHTML("TESTAREA", "<form enctype='multipart/form-data' name='simulateAsyncFormSubmit' id='simulateAsyncFormSubmit' method='POST' action='"
                    + Aria.rootFolderPath
                    + "test/aria/core/test/TestFile.html'><input type='text' id='simulateAsyncFileUpload' name='simulateAsyncFileUpload' value='test.txt' style='-moz-opacity:0;filter:alpha(opacity: 0);opacity: 0;'></form>");
        },

        /**
         * Callback used when request was successful
         * @param {Object} request
         * @protected
         */
        _testFormHandlerSuccess : function (response, args) {
            try {
                var expectedResult = args.expectedResult;
                this.assertTrue(expectedResult.success, "Expecting a failure and got a success.");
                this.assertTrue(response.status === 200);
                this.assertTrue(aria.utils.Type.isString(response.responseText), "responseText must be a string");
                if (expectedResult.expectsXml) {
                    var docElement = response.responseXML.documentElement;
                    this.assertTrue(docElement.nodeName == "response");
                    var json = aria.utils.Xml.convertXmlNodeToJson(docElement);
                    this.assertTrue(json.content1 == "<Hello world!>");
                } else {
                    this.assertTrue(aria.utils.String.trim(response.responseText) == "Test file content. &lt;=<  &gt;=>.Tags: <b>in a <b> tag</b>.");
                }
                this._removeFilter();
                this.notifyTestEnd(args.testName);
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        /**
         * Callback used when request failed
         * @param {Object} request
         * @protected
         */
        _testFormHandlerError : function (response, args) {
            try {
                var expectedResult = args.expectedResult;
                this.assertFalse(expectedResult.success, "Expecting a success and got a failure.");
                this.assertTrue(response.status === -1);
                this._removeFilter();
                this.notifyTestEnd(args.testName);
            } catch (e) {
                this.handleAsyncTestError(e);
            }
        },

        /**
         * Removes a filter when there is one present
         * @protected
         */
        _removeFilter : function () {
            if (aria.core.IOFiltersMgr.isFilterPresent("test.aria.core.test.IOFilterSample")) {
                var res = aria.core.IOFiltersMgr.removeFilter("test.aria.core.test.IOFilterSample");
                this.assertTrue(res);
            }
        }
    }
});
