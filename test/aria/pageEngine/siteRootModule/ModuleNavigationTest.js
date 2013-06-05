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
    $classpath : "test.aria.pageEngine.siteRootModule.ModuleNavigationTest",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $constructor : function () {
        this.$SiteRootModuleBaseTestCase.constructor.call(this);
        this._navigateCalls = [];
        this._moduleNavigateCallbackCalled = false;
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

        _navigate : function (page, cb) {
            this._navigateCalls.push(page);
            this.$callback(cb);
        },

        _testAsyncLoadPageEngineModulesOneCB : function () {

            this.rm.navigate({
                pageId : "BBBB"
            }, {
                fn : this._navigateCallback,
                scope : this
            });

            this.assertTrue(this._navigateCalls.length == 1);
            this.assertTrue(this._moduleNavigateCallbackCalled, "The navigation callback provided to the root module navigate method was not correctly called.");
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
        },

        _navigateCallback : function () {
            this._moduleNavigateCallbackCalled = true;
        }

    }
});
