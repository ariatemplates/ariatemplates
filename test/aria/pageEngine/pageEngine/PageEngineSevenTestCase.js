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
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineSevenTestCase",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBase",
    $constructor : function () {
        this.$PageEngineBase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProviderSeven");
    },
    $prototype : {

        runTestInIframe : function () {
            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _onPageEngineStarted : function () {
            this._checkTextIsInDom("1234567");
            this._checkTextIsInDom("abcdef");
            this._checkTextIsInDom("ghi");
            this._checkTextIsInDom("jastAStrangeString");

            this.end();
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.site.PageProviderSeven();
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this[args.oncomplete],
                    scope : this
                }
            });
        },

        end : function () {
            this._disposePageEngine();
            this.$PageEngineBase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
        },

        _checkTextIsInDom : function (text) {
            var elt = this._testWindow.aria.utils.Dom.getElementById("at-main");
            var firstDiv = elt.innerHTML;
            this.assertTrue(firstDiv.indexOf(text) != -1, "Text " + text + " was not found in the page.");
        }
    }
});
