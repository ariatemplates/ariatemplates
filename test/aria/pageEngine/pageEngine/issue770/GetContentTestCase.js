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

Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.issue770.GetContentTest",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.defaultTestTimeout = 10000;
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.issue770.PageProvider770");

        this.__pageReadyEventWasRaised = false;
    },
    $prototype : {

        /**
         * @override
         */
        runTestInIframe : function () {
            this._createPageEngine();
        },

        _createPageEngine : function () {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.issue770.PageProvider770();
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();

            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this._onPageEngineStart,
                    scope : this
                }
            });
            
            // Testing that no error is raised when the page engine, as a content provider, is asked for a content that it cannot provide because it hasn't received any page definition yet
            var ex;
            try {
                this.pageEngine.getContent("body");
            } catch (e) {
                ex = e;
            }
            this.assertTrue(typeof ex == "undefined");
        },

        _onPageEngineStart : function () {
            this.end();
        },

        /**
         * @override
         */
        end : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
            this.$PageEngineBaseTestCase.end.call(this);
        }
    }
});
