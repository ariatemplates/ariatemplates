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
    $classpath : "test.aria.pageEngine.siteRootModule.SubModuleOneTestCase",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBase",
    $constructor : function () {
        this.$SiteRootModuleBase.constructor.call(this);
    },
    $destructor : function () {
        this.$SiteRootModuleBase.$destructor.call(this);
    },
    $prototype : {

        testAsyncBuildModuleRefpath : function () {
            this._createSiteModule({
                appData : {},
                cb : {
                    fn : this._testAsyncBuildModuleRefpathCB,
                    scope : this
                }
            });
        },

        _testAsyncBuildModuleRefpathCB : function () {
            var testMethod = this.rm.buildModuleRefpath;

            this.assertTrue(testMethod("a", true, null) == "commonModules.a");
            this.assertTrue(testMethod("a", true, "b") == "commonModules.a");
            this.assertTrue(testMethod("a", false, "b") == "pageModules.b.a");
            this.rm.$dispose();
            this.notifyTestEnd("testAsyncBuildModuleRefpath");
        },

        testAsyncGetPageModules : function () {
            this._createSiteModule({
                appData : {},
                cb : {
                    fn : this._testAsyncGetPageModulesCB,
                    scope : this
                }
            });
        },

        _testAsyncGetPageModulesCB : function () {
            this.rm.pageModules = {
                pageOne : {
                    modOne : {
                        data : "modOne"
                    },
                    modTwo : {
                        modThree : {
                            data : "modTwo"
                        },
                        mod : {
                            modFive : {
                                data : "modFive"
                            }
                        }
                    }
                },
                pageTwo : {
                    modFour : {
                        data : "modFour"
                    }
                }
            };
            this.rm.commonModules = {
                modOneCommon : {
                    data : "modOneCommon"
                },
                modTwoCommon : {
                    modThree : {
                        data : "modTwoCommon"
                    },
                    mod : {
                        modFiveCommon : {
                            data : "modFiveCommon"
                        }
                    }
                },
                modFourCommon : {
                    data : "modFourCommon"
                }
            };

            this.assertTrue(this.rm.getPageModule("pageOne", "modOne").data == "modOne");
            this.assertTrue(this.rm.getPageModule("pageOne", "modTwo.modThree").data == "modTwo");
            this.assertTrue(this.rm.getPageModule("pageOne", "modTwo.mod.modFive").data == "modFive");
            this.assertTrue(this.rm.getPageModule("pageTwo", "modFour").data == "modFour");

            this.assertTrue(this.rm.getPageModule("pageOne", "common:modOneCommon").data == "modOneCommon");
            this.assertTrue(this.rm.getPageModule("pageOne", "common:modTwoCommon.modThree").data == "modTwoCommon");
            this.assertTrue(this.rm.getPageModule("pageOne", "common:modTwoCommon.mod.modFiveCommon").data == "modFiveCommon");

            this.assertTrue(this.rm.getPageModule("pageOne", "modTwoCommon.modWrong.modFiveCommon") === undefined);
            this.assertTrue(this.rm.getPageModule("pageOne", "common:modTwoCommon.modWrong.modFiveCommon") === undefined);

            this.rm.$dispose();
            this.notifyTestEnd("testAsyncGetPageModules");

        }

    }
});
