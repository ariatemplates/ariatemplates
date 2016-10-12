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
    $classpath : "test.aria.pageEngine.pageEngine.placeholderTemplateData.PlaceholderTemplateDataTestCase",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBase",
    $constructor : function () {
        this.$PageEngineBase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.placeholderTemplateData.MyPageProvider");
    },
    $prototype : {
        /**
         * @override
         */
        runTestInIframe : function () {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.placeholderTemplateData.MyPageProvider();
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();

            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this._onPageEngineStart,
                    scope : this
                }
            });
        },

        _onPageEngineStart : function () {
            var divToCheck = this._testWindow.document.getElementById("divToCheck");
            this.assertEquals(divToCheck.innerHTML, "This is the message to be displayed on the page !!");
            this.end();
        },

        /**
         * @override
         */
        end : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
            this.$PageEngineBase.end.call(this);
        }
    }
});
