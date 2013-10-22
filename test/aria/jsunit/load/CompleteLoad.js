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

// See what happens when both success and fail callback are present
Aria.classDefinition({
    $classpath : "test.aria.jsunit.load.CompleteLoad",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.jsunit.load.dependencies.Met"],
    $prototype : {
        logSomething : function (message) {
            // Log something so that the tester can assert that we called the callback from checkExpectedEventListEnd
            this.$logError(message);
        },

        testAsyncLoad: function () {
            // Expect the complete callback to be called before actually finishing the test
            this._expectedErrorList = ["oncomplete called"];

            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.Missed"],
                oncomplete : {
                    fn : this.logSomething,
                    scope : this,
                    args : "oncomplete called"
                },
                onerror : {
                    fn : this.logSomething,
                    scope : this,
                    args : "onerror called"
                }
            });

            this.notifyTestEnd("testAsyncLoad");
        },

        testAsyncLoadError: function () {
            // Expect the complete callback to be called before actually finishing the test
            this._expectedErrorList = ["onerror called", aria.core.MultiLoader.LOAD_ERROR];

            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.FileNotFound"],
                oncomplete : {
                    fn : this.logSomething,
                    scope : this,
                    args : "oncomplete called"
                },
                onerror : {
                    fn : this.logSomething,
                    scope : this,
                    args : "onerror called"
                }
            });

            this.notifyTestEnd("testAsyncLoadError");
        },

        testAsyncLoadErrorWithOverride: function () {
            // By overriding we prevent the class load error to be logged
            this._expectedErrorList = ["onerror called"];

            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.FileNotFoundAgain"],
                oncomplete : {
                    fn : this.logSomething,
                    scope : this,
                    args : "oncomplete called"
                },
                onerror : {
                    fn : this.logSomething,
                    scope : this,
                    args : "onerror called",
                    override : true
                }
            });

            this.notifyTestEnd("testAsyncLoadError");
        },

        testAsyncLoadSync: function () {
            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.Met"],
                oncomplete : {
                    fn : this.logSomething,
                    scope : this,
                    args : "oncomplete called"
                },
                onerror : {
                    fn : this.logSomething,
                    scope : this,
                    args : "onerror called"
                }
            });

            // I expect the error to be here already because Aria.load should be synchronous
            this.assertErrorInLogs("oncomplete called");

            this.notifyTestEnd("testAsyncLoadSync");
        }
    }
});
