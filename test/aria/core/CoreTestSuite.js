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

        this.addTests("test.aria.core.environment.EnvironmentTestCase");
        this.addTests("test.aria.core.environment.CustomizationsTestCase");
        this.addTests("test.aria.core.AppEnvironmentTestCase");
        this.addTests("test.aria.core.useragent.BrowserAndDeviceTestCase");
        this.addTests("test.aria.core.BrowserTestCase");
        this.addTests("test.aria.core.CacheTestCase");
        this.addTests("test.aria.core.CallbackTestCase");
        this.addTests("test.aria.core.ClassMgrTestCase");
        this.addTests("test.aria.core.DefaultAppenderTestSuite");
        this.addTests("test.aria.core.DownloadMgrTestCase");
        this.addTests("test.aria.core.FileLoaderLicenseTestCase");
        this.addTests("test.aria.core.FileLoaderTestCase");
        this.addTests("test.aria.core.InterfacesTestCase");
        this.addTests("test.aria.core.JsObjectTestCase");
        this.addTests("test.aria.core.JsonValidatorTestCase");
        this.addTests("test.aria.core.jsonValidator.RecursiveBeansTestCase");
        this.addTests("test.aria.core.LogTestCase");
        this.addTests("test.aria.core.ObservableTestCase");
        this.addTests("test.aria.core.prototypefn.PrototypeFnTestCase");
        this.addTests("test.aria.core.ResMgrTestCase");
        this.addTests("test.aria.core.ResMgr2TestCase");
        this.addTests("test.aria.core.resProviders.ResProvidersTestSuite");
        this.addTests("test.aria.core.SequencerTestCase");
        this.addTests("test.aria.core.TimerTestCase");
        this.addTests("test.aria.core.TplClassLoaderTestCase");
        this.addTests("test.aria.core.TplClassLoaderErrorTestCase");
        this.addTests("test.aria.core.io.IOTestSuite");
        this.addTests("test.aria.core.CSSPrefixTestCase");
        this.addTests("test.aria.core.OnCallbackTestCase");
    }
});
