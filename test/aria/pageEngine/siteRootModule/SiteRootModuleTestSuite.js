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
        this.addTests("test.aria.pageEngine.siteRootModule.SubModuleOneTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.SubModuleTwoTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModuleNavigationTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingOneTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingTwoBase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingThreeTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingFourTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModelBindingFiveTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModuleUnloadTestCase");
        this.addTests("test.aria.pageEngine.siteRootModule.ModuleInitArgsTestCase");
    }
});
