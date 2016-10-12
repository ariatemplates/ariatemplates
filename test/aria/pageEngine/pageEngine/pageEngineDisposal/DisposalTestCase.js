/*
 * Copyright 2014 Amadeus s.a.s.
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
    $classpath : "test.aria.pageEngine.pageEngine.pageEngineDisposal.DisposalTestCase",
    $dependencies : ["aria.pageEngine.PageEngine", "test.aria.pageEngine.pageEngine.pageEngineDisposal.PageProvider"],
    $extends : "aria.jsunit.TestCase",
    $prototype : {

        /**
         * this test just checks if all the object instantiated by pageEngine and pageProvider are correctly disposed
         */
        testAsyncDisposePageEngine : function () {
            var document = Aria.$window.document;
            var div = document.createElement("div");
            div.id = "testId";
            document.body.appendChild(div);

            this.pageEngine = new aria.pageEngine.PageEngine();
            this.pageProvider = new test.aria.pageEngine.pageEngine.pageEngineDisposal.PageProvider();

            var startConfig = {
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : function () {
                        this.pageEngine.$dispose();
                        this.pageProvider.$dispose();
                        this.notifyTestEnd('testAsyncDisposePageEngine');
                    },
                    scope : this
                }
            };

            this.pageEngine.start(startConfig);

        }
    }
});
