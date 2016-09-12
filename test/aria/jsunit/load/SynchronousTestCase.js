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

// See what happens when Aria.load is called inside a synchronous test
Aria.classDefinition({
    $classpath : "test.aria.jsunit.load.Synchronous",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["test.aria.jsunit.load.dependencies.Met"],
    $prototype : {
        testLoadSync: function () {
            // This test should work fine without errors

            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.Met"]
            });

            this.assertLogsEmpty();
        },

        testLoadAsync: function () {
            // This happens to be an async call inside a sync test, warn the user that something is wrong
            this._expectedErrorList = [aria.jsunit.TestCase.ASYNC_IN_SYNC_TEST];

            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.ForSyncTest"]
            });
        }
    }
});
