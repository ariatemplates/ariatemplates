/**
 * aria.pageEngine.SiteRootModule test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.SubModuleTestTwo",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $constructor : function () {
        this.$SiteRootModuleBaseTestCase.constructor.call(this);
    },
    $destructor : function () {
        this.$SiteRootModuleBaseTestCase.$destructor.call(this);
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
