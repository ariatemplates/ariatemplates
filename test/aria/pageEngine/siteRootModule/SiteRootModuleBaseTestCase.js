/**
 * aria.pageEngine.SiteRootModule base test case
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $extends : "test.aria.NodeCoverageTestCase",
    $dependencies : ["aria.pageEngine.SiteRootModule", "aria.templates.ModuleCtrlFactory", "aria.utils.Json",
            "test.aria.pageEngine.testContents.modules.BoundModule1", "test.aria.pageEngine.testContents.modules.BoundModule2",
            "test.aria.pageEngine.testContents.modules.BoundModule3", "aria.pageEngine.utils.PageEngineUtils"],
    $constructor : function () {
        this.$NodeCoverageTestCase.constructor.call(this);
        this.rm = null;
        this.$json = aria.utils.Json;
        this.pageId = "defaultPageId";

        this._utils = aria.pageEngine.utils.PageEngineUtils;
    },
    $destructor : function () {
        this.$NodeCoverageTestCase.$destructor.call(this);
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
