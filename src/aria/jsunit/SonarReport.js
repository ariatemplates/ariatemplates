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
 * Sonar Report
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.SonarReport",
    $dependencies : ["aria.core.Browser"],
    $statics : {
        REPORT_SEPARATOR : "###__REPORT__DELIMITER__###",
        LINE_SEPARATOR : "####",
        TAB_SEPARATOR : "#TT#"
    },
    $constructor : function (conf) {
        this.testRunner = conf.testRunner;

        var browserName = aria.core.Browser.toString().replace(/ /g, "_").replace(/\./g, "");
        var osName = aria.core.Browser.environment;
        this.__browserInfo = browserName + "_" + osName + ".";
    },
    $destructor : function () {
        this.testRunner = null;
    },
    $prototype : {
        /**
         * @return {String}
         */
        getReport : function () {
            var report = "";

            var testCaseReports = [];
            var testCases = this.testRunner.getTestCases();
            for (var i = 0, l = testCases.length; i < l; i++) {
                var testCase = testCases[i].instance;
                testCaseReports.push(this.__getTestCaseReport(testCase));
            }

            report = testCaseReports.join(this.REPORT_SEPARATOR);
            return report;
        },

        /**
         * @private
         * @return {String}
         */
        __getTestCaseReport : function (testCase) {
            var report = this.__formatTestCaseReport(testCase);
            return report;
        },

        /**
         * Format the test case name to add browser/platform information
         */
        __getTestSuiteName : function (testCase) {
            return this.__browserInfo + testCase.$classpath;
        },

        /**
         * @private
         */
        __formatTestCaseReport : function (testCase) {
            var reportBuffer = ["<?xml version='1.0' encoding='UTF-8' ?>"];

            var subTests = this.__getTestCaseSubTests(testCase);

            var errors = testCase.getErrors();
            reportBuffer.push(["<testsuite", "name='" + this.__getTestSuiteName(testCase) + "'",
                    "errors='" + testCase.getExecutionErrors().length + "'",
                    "failures='" + testCase.getFailures().length + "'", "tests='" + subTests.length + "'",
                    "skipped='0'", "time='" + testCase.getExecutionTime() / 1000 + "'", ">"].join(" "));

            for (var i = 0, l = subTests.length; i < l; i++) {
                var subTest = subTests[i];
                var subTestReport = this.__formatSubTestReport(subTest, testCase);
                reportBuffer.push(subTestReport);
            }

            reportBuffer.push("</testsuite>");

            var report = reportBuffer.join(this.LINE_SEPARATOR);
            return report;
        },

        /**
         * @private
         */
        __getTestCaseSubTests : function (testCase) {
            var subTests = [];
            var testErrors = testCase.getErrors();
            for (var i in testCase) {
                if (i.match(/^test/) && typeof(testCase[i]) == 'function') {
                    var subTest = {
                        name : i,
                        status : "success",
                        time : 0,
                        errors : []
                    };
                    for (var j = 0, m = testErrors.length; j < m; j++) {
                        var error = testErrors[j];
                        if (subTest.name + "()" == error.testMethod) {
                            subTest.status = "error";
                            subTest.errors.push(error);
                        }
                    }
                    subTests.push(subTest);
                }
            }

            return subTests;
        },

        /**
         * @private
         */
        __formatSubTestReport : function (subTest, testCase) {
            var report = "";
            var errors = subTest.errors;

            if (errors.length > 0) {
                report = this.TAB_SEPARATOR + "<testcase classname='" + this.__getTestSuiteName(testCase) + "' time='"
                        + subTest.time + "' name='" + subTest.name + "'>";
                for (var i = 0, l = errors.length; i < l; i++) {
                    var error = errors[i];
                    report += this.LINE_SEPARATOR + this.TAB_SEPARATOR + this.TAB_SEPARATOR;
                    if (error.state == "failure") {
                        report += "<failure>" + error.description + "</failure>";
                    } else {
                        report += "<error>" + error.description + "</error>";
                    }
                }
                report += this.LINE_SEPARATOR + this.TAB_SEPARATOR + "</testcase>";
            } else {
                report = this.TAB_SEPARATOR + "<testcase classname='" + testCase.$classpath + "' time='" + subTest.time
                        + "' name='" + subTest.name + "'/>";
            }

            return report;
        }
    }
});
