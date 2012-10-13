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
 * Test for transports used by IO
 */
Aria.classDefinition({
    $classpath : 'test.aria.core.io.IOTransportTest',
    $extends : 'aria.jsunit.TestCase',
    $dependencies : ["test.aria.core.test.IOFilterSample", "aria.utils.Dom", "aria.utils.String", "aria.utils.Xml"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
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

            aria.core.IO.updateTransports({
                "sameDomain" : "aria.core.transport.XHR",
                "crossDomain" : "aria.core.transport.XDR",
                "jsonp" : "aria.core.transport.JsonP",
                "local" : "aria.core.transport.Local",
                "iframe" : "aria.core.transport.IFrame"
            });

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

            this.request = {};

            this.assertEquals(timers, 0, "Undisposed timers on aria.core.IO");
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
                        this.assertTrue(this.eventsState == 1);
                        this.eventsState = 2;
                    }
                } catch (ex) {}
            }
        },

        /**
         * Helper creating custom transports to be used by the tests.
         * @protected
         */
        _customTransports : function () {
            /**
             * Base Custom Transport class.
             * @class myApplication.transports.BaseXHR
             */
            Aria.classDefinition({
                $classpath : "myApplication.transports.BaseXHR",
                $constructor : function () {},
                $prototype : {}
            });

            /**
             * Custom Transport class for same origin requests.
             * @class myApplication.transports.SameDomainCustomTransport
             * @extends aria.core.transport.BaseXHR
             * @singleton
             */
            Aria.classDefinition({
                $classpath : "myApplication.transports.SameDomainCustomTransport",
                $extends : "myApplication.transports.BaseXHR",
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for different origin requests.
             * @class myApplication.transports.CrossDomainCustomTransport
             * @extends aria.core.transport.BaseXHR
             * @singleton
             */
            Aria.classDefinition({
                $classpath : "myApplication.transports.CrossDomainCustomTransport",
                $extends : "myApplication.transports.BaseXHR",
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for JsonP requests.
             * @class myApplication.transports.JsonPCustomTransport
             * @extends aria.core.transport.BaseXHR
             * @singleton
             */
            Aria.classDefinition({
                $classpath : "myApplication.transports.JsonPCustomTransport",
                $extends : "myApplication.transports.BaseXHR",
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for local requests.
             * @class myApplication.transports.LocalCustomTransport
             * @extends aria.core.transport.BaseXHR
             * @singleton
             */
            Aria.classDefinition({
                $classpath : "myApplication.transports.LocalCustomTransport",
                $extends : "myApplication.transports.BaseXHR",
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });

            /**
             * Custom Transport class for IFrame requests.
             * @class myApplication.transports.IFrameCustomTransport
             * @extends aria.core.transport.BaseXHR
             * @singleton
             */
            Aria.classDefinition({
                $classpath : "myApplication.transports.IFrameCustomTransport",
                $extends : "myApplication.transports.BaseXHR",
                $singleton : true,
                $constructor : function () {
                    this.$BaseXHR.constructor.call(this);
                },
                $prototype : {}
            });
        },

        /**
         * Tests the default transports set by the framework then sets and tests custom transports.
         */
        testSetTransports : function () {
            // Test the default settings for transports in IO.
            var transports = aria.core.IO.getTransports();
            this.assertTrue(transports.sameDomain === "aria.core.transport.XHR");
            this.assertTrue(transports.crossDomain === "aria.core.transport.XDR");
            this.assertTrue(transports.jsonp === "aria.core.transport.JsonP");
            this.assertTrue(transports.local === "aria.core.transport.Local");
            this.assertTrue(transports.iframe === "aria.core.transport.IFrame");

            // Test the loading of custom transports and the storing of the transport class names and paths in IO.
            this._customTransports();
            aria.core.IO.updateTransports({
                "sameDomain" : "myApplication.transports.SameDomainCustomTransport",
                "crossDomain" : "myApplication.transports.CrossDomainCustomTransport",
                "jsonp" : "myApplication.transports.JsonPCustomTransport",
                "local" : "myApplication.transports.LocalCustomTransport",
                "iframe" : "myApplication.transports.IFrameCustomTransport"
            });
            transports = aria.core.IO.getTransports();
            var sameDomainTransport = Aria.getClassRef(transports.sameDomain);
            var crossDomainTransport = Aria.getClassRef(transports.crossDomain);
            var jsonpTransport = Aria.getClassRef(transports.jsonp);
            var localTransport = Aria.getClassRef(transports.local);
            var iframeTransport = Aria.getClassRef(transports.iframe);

            this.assertTrue(aria.utils.Type.isInstanceOf(sameDomainTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(crossDomainTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(jsonpTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(localTransport, 'myApplication.transports.BaseXHR'));
            this.assertTrue(aria.utils.Type.isInstanceOf(iframeTransport, 'myApplication.transports.BaseXHR'));
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
            this._setFormRequestObject("testAsyncFormSubmissionWithTimeout", {
                success : true
            });
            this.request.timeout = 10;
            aria.core.IO.asyncFormSubmit(this.request);
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