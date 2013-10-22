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

// See what happens when Aria.load doesn't have any callback
Aria.classDefinition({
    $classpath : "test.aria.jsunit.load.IgnoreCallbacks",
    $extends : "aria.jsunit.TestCase",
    $prototype : {
        testAsyncLoadError: function () {
            // Simply expect 0 undisposed objects
            this._expectedErrorList = [aria.core.MultiLoader.LOAD_ERROR];

            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.AnotherFileNotFound"]
            });

            this.notifyTestEnd("testAsyncLoadError");
        }
    }
});
