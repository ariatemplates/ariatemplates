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
 * This etst fails only inside a Suite
 */
Aria.classDefinition({
    $classpath : "test.aria.jsunit.TestCaseTest",
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        /**
         * Try to call notify test end in a synchronous test, it should raise an error
         */
        testTwoNotify : function () {
            // This test is synchronous, it shouldn't call notifyTestEnd
            this.notifyTestEnd("testTwoNotify");

            this.assertErrorInLogs(aria.jsunit.TestCase.ERROR_NOTIFY_END);
        },

        /**
         * Raise an exception in a test callack. It should make the test fail
         */
        testAsyncError : function () {
            var scope = {
                failed : false
            };

            // Override the default implementation for async failures
            this.__failInTestMethod = function () {
                scope.failed = true;
            };

            aria.core.Timer.addCallback({
                fn : this.after,
                scope : this,
                delay : 100
            });

            aria.core.Timer.addCallback({
                fn : this.complete,
                scope : this,
                args : scope,
                delay : 200
            });
        },

        /**
         * Method that throws the exception
         */
        after : function () {
            throw "Error";
        },

        /**
         * Complete the test
         */
        complete : function (args) {
            this.assertTrue(args.failed, "Fail function was not called");
            this.notifyTestEnd("testAsyncError");
        }
    }
});
