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
 * Mutualize most of the test formatting and information extraction logic
 */
Aria.classDefinition({
    $classpath : "aria.tester.runner.utils.TestUtils",
    $singleton : true,
    $prototype : {
        /**
         *
         */
        getTestSuiteInfo : function (testSuite) {
            var instance = testSuite.instance;
            var suitesCount = instance.getAllSubTestSuites().length;
            var casesCount = instance.getAllSubTestCases().length;

            return this._formatTestSuiteInfo(suitesCount, casesCount);
        },

        /**
         * Format information about a test suite for display purposes, with an abstraction on the testsuite. <br />
         * (0,3) => '(3 test cases)' <br />
         * (1,3) => '(1 test suite and 3 test cases)' <br />
         * (2,0) => '(2 test suites)' <br />
         * @param {Number} suitesCount The number of suites contained inside a given suite
         * @param {Number} casesCount The number of cases contained inside a given suite
         * @return {String} Formatted information
         */
        _formatTestSuiteInfo : function (suitesCount, casesCount) {
            var testSuitesText = suitesCount ? suitesCount + " test suite" + (suitesCount > 1 ? "s" : "") : null;

            var testCasesText = casesCount ? casesCount + " test case" + (casesCount > 1 ? "s" : "") : null;

            if (casesCount && suitesCount) {
                return [testSuitesText, testCasesText].join(" and ");
            } else if (casesCount || suitesCount) {
                return [testSuitesText, testCasesText].join("");
            } else {
                return "no test available in this suite !";
            }
        },

        /**
         * Format the classpath of a given test case
         * @param {Object} testCase : test preload wrapper {instance, classpath}
         * @return {String} formatted name
         */
        formatTestCaseName : function (testCase, mini) {
            var classpath = testCase.classpath;
            var formattedClasspath = this._formatTestCaseClasspath(classpath, mini);
            return formattedClasspath;
        },

        /**
         * Apply display transformation to a given test case classpath
         * @param {String} classpath
         * @return {String} formatted classpath
         * @private
         */
        _formatTestCaseClasspath : function (classpath, mini) {
            var splitClasspath = classpath.split(".");
            var lastElem = splitClasspath[splitClasspath.length - 1];
            splitClasspath[splitClasspath.length - 1] = "<b>" + lastElem + "</b>";

            if (mini) {
                return "<b>" + lastElem + "</b>";
            } else {
                return splitClasspath.join(".");
            }
        },

        formatTestErrorsCount : function (testCase) {
            var errors = testCase.instance.getErrors();
            var l = errors.length;
            return (l + " error" + (l != 1 ? "s" : ""));
        },

        /**
         * @param {Object}
         */
        formatTestSuiteName : function (testSuite) {
            var classpath = testSuite.$classpath || testSuite.classpath;
            var formattedClasspath = this._formatTestSuiteClasspath(classpath);
            return formattedClasspath;
        },

        /**
         *
         */
        _formatTestSuiteClasspath : function (classpath) {
            var splitClasspath = classpath.split(".");
            return splitClasspath[splitClasspath.length - 1].replace("TestSuite", "");
        },

        /**
         * Retrieve all the selected tests (cases and suites) nested inside a given suite as a flat array
         * @param {aria.jsunit.TestSuite} suite
         * @return {Array}
         */
        getSubTestsAsArray : function (suite) {
            var tests = [];
            var subTests = suite.getSubTests();
            for (var i = 0, l = subTests.length; i < l; i++) {
                var test = subTests[i];
                var instance = test.instance;
                if (instance && instance.$TestSuite) {
                    if (instance.isSelected() !== -1 && !instance.isSkipped()) {
                        var suiteSubTests = this.getSubTestsAsArray(instance);
                        if (instance.getSubTests().length != instance.getSubTestSuites().length
                                && suiteSubTests.length !== 0) {
                            tests.push(test);
                        }
                        tests = tests.concat(suiteSubTests);
                    }
                } else {
                    tests.push(test);
                }
            }
            return tests;
        },

        /**
         * Retrieve the classpaths of all the unselected test suites nested inside a given suite
         * @param {aria.jsunit.TestSuite} suite
         * @return {Array}
         */
        getUnselectedSubSuites : function (suite) {
            var unselectedSuites = [];
            var subsuites = suite.getSubTestSuites();
            for (var i = 0, l = subsuites.length; i < l; i++) {
                var subsuite = subsuites[i].instance;
                if (subsuite.isSelected() == -1) {
                    unselectedSuites.push(subsuite.$classpath);
                } else if (subsuite.isSelected() === 0) {
                    unselectedSuites = unselectedSuites.concat(this.getUnselectedSubSuites(subsuite));
                }
            }
            return unselectedSuites;
        }
    }
});
