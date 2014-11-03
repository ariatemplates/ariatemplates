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
    $classpath : "test.aria.pageEngine.pageEngine.customPageConfig.CustomPageConfigTest",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProvider");
        this._dependencies.push("test.aria.pageEngine.pageEngine.customPageConfig.CustomPageEngine");
    },
    $prototype : {

        runTestInIframe : function () {

            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function (args) {

            // check that the page is displayed
            var text = this._testWindow.aria.utils.Dom.getElementById("at-main").innerHTML;
            this.assertTrue(text.match(/AAAA/) !== null);

            // check that the overridden method has been called
            this.assertTrue(this.pageEngine.customPageConfigHelper, "Overridden method _getPageConfigHelper hasn't been called");
            this.end();
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.site.PageProvider();
            this.pageEngine = new this._testWindow.test.aria.pageEngine.pageEngine.customPageConfig.CustomPageEngine();
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this[args.oncomplete],
                    scope : this
                }
            });
        },

        end : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
            this.$PageEngineBaseTestCase.end.call(this);
        }
    }
});
