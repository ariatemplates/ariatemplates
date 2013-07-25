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
    $classpath : "test.aria.pageEngine.pageEngine.issue626.PageReadyEventTest",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.defaultTestTimeout = 10000;
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.issue626.PageProvider626");

        this.__pageReadyEventWasRaised = false;
    },
    $prototype : {

        /**
         * This function will be called if test is successful. Otherwise the test will time out.
         */
        _onPageReady : function () {
            this.__pageReadyEventWasRaised = true;
        },

        /**
         * @override
         */
        runTestInIframe : function () {
            this._createPageEngine();
        },

        _createPageEngine : function () {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.issue626.PageProvider626();
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.$addListeners({
                "pageReady" : {
                    fn : this._onPageReady,
                    scope : this
                }
            });
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this._onPageEngineStart,
                    scope : this
                }
            });
        },

        _onPageEngineStart : function () {
            this.assertTrue(this.__pageReadyEventWasRaised, "pageReady event was not raised");
            this.end();
        },

        /**
         * @override
         */
        end : function () {
            this._disposePageEngine();
            this.$PageEngineBaseTestCase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$removeListeners({
                "pageReady" : {
                    fn : this._onPageReady,
                    scope : this
                }
            });
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
        }
    }
});
