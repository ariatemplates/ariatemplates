/**
 * Test suite regrouping all tests of the core namespace
 */
Aria.classDefinition({
    $classpath : "test.aria.core.DefaultAppenderTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.core.DefaultAppenderTest");
        this.addTests("test.aria.core.DefaultAppenderTest2");
    }
});