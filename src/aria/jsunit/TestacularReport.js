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
var ariaUtilsJson = require("../utils/Json");


/**
 * Reports test results to Testacular.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.TestacularReport",
    $singleton : true,
    $constructor : function () {
        var window = Aria.$frameworkWindow;
        var testacular;
        if (window.parent !== window) {
            testacular = window.parent.testacular;
        }
        this._testacular = testacular;
        if (testacular == null) {
            // disable this class if testacular is not used
            this.attachTest = Aria.empty;
        }
        this._testEngine = null;
    },
    $dispose : function () {
        if (this._testEngine) {
            this.detachTestEngine(this._testEngine);
        }
        this._testacular = null;
    },
    $statics : {
        SEVERAL_TEST_ENGINES : "Attaching several test engines to the TestacularReport is not supported."
    },
    $prototype : {
        /**
         * Returns true if Testacular is used.
         * @return {Boolean}
         */
        isTestacularEnabled : function () {
            return (this._testacular != null);
        },

        /**
         * Listens for changes in the test engine, and reports the current status, errors and the final report to
         * Testacular.
         * @param {Object} evt
         */
        _onChange : function (evt) {
            var changeType = evt.changeType;
            var testEngine = this._testEngine;
            // var testacular = this._testacular;
            var currentTest = testEngine.getCurrentTest();

            // immediately report any failures or errors
            var issuesArray = null;
            if (evt.changeType == "failure") {
                issuesArray = currentTest.failures;
            } else if (evt.changeType == "error") {
                issuesArray = currentTest.errors;
            }
            if (issuesArray) {
                this._testacular.error({
                    type : changeType,
                    testClass : currentTest.testClass,
                    details : issuesArray[issuesArray.length - 1]
                });
            }

            var finished = testEngine.isFinished();
            if (finished) {
                var finalReport = this.createFinalReport(evt.testReport);
                this._testacular.updateResult(finalReport);
                var success = (finalReport.totalNbrOfErrors === 0 && finalReport.totalNbrOfFailures === 0);
                this._testacular.complete(success);
            } else {
                var statusReport = this.createStatusReport(evt.testReport, currentTest);
                this._testacular.updateStatus(statusReport);
            }
        },

        /**
         * Attach the given test engine to Testacular, so that its results are sent to Testacular.
         * @param {aria.jsunit.TestEngine} testEngine
         */
        attachTestEngine : function (testEngine) {
            if (this._testacular) {
                if (testEngine === this._testEngine) {
                    return;
                }
                // attaching several test engines is not supported:
                if (this._testEngine) {
                    this.$logError(this.SEVERAL_TEST_ENGINES);
                    this.detachTestEngine(this._testEngine);
                }
                this._testEngine = testEngine;
                testEngine.$on({
                    "change" : this._onChange,
                    scope : this
                });
            }
        },

        /**
         * Detach the given test engine from Testacular.
         * @param {aria.jsunit.TestEngine} testEngine
         */
        detachTestEngine : function (testEngine) {
            if (this._testEngine == testEngine) {
                testEngine.$unregisterListeners(this);
                this._testEngine = null;
            }
        },

        /**
         * Returns a small JSON object, which can be serialized, containing information about the current test status.
         * @param {Object} engineReport engine report
         * @param {Object} currentTest current test (part of the report)
         * @return {Object}
         */
        createStatusReport : function (engineReport, currentTest) {
            return {
                totalNbrOfAsserts : engineReport.totalNbrOfAsserts,
                totalNbrOfErrors : engineReport.totalNbrOfErrors,
                totalNbrOfFailures : engineReport.totalNbrOfFailures,
                currentTest : {
                    testClass : currentTest.testClass,
                    state : currentTest.state,
                    processingState : currentTest.processingState
                }
            };
        },

        /**
         * Returns a filtered copy of the engineReport so that it can be serialized.
         * @param {Object} engineReport
         * @return {Object}
         */
        createFinalReport : function (engineReport) {
            var res = ariaUtilsJson.copy(engineReport, false);
            res.executionTime = res.instance.getExecutionTime();
            delete res.instance;
            delete res.state;
            delete res.processingState;
            if (!res.errors) {
                delete res.errors;
            }
            if (!res.failures) {
                delete res.failures;
            }
            // res.retryURL = res.retryURL.replace(/^https?:\/\/[^/]*(?=\/)/, this._testacular.rootUrl);
            delete res.retryURL;
            var subTests = res.subTests;
            if (subTests) {
                var newSubTests = [];
                for (var i = 0, l = subTests.length; i < l; i++) {
                    newSubTests[i] = this.createFinalReport(subTests[i]);
                }
                res.subTests = newSubTests;
            } else {
                delete res.subTests;
            }
            return res;
        }
    }
});
