/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Meta test, check that the test runner raises the exception in case of a timeout in `beforeClass`. Since it's testing
 * itself, it needs some hacks.
 */
Aria.classDefinition({
    $classpath : "test.aria.jsunit.beforeAfter.TimeoutTestBeforeClass",
    $extends : "aria.jsunit.TestCase",
    $constructor : function () {
        this.defaultTestTimeout = 1000;

        this.testsWereExecuted = false;
        this.properErrorWasRaised = false;

        this.$TestCase.constructor.call(this);
    },
    $destructor : function () {
        // if (and only if) there is "Error disposing test" raised, one of the following assertions has failed.
        this.assertFalse(this.testsWereExecuted);
        this.assertTrue(this.properErrorWasRaised);

        this.$TestCase.constructor.call(this);
    },
    $prototype : {
        /**
         * Override the standard method for handling async errors, in order to assert the error was raised
         * @override
         */
        handleAsyncTestError : function (ex, endTest) {
            // do not raise the error!
            if (ex.message.indexOf(this.FORGOTTEN_CB) != -1) {
                this.properErrorWasRaised = true;
            }
            this.notifyTestEnd(this._currentTestName);
        },

        beforeClass : function (cb) {
            // I forgot to call cb here!
            // Hence this should time out and raise the exception with the message containing this.FORGOTTEN_CB
        },

        testThisIsNotExecuted : function () {
            this.testsWereExecuted = true;
        }
    }
});
