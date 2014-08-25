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
var ariaJsunitSonarReport = require("./SonarReport");
var ariaUtilsDom = require("../utils/Dom");
var ariaUtilsType = require("../utils/Type");


/**
 * HTML UI Renderer for aria.jsunit.TestEngine
 * @singleton
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.TestRunner",
    $singleton : true,
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

        this._sonarReporter = new ariaJsunitSonarReport({
            testRunner : this
        });
        /**
         * @private
         * @type HTMLElement
         */
        this._outputDiv = null; // reference to the DOM output div
    },
    $destructor : function () {
        if (this._testEngine) {
            this._testEngine.$dispose();
        }

        if (this._reporter) {
            this._reporter.$dispose();
        }

        if (this._sonarReporter) {
            this._sonarReporter.$dispose();
        }

        this._outputDiv = null;
    },
    $prototype : {
        /**
         * Id of the DIV element to use as output container Can be changed by the user before run() is called
         * @type String
         */
        outputDivId : '_TestRunnerOutput_',

        /**
         * @return {aria.jsunit.TestReport}
         */
        getReporter : function () {
            return this._reporter;
        },

        getSonarReporter : function () {
            return this._sonarReporter;
        },

        /**
         * Main function to call to run the test. If no div corresponding to outputDivId is found in the DOM, a new DIV
         * is created and appended at the end of the document body
         * @param {aria.jsunit.Test} test the Test to run (e.g. Test case or Test suite)
         * @param {Array} skipTests A collection of tests to be skipped (Test case or Test suite)
         */
        run : function (test, skipTests) {
            // get a reference to the output div
            var elt = ariaUtilsDom.getElementById(this.outputDivId);
            if (elt == null) {
                var document = Aria.$window.document;
                elt = document.createElement('div');
                document.body.appendChild(elt);
            }
            this._outputDiv = elt;

            // init the engine
            var testEngine = this.getEngine();

            // update display
            this._refreshDisplay();

            this._rootTest = test;

            // run the test
            testEngine.runTest(test, skipTests);
        },

        /**
         * Internal listener called when a change occurs during the test execution
         * @param {aria.jsunit.TestEngine:change:event} evt the event
         * @private
         */
        _onChange : function (evt) {
            var tp = evt.changeType;
            if (tp == 'testStart' || tp == 'testEnd') {
                // we skip some events to avoid too many refresh
                this._refreshDisplay();
            }
        },

        /**
         * Update the test report display in the HTML div
         * @private
         */
        _refreshDisplay : function () {
            var tr = this._testEngine.testReport;

            var h = ['<div style="font-family:Arial;font-size:12px">',
                    '<span style="font-size:15px;font-weight:bold">Unit Test Report</span>', '<hr/>'];

            if (tr == null) {
                h.push('Test pending start...');
            } else {
                this._processOutput(tr, h);
            }

            h.push('</div>');

            // insert HTML report in DOM
            var elt = this._outputDiv;
            elt.innerHTML = '';
            elt.innerHTML = h.join('');
        },

        /**
         * Internal method used to process the HTML report for a given test This method is called recursively for each
         * sub-test
         * @param {aria.jsunit.TestEngine:testReport:property} trTest a test element of the test report
         * @param {Array} h the HTML output buffer
         * @private
         */
        _processOutput : function (trTest, h) {
            var color = '#000000', msg = '';
            var testObject = trTest.instance;

            if (trTest.state == 'done' && trTest.totalNbrOfFailures === 0 && trTest.totalNbrOfErrors === 0) {
                color = 'green';
                msg = ' - OK';
            } else if (trTest.totalNbrOfFailures > 0 || trTest.totalNbrOfErrors > 0) {
                color = 'red';
                var arr = [];
                if (trTest.totalNbrOfFailures > 0) {
                    var str = (trTest.totalNbrOfFailures > 1) ? ' failures' : ' failure';
                    arr.push(trTest.totalNbrOfFailures + str);
                }
                if (trTest.totalNbrOfErrors > 0) {
                    var str = (trTest.totalNbrOfErrors > 1) ? ' errors' : ' error';
                    arr.push(trTest.totalNbrOfErrors + str);
                }
                msg = ' - KO: ' + arr.join(',');
            }
            var duration = '', asserts = '';
            if (trTest.state == 'done') {
                duration = ' in ' + testObject.getExecutionTime() + ' ms';
                var str = (trTest.totalNbrOfAsserts > 1) ? 'asserts' : 'assert';
                asserts = ' (' + trTest.totalNbrOfAsserts + ' ' + str + ')';
            }

            if (trTest.state == 'skipped') {
                color = 'green';
                msg = ' - NOT TESTED';
            }

            var buffer = ['<div style="color:', color, '">', '<b>', trTest.testClass, '</b> ', msg, ' - ', '<i>',
                    trTest.state, duration, asserts, '</i>', '<a href="', trTest.retryURL,
                    '" target="_blank" style="color:blue"> retry</a>', '<br/>'];
            if (trTest.state === 'processing') {
                buffer.splice(-1, 0, '<a href=javascript:interrupt("', trTest.testClass, '");> skip</a>');
            }
            h.push(buffer.join(''));

            // failures and errors display
            this._processFailuresOrErrors(trTest, 'failures', h);
            this._processFailuresOrErrors(trTest, 'errors', h);

            if (trTest.subTests && trTest.subTests.length > 0) {
                h.push('<div style="margin-left:20px">');

                var sz = trTest.subTests.length;
                for (var i = 0; sz > i; i++)
                    this._processOutput(trTest.subTests[i], h);

                h.push('</div>');
            }

            buffer = ['</div>'];
            h.push(buffer.join(''));
        },

        getFailures : function () {
            var failures = [];
            var errors = aria.jsunit.TestRunner.getErrors();
            for (var i = 0; i < errors.length; i++) {
                failures.push(errors[i].testClass);
            }
            return failures.join(",");
        },

        /**
         * @return {Array} Array of Reports
         */
        getErrors : function () {
            var errors = [];
            var report = this.getEngineReport();
(function   (report) {
                var subTests = report.subTests;
                if (ariaUtilsType.isArray(subTests)) {
                    for (var i = 0, l = subTests.length; i < l; i++) {
                        var subTest = subTests[i];
                        arguments.callee(subTest);
                    }
                }
                var failures = [];
                if (ariaUtilsType.isArray(report.failures)) {
                    failures = failures.concat(report.failures);
                }
                if (ariaUtilsType.isArray(report.errors)) {
                    failures = failures.concat(report.errors);
                }
                if (failures.length > 0) {
                    var messages = [];
                    for (var i = 0, l = failures.length; i < l; i++) {
                        var failure = failures[i];
                        messages.push(failure.testState + " : " + failure.description);
                    }

                    errors.push({
                        retryURL : report.retryURL,
                        messages : messages,
                        testClass : report.testClass
                    });
                }

            })(report);
            errors = errors.sort(function (e1, e2) {
                var testClass1 = e1.testClass.toLowerCase(), testClass2 = e2.testClass.toLowerCase();
                if (testClass1 > testClass2) {
                    return 1;
                } else if (testClass1 == testClass2) {
                    return 0;
                }
                return -1;
            });
            return errors;
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
         * Internal method used to process the HTML report of failures and errors (similar type of output)
         * @param {aria.jsunit.TestEngine:testReport:property} trTest a test element of the test report
         * @param {Enum} type the target of the call: 'failures' or 'errors'
         * @param {Array} h the HTML output buffer
         * @private
         */
        _processFailuresOrErrors : function (trTest, type, h) {
            var isFailure = (type == 'failures');
            if (trTest[type] && trTest[type].length > 0) {
                h.push('<div style="margin-left:20px;color:#000000">');

                var sz = trTest[type].length;
                for (var i = 0; sz > i; i++) {
                    var itm = trTest[type][i];
                    if (isFailure) {
                        h.push("Failure #" + (i + 1));
                    } else {
                        h.push("Error #" + (i + 1));
                    }
                    h.push(': ');
                    if (itm.description) {
                        h.push(itm.description);
                    } else {
                        if (isFailure) {
                            h.push('Failure');
                        } else {
                            h.push('Error');
                        }
                    }
                    h.push(' in <i>' + itm.testState + '</i>');
                    h.push("<br/>");
                }

                h.push('</div>');
            }
        },

        /**
         * @private
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
            if (testSuite.isSkipped() || testSuite.isSelected() == -1) {
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
         * Interrupt the current test.
         * @param {String} testClass Current test classpath.
         */
        interrupt : function (testClass) {
            var current = this._testEngine.getCurrentTest();
            if (testClass !== current.testClass || current.state !== "processing") {
                return;
            }

            var error = new Error("Test interrupted by the user");
            current.instance.handleAsyncTestError(error, true);

            return false;
        },

        /**
         * Return the test engine, creating it if necessary.
         * @return {Object}
         */
        getEngine : function () {
            if (this._testEngine == null) {
                this._testEngine = new ariaJsunitTestEngine();

                this._testEngine.$on({
                    'change' : this._onChange,
                    scope : this
                });
            }
            return this._testEngine;
        }
    }
});
