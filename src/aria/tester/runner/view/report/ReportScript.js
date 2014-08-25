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
var Aria = require("../../../../Aria");
var ariaTesterRunnerUtilsTestUtils = require("../../utils/TestUtils");


/**
 * Template script definition for aria.tester.runner.view.Report
 */
module.exports = Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.report.ReportScript',
    $destructor : function () {
        this._backupScrollPosition();
    },
    $prototype : {
        $beforeRefresh : function () {
            this._backupScrollPosition();
        },
        $afterRefresh : function () {
            var divToScroll = this.$getElementById("left");
            var state = this.data.flow.currentState;
            if (this.lastFinishedId > 10 && state == this.flowCtrl.STATES.ONGOING) {
                var scrollPositions = divToScroll.getScroll();
                scrollPositions.scrollTop = 23 * (this.lastFinishedId - 10);
                divToScroll.setScroll(scrollPositions);
            } else {
                var backupScroll = this.data.view.scrollPositions["ReportScript_left"];
                if (backupScroll) {
                    divToScroll.setScroll(backupScroll);
                }
            }
        },

        _backupScrollPosition : function () {
            var divToScroll = this.$getElementById("left");
            if (divToScroll) {
                this.$json.setValue(this.data.view.scrollPositions, "ReportScript_left", divToScroll.getScroll());
            }
        },

        _setLastFinishedId : function (index) {
            this.lastFinishedId = index - 1;
        },

        getTestsArray : function () {
            var __testUtils = ariaTesterRunnerUtilsTestUtils;

            var rootSuite = this.data.campaign.testsTree[0];
            if (!rootSuite) {
                return [];
            } else if (!rootSuite.$TestSuite) {
                return [{
                            classpath : rootSuite.$classpath,
                            instance : rootSuite
                        }];
            }

            var subTests = __testUtils.getSubTestsAsArray(rootSuite);
            return subTests;
        },

        getFilteredTestsArray : function () {
            var subTests = this.getTestsArray();
            var filteredTests = [];
            for (var i = 0, l = subTests.length; i < l; i++) {
                var subTest = subTests[i];
                if (this._isFiltered(subTest)) {
                    filteredTests.push(subTest);
                }
            }
            for (var i = 0; i < filteredTests.length; i++) {
                var filteredTest = filteredTests[i];
                var nextTest = filteredTests[i + 1];
                if (!nextTest || (nextTest.instance && nextTest.instance.$TestSuite)) {
                    filteredTest.lastInSuite = false;
                }
                if (filteredTest.instance && filteredTest.instance.$TestSuite
                        && (!nextTest || (nextTest.instance && !nextTest.instance.$Assert))) {
                    filteredTests.splice(i, 1);
                    i--;
                }
            }

            return filteredTests;
        },

        _isFiltered : function (test) {
            var instance = test.instance;

            if (this.data.view.filter.type == "all") {
                return true;
            }
            if (!instance) {
                return false;
            }
            if (!instance.$Assert) {
                return true;
            }
            if (this.data.view.filter.type == "errors") {
                if (instance.hasError()) {
                    return true;
                }
            }
            if (this.data.view.filter.type == "warnings") {
                if (instance.hasWarning()) {
                    return true;
                }
            }
            return false;
        },

        getSuiteName : function (suite) {
            var __testUtils = ariaTesterRunnerUtilsTestUtils;
            var displayName = __testUtils.formatTestSuiteName(suite);

            var parentSuite = suite.getParentTest();
            if (parentSuite && parentSuite.getParentTest()) {
                return this.getSuiteName(parentSuite) + " | " + displayName;
            } else {
                return displayName;
            }
        },

        getTestName : function (testCase) {
            var __testUtils = ariaTesterRunnerUtilsTestUtils;
            return __testUtils.formatTestCaseName(testCase, this.data.view.configuration.mini);
        },

        formatTestErrorsCount : function (testCase) {
            var __testUtils = ariaTesterRunnerUtilsTestUtils;
            return __testUtils.formatTestErrorsCount(testCase);
        },

        formatTestInfo : function (testCase) {
            var assertCount = testCase.instance._totalAssertCount;
            var assertReport = assertCount + " asserts";

            var testsCount = testCase.instance._testsCount;
            var testsReport = testsCount + " tests and ";

            return "(" + testsReport + assertReport + ")";
        },

        _beforeDisplayReport : function () {
            this.counter = 0;
            this.currentAssigned = false;
        },
        _onErrorTestClick : function (evt, args) {
            this.data.view.highlightedTest = args.classpath;
            this.flowCtrl.navigate(this.flowCtrl.STATES.REPORT);
        }
    }
});
