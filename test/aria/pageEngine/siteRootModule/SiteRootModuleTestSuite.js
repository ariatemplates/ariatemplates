/**
 * Test suite regrouping all tests for aria.pageEngine.SiteRootModule
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.SiteRootModuleTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.pageEngine.siteRootModule.SubModuleTestOne");
        this.addTests("test.aria.pageEngine.siteRootModule.SubModuleTestTwo");
        this.addTests("test.aria.pageEngine.siteRootModule.ModuleNavigationTest");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingTestOne");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingTestTwo");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingTestThree");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingTestFour");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingTestFive");
        this.addTests("test.aria.pageEngine.siteRootModule.ModuleUnloadTest");
        this.addTests("test.aria.pageEngine.siteRootModule.ModuleInitArgsTest");
    }
});
