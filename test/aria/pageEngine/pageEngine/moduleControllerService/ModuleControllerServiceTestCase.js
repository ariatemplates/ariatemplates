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
    $classpath : "test.aria.pageEngine.pageEngine.moduleControllerService.ModuleControllerServiceTestCase",
    $extends : "test.aria.pageEngine.pageEngine.PageEngineBase",
    $dependencies : ["aria.pageEngine.pageProviders.BasePageProvider",
            "aria.pageEngine.pageProviders.BasePageProviderBeans"],
    $constructor : function () {
        this.$PageEngineBase.constructor.call(this);
        this._dependencies.push("test.aria.pageEngine.pageEngine.site.PageProviderServices");
        this._cssBasePath = "test/aria/pageEngine/pageEngine/site/css/";

    },
    $prototype : {

        runTestInIframe : function () {
            this._createPageEngine({
                oncomplete : "_onPageEngineStarted"
            });
        },

        _createPageEngine : function (args) {
            this.pageProvider = new this._testWindow.test.aria.pageEngine.pageEngine.site.PageProviderServices();
            this.pageEngine = new this._testWindow.aria.pageEngine.PageEngine();
            this.pageEngine.start({
                pageProvider : this.pageProvider,
                oncomplete : {
                    fn : this[args.oncomplete],
                    scope : this
                }
            });

        },

        _onPageEngineStarted : function () {
            this._testGetServices();
            this.end();
        },

        /**
         * Test the exposure of the module controller methods
         */
        _testGetServices : function () {
            var services = this.pageEngine.getServices();
            // tests property exposed directly as a service
            this.assertUndefined(services.SiteModuleServicesProperty);
            // tests property exposed through a method on ModuleServices1 (scope test)
            this.assertEquals(services.SiteModuleServicesScope(), "abcdef");
            // tests method exposed on ModuleServices1 (test.aria.pageEngine.pageEngine.site.modules.ModuleServices1)
            this.assertTrue(services.SiteModuleServicesMethod1() === "ModuleServices1");
            // tests method exposed on ModuleServices2 (test.aria.pageEngine.pageEngine.site.modules.ModuleServices2)
            this.assertTrue(services.SiteModuleServicesMethod2() === "ModuleServices2");
            // tests error logging, when there is an existing service
            this.assertErrorInLogs(this.pageEngine._rootModule.SERVICE_ALREADY_DEFINED);
            // tests when there is an existing service, the last exposed method wins
            this.assertTrue(services.SiteModuleServicesMethod3() === "ModuleServices2");
            // tests that no service is available when a module method that does not exist was exposed as a service
            this.assertUndefined(services.SiteModuleServicesMethod4);
            // tests error logging, when a module method that does not exist is being exposed as a service
            this.assertErrorInLogs(this.pageEngine._rootModule.SERVICE_METHOD_NOT_FOUND);
            // tests method exposed as a service but not on the public interface
            this.assertUndefined(services.SiteModuleServicesMethod5);
            // tests method exposed through services defined in the page definition
            this.assertTrue(services.PageModuleServicesMethod1() === "ModuleServices1");
            this.pageEngine._rootModule.unloadPageModules("ModuleServices1");
            // tests services are removed when a module gets unloaded
            this.assertUndefined(services.PageModuleServicesMethod1);
            // test that getServices method is available also within modules
            this.assertEquals(services.SiteModuleServicesMethod6(), "abcdef");

        },

        end : function () {
            this._disposePageEngine();
            this.$PageEngineBase.end.call(this);
        },

        _disposePageEngine : function () {
            this.pageEngine.$dispose();
            this.pageProvider.$dispose();
        }
    }

});
