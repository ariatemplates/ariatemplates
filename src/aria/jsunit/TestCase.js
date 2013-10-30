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
    $dependencies : ["aria.core.Sequencer", "aria.utils.Json", "aria.utils.Type", "aria.utils.Object",
            "aria.utils.Array"],
    $statics : {
        // some tests run slower on IE when they are in a suite
        "defaultTestTimeout" : 60000,

        IFRAME_BASE_CSS_TEXT : "position:fixed;top:20px;left:20px;z-index:10000;width:1000px;height:700px;border:1px solid blue;background:aliceblue;opacity:0.8;-ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=80)';filter: alpha(opacity=80);",

        ERROR_NOTIFY_END : "Synchronous test is calling notifyTestEnd",
        EXCEPTION_IN_METHOD : "Exception raised while calling '%1' in an asynchronous test",
        ASYNC_IN_SYNC_TEST : "Doing asynchronous actions inside a synchronous test, please check '%1'",
        FORGOTTEN_CB : "Did you forget to call this.$callback(callback)?"
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
         * Whether or not to skip this test
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

        var proto = Aria.nspace(this.$classpath).classDefinition.$prototype;
        var methods = aria.utils.Object.keys(proto);
        var isFunction = aria.utils.Type.isFunction;
        methods = aria.utils.Array.filter(methods, function (method) {
            return isFunction(proto[method])
                    && !aria.utils.Array.contains(["setUp", "tearDown", "beforeClass", "afterClass"], method);
        });
        this.__wrapTestMethods(methods);
        this.__wrapAriaLoad();

        /**
         * Number of Aria.load pending to be completed before we can notify a test end
         * @type {Number}
         */
        this.__pendingAriaLoad = 0;

        /**
         * Actions that should be executed once __pendingAriaLoad reaches 0
         * @type {Array} of functions called with the test scope
         */
        this.__pendingActions = [];
    },
    $destructor : function () {
        this.__restoreAriaLoad();
        // destructor
        if (this._sequencer) {
            this._sequencer.$dispose();
        }
        this.$Assert.$destructor.call(this);
        this._currentTaskId = null;
        this.__pendingActions = null;
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

            var isFunction = aria.utils.Type.isFunction;
            // do not add tasks to the sequencer if the TestCase is mean to be skipped
            if (!this.skipTest) {
                for (var key in this) {
                    if (key.indexOf("test") === 0 && isFunction(this[key])) {
                        var isAsynchronous = (key.indexOf("testAsync") === 0);

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
                "end" : this._onSequencerEnd,
                scope : this
            });

            try {
                this._beforeClass(this._startSequencer);
            } catch (exBeforeClass) {
                this.raiseError(exBeforeClass, "Error location: beforeClass() method");
            }
        },

        /**
         * Cancels the timeout timer if it exists.
         */
        _clearTimeoutTimer : function () {
            if (this._timeoutTimer) {
                aria.core.Timer.cancelCallback(this._timeoutTimer);
                this._timeoutTimer = null;
            }
        },

        /**
         * Start the test tasks sequence.
         */
        _startSequencer : function () {
            this._clearTimeoutTimer(); // reset the timer for beforeClass
            this._sequencer.start();
        },

        /**
         * Wrap original test methods inside a try catch that if failed logs an error and ends the test
         * @param {Array} methods List of functions on the test prototype
         * @private
         */
        __wrapTestMethods : function (methods) {
            var originals = {};
            for (var i = 0, len = methods.length; i < len; i += 1) {
                var method = methods[i];
                if (method.indexOf("test") === 0) {
                    continue;
                }
                originals[method] = this[method];
                this[method] = (function (name) {
                    return function () {
                        var test = this._currentTestName;
                        if (test && test.indexOf("testAsyn") === 0) {
                            try {
                                return originals[name].apply(this, arguments);
                            } catch (ex) {
                                this.__failInTestMethod(ex, name);
                            }
                        } else {
                            // Either this is not a test (callback?) or sync test, let the test handle the error
                            return originals[name].apply(this, arguments);
                        }
                    };
                })(method);
            }
        },

        /**
         * Executed when an unhandled exception is thrown inside a method defined on the test instance but not a test.
         * If the test is asynchronous this will log an error and notify its end
         * @param {Error} ex Exception
         * @param {String} methodName Method that threw the exception
         * @private
         */
        __failInTestMethod : function (ex, methodName) {
            var test = this._currentTestName;
            if (test.indexOf("testAsyn") === 0) {
                this.$logError(this.EXCEPTION_IN_METHOD, methodName, ex);
                // Remove '()'
                this.notifyTestEnd(test.substring(0, test.length - 2));
            }
        },

        __wrapAriaLoad : function () {
            var originalLoad = Aria.load;
            var testCase = this;
            Aria.load = function (description) {
                testCase.__pendingAriaLoad += 1;

                var userSuccess = description.oncomplete;
                var userError = description.onerror;

                description.oncomplete = {
                    fn : testCase.__AriaLoadCallback,
                    scope : testCase,
                    args : userSuccess
                };
                description.onerror = {
                    fn : testCase.__AriaLoadCallback,
                    scope : testCase,
                    args : userError,
                    override : userError && userError.override
                };

                originalLoad.call(Aria, description);
            };
            Aria.load.originalLoad = originalLoad;
        },

        __AriaLoadCallback : function (userCallback) {
            this.__pendingAriaLoad -= 1;
            // FIXME it would be nice to use this.$callback but Aria.load has a different signature
            // see http://ariatemplates.com/forum/showthread.php?tid=23
            if (userCallback) {
                if (typeof(userCallback) == 'function') {
                    userCallback = {
                        fn : userCallback
                    };
                }
                var scope = (userCallback.scope) ? userCallback.scope : Aria;
                // Didn't copy paste the try catch because we are already inside that try block
                userCallback.fn.call(scope, userCallback.args);
            }

            if (this.__pendingAriaLoad < 1 && this.__pendingActions.length > 0) {
                while (this.__pendingActions.length > 0) {
                    var action = this.__pendingActions.shift();
                    action.fn.apply(this, action.args);
                }
            }
        },

        __restoreAriaLoad : function () {
            var originalLoad = Aria.load.originalLoad;
            if (originalLoad) {
                Aria.load = originalLoad;
            }
        },

        /**
         * Conditional wait before calling the callback It takes only one json parameter
         * @param {args} args json parameter with the following attributes: <br />
         * {integer} delay : Optional. Time interval between two test <br />
         * {Function} condition : function which returns true or false. If true, the callback will be called, if false,
         * this method will will call again after a delay. <br />
         * {Function} callback : callback which will be called when the condition function returns true
         */
        waitFor : function (args) {
            var delay = args.delay || 250;
            var condition = args.condition;

            var timeoutFn = function () {
                if (this.$callback(condition)) {
                    this.$callback(args.callback);
                } else {
                    aria.core.Timer.addCallback({
                        fn : timeoutFn,
                        scope : this,
                        delay : delay
                    });
                }
            };
            aria.core.Timer.addCallback({
                fn : timeoutFn,
                scope : this,
                delay : delay
            });
        },

        /**
         * Internal method called for each test method
         * @param {Object} evt the event sent by the sequencer
         * @private
         */
        _execTestTask : function (task) {
            var testName = task.name, original;
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
                } else {
                    original = this._disableTestEnd();
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

            if (!task.asynchronous || errorDetected) {
                // it might have started synchronously, but now it should behave asynchronously
                if (!task.asynchronous && this.__pendingAriaLoad > 0) {
                    task.asynchronous = true;
                    this.$logError(this.ASYNC_IN_SYNC_TEST, this._currentTestName);
                }

                this._enableTestEnd(original);
                this.notifyTestEnd(testName, errorDetected, task.asynchronous);
            }
        },

        /**
         * Synchronous tests shouldn't call their notify test end manually. This is handled by the framework. Report an
         * error in this case
         * @return {Function} Original notify test end function
         */
        _disableTestEnd : function () {
            var original = this.notifyTestEnd;
            this.notifyTestEnd = this._failOnNotify;
            return original;
        },

        /**
         * Put back the original notifyTestEnd to let the test end properly. Should be called only for sync tests
         * @param {Function} original Original notify test end function
         */
        _enableTestEnd : function (original) {
            if (original) {
                this.notifyTestEnd = original;
            }
        },

        /**
         * This function replaces notifyTestEnd in synchronous tests, this prevents a task from being terminated twice,
         * that might result in un-handled errors.
         */
        _failOnNotify : function () {
            this.$logError(this.ERROR_NOTIFY_END);
        },

        /**
         * Override the timeout delay allowed for the current test. Tests are now stopped if they don't reach completion
         * after a certain delay. This method allows to increase or decrease this delay. When called the timer is
         * restarted. Meaning after the call, the test will have ${timeout} milliseconds before failing for timeout.
         * @param {Number} timeout
         * @param {String} methodName name of the test or a special method (e.g. beforeClass)
         */
        setTestTimeout : function (timeout, methodName) {
            if (this.demoMode) {
                return;
            }
            this._clearTimeoutTimer();

            var msg = "The method " + methodName + " has timed out.";
            var beforeOrAfterClass = (methodName == "beforeClass" || methodName == "afterClass");
            if (beforeOrAfterClass) {
                msg = msg + " " + this.FORGOTTEN_CB;
            }
            var error = new Error(msg);
            this._timeoutTimer = aria.core.Timer.addCallback({
                fn : beforeOrAfterClass ? this._beforeAfterClassError : this.handleAsyncTestError,
                scope : this,
                delay : timeout,
                args : beforeOrAfterClass ? [error, methodName] : error
            });
        },

        /**
         * Handler for the timeouts of asynchronous `beforeClass` and `afterClass` special methods.
         * @param {Array} args [0]{Error} [1]{String} either "beforeClass" or "afterClass"
         */
        _beforeAfterClassError : function (args) {
            var ex = args[0];
            var methodName = args[1];

            if (methodName == "beforeClass") {
                // disallow executing any tests, probably most of them would fail and unnecessarily flood the console
                this._sequencer._tasks = [];
            }

            this.handleAsyncTestError(ex, methodName);

            if (methodName == "afterClass") {
                this._onSequencerEndCallback();
            }
        },

        /**
         * Internal method used by asynchronous tests methods (i.e. named as testAsyncXXX) to notify the test end -
         * automatically called for synchronous tests
         * @param {String} testName the test method name
         * @param {Boolean} terminate force the test termination [optional - default: false]
         * @param {Boolean} asyncTest tells if test was asynchronous [optional - default: true]
         */
        notifyTestEnd : function (testName, terminate, asyncTest) {
            if (this.__pendingAriaLoad > 0) {
                this.__pendingActions.push({
                    fn : this.notifyTestEnd,
                    args : [testName, terminate, asyncTest]
                });

                // Stop here, the load callback will notify the test end again
                return this.$logInfo("notifyTestEnd called when Aria.load is still pending, waiting");
            }

            this._clearTimeoutTimer();

            // check that all expected events have occurred
            this.checkExpectedEventListEnd();
            this.checkExpectedErrorListEnd();
            // show any unexpected error which appeared in logs
            this.assertLogsEmpty(false, false);

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
            if (asyncTest !== false) {
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
         * Executes the <code>this.beforeClass</code> if it exists and is a function, and passes the callback.
         * Otherwise, it executes the callback.
         * @param {Function} done Callback function
         */
        _beforeClass : function (done) {
            this.__beforeOrAfterClass(this.beforeClass, "beforeClass", done);
        },

        /**
         * Executes the <code>this.afterClass</code> if it exists and is a function, and passes the callback.
         * Otherwise, it executes the callback.
         * @param {Function} done Callback function
         */
        _afterClass : function (done) {
            this.__beforeOrAfterClass(this.afterClass, "afterClass", done);
        },

        /**
         * Calls <code>func</code>, if it is a function, in a synchronous or asynchronous way (inferred from function
         * length), and calls/relays the <code>done</code> callback accordingly.
         * @param {Function} func Function to be executed
         * @param {String} funcName Name that will be logged for debugging purpose if the callback was not executed
         * @param {Function} done Callback function
         * @private
         */
        __beforeOrAfterClass : function (func, funcName, done) {
            var cb = {
                fn : done,
                scope : this
            };

            if (aria.utils.Type.isFunction(func)) {
                if (func.length === 0) { // func is sync, execute the callback ourselves
                    func.call(this);
                    this.$callback(cb);
                } else { // func is async, let the user execute the callback
                    // first, set the timer, in case the user forgot to call the callback
                    this.setTestTimeout(this.defaultTestTimeout, funcName);
                    func.call(this, cb);
                }
            } else {
                this.$callback(cb);
            }
        },

        /**
         * Internal method called at the end of the test
         * @param {Object} evt the event sent by the sequencer
         * @private
         */
        _onSequencerEnd : function (evt) {
            if (this._sequencer) {
                this._sequencer.$dispose(); // will also remove listeners
                this._sequencer = null;
            }

            try {
                this._afterClass(this._onSequencerEndCallback);
            } catch (exAfterClass) {
                this.raiseError(exAfterClass, "Error location: afterClass() method");
            }
        },

        /**
         * Internal method called at the end of the test, after <code>this.afterClass</code>.
         */
        _onSequencerEndCallback : function () {
            this._clearTimeoutTimer(); // reset the timer for afterClass
            this._testPassed++;

            this._endTest();
            this._currentTaskId = -1;
        },

        /**
         * Error handler to use for asynchronous test callbacks. Should be called in the catch statement - or associated
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
         * Save the Application Environment configuration. This prevents some other tests to run in an unexpected
         * configuration.
         * @protected
         */
        _saveAppEnvironment : function () {
            this.__appEnv = aria.utils.Json.copy(aria.core.AppEnvironment.applicationSettings);
        },

        /**
         * Restore the Application Environment configuration. This prevents some other tests to run in an unexpected
         * configuration.
         * @protected
         */
        _restoreAppEnvironment : function () {
            aria.core.AppEnvironment.setEnvironment(aria.utils.Json.copy(this.__appEnv));
        }
    }
});
