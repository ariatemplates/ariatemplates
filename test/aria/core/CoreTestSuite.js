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
        this.addTests("test.aria.core.MobileBrowserTest");
        this.addTests("test.aria.core.CacheTest");
        this.addTests("test.aria.core.CallbackTest");
        this.addTests("test.aria.core.ClassMgrTest");
        this.addTests("test.aria.core.DefaultAppenderTestSuite");
        this.addTests("test.aria.core.DownloadMgrTest");
        this.addTests("test.aria.core.FileLoaderLicenseTest");
        this.addTests("test.aria.core.FileLoaderTest");
        this.addTests("test.aria.core.InterfacesTest");
        this.addTests("test.aria.core.JsObjectTest");
        this.addTests("test.aria.core.JsonValidatorTest");
        this.addTests("test.aria.core.LogTest");
        this.addTests("test.aria.core.ObservableTest");
        this.addTests("test.aria.core.ResClassLoaderTest");
        this.addTests("test.aria.core.SequencerTest");
        this.addTests("test.aria.core.TimerTest");
        this.addTests("test.aria.core.TplClassLoaderTest");
        this.addTests("test.aria.core.TplClassLoaderErrorTest");
        this.addTests("test.aria.core.io.IOTestSuite");
        this.addTests("test.aria.core.CSSPrefixTest");
    }
});