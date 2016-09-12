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

Aria.classDefinition({
    $classpath : "test.aria.jsunit.load.TemplateATestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            // Expect the complete callback to be called before actually finishing the test
            this._expectedErrorList = ["oncomplete called"];

            Aria.load({
                classes : ["test.aria.jsunit.load.dependencies.Missed"],
                oncomplete : {
                    fn : this.logSomething,
                    scope : this,
                    args : "oncomplete called"
                }
            });

            this.end();
        },

        logSomething : function (message) {
            // Log something so that the tester can assert that we called the callback from checkExpectedEventListEnd
            this.$logError(message);
        }
    }
});
