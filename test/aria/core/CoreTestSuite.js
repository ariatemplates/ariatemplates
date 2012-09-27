/**
 * Test suite regrouping all tests of the core namespace
 */
Aria.classDefinition({
    $classpath : "test.aria.core.CoreTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.core.environment.Environment");
        this.addTests("test.aria.core.environment.Customizations");
        this.addTests("test.aria.core.AppEnvironmentTest");
        this.addTests("test.aria.core.BrowserTest");
        this.addTests("test.aria.core.CacheTest");
        this.addTests("test.aria.core.CallbackTest");
        this.addTests("test.aria.core.ClassMgrTest");
        this.addTests("test.aria.core.DefaultAppenderTestSuite");
        this.addTests("test.aria.core.DownloadMgrTest");
        this.addTests("test.aria.core.FileLoaderLicenseTest");
        this.addTests("test.aria.core.FileLoaderTest");
        this.addTests("test.aria.core.InterfacesTest");
        this.addTests("test.aria.core.IOFiltersMgrTest");
        this.addTests("test.aria.core.IOFilterTest");
        this.addTests("test.aria.core.IOTest");
        this.addTests("test.aria.core.IOTransportTest");
        this.addTests("test.aria.core.JsObjectTest");
        this.addTests("test.aria.core.JSONPTest");
        this.addTests("test.aria.core.JsonValidatorTest");
        this.addTests("test.aria.core.LogTest");
        this.addTests("test.aria.core.ObservableTest");
        this.addTests("test.aria.core.ResClassLoaderTest");
        this.addTests("test.aria.core.SequencerTest");
        this.addTests("test.aria.core.TimerTest");
        this.addTests("test.aria.core.TplClassLoaderTest");
        this.addTests("test.aria.core.TplClassLoaderErrorTest");
    }
});