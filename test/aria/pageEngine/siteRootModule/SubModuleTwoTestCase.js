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
    $classpath : "test.aria.pageEngine.siteRootModule.SubModuleTwoTestCase",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBase",
    $constructor : function () {
        this.$SiteRootModuleBase.constructor.call(this);
    },
    $destructor : function () {
        this.$SiteRootModuleBase.$destructor.call(this);
    },
    $prototype : {

        testAsyncLoadPageEngineModulesOne : function () {
            this._createSiteModule({
                appData : {},
                cb : {
                    fn : this._testAsyncLoadPageEngineModulesOneCB,
                    scope : this
                }
            });
        },

        _testAsyncLoadPageEngineModulesOneCB : function () {
            this.testModules = {
                page : [{
                            classpath : "test.aria.pageEngine.testContents.modules.SimpleModule1",
                            refpath : "modOne"
                        }, {
                            classpath : "test.aria.pageEngine.testContents.modules.SimpleModule2",
                            refpath : "mod.modTwo"
                        }, {
                            classpath : "test.aria.pageEngine.testContents.modules.SimpleModule3",
                            refpath : "mod.modThree",
                            initArgs : {
                                args : "modThree"
                            }
                        }],
                common : [{
                            classpath : "test.aria.pageEngine.testContents.modules.SimpleModule1",
                            refpath : "modOne"
                        }, {
                            classpath : "test.aria.pageEngine.testContents.modules.SimpleModule2",
                            refpath : "mod.modTwo"
                        }, {
                            classpath : "test.aria.pageEngine.testContents.modules.SimpleModule3",
                            refpath : "mod.modThree",
                            initArgs : {
                                args : "modThree"
                            }
                        }]
            };
            this.rm.loadModules("pageOne", this.testModules, {
                fn : this._afterSMLoadOne,
                scope : this
            });
        },

        _afterSMLoadOne : function () {

            this.assertTrue(this.rm.getPageModule("pageOne", "modOne") != null);
            this.assertTrue(this.rm.getPageModule("pageOne", "mod.modTwo") != null);
            this.assertTrue(this.rm.getPageModule("pageOne", "mod.modThree").getData().args == "modThree");

            this.assertTrue(this.rm.getPageModule("pageOne", "common:modOne") != null);
            this.assertTrue(this.rm.getPageModule("pageOne", "common:mod.modTwo") != null);
            this.assertTrue(this.rm.getPageModule("pageOne", "common:mod.modThree").getData().args == "modThree");
            this.rm.loadModules("pageOne", this.testModules, {
                fn : this._afterSMLoadTwo,
                scope : this
            });
        },

        _afterSMLoadTwo : function () {
            this.testModules = null;
            this.rm.$dispose();
            this.notifyTestEnd("testLoadPageEngineModulesOne");

        }

    }
});
