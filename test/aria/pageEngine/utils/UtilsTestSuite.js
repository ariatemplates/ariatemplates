/**
 * Test suite regrouping all tests for aria.pageEngine.utils package
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.utils.UtilsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.pageEngine.utils.SiteConfigHelperTest");
        this.addTests("test.aria.pageEngine.utils.PageEngineUtilsTest");
        this.addTests("test.aria.pageEngine.utils.PageConfigHelperTest");
    }
});
