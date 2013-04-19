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
 * aria.pageEngine.utils.SiteConfigHelper test
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.utils.SiteConfigHelperTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.utils.SiteConfigHelper", "aria.pageEngine.contentProcessors.MarkdownProcessor",
            "test.aria.pageEngine.utils.test.ProcessorwithoutProcessContent",
            "test.aria.pageEngine.utils.test.ValidContentProcessor", "aria.utils.Array", "aria.utils.Object"],
    $prototype : {
        testSiteConfigHelper : function () {
            var json = {
                containerId : "root",
                appData : {
                    menu : {
                        page1 : "pageOne"
                    }
                },
                css : ["a/b/c.css"],
                commonModules : {
                    mod1 : {
                        classpath : "test.aria.pageEngine.testContents.modules.TestModuleOne",
                        priority : 2
                    },
                    mod2 : {
                        classpath : "test.aria.pageEngine.testContents.modules.TestModuleTwo",
                        priority : 1
                    },
                    mod3 : {
                        classpath : "test.aria.pageEngine.testContents.modules.TestModuleFive",
                        priority : 2,
                        initArgs : {
                            some : "args"
                        }
                    },
                    "mod5.mod6" : {
                        classpath : "test.aria.pageEngine.testContents.modules.TestModuleFive",
                        priority : 2
                    },
                    "mod7.mod8" : {
                        classpath : "test.aria.pageEngine.testContents.modules.TestModuleFive",
                        priority : 2
                    }
                },
                contentProcessors : {
                    "markdown" : "aria.pageEngine.contentProcessors.MarkdownProcessor",
                    "noProcessContent" : "test.aria.pageEngine.utils.test.ProcessorwithoutProcessContent"
                },
                extraParams : {
                    param : "sample parameter"
                }
            };
            this._siteJson = aria.utils.Json.copy(json);
            this.siteConfigHelper = new aria.pageEngine.utils.SiteConfigHelper(json);
            this._testSiteConfigHelper();

        },
        _testSiteConfigHelper : function () {
            this.assertTrue(this.siteConfigHelper.getRootDiv() !== null, "method getRootDiv failed");
            this.assertTrue(this.siteConfigHelper.getRootDiv().id == "root", "method getRootDiv failed");
            this.assertTrue(this.siteConfigHelper.getRootDivId() == "root", "method getRootDivId failed");
            this.assertJsonEquals(this.siteConfigHelper.getSiteCss(), ["a/b/c.css"], "method getRootDivId failed");
            this.assertJsonEquals(this.siteConfigHelper.getAppData(), {
                menu : {
                    page1 : "pageOne"
                }
            }, "method getAppData failed");
            this.assertTrue(this.siteConfigHelper.getListOfContentProcessors()[0] == "aria.pageEngine.contentProcessors.MarkdownProcessor", "method getListOfContentProcessors failed");
            this.assertTrue(this.siteConfigHelper.getListOfContentProcessors()[1] == "test.aria.pageEngine.utils.test.ProcessorwithoutProcessContent", "method getListOfContentProcessors failed");
            this.siteConfigHelper.getContentProcessorInstances();
            this.assertErrorInLogs(this.siteConfigHelper.MISSING_PROCESS_METHOD);
            this.siteConfigHelper.$dispose();
            this._testSiteConfigHelperDefault();

        },

        _testSiteConfigHelperDefault : function () {
            var json = {
                containerId : "rootDiv"
            };
            this.siteConfigHelper = new aria.pageEngine.utils.SiteConfigHelper(json);
            this.assertTrue(this.siteConfigHelper.getRootDiv() !== null, "method getRootDiv failed");
            this.assertTrue(this.siteConfigHelper.getRootDiv().id == "rootDiv", "method getRootDiv failed");
            this.assertTrue(this.siteConfigHelper.getRootDivId() == "rootDiv", "method getRootDivId failed");
            this.assertTrue(!this.siteConfigHelper.getAppData(), "method getAppData failed");
            this.assertTrue(aria.utils.Array.isEmpty(this.siteConfigHelper.getListOfContentProcessors()), "method getAppData failed");
            this.assertTrue(aria.utils.Array.isEmpty(aria.utils.Object.keys(this.siteConfigHelper.getContentProcessorInstances())), "method getContentProcessorInstances failed");
            this.siteConfigHelper.$dispose();

            this._testGetCommonModulesDescription();
        },

        _testGetCommonModulesDescription : function () {
            var siteConfigHelper = new aria.pageEngine.utils.SiteConfigHelper(this._siteJson);

            // Retrieve all of them
            var cm = siteConfigHelper.getCommonModulesDescription();
            this.assertTrue(cm.length == 5);
            this.assertTrue(this.__getModuleWithRefpath(cm, "mod7.mod8").classpath == "test.aria.pageEngine.testContents.modules.TestModuleFive");
            cm = siteConfigHelper.getCommonModulesDescription({});
            this.assertTrue(cm.length == 5);
            this.assertTrue(this.__getModuleWithRefpath(cm, "mod7.mod8").classpath == "test.aria.pageEngine.testContents.modules.TestModuleFive");

            // Retrieve with priority only
            cm = siteConfigHelper.getCommonModulesDescription({
                priority : 1
            });
            this.assertTrue(cm.length == 1);
            this.assertTrue(cm[0].refpath == "mod2");

            // Retrieve with refpaths only
            cm = siteConfigHelper.getCommonModulesDescription({
                refpaths : ["mod3", "mod10", "mod5.mod6"]
            });
            this.assertTrue(cm.length == 2);
            this.assertTrue(this.__getModuleWithRefpath(cm, "mod5.mod6").refpath == "mod5.mod6");
            this.assertTrue(this.__getModuleWithRefpath(cm, "mod3").initArgs.some == "args");

            // Retrieve with refpaths only
            cm = siteConfigHelper.getCommonModulesDescription({
                refpaths : []
            });
            this.assertTrue(cm.length === 0);

            // Retrieve with priority and refpaths
            cm = siteConfigHelper.getCommonModulesDescription({
                priority : 1,
                refpaths : ["mod5.mod6"]
            });
            this.assertTrue(cm.length === 0);

            cm = siteConfigHelper.getCommonModulesDescription({
                priority : 2,
                refpaths : ["mod5.mod6", "mod2", "mod10", "mod3", "mod1"]
            });
            this.assertTrue(cm.length == 3);
            this.assertTrue(this.__getModuleWithRefpath(cm, "mod5.mod6").refpath == "mod5.mod6");
            this.assertTrue(this.__getModuleWithRefpath(cm, "mod1").refpath == "mod1");
            this.assertTrue(this.__getModuleWithRefpath(cm, "mod3").initArgs.some == "args");

            siteConfigHelper.$dispose();

            this._testValidContentProcessor();
        },

        _testValidContentProcessor : function () {
            this._siteJson.contentProcessors.valid = "test.aria.pageEngine.utils.test.ValidContentProcessor";
            delete this._siteJson.contentProcessors.noProcessContent;
            var siteConfigHelper = new aria.pageEngine.utils.SiteConfigHelper(this._siteJson);
            var cpInstances = siteConfigHelper.getContentProcessorInstances();
            this.assertTrue(cpInstances.valid.processContent("vvv") == "vvv");

            siteConfigHelper.$dispose();

            this._testGetNavigationManagerClass();
        },

        _testGetNavigationManagerClass : function () {

            var siteConfigHelper = new aria.pageEngine.utils.SiteConfigHelper(this._siteJson);
            this.assertTrue(siteConfigHelper.getNavigationManagerClass() === null);
            siteConfigHelper.$dispose();
            this._siteJson.navigation = "hash";
            siteConfigHelper = new aria.pageEngine.utils.SiteConfigHelper(this._siteJson);
            this.assertTrue(siteConfigHelper.getNavigationManagerClass() == "aria.pageEngine.utils.HashManager");
            siteConfigHelper.$dispose();
            this._siteJson.navigation = "history";
            siteConfigHelper = new aria.pageEngine.utils.SiteConfigHelper(this._siteJson);
            this.assertTrue(siteConfigHelper.getNavigationManagerClass() == "aria.pageEngine.utils.HistoryManager");
            siteConfigHelper.$dispose();

        },

        __getModuleWithRefpath : function (modules, refpath) {
            for (var i = 0, len = modules.length; i < len; i++) {
                if (modules[i].refpath == refpath) {
                    return modules[i];
                }
            }
            return null;
        }

    }
});
