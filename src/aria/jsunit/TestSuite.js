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
 * The testsuite class
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.TestSuite",
    $extends : "aria.jsunit.Test",
    $dependencies : ["aria.core.Sequencer", "aria.jsunit.TestCase", "aria.jsunit.TestWrapper", "aria.utils.Type"],
    $constructor : function () {
        this.$Test.constructor.call(this);

        this._tests = [];
        this._subTests = [];

        this._sequencer = null;
        this._preloadSequencer = null;

        // a TestSuite doesn't count as a test
        this._assertCount = 0;

        this._isSelected = 1;

        this.skipTest = false;

        /**
         * Whether each test in the suite which is not itself a test suite should be run in an isolated environment
         * (iframe)
         * @type Boolean
         */
        this.runIsolated = false;
    },
    $destructor : function () {
        if (this._sequencer) {
            this._sequencer.$dispose();
        }
        if (this._preloadSequencer) {
            this._preloadSequencer.$dispose();
        }

        this._disposeRunningTest();

        this.$Test.$destructor.call(this);
    },
    $prototype : {
        /**
         * Will be automatically call when retrieving the sub tests for the first time. Can be called explicitely to
         * force the test suite to refresh its sub tests.
         */
        refreshSubTests : function () {
            var tests = this._tests;
            var subTests = [];
            for (var i = 0, l = tests.length; i < l; i++) {
                var test = tests[i];
                subTests.push({
                    classpath : test,
                    instance : null
                });
            }

            this._subTests = subTests;
        },

        /**
         * Retrieve the array of tests managed by this test suite. This array will mix test cases and test suites. Each
         * sub test is stored in a wrapper object with both the classpath and the instance of the test : { classpath :
         * {String} ("mycompany.mypackage.mymodule.MyTest") instance : {Object} (an instance of the classpath or null if
         * not yet instanciated }
         * @return {Array} the Array of tests managed by the test suite
         */
        getSubTests : function () {
            // while no tests are available, try to rebuild the test tree
            if (this._subTests.length == 0) {
                this.refreshSubTests();
            }
            return this._subTests;
        },

        /**
         * @return {Array} Array of test suites contained in this instance of TestSuite
         */
        getSubTestSuites : function () {
            var testSuites = [];
            var subTests = this.getSubTests();
            for (var i = 0, l = subTests.length; i < l; i++) {
                var subTest = subTests[i];
                var subTestClasspath = subTest.classpath;
                if (subTestClasspath.indexOf("TestSuite") != -1) {
                    testSuites.push(subTest);
                }
            }
            return testSuites;
        },

        getAllSubTestCases : function () {
            var testCases = [];
            var subTests = this.getSubTests();
            for (var i = 0, l = subTests.length; i < l; i++) {
                var test = subTests[i];
                if (test.classpath.indexOf("TestSuite") != -1) {
                    var subCases = test.instance.getAllSubTestCases();
                    testCases = testCases.concat(subCases);
                } else {
                    testCases.push(test);
                }
            }

            return testCases;
        },

        getAllSubTestSuites : function () {
            var testSuites = [];
            var subTests = this.getSubTests();
            for (var i = 0, l = subTests.length; i < l; i++) {
                var test = subTests[i];
                if (test.classpath.indexOf("TestSuite") != -1) {
                    testSuites.push(test)
                    var subSuites = test.instance.getAllSubTestSuites();
                    testSuites = testSuites.concat(subSuites);
                }
            }

            return testSuites;
        },

        preload : function () {
            var testSuites = this.getSubTestSuites();
            if (testSuites.length == 0) {
                return this.$raiseEvent("preloadEnd");
            }
            this._preloadSequencer = new aria.core.Sequencer();

            for (var i = 0, l = testSuites.length; i < l; i++) {
                var suite = testSuites[i];
                this._preloadSequencer.addTask({
                    name : "preload_" + i,
                    fn : this.__preloadSubSuiteTask,
                    scope : this,
                    args : {
                        suite : suite
                    },
                    asynchronous : true
                });
            }

            this._preloadSequencer.$on({
                "end" : this.__onPreloadSequenceEnd,
                scope : this
            });

            // start processing
            this._preloadSequencer.start();
        },

        __onPreloadSequenceEnd : function () {
            this.$raiseEvent("preloadEnd");
        },

        __preloadSubSuiteTask : function (task, args) {
            var suite = args.suite;
            var suiteClasspath = suite.classpath;
            Aria.load({
                classes : [suiteClasspath],
                oncomplete : {
                    fn : this.__onLoadSubSuiteCompleted,
                    scope : this,
                    args : {
                        task : task,
                        suite : suite
                    }
                },
                onerror : {
                    fn : this.__onDownloadTaskError,
                    scope : this,
                    args : {
                        sequencer : this._preloadSequencer,
                        task : task,
                        test : suite
                    }
                }
            })
        },

        __onLoadSubSuiteCompleted : function (args) {
            var task = args.task, suite = args.suite;

            suite.instance = Aria.getClassInstance(suite.classpath);
            suite.instance.setParentTest(this);
            suite.instance.$on({
                "preloadEnd" : {
                    fn : function () {
                        this._preloadSequencer.notifyTaskEnd(task.id);
                    },
                    scope : this
                }
            });

            suite.instance.preload();
        },

        /**
         * Add test classpaths to the test suite Pass as many arguments as needed
         * @param : String
         */
        addTests : function () {
            var args = arguments;
            for (var i = 0, l = args.length; i < l; i++) {
                var testClassPath = args[i];
                if (aria.utils.Type.isString(testClassPath)) {
                    this._tests.push(testClassPath);
                }
            }
        },

        getFinishedTestsCount : function () {
            var suites = this._suitesInstances;
            var passed = this._testPassed;
            for (var i in suites) {
                if (!suites.hasOwnProperty(i)) {
                    continue;
                }
                var suite = suites[i];
                passed += suite.getFinishedTestsCount();
            }
            return passed;
        },

        /**
         * Main method called to run the test suite This method is asynchronous and meant to be used with an object
         * listener
         */
        run : function () {
            this._startTest();
            this._sequencer = new aria.core.Sequencer();
            this._assertCount = 0;
            var subTests = this.getSubTests();
            // do not add tasks to the sequencer if the TestSuite is mean to be skipped
            if (!this.isSkipped() && this.isSelected() !== -1) {
                // configure sequencer
                for (var i = 0, l = subTests.length; i < l; i++) {
                    var test = subTests[i];
                    this._sequencer.addTask({
                        name : "Test_" + i,
                        fn : this.__runTestTask,
                        scope : this,
                        args : {
                            test : test
                        },
                        asynchronous : true
                    });
                }
            }

            this._sequencer.$on({
                "end" : this._onSequenceEnd,
                scope : this
            });

            // raise start event
            this.$raiseEvent({
                name : "start",
                testObject : this,
                testClass : this.$classpath
            });

            // start processing
            this._sequencer.start();
        },

        /**
         * @return {Boolean} true if the TestSuite should be skipped
         */
        isSkipped : function () {
            return this.skipTest === true;
        },
        /**
         * Internal task processor called by the sequencer anytime a new task must be executed. This method downloads
         * the test class and executes it
         * @param {Object} evt the sequencer event
         * @param {Object} args the task arguments
         * @private
         */
        __runTestTask : function (task, args) {
            var test = args.test;
            var testClasspath = test.classpath;
            Aria.load({
                classes : [testClasspath],
                oncomplete : {
                    fn : this._execTestTask,
                    scope : this,
                    args : {
                        task : task,
                        test : test
                    }
                },
                onerror : {
                    fn : this.__onDownloadTaskError,
                    scope : this,
                    args : {
                        sequencer : this._sequencer,
                        task : task,
                        test : test
                    }
                }
            });
        },

        /**
         * Callback for the errors downloading a test task. It notifies a failure and goes to the next test
         * @param {Object} params
         */
        __onDownloadTaskError : function (args) {
            var task = args.task, test = args.test, sequencer = args.sequencer;

            var errorMessage = "Loading of " + test.classpath + " failed";

            var lastRuntimeError = this.__getLastRuntimeError();
            if (lastRuntimeError) {
                errorMessage = lastRuntimeError;
            }

            this.$raiseEvent({
                name : "failure",
                testState : this.$classpath,
                description : errorMessage
            });

            // replace the test by a fake
            test.instance = this.__createFailedTest("$fileLoad", errorMessage);

            // go on with the tests
            this._execTestTask(args);
            // sequencer.notifyTaskEnd(task.id);
        },

        /**
         * Internal task processor called by the sequencer anytime a new task must be executed
         * @param {Object} evt the sequencer event
         * @param {Object} args the task arguments
         * @private
         */
        _execTestTask : function (args) {
            var task = args.task, test = args.test;

            if (!test.instance) {
                test.instance = this._createTest(test.classpath);
            }
            this.__runningTest = test.instance;

            // notify test start
            this.$raiseEvent({
                name : "testLoad",
                testLoader : this,
                testObject : test.instance
            });

            // run sub-test (note: sub-test is asynchronous, so we need to register for its end event)
            test.instance.$on({
                "end" : {
                    fn : this._onTestEnd,
                    scope : this,
                    args : {
                        taskId : task.id,
                        taskMgr : task.taskMgr
                    }
                },
                "stateChange" : {
                    fn : this._raiseStateChange,
                    scope : this
                }
            });
            test.instance.run();
        },

        /**
         * Called by a test when it is done (tests are asynchronous)
         * @param {Object} evt
         * @private
         */
        _onTestEnd : function (evt, args) {
            if (evt.nbrOfAsserts) {
                this._assertCount += evt.nbrOfAsserts;
            }

            this._raiseStateChange();

            // unregister as listener
            evt.src.$unregisterListeners(this);

            // Dispose this test
            this._disposeRunningTest();

            // current task is asynchronous - we need to notify the sequencer
            args.taskMgr.notifyTaskEnd(args.taskId);
        },

        /**
         * Try to create a new instance of a given test case classpath.
         * @protected
         * @param {String} classpath
         * @return {TestCase}
         */
        _createTest : function (classpath) {
            var testInstance;
            try {
                var classRef = Aria.getClassRef(classpath);
                if (this.runIsolated && !aria.utils.Type.isInstanceOf(classRef.prototype, "aria.jsunit.TestSuite")) {
                    testInstance = new aria.jsunit.TestWrapper(classpath);
                } else {
                    testInstance = new classRef();
                }
                testInstance.setParentTest(this);
            } catch (er) {
                var errorMessage = "Uncaught exception while creating " + classpath + "\n" + "Message : " + er.message;
                var lastRuntimeError = this.__getLastRuntimeError();
                if (lastRuntimeError) {
                    errorMessage = lastRuntimeError;
                }
                testInstance = this.__createFailedTest("$constructor", errorMessage);

            }
            return testInstance;
        },

        /**
         * If the NewTestRunner is used, runtime errors are preserved in order to display them in the test runner. This
         * can help to debug crashes that prevented the test from completing correctly
         * @return {String} The latest runtime error captured
         */
        __getLastRuntimeError : function () {
            var lastRuntimeError = "";
            if (Aria.__runtimeErrors) {
                var lastError = Aria.__runtimeErrors[Aria.__runtimeErrors.length - 1];
                lastRuntimeError = lastError;
            }
            return lastRuntimeError;
        },

        __createFailedTest : function (method, message) {
            var testInstance = new aria.jsunit.TestCase();
            testInstance._errors = [{
                        type : "failure",
                        testMethod : method,
                        description : message
                    }];
            return testInstance;
        },

        /**
         * Try to dispose the current test case of the test suite. If the destroy fails, add another error to the error
         * array of the test case
         * @protected
         */
        _disposeRunningTest : function () {
            try {
                if (this.__runningTest) {
                    this.__runningTest.$dispose();

                    // Check for errors in dispose
                    if (this.__runningTest.$TestCase) {
                        this.__runningTest.assertLogsEmpty();
                    }
                }
            } catch (er) {
                var classpath = this.__runningTest.$classpath;
                this.__runningTest._errors.push({
                    type : "failure",
                    testMethod : "$destructor",
                    description : "Uncaught exception while destroying " + classpath + "\nMessage : " + er.message
                });
                this.$raiseEvent({
                    name : "failure",
                    testState : classpath,
                    description : "Uncaught exception while destroying " + classpath + "\nMessage : " + er.message
                });
            }

            aria.core.Log.clearAppenders();
            aria.core.Log.resetLoggingLevels();

            this.__runningTest = null;
        },

        /**
         * Propagate the stateChange event up
         */
        _raiseStateChange : function () {
            this.$raiseEvent({
                name : "stateChange"
            });
        },

        isSelected : function () {
            return this._isSelected;
        },

        setSelected : function (bubble) {
            if (this._isSelected === 1) {
                return;
            }
            this._isSelected = 1;
            var parentTest = this.getParentTest();
            if (parentTest && bubble !== false) {
                parentTest.checkSelected();
            }
            var testSuites = this.getSubTestSuites();
            for (var i = 0, l = testSuites.length; i < l; i++) {
                var suite = testSuites[i];
                suite.instance.setSelected(false);
            }
        },

        setUnselected : function (bubble) {
            if (this._isSelected === -1) {
                return;
            }
            this._isSelected = -1;
            var parentTest = this.getParentTest();
            if (parentTest && bubble !== false) {
                parentTest.checkSelected();
            }
            var testSuites = this.getSubTestSuites();
            for (var i = 0, l = testSuites.length; i < l; i++) {
                var suite = testSuites[i];
                suite.instance.setUnselected(false);
            }
        },

        checkSelected : function () {
            var hasSelected = false;
            var hasUnselected = false;
            var testSuites = this.getSubTestSuites();
            for (var i = 0, l = testSuites.length; i < l; i++) {
                var suite = testSuites[i];
                if (suite.instance.isSelected() == 1) {
                    hasSelected = true;
                } else if (suite.instance.isSelected() == -1) {
                    hasUnselected = true;
                } else {
                    hasSelected = true;
                    hasUnselected = true;
                }
            }
            if (hasSelected && !hasUnselected) {
                this.setSelected();
            } else if (!hasSelected && hasUnselected && this.getSubTests().length == testSuites.length) {
                this.setUnselected();
            } else {
                this._isSelected = 0;
                var parentTest = this.getParentTest();
                if (parentTest) {
                    parentTest.checkSelected();
                }
            }
        },

        /**
         * Internal listener called by the Sequencer when the last task is executed
         * @param {Object} evt the sequencer event
         * @private
         */
        _onSequenceEnd : function (evt) {
            if (this._sequencer) {
                this._sequencer.$dispose(); // will also remove listeners
                this._sequencer = null;
            }

            this._endTest();

            this._isFinished = true;
            this.$raiseEvent({
                name : "end",
                testObject : this,
                testClass : this.$classpath,
                nbrOfAsserts : this._assertCount
            });
        }
    }
});