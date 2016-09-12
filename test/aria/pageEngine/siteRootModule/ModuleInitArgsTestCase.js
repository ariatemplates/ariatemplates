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

/**
 * aria.pageEngine.SiteRootModule test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModuleInitArgsTestCase",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBase",
    $constructor : function () {
        this.$SiteRootModuleBase.constructor.call(this);
        this._navigateCalls = [];
        this._pageEngine = null;
    },
    $destructor : function () {
        this._pageEngine = null;
        this.$SiteRootModuleBase.$destructor.call(this);
    },
    $prototype : {

        testAsyncLoadPageEngineModulesOne : function () {
            var that = this;
            this._pageEngine = {
                navigate : function () {
                    that._navigate.apply(that, arguments);
                }
            };
            this._createSiteModule({
                appData : {},
                pageEngine : this._pageEngine,
                cb : {
                    fn : this._testAsyncLoadPageEngineModulesOneCB,
                    scope : this
                }
            });
        },

        _navigate : function (page) {
            this._navigateCalls.push(page);
        },

        _testAsyncLoadPageEngineModulesOneCB : function () {

            this.testModules = {
                page : [{
                            classpath : "test.aria.pageEngine.testContents.modules.TestModuleSeven",
                            refpath : "modSeven"
                        }],
                common : []
            };
            this.rm.loadModules("pageOne", this.testModules, {
                fn : this._afterSMLoadOne,
                scope : this
            });
        },

        _afterSMLoadOne : function () {
            var moduleSeven = this.rm.getPageModule("pageOne", "modSeven");
            this.assertTrue(moduleSeven != null);
            var initArgs = moduleSeven.getInitArgs();

            this.assertEquals(initArgs.pageEngine, this._pageEngine, "Page engine wrapper was not correctly passed as init argument of the module.");

            this.rm.unloadPageModules("pageOne");

            this.testModules = {
                page : [{
                            classpath : "test.aria.pageEngine.testContents.modules.TestModuleSeven",
                            refpath : "modSeven",
                            initArgs : {
                                testVar : "myTestVar"
                            }
                        }],
                common : []
            };
            this.rm.loadModules("pageOne", this.testModules, {
                fn : this._afterSMLoadTwo,
                scope : this
            });

        },

        _afterSMLoadTwo : function () {
            var moduleSeven = this.rm.getPageModule("pageOne", "modSeven");
            this.assertTrue(moduleSeven != null);
            var initArgs = moduleSeven.getInitArgs();

            this.assertEquals(initArgs.pageEngine, this._pageEngine, "Page engine wrapper was not correctly passed as init argument of the module.");
            this.assertEquals(initArgs.testVar, "myTestVar", "Original initArgs have not been correctly passed to the module.");

            this.rm.$dispose();
            this.notifyTestEnd("testLoadPageEngineModulesOne");

        }

    }
});
