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
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTestOne");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTestTwo");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTestThree");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTestFour");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTestFive");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTestSix");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTestSeven");
        this.addTests("test.aria.pageEngine.pageEngine.PageDefinitionChangeTest");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTemplateDisposalTest");
        this.addTests("test.aria.pageEngine.pageEngine.PageEngineTemplateDisposalTestWithAnimations");
        this.addTests("test.aria.pageEngine.pageEngine.issue626.PageReadyEventTest");
        this.addTests("test.aria.pageEngine.pageEngine.issue770.GetContentTest");
        this.addTests("test.aria.pageEngine.pageEngine.customRootModule.CustomRootModuleTestSuite");
        this.addTests("test.aria.pageEngine.pageEngine.externalHashNavigation.ExternalHashNavigationTest");
        this.addTests("test.aria.pageEngine.pageEngine.pageEngineDisposal.DisposalTest");
        this.addTests("test.aria.pageEngine.pageEngine.customPageConfig.CustomPageConfigTest");
        this.addTests("test.aria.pageEngine.pageEngine.placeholderTemplateData.PlaceholderTemplateDataTestCase");
    }
});
