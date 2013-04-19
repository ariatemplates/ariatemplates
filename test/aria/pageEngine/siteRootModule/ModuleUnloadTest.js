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
 * Test a simple binding with two modules
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModuleUnloadTest",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $prototype : {
        testAsyncMultipleBinding : function () {
            this._createSiteModule({
                appData : {
                    second : false,
                    baseFacts : {
                        one : 1,
                        two : 2
                    }
                },
                cb : {
                    fn : this._loadFirstSubmodules,
                    scope : this
                }
            });

        },

        _loadFirstSubmodules : function (res) {
            var moduleConf = {
                page : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule1",
                            initArgs : {
                                first : false
                            },
                            bind : {
                                "first" : "appData:baseFacts.first",
                                "second" : "pageData:second"
                            }
                        }, {
                            refpath : "m2.m3",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule3",
                            bind : {
                                "first.third" : "appData:baseFacts.first",
                                "second.fourth" : "pageData:second"
                            }
                        }],
                common : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule2",
                            bind : {
                                "first.data" : "appData:baseFacts.first",
                                "second" : "pageData:second"
                            }
                        }]
            };

            this.rm.loadModules("pageOne", moduleConf, {
                fn : this._loadSecondSubmodules,
                scope : this,
                resIndex : -1,
                args : "_checkBindings"

            });
        },
        _loadSecondSubmodules : function (callback) {
            var moduleConf = {
                page : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule1",
                            initArgs : {
                                first : false
                            },
                            bind : {
                                "first" : "appData:baseFacts.first",
                                "second" : "pageData:second"
                            }
                        }, {
                            refpath : "m2.m3",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule3",
                            bind : {
                                "first.third" : "appData:baseFacts.first",
                                "second.fourth" : "pageData:second"
                            }
                        }],
                common : [{
                            refpath : "m2",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule2",
                            bind : {
                                "first.data" : "appData:baseFacts.first",
                                "second" : "pageData:second"
                            }
                        }]
            };

            this.rm.loadModules("pageTwo", moduleConf, {
                fn : this[callback],
                scope : this
            });
        },

        _checkBindings : function () {
            // change a bound value
            this.$json.setValue(this._getModuleData("m1", true, "pageOne"), "first", "new");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new");
            this.assertEquals(this._getModuleData("m1", false, "pageTwo").first, "new");
            this.assertEquals(this._getModuleData("common:m1", false).first.data, "new");
            this.assertEquals(this._getModuleData("common:m2", false).first.data, "new");
            this.assertEquals(this._getModuleData("m2.m3", false, "pageOne").first.third, "new");
            this.assertEquals(this._getModuleData("m2.m3", false, "pageTwo").first.third, "new");

            // change a value directly in the app data
            this.$json.setValue(this.rm.getData().storage.pageData, "second", true);
            this.assertEquals(this._getModuleData("m1", false, "pageOne").second, true);
            this.assertEquals(this._getModuleData("m1", false, "pageTwo").second, true);
            this.assertEquals(this._getModuleData("common:m1", false).second, true);
            this.assertEquals(this._getModuleData("common:m2", false).second, true);
            this.assertEquals(this._getModuleData("m2.m3", false, "pageOne").second.fourth, true);
            this.assertEquals(this._getModuleData("m2.m3", false, "pageTwo").second.fourth, true);

            this._unloadPageModules();

        },

        _unloadPageModules : function () {

            this.rm.unloadPageModules();
            this.rm.unloadPageModules("fakePage");
            this.rm.unloadPageModules("pageTwo");
            this.assertEquals(this._utils.resolvePath(this.rm.buildModuleRefpath("m1", false, "pageTwo"), this.rm.getData()), null);
            this.assertEquals(this.rm.getPageModule("pageTwo", "m1"), null);

            this.assertEquals(this._getModuleData("m1", false, "pageOne").second, true);
            this.assertEquals(this._getModuleData("common:m1", false).second, true);
            this.assertEquals(this._getModuleData("common:m2", false).second, true);
            this.assertEquals(this._getModuleData("m2.m3", false, "pageOne").second.fourth, true);

            this._unloadCommonModules();

        },

        _unloadCommonModules : function () {

            this.rm.unloadCommonModules();
            this.assertEquals(this._utils.resolvePath(this.rm.buildModuleRefpath("m1", true), this.rm.getData()), null);
            this.assertEquals(this.rm.getPageModule(null, "common:m1"), null);
            this.assertEquals(this._utils.resolvePath(this.rm.buildModuleRefpath("m2", true), this.rm.getData()), null);
            this.assertEquals(this.rm.getPageModule(null, "common:m2"), null);

            this.$json.setValue(this._getModuleData("m1", true, "pageOne"), "first", "another");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "another");
            this.assertEquals(this._getModuleData("m2.m3", false, "pageOne").first.third, "another");

            this.$json.setValue(this.rm.getData().storage.pageData, "second", false);
            this.assertEquals(this._getModuleData("m1", false, "pageOne").second, false);
            this.assertEquals(this._getModuleData("m2.m3", false, "pageOne").second.fourth, false);

            this._loadSecondSubmodules("_afterPageModuleReload");

        },
        _afterPageModuleReload : function () {

            this.assertEquals(this._getModuleData("m1", false, "pageTwo").second, false);
            this.assertEquals(this._getModuleData("common:m2", false).second, false);
            this.assertEquals(this._getModuleData("m2.m3", false, "pageTwo").second.fourth, false);

            this.$json.setValue(this.rm.getData().storage.pageData, "second", true);
            this.assertEquals(this._getModuleData("m1", false, "pageTwo").second, true);
            this.assertEquals(this._getModuleData("common:m2", false).second, true);
            this.assertEquals(this._getModuleData("m2.m3", false, "pageTwo").second.fourth, true);

            this.$json.setValue(this._getModuleData("m1", true, "pageTwo"), "first", "value");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "value");
            this.assertEquals(this._getModuleData("m1", false, "pageTwo").first, "value");
            this.assertEquals(this._getModuleData("common:m2", false).first.data, "value");
            this.assertEquals(this._getModuleData("m2.m3", false, "pageTwo").first.third, "value");

            this._unloadAllModules();

        },
        _unloadAllModules : function () {
            this.rm.unloadAllModules();

            this.assertEquals(this._utils.resolvePath(this.rm.buildModuleRefpath("m2", true), this.rm.getData()), null);
            this.assertEquals(this.rm.getPageModule(null, "common:m2"), null);
            this.assertEquals(this._utils.resolvePath(this.rm.buildModuleRefpath("m1", false, "pageTwo"), this.rm.getData()), null);
            this.assertEquals(this.rm.getPageModule("pageTwo", "m1"), null);
            this.assertEquals(this._utils.resolvePath(this.rm.buildModuleRefpath("m2.m3", false, "pageTwo"), this.rm.getData()), null);
            this.assertEquals(this.rm.getPageModule("pageTwo", "m2.m3"), null);

            this.completeTest();
        }

    }
});
