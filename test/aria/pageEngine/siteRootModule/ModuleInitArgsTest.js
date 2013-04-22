/**
 * aria.pageEngine.SiteRootModule test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModuleInitArgsTest",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $constructor : function () {
        this.$SiteRootModuleBaseTestCase.constructor.call(this);
        this._navigateCalls = [];
        this._pageEngine = null;
    },
    $destructor : function () {
        this._pageEngine = null;
        this.$SiteRootModuleBaseTestCase.$destructor.call(this);
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
