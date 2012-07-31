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
 * A test case defines the fixture to run multiple tests. To define a test case
 * <ol>
 * <li> implement a subclass of TestCase </li>
 * <li> define instance variables that store the state of the fixture </li>
 * <li> initialize the fixture state by overriding setUp </li>
 * <li> clean-up after a test by overriding tearDown</li>
 * </ol>
 * Each test runs in its own fixture so there can be no side effects among test runs
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.TestCase",
    $extends : "aria.jsunit.Assert",
    $dependencies : ["aria.core.Sequencer", "aria.utils.Json"],
    $statics : {
        // some tests run slower on IE when they are in a suite
        "defaultTestTimeout" : 60000
    },
    $constructor : function () {
        // constructor
        this.$Assert.constructor.call(this);

        /**
         * Instance of sequencer that runs the tests
         * @type aria.core.Sequencer
         * @protected
         */
        this._sequencer = null;
        this._currentTaskId = -1;

        /**
         * Wheter or not to skip this test
         * @type Boolean
         */
        this.skipTest = false;

        /**
         * Total number of tests
         * @type Number
         * @protected
         */
        this._testsCount = 0;

        /**
         * Number of tests passed
         * @type Number
         * @protected
         */
        this._testPassed = 0;

        /**
         * Copy of the appenvironment application settings
         * @type Object
         * @private
         */
        this.__appEnv = {};
    },
    $destructor : function () {
        // destructor
        if (this._sequencer) {
            this._sequencer.$dispose();
        }
        this.$Assert.$destructor.call(this);
        this._currentTaskId = null;

    },
    $prototype : {
        /**
         * Main method that will run all the test methods attached to the object This methods loops on all elements of
         * the current object and calls the methods starting with 'test'
         * @see aria.jsunit.Test
         */
        run : function () {
            this._saveAppEnvironment();
            this._startTest();
            this._sequencer = new aria.core.Sequencer();

            // do not add tasks to the sequencer if the TestCase is mean to be skipped
            if (!this.skipTest) {
                for (var key in this) {
                    if (key.match(/^test/) && typeof(this[key]) == 'function') {

                        var isAsynchronous = (key.match(/^testAsync/) != null);

                        this._sequencer.addTask({
                            name : key,
                            fn : this._execTestTask,
                            scope : this,
                            asynchronous : isAsynchronous
                        });
                        this._testsCount++;
                    }
                }
            }
            this._sequencer.$on({
                "end" : this._onSequenceEnd,
                scope : this
            });
            this._sequencer.start();
        },

        /**
         * Conditionnal wait before calling the callback
         * It takes only one json parameter
         * @param {args} args json parameter with the following attributes:
         * <br />{integer} delay : Optional. Time interval between two test
         * <br />{Function} condition : function which returns true or false. If true, the callback will be called, if false, this method will will call again after a delay.
         * <br />{Function} callback : callback wich be called when the condition function returns true
         */
        waitFor : function (args) {
            var delay = args.delay || 250;
            var condition = args.condition;

            var timeoutFn = function() {
                if (this.$callback(condition)) {
                    this.$callback(args.callback);
                } else {
                    aria.core.Timer.addCallback({
                        fn : timeoutFn,
                        scope : this,
                        delay : delay
                    });
                }
            }
            aria.core.Timer.addCallback({
                fn : timeoutFn,
                scope : this,
                delay : delay
            });
        },

        /**
         * Internal method called for each test metod
         * @param {Object} evt the event sent by the sequencer
         * @private
         */
        _execTestTask : function (task) {
            var testName = task.name;
            this._updateAssertInfo(testName + '()');
            var errorDetected = false;
            try {
                this._currentTaskId = task.id;

                // fixture setup
                if (this.setUp) {
                    this.setUp();
                }
                if (task.asynchronous) {
                    // we set the timeout before running the test, because an asynchronous test
                    // may finally be executed synchronously
                    this.setTestTimeout(this.defaultTestTimeout, testName);
                }
                // test run
                try {
                    this[testName].call(this);
                } catch (ex) {
                    if (ex.name != this.ASSERT_FAILURE) {
                        // errors different from failures have to be notified
                        this.raiseError(ex);
                    }
                    errorDetected = true;
                }
            } catch (exSetUp) {
                this.raiseError(exSetUp, "Error location: setUp() method");
                errorDetected = true;
            }

            if (task.asynchronous != true || errorDetected) {
                this.notifyTestEnd(testName, errorDetected, task.asynchronous == true);
            }
        },

        /**
         * Override the timeout delay allowed for the current test. Tests are now stopped if they don't reach completion
         * after a certain delay. This method allows to increase or decrease this delay. When called the timer is
         * restarted. Meaning after the call, the test will have ${timeout} milliseconds before failing for timeout.
         * @param {Number} timeout
         * @param {String} testName
         */
        setTestTimeout : function (timeout, testName) {
            if (this._timeoutTimer) {
                aria.core.Timer.cancelCallback(this._timeoutTimer);
            }
            var error = new Error("Assert " + testName + " has timed out");

            this._timeoutTimer = aria.core.Timer.addCallback({
                fn : this.handleAsyncTestError,
                scope : this,
                delay : timeout,
                args : error
            });
        },

        /**
         * Internal method used by asynchronous tests methods (i.e. named as testAsyncXXX) to notify the test end -
         * automatically called for synchronous tests
         * @param {String} testName the test method name
         * @param {Boolean} terminate force the test termination [optional - default: false]
         * @param {Boolean} asyncTest tells if test was asynchronous [optional - default: true]
         */
        notifyTestEnd : function (testName, terminate, asyncTest) {
            if (this._timeoutTimer) {
                aria.core.Timer.cancelCallback(this._timeoutTimer);
                this._timeoutTimer = null;
            }
            // check that all expected events have occured
            this.checkExpectedEventListEnd();
            // show any unexpected error which appeared in logs
            this.assertLogsEmpty(false);

            this.clearLogs();

            // fixture teardown
            try {
                if (this.tearDown) {
                    this.tearDown();
                }
            } catch (exTearDown) {
                this.raiseError(exTearDown, "Error location: tearDown() method");
            }
            this._restoreAppEnvironment();

            // add meta containing which test is related to which undisposed objects
            var undisposed = Aria.__undisposedObjects;
            for (var i in undisposed) {
                if (undisposed.hasOwnProperty(i) && undisposed[i]["aria:createdFromTest"] == null) {
                    undisposed[i]["aria:createdFromTest"] = this.$classpath + "." + this._currentTestName;
                }
            }
            // clean any remaining callbacks
            aria.core.Timer.callbacksRemaining();
            if (asyncTest != false) {
                if (this._sequencer) {
                    this._sequencer.notifyTaskEnd(this._currentTaskId);
                }
            }
        },

        /**
         * This function should be called when testing an asynchronous method i.e. one that takes as input a callback
         * object
         * @param {Object} object The object on which to call the method
         * @param {String} methodName The name of the method to be called
         * @param {Array} methodArgs An array containing the arguments to the method
         * @param {Object} cb A callback object encapsulating the callback function, its scope and arguments
         */
        callAsyncMethod : function (object, methodName, methodArgs, cb) {
            // create the new callback arg
            var arg2 = {
                cb : cb,
                testName : this._currentTestName
            };

            // we assert methodName exists in object and is a method
            if (object[methodName] == null) {
                this.raiseError(new Error("Object " + object + "has no method called '" + methodName + "'"));
            }
            if (!aria.utils.Type.isFunction(object[methodName])) {
                this.raiseError(new Error("Method '" + methodName + "' in " + object + " is not a Function"));
            }

            try {
                methodArgs.push({
                    fn : '_callAsyncMethodCb',
                    scope : this,
                    args : arg2
                });
                object[methodName].apply(object, methodArgs);
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
                // TODO check: is this necessary: seems to be
                this.notifyTestEnd(this._currentTestName);
            }
        },

        /**
         * Helper callback function, adds a level of indirection to a callback by encapsulating it in a try/catch
         * @param {Object} args A structure containing the callback object and the name of the current test method
         */
        _callAsyncMethodCb : function (res, args) {
            try {
                // call test callback
                this.$callback(args.cb, res);
            } catch (ex) {
                this.handleAsyncTestError(ex, false);
            }
            this.notifyTestEnd(args.testName);
        },

        /**
         * Internal method called at the end of the test
         * @param {Object} evt the event sent by the sequencer
         * @private
         */
        _onSequenceEnd : function (evt) {
            if (this._sequencer) {
                this._sequencer.$dispose(); // will also remove listeners
                this._sequencer = null;
            }
            this._testPassed++;

            this._endTest();
            this._currentTaskId = -1;
        },

        /**
         * Error handler to use for asynchronous test callbacks. Sould be called in the catch statement - or associated
         * to the callback handler
         * @param {Error} ex the error caught in the catch statement
         * @param {Boolean} endTest [optional, default:true] ends the current test
         */
        handleAsyncTestError : function (ex, endTest) {
            if (ex.name != this.ASSERT_FAILURE) {
                // errors different from failures have to be notified
                this.raiseError(ex);
            }
            if (endTest !== false) {
                this.notifyTestEnd(this._currentTestName);
            }
        },

        /**
         * Save the Application Environment configuration. This prevents some other tests to run in an unexcpected
         * configuration.
         * @protected
         */
        _saveAppEnvironment : function () {
            this.__appEnv = aria.utils.Json.copy(aria.core.AppEnvironment.applicationSettings);
        },

        /**
         * Restore the Application Environment configuration. This prevents some other tests to run in an unexcpected
         * configuration.
         * @protected
         */
        _restoreAppEnvironment : function () {
            aria.core.AppEnvironment.setEnvironment(aria.utils.Json.copy(this.__appEnv));
        }
    }
});