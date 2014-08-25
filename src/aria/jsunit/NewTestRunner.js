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
var Aria = require("../Aria");
var ariaJsunitTestEngine = require("./TestEngine");
var ariaJsunitTestReport = require("./TestReport");
var ariaCoreLog = require("../core/Log");
var ariaJsunitTestWrapper = require("./TestWrapper");
var ariaCoreJsObject = require("../core/JsObject");
var ariaCoreDownloadMgr = require("../core/DownloadMgr");


/**
 * HTML UI Renderer for aria.jsunit.TestEngine
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.NewTestRunner",
    $events : {
        "preloadBegin" : "preloadBegin",
        "preloadEnd" : "preloadEnd",
        "campaignBegin" : "campaignBegin",
        "campaignEnd" : "campaignEnd",
        "campaignChange" : "campaignChange"
    },
    $constructor : function () {
        /**
         * @private
         * @type aria.jsunit.TestEngine
         */
        this._testEngine = null;

        /**
         * @private
         * @type aria.jsunit.TestReport
         */
        this._reporter = new ariaJsunitTestReport({
            testRunner : this
        });

        this.__overrideGetURLWithTimestamp();

        /**
         * @private
         * @type String
         */
        this._rootClasspath = "";

        /**
         * If true, all test cases will be run in isolated mode (inside an iframe), so that they don't have any impact
         * on one another.
         * @type Boolean
         */
        this.runIsolated = false;
    },
    $destructor : function () {
        if (this._testEngine) {
            this._testEngine.$dispose();
        }

        if (this._reporter) {
            this._reporter.$dispose();
        }

        this._outputDiv = null;
    },
    $prototype : {
        /**
         * @return {aria.jsunit.TestReport}
         */
        getReporter : function () {
            return this._reporter;
        },

        /**
         * Preload all the test suites for the current test campaign. Will fire the "preloadEnd" event when the preload
         * is finished
         */
        preload : function () {
            this.$raiseEvent("preloadBegin");
            var classCstr = Aria.getClassRef(this._rootClasspath);
            if (classCstr.prototype.$TestSuite) {
                // Instanciate the test suite object
                this._rootTest = new classCstr();
                this._rootTest.$on({
                    "preloadEnd" : {
                        fn : this._onPreloadEnd,
                        scope : this
                    }
                });
                this._rootTest.preload();
            } else {
                if (this.runIsolated) {
                    this._rootTest = new ariaJsunitTestWrapper(this._rootClasspath);
                } else {
                    // Instanciate the test object
                    this._rootTest = new classCstr();
                }
                // root test is a test case, no further preload is required
                this.$raiseEvent("preloadEnd");
            }
        },

        /**
         * Callback triggered when the preload of the root test class has been completed
         * @protected
         */
        _onPreloadEnd : function () {
            this.$raiseEvent("preloadEnd");
        },

        /**
         * @param {String} classpath Classpath of the root test for this campaign. The root test can either be a
         * TestCase or a TestSuite
         */
        setRootClasspath : function (classpath) {
            this._rootClasspath = classpath;
        },

        /**
         * Main function to call to run the test. If no div corresponding to outputDivId is found in the DOM, a new DIV
         * is created and appended at the end of the document body
         * @param {aria.jsunit.Test} test the Test to run (e.g. Test case or Test suite)
         * @param {Array} skipTests A collection of tests to be skipped (Test case or Test suite)
         */
        run : function (test, skipTests) {
            this.__overrideLogError();
            // init the engine
            this.$raiseEvent("campaignBegin");
            var testEngine = this.getEngine();

            // run the test
            testEngine.runTest(this._rootTest, skipTests);
        },

        /**
         * Override the aria.core.JsObject implementation of $logError in order to keep a trace of all the logged errors
         * This is then used in the TestSuite to provide more detailed failure information to the user in case a test
         * load fails for instance
         * @private
         */
        __overrideLogError : function () {
            // backup original $logError
            var bkpLogError = ariaCoreJsObject.prototype.$logError;
            // override $logError
            ariaCoreJsObject.prototype.$logError = function (id, args, error) {
                var msg = ariaCoreLog.prepareLoggedMessage(id, args);
                var errorMessage = (error ? ". Error : " + error.message : "");
                if (!Aria.__runtimeErrors)
                    Aria.__runtimeErrors = [];
                Aria.__runtimeErrors.push(msg + errorMessage);

                // call the original $logError
                return bkpLogError.apply(this, arguments);
            };
        },

        /**
         * We override getURLWithTimestamp in aria.core.DownloadMgr to force all URLs to be called with a timestamp.
         * This should avoid cache issues for all users.
         */
        __overrideGetURLWithTimestamp : function () {
            // backup original getURLWithTimestamp
            var bkpGetURLWithTimestamp = ariaCoreDownloadMgr.getURLWithTimestamp;
            // override getURLWithTimestamp
            ariaCoreDownloadMgr.getURLWithTimestamp = function (url, force) {
                // call the original getURLWithTimestamp
                return bkpGetURLWithTimestamp.apply(ariaCoreDownloadMgr, [url, true]);
            };
        },

        /**
         * Internal listener called when a change occurs during the test execution
         * @param {aria.jsunit.TestEngine:change:event} evt the event
         * @private
         */
        _onChange : function (evt) {
            var tp = evt.changeType;
            if (tp == 'testStart' || tp == 'testEnd') {
                this.$raiseEvent("campaignChange");
                if (this._testEngine.isFinished()) {
                    this.$raiseEvent("campaignEnd");
                }
            }
        },

        /**
         * Return the root test case
         */
         getRootTest : function () {
             return this._rootTest;
         },

         /**
         * Retrieve all the TestCase objects contained in a given TestSuite instance. This will recursively inspect all
         * the sub test suites as well. TestCases will be returned as an array of test wrappers
         * {instance:{aria.jsunit.TestCase},classpath:{String}}. As usual, only the classpath property might be
         * available at this stage.
         * @param {aria.jsunit.TestSuite} testSuite
         * @return {Array}
         */
        _getTestCases : function (testSuite) {
            var testCases = [];
            if (!testSuite.$TestSuite) {
                return [{
                            classpath : testSuite.$classpath,
                            instance : testSuite
                        }];
            }
            if (testSuite.isSkipped() || testSuite.isSelected() === -1) {
                return [];
            }
            var subTests = testSuite.getSubTests();
            for (var i = 0, l = subTests.length; i < l; i++) {
                var test = subTests[i];
                if (test.classpath.indexOf("TestSuite") != -1) {
                    var subCases = this._getTestCases(test.instance);
                    testCases = testCases.concat(subCases);
                } else {
                    testCases.push(test);
                }
            }

            return testCases;
        },

        /**
         * @return {Array} the array of test cases
         */
        getTestCases : function () {
            return this._getTestCases(this._rootTest);
        },

        /**
         * Retrieve the number of valid tests for the current test campaign
         * @return {Number}
         */
        getTestsCount : function () {
            var rootTest = this._rootTest;
            return this._getTestCases(rootTest).length;
        },

        /**
         * Retrieve the array of finished tests for the current test campaign
         * @return {Array}
         */
        getFinishedTests : function () {
            var testCases = this.getTestCases();
            var finishedTests = [];

            for (var i = 0, l = testCases.length; i < l; i++) {
                var testCase = testCases[i];
                if (testCase.instance && testCase.instance._isFinished) {
                    finishedTests.push(testCase);
                }
            }
            return finishedTests;
        },

        /**
         * Retrieve the amount of completed test cases during this test campaign
         * @return {Number}
         */
        getFinishedTestsCount : function () {
            return this.getFinishedTests().length;
        },

        /**
         * Retrieve the number of failed tests for the current test campaign
         * @return {Array}
         */
        getFailedTests : function () {
            var testCases = this.getTestCases();
            var failedTests = [];

            for (var i = 0, l = testCases.length; i < l; i++) {
                var testCase = testCases[i];
                if (testCase.instance && testCase.instance.hasError()) {
                    failedTests.push(testCase);
                }
            }
            return failedTests;
        },

        /**
         * @return {String}
         */
        getReport : function () {
            return this.getReporter().getReport();
        },

        /**
         * @return {Object}
         */
        getEngineReport : function () {
            var engine = this._testEngine;
            return engine.testReport;
        },

        /**
         * @return {Object}
         */
        getEngine : function () {
            if (this._testEngine == null) {
                this._testEngine = new ariaJsunitTestEngine();
                this._testEngine.runIsolated = this.runIsolated;

                this._testEngine.$on({
                    'change' : this._onChange,
                    scope : this
                });
            }
            return this._testEngine;
        }
    }
});
