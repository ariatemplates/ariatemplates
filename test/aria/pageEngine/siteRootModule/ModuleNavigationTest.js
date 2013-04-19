/**
 * aria.pageEngine.SiteRootModule test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModuleNavigationTest",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $constructor : function () {
        this.$SiteRootModuleBaseTestCase.constructor.call(this);
        this._navigateCalls = [];
    },
    $destructor : function () {
        this.$SiteRootModuleBaseTestCase.$destructor.call(this);
    },
    $prototype : {

        testAsyncLoadPageEngineModulesOne : function () {
            var that = this;
            this._createSiteModule({
                appData : {},
                pageEngine : {
                    navigate : function () {
                        that._navigate.apply(that, arguments);
                    }
                },
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

            this.rm.navigate({
                pageId : "BBBB"
            });

            this.assertTrue(this._navigateCalls.length == 1);
            this.assertJsonEquals(this._navigateCalls[0], {
                pageId : "BBBB"
            }, "navigate method is not working correctly");

            this.testModules = {
                page : [{
                            classpath : "test.aria.pageEngine.testContents.modules.TestModuleSix",
                            refpath : "modSix"
                        }],
                common : []
            };
            this.rm.loadModules("pageOne", this.testModules, {
                fn : this._afterSMLoadOne,
                scope : this
            });
        },

        _afterSMLoadOne : function () {
            var moduleSix = this.rm.getPageModule("pageOne", "modSix");
            this.assertTrue(moduleSix != null);
            moduleSix.triggerNavigation();
            this.assertTrue(this._navigateCalls.length == 2);
            this.assertJsonEquals(this._navigateCalls[1], {
                pageId : "AAAA"
            }, "Root module is not listening to submodules navigation events");

            this.rm.$dispose();
            this.notifyTestEnd("testLoadPageEngineModulesOne");

        }

    }
});
