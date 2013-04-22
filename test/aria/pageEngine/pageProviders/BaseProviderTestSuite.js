/**
 * Test suite regrouping all tests for aria.pageEngine.pageProviders.BasePageProvider
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageProviders.BaseProviderTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.pageEngine.pageProviders.BaseProviderSiteTest");
        this.addTests("test.aria.pageEngine.pageProviders.BaseProviderPageCacheTest");
        this.addTests("test.aria.pageEngine.pageProviders.BaseProviderPageNoCacheTest");
    }
});
