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
 * aria.pageEngine.SiteRootModule base test case
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.SiteRootModuleBase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.pageEngine.SiteRootModule", "aria.templates.ModuleCtrlFactory", "aria.utils.Json",
            "test.aria.pageEngine.testContents.modules.BoundModule1",
            "test.aria.pageEngine.testContents.modules.BoundModule2",
            "test.aria.pageEngine.testContents.modules.BoundModule3", "aria.pageEngine.utils.PageEngineUtils"],
    $constructor : function () {
        this.$TestCase.constructor.call(this);
        this.rm = null;
        this.$json = aria.utils.Json;
        this.pageId = "defaultPageId";

        this._utils = aria.pageEngine.utils.PageEngineUtils;
    },
    $prototype : {

        _createSiteModule : function (args) {
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : "aria.pageEngine.SiteRootModule",
                initArgs : {
                    appData : args.appData,
                    pageEngine : args.pageEngine
                }
            }, {
                fn : this._afterCreateSiteModule,
                scope : this,
                args : args.cb
            });
        },

        _afterCreateSiteModule : function (module, cb) {
            this.rm = module.moduleCtrlPrivate;
            this.$callback(cb);
        },

        _getModuleData : function (moduleId, keepMetadata, pageId) {
            pageId = pageId || this.pageId;
            var module = this.rm.getPageModule(pageId, moduleId);
            if (!module) {
                return null;
            }
            var output = module.getData();
            return keepMetadata ? output : this.$json.removeMetadata(output);
        },
        completeTest : function () {
            this.rm.$dispose();
            this.notifyTestEnd("testAsyncMultipleBinding");
        }

    }
});
