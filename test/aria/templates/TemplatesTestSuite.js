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

Aria.classDefinition({
    $classpath : "test.aria.templates.TemplatesTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.templates.issue1413.RefreshDisposedTemplateTestCase");
        this.addTests("test.aria.templates.EmptyTestCase");
        this.addTests("test.aria.templates.autorefresh.AutorefreshTestSuite");
        this.addTests("test.aria.templates.beforeRefresh.BeforeRefreshTestCase");

        this.addTests("test.aria.templates.binding.missingbinding.MissingBindingTestCase");
        this.addTests("test.aria.templates.ClassGeneratorTest");
        this.addTests("test.aria.templates.css.CSSTestSuite");
        this.addTests("test.aria.templates.csslibs.CSSLibsTestCase");
        this.addTests("test.aria.templates.customization.CustomizationTestSuite");
        this.addTests("test.aria.templates.keyboardNavigation.NavigationTestSuite");

        this.addTests("test.aria.templates.DomElementWrapper");
        this.addTests("test.aria.templates.EnableMethodEventInterceptorTest");
        this.addTests("test.aria.templates.FlowCtrlTest");
        this.addTests("test.aria.templates.ModifiersTest");
        this.addTests("test.aria.templates.ModuleCtrlFactoryTest");
        this.addTests("test.aria.templates.ModuleCtrlTest");
        this.addTests("test.aria.templates.moduleCtrlSyncRequest.ModuleCtrlSyncRequestTest");
        this.addTests("test.aria.templates.ParserTest");
        this.addTests("test.aria.templates.SectionOnTypeTest");
        this.addTests("test.aria.templates.SectionTest");
        this.addTests("test.aria.templates.TemplateContextTest");
        this.addTests("test.aria.templates.TemplateManagerTest");

        this.addTests("test.aria.templates.TemplateTest");

        this.addTests("test.aria.templates.TplClassGeneratorTest");
        this.addTests("test.aria.templates.TxtClassGeneratorTest");
        this.addTests("test.aria.templates.TxtTemplateTest");
        this.addTests("test.aria.templates.ViewTest");
        this.addTests("test.aria.templates.view.ViewTest");
        this.addTests("test.aria.templates.tableRefresh.TableRefreshTestCase");

        this.addTests("test.aria.templates.domElementWrapper.PTRTemplateTestCase");
        this.addTests("test.aria.templates.focusAfterRefresh.FocusTemplateTestCase");
        this.addTests("test.aria.templates.lifecycle.displayReady.DisplayReadyTestCase");
        this.addTests("test.aria.templates.lifecycle.displayReadyDependencies.DisplayReadyTestCase");
        this.addTests("test.aria.templates.lifecycle.htmlDisplayReady.DisplayReadyTestCase");
        this.addTests("test.aria.templates.lifecycle.subtemplates.LifeCycleTestCase");
        this.addTests("test.aria.templates.popup.focus.FocusOnDialogTestCase");
        this.addTests("test.aria.templates.popup.zIndex.ZIndex");
        this.addTests("test.aria.templates.htmlstyle.HtmlStyleTemplateTestCase");
        this.addTests("test.aria.templates.validation.delay.PTRTemplateTestCase");
        this.addTests("test.aria.templates.validation.report.ValidationReportTestCase");
        this.addTests("test.aria.templates.events.basic.BasicEventsTestCase");
        this.addTests("test.aria.templates.events.eventpropagation.EventPropagationTestCase");
        this.addTests("test.aria.templates.events.delegate.DelegateTestCase");

        this.addTests("test.aria.templates.validation.errortext.ErrorTextTestCase");

        this.addTests("test.aria.templates.dynamicSection.DynSectionTestCase");
        this.addTests("test.aria.templates.focusHandling.FocusHandlingTestCase");
        this.addTests("test.aria.templates.focusHandling.focuscheck.FocusCheckTestCase");
        this.addTests("test.aria.templates.inheritance.TemplateInheritanceTestCase");
        this.addTests("test.aria.templates.inheritance.logs.LogsTestCase");
        this.addTests("test.aria.templates.generatedId.IncrementalElementIdTestCase");
        this.addTests("test.aria.templates.issue142.HtmlStyleTemplateTestCase");
        this.addTests("test.aria.templates.issue279.ButtonSpacingTestCase");
        this.addTests("test.aria.templates.issue353.Issue353TestCase");

        this.addTests("test.aria.templates.issue348.transition.TransitionTestcase");
        this.addTests("test.aria.templates.issue348.animation.AnimationTestcase");

        this.addTests("test.aria.templates.statements.StatementsTestSuite");
        this.addTests("test.aria.templates.issue400.AlreadyCompiledTplTestCase");
        this.addTests("test.aria.templates.issue400.AlreadyCompiledTplNewSyntaxTestCase");

        this.addTests("test.aria.templates.issue727.RefreshManagerExceptionTestCase");
        this.addTests("test.aria.templates.issue833.CaretPositionTestCase");

        this.addTests("test.aria.templates.issue1319.TplDefinitionChangedTestCase");

        this.addTests("test.aria.templates.tabsRefresh.TabsRefreshTestCase");
        this.addTests("test.aria.templates.macrolibs.MacrolibsTestCase");
        this.addTests("test.aria.templates.textTemplates.TextTemplatesTestCase");
        this.addTests("test.aria.templates.section.SectionTestSuite");
        this.addTests("test.aria.templates.repeater.RepeaterTestSuite");
        this.addTests("test.aria.templates.visualFocus.VisualFocusTestCase");
        this.addTests("test.aria.templates.testmode.TestIdsTestCase");
        this.addTests("test.aria.templates.memoization.MemoTestCase");
        this.addTests("test.aria.templates.scrollControl.ScrollControlTestCase");

        this.addTests("test.aria.templates.refresh.events.EventsTestCase");
        this.addTests("test.aria.templates.refresh.partial.PartialRefreshTestCase");
        this.addTests("test.aria.templates.reloadResources.ReloadResourcesTestCase");
        this.addTests("test.aria.templates.reloadParentTemplate.ParentReloadTestSuite");

        this.addTests("test.aria.templates.layoutResize.ResizeTestCase");
        this.addTests("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorTestCase");

    }
});
