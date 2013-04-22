/**
 * Test suite regrouping all unit tests of the aria.pageEngine package
 */
Aria.classDefinition({
    $classpath : 'test.aria.pageEngine.PageEngineTestSuite',
    $extends : 'aria.jsunit.TestSuite',
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.pageEngine.contentProcessors.MarkdownProcessorTest");
        this.addTests("test.aria.pageEngine.siteRootModule.SiteRootModuleTestSuite");
        this.addTests("test.aria.pageEngine.utils.UtilsTestSuite");
        this.addTests("test.aria.pageEngine.pageProviders.BaseProviderTestSuite");
    }
});
