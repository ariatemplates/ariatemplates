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
 * Base class for all Test objects (Test Case and TestSuite). Defines the interface expected by the Test Runner
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.Test",
    $events : {
        /**
         * @event failure
         */
        "failure" : {
            description : "raised when a failure occurs (failures are expected and correspond to wrong assertions)",
            properties : {
                testClass : "{String} classpath of the current test",
                testState : "{String} name of the current state in the test (method name)",
                description : "{String} failure description"
            }
        },
        /**
         * @event error
         */
        "error" : {
            description : "raised when an error occurs (error are uncaught exception)",
            properties : {
                testClass : "{String} classpath of the current test",
                testState : "{String} name of the current state in the test (method name)",
                exception : "{Error} error object caught by the test",
                msg : "{String} optional message associated to this error"
            }
        },
        /**
         * @event stateChange
         */
        "stateChange" : {
            description : "raised when the test moves to a new test method",
            properties : {
                testClass : "{String} classpath of the current test",
                testState : "{String} name of the current state in the test (method name)"
            }
        },
        /**
         * @event start
         */
        "start" : {
            description : "raised when a test starts",
            properties : {
                testObject : "{Object) the test object",
                testClass : "{String} classpath of the current test"
            }
        },
        /**
         * @event end
         */
        "end" : {
            description : "raised when the test ends",
            properties : {
                testObject : "{Object) the test object",
                testClass : "{String} classpath of the current test",
                nbrOfAsserts : "{Integer} number of asserts evaluated during the test"
            }
        },
        /**
         * @event testLoad
         */
        "testLoad" : {
            description : "raised when a test loads a sub-test",
            properties : {
                testLoader : "{Object) the test object that loads the sub-test",
                testObject : "{Object) the test object which has been loaded"
            }
        },
        "preloadEnd" : {
            description : "Raised when the class of the Test is preloaded, with its dependencies and sub tests",
            properties : {
                testSuite : "{Object) the test object that loads the sub-test"
            }
        }
    },
    $constructor : function () {
        /**
         * Flag to check if the test if finished
         * @type Boolean
         * @private
         */
        this._isFinished = false;

        /**
         * In the scope of a test campaign, a test can have a parent test
         * @type aria.jsunit.TestSuite
         * @private
         */
        this._parentTest = null;

        /**
         * Execution time of the test
         * @private
         */
        this._executionTime = -1;

        /**
         * Array of all errors triggered by this Assert class
         * @type Array
         * @private
         */
        this._errors = [];

        /**
         * Whether or not this test is already failed when the constructor is called. This might happen when there's an
         * error downloading the test file
         * @type Boolean
         */
        this._failedOnCreate = false;

        this.$JsObject.constructor.call(this);
    },
    $destructor : function () {
        this._parentTest = null;

        // Free some memory, not for failed tests
        if (!this._failedOnCreate) {
            var classRef = Aria.getClassRef(this.$classpath);
            aria.core.ClassMgr.unloadClass(this.$classpath);
            if (classRef && classRef.classDefinition && classRef.classDefinition.$dependencies) {
                var dep = classRef.classDefinition.$dependencies;
                for (var i = 0, len = dep.length; i < len; i += 1) {
                    if (dep[i].substring(0, 5) == "test.") {
                        aria.core.ClassMgr.unloadClass(dep[i]);
                    }
                }
            }
        }

        this.$JsObject.$destructor.call(this);
    },
    $prototype : {
        /**
         * Main function that will be called to execute the test. Failures and errors should be reported through events
         * (cf. JsObject) This method must be overridden by sub-classes
         */
        run : function () {},

        _startTest : function () {
            this._timestampBegin = (new Date()).getTime();
        },

        _endTest : function () {
            this._timestampEnd = (new Date()).getTime();
            this._executionTime = this._timestampEnd - this._timestampBegin;
        },

        /**
         * Retrieve the execution time of the test in milliseconds
         * @return {Number} execution time of the test in milliseconds
         */
        getExecutionTime : function () {
            return this._executionTime;
        },

        /**
         * Assign a parent test suite to the Test
         * @param {aria.jsunit.TestSuite} test
         */
        setParentTest : function (testsuite) {
            this._parentTest = testsuite;
        },

        /**
         * Retrieve the parent test suite of this test
         * @return {aria.jsunit.TestSuite} test
         */
        getParentTest : function () {
            return this._parentTest;
        },

        /**
         * Retrieve the status of the test
         * @return {Boolean} true if the test is finished, false otherwise
         */
        isFinished : function () {
            return this._isFinished === true;
        },

        /**
         * Retrieve the amount of completed Test elements executed in the scope of this Test. Can be 0 or 1 for a
         * TestCase, and 0 to N for a TestSuite
         * @return {Number}
         */
        getFinishedTestsCount : function () {
            return this._testPassed;
        },

        init : function () {
            this.$raiseEvent({
                name : "preloadEnd",
                testSuite : this
            });
        }
    }
});