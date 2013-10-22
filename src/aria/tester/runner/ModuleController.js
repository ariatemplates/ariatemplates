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
 * Todo List module sample
 */
Aria.classDefinition({
    $classpath : "aria.tester.runner.ModuleController",
    $extends : "aria.templates.ModuleCtrl",
    $dependencies : ["aria.tester.runner.datamodel.DataDefinitions", "aria.tester.runner.utils.Hash",
            "aria.jsunit.IOViewer", "aria.jsunit.AppletWorker", "aria.utils.QueryString", "aria.jsunit.NewTestRunner",
            "aria.jsunit.JsCoverage", "aria.jsunit.TestCommunicator", "aria.utils.Callback",
            "aria.tester.runner.utils.TestUtils", "aria.tester.runner.appenders.JsonTextDivAppender",
            "aria.jsunit.TestacularReport"],
    $statics : {
        DATA_DEFINITION : "aria.tester.runner.datamodel.DataDefinitions"
    },
    $implements : ["aria.tester.runner.ModuleControllerInterface"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
        this._testRunner = null;

        // Should be configurable at some stage when we have more than one possible report appenders
        this._reportAppenders = [new aria.tester.runner.appenders.JsonTextDivAppender()];

        aria.core.JsonValidator.normalize({
            json : this._data,
            beanName : this.DATA_DEFINITION + ".Root"
        });

        this._readConfigurationParameters();
    },
    $prototype : {
        $hasFlowCtrl : true,
        $publicInterfaceName : "aria.tester.runner.ModuleControllerInterface",

        /**
         * The init of the Tester module controller will attempt to load the root test suite of the test campaign
         * @param {Array} args This module controller is not expecting any argument here
         * @param {aria.core.CfgBeans:Callback} cb Callback defined by contract for this asynchronous method
         */
        init : function (args, cb) {
            var campaignData = this.getData().campaign;

            var rootClasspath = campaignData.rootClasspath;
            Aria.load({
                classes : [rootClasspath],
                oncomplete : {
                    fn : this._onInitLoadCompleted,
                    args : cb,
                    scope : this
                },
                onerror : {
                    fn : this._onInitLoadError,
                    args : cb,
                    scope : this
                }
            });
        },

        /**
         * Change the view used to display the tester. This setting is reflected in hash using the 'mini' parameter. It
         * is also stored in the view.configuration.mini path in the datamodel. The tester currently allows two views :
         * <ul>
         * <li>- mini=false : default setting. A TestSuite selector is displayed on the left column, the test monitor
         * is displayed in the rest of the screens. </li>
         * <li>- mini=true : the 'Monitor' template will take the whole screen estate. The test suite explorer (see
         * 'Config' template) is hidden. All margins around the monitor have been removed</li>
         * </ul>
         * @param {aria.core.CfgBeans:Callback} cb Callback defined by contract for this asynchronous method
         */
        switchView : function (cb) {
            var __hash = aria.tester.runner.utils.Hash;
            this.json.setValue(this._data.view.configuration, "mini", !this._data.view.configuration.mini);
            __hash.setParameter("mini", this._data.view.configuration.mini);
            this.$callback(cb);
        },

        /**
         * This module accepts several configuration parameters to be extracted from the URL :
         * <ul>
         * <li>mini</li>
         * <li>testClasspath</li>
         * <li>autorun</li>
         * <li>runIsolated</li>
         * </ul>
         */
        _readConfigurationParameters : function () {
            var campaignData = this.getData().campaign, viewData = this.getData().view, __hash = aria.tester.runner.utils.Hash, json = aria.utils.Json;

            if (__hash.getParameter("mini") == "true") {
                json.setValue(viewData.configuration, "mini", true);
            }

            if (__hash.getParameter("testClasspath")) {
                json.setValue(campaignData, "rootClasspath", __hash.getParameter("testClasspath"));
            }

            if (__hash.getParameter("autorun") == "true" || aria.jsunit.TestacularReport.isTestacularEnabled()) {
                // if Testacular is detected, then automatically run the test suite
                json.setValue(campaignData, "autorun", true);
            }

            if (__hash.getParameter("runIsolated") == "true") {
                json.setValue(campaignData, "runIsolated", true);
            }

            if (__hash.getParameter("demo") == "true") {
                json.setValue(campaignData, "demoMode", true);
            }
        },

        /**
         * @param {aria.core.CfgBeans:Callback} cb
         */
        _onInitLoadCompleted : function (cb) {
            this.getData().campaign.loadSuccessful = true;
            var __hash = aria.tester.runner.utils.Hash, campaignData = this.getData().campaign;
            __hash.setParameter("testClasspath", campaignData.rootClasspath);

            this.$callback(cb);
        },

        /**
         * @param {aria.core.CfgBeans:Callback} cb
         */
        _onInitLoadError : function (cb) {
            this.$logError("Unable to load test object for classpath : " + this.getData().campaign.rootClasspath);

            this.getData().campaign.loadSuccessful = false;
            this.$callback(cb);
        },

        /**
         * Preload all the test suites available for the campaign to gather information such as the total number of
         * tests
         * @param {aria.core.CfgBeans:Callback} cb
         */
        preloadSuites : function (cb) {
            var campaignData = this.getData().campaign;
            var rootClasspath = campaignData.rootClasspath;
            this._testRunner = new aria.jsunit.NewTestRunner();
            this._testRunner.runIsolated = campaignData.runIsolated;
            this._testRunner.setRootClasspath(rootClasspath);

            // Add a listener to the preloadEnd and propagate the callback cb
            this._testRunner.$on({
                'preloadEnd' : {
                    fn : this._onPreloadEnd,
                    scope : this,
                    args : cb
                }
            });

            // The init method of a test object will prepare the test object and trigger the preload
            this._testRunner.preload();
        },

        /**
         * @param {Object} event
         * @param {aria.core.CfgBeans:Callback} cb
         */
        _onPreloadEnd : function (event, cb) {
            // add new event listeners on the test object
            this._testRunner.$on({
                'campaignEnd' : this._onCampaignEnd,
                'campaignChange' : this._onCampaignChange,
                scope : this
            });

            this.selectTestSuitesFromHash();

            // Update tests
            this.updateTests(cb);
        },

        /**
         * @private
         */
        _onCampaignEnd : function () {
            this._onCampaignChange();
            this.$callback(this._startCampaignCb);
            this._exportResults();
        },

        /**
         * Export the test and coverage reports to whatever report appenders are set up
         */
        _exportResults : function () {
            // List of tests with results
            var campaign = this._data.campaign;
            var testReport = {
                errorCount : campaign.errorCount,
                tests : [],
                coverage : {}
            };
            for (var t = 0; t < campaign.tests.length; t++) {
                var test = campaign.tests[t];
                testReport.tests.push({
                    classpath : test.classpath,
                    assertCount : test.instance._totalAssertCount,
                    errors : test.instance._errors
                });
            }

            // Coverage report
            var coverage = Aria.$window._$jscoverage;
            if (typeof coverage != "undefined") {
                testReport.coverage = coverage;
            }

            for (var a = 0; a < this._reportAppenders.length; a++) {
                this._reportAppenders[a].append(testReport);
            }
        },

        /**
         * @private
         */
        _onCampaignChange : function () {
            this.updateProgress();
            this.updateErrorCount();
            this.updateTests();
        },

        updateProgress : function () {
            // Update progress
            var finishedTests = this._testRunner.getFinishedTestsCount();
            var percentage = Math.floor(100 * (finishedTests / this._testRunner.getTestsCount()));
            aria.utils.Json.setValue(this.getData().campaign, "progress", percentage);
        },

        updateErrorCount : function () {
            var failedTests = this._testRunner.getFailedTests();
            aria.utils.Json.setValue(this.getData().campaign, "errorCount", failedTests.length);
        },

        updateTests : function (cb) {
            // Update tests
            aria.utils.Json.setValue(this.getData().campaign, "tests", this._testRunner.getTestCases());
            aria.utils.Json.setValue(this.getData().campaign, "testsTree", [this._testRunner._rootTest]);
            this.storeUnselectedSuitesInHash();
            this.$callback(cb);
        },

        selectTestSuitesFromHash : function () {
            var __hash = aria.tester.runner.utils.Hash;
            var unselectedSuites = __hash.getParameter("unselected");
            var rootSuite = this._testRunner._rootTest;

            if (!rootSuite.$TestSuite) {
                return;
            } else {
                // get selected sub suites
                var subSuites = rootSuite.getAllSubTestSuites();
                for (var i = 0, l = subSuites.length; i < l; i++) {
                    var subSuite = subSuites[i].instance;
                    var classpath = subSuite.$classpath;
                    if (unselectedSuites.indexOf(classpath) != -1) {
                        subSuite.setUnselected();
                    }
                }
            }
            this.updateTests();
        },

        storeUnselectedSuitesInHash : function () {
            var __testUtils = aria.tester.runner.utils.TestUtils;
            var __hash = aria.tester.runner.utils.Hash;
            var rootSuite = this._testRunner._rootTest;

            if (!rootSuite.$TestSuite) {
                return;
            } else {
                // get selected sub suites
                var unselectedSuites = __testUtils.getUnselectedSubSuites(rootSuite);
                __hash.setParameter("unselected", unselectedSuites.join(","));
            }
        },

        startCampaign : function (cb) {
            var skipTests = [];
            if (aria.utils.QueryString.getKeyValue("UITest") != "1") {
                skipTests = ['test.aria.widgets.WidgetsUITestSuite'];
            }
            this._startCampaignCb = cb;

            // Notify testacular in case it is available:
            aria.jsunit.TestacularReport.attachTestEngine(this._testRunner.getEngine());

            if (this.getData().campaign.demoMode) {
                this._testRunner.getRootTest().demoMode = true;
            }

            this._testRunner.run(this.testObject, skipTests);
        },

        /**
         * Pause the current test execution. This method is called by the flow controller on state transition
         * @param {aria.core.CfgBeans:Callback} cb
         */
        pauseCampaign : function (cb) {
            this._testRunner.getEngine().pause(cb);
        },

        /**
         * Pause the current paused execution. This method is called by the flow controller on state transition
         * @param {aria.core.CfgBeans:Callback} cb
         */
        resumeCampaign : function (cb) {
            this._testRunner.getEngine().resume(cb);
        },

        /**
         * Dynamically reload the campaign. Only non-framework classes will be redownloaded
         */
        reload : function (cb) {
            aria.jsunit.TestacularReport.detachTestEngine(this._testRunner.getEngine());
            // The testRunner is responsible for disposing the test engine and all subsequent classes
            this._testRunner.$dispose();

            // unload all the classes that don' t belong to the framework
            // TODO change this -- aria.core.Cache.content.classes is not used anymore
            var loadedClasses = aria.core.Cache.content.classes;
            for (var classpath in loadedClasses) {
                if (!loadedClasses.hasOwnProperty(classpath) || classpath.indexOf("aria.") === 0) {
                    continue;
                }
                aria.core.ClassMgr.unloadClass(classpath, true);
            }

            // Activate the autorun in order to start the campaign as soon as the tests have been reloaded
            aria.utils.Json.setValue(this.getData().campaign, "autorun", true);

            this.$callback(cb);
        }
    }
});
