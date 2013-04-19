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
