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
    $classpath : "test.aria.pageEngine.pageEngine.customRootModule.CustomRootModuleBaseTestCase",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBaseTestCase",
    $constructor : function () {
        this.$PageEngineBaseTestCase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.customRootModule.PageProvider");
        this.rootModuleCfg = this.rootModuleCfg || null;
    },
    $prototype : {

        runTestInIframe : function () {

            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.customRootModule.PageProvider();
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                rootModule : this.rootModuleCfg,
                oncomplete : {
                    fn : this._afterPageEngineStart,
                    scope : this
                },
                onerror : {
                    fn : this._afterPageEngineStart,
                    scope : this
                }
            });

        },

        _afterPageEngineStart : function () {
            this.end();
        },

        end : function () {
            this._disposePageEngine();
            this.$PageEngineBaseTestCase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();

        }

    }
});
