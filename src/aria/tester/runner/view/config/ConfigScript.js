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
 * Template script definition for aria.tester.runner.view.Report
 */
Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.config.ConfigScript',
    $dependencies : [
        'aria.tester.runner.utils.TestUtils',
        'aria.tester.runner.utils.Hash'
    ],
    $prototype : {
        /**
         * Format information about a test suite for display purposes.
         * @param {aria.jsunit.TestSuite} testSuite
         * @return {String} Formatted information
         */
        getSuiteInfo : function (testSuite) {
            var __testUtils = aria.tester.runner.utils.TestUtils;
            return __testUtils.getTestSuiteInfo(testSuite);
        },


        getSuiteName : function (testSuite) {
            var __testUtils = aria.tester.runner.utils.TestUtils;
            return __testUtils.formatTestSuiteName(testSuite);
        },

        /**
         *
         * @param {Object} evt
         * @param {Object} args
         */
        onSuiteClick : function (evt, args) {
            var suite = args.testSuite;
            if (suite.isSelected() == -1) {
                suite.setSelected();
            } else {
                suite.setUnselected();
            }

            this.moduleCtrl.updateTests();
        }
    }
});