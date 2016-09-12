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
 * Test suite regrouping all template tests tests for aria.pageEngine
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.pageEngine.PageEngineTemplateTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineOneTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTwoTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineThreeTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineFourTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineFiveTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineSixTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineSevenTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageDefinitionChangeTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTemplateDisposalTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTemplateDisposalWithAnimationsTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.issue626.PageReadyEventTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.issue770.GetContentTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.customRootModule.CustomRootModuleTestSuite");
        this.addTests("test.aria.pageEngine.pageEngine.externalHashNavigation.ExternalHashNavigationTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.pageEngineDisposal.DisposalTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.customPageConfig.CustomPageConfigTestCase");
        this.addTests("test.aria.pageEngine.pageEngine.placeholderTemplateData.PlaceholderTemplateDataTestCase");
    }
});
