/*
 * Copyright 2013 Amadeus s.a.s.
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
 * Test suite regrouping all features tests
 */
Aria.classDefinition({
    $classpath : "test.aria.templates.css.CSSTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.templates.css.CSSCtxtManagerTest");
        this.addTests("test.aria.templates.css.CSSCtxtTest");
        this.addTests("test.aria.templates.css.CSSMgrTest");
        this.addTests("test.aria.templates.css.CSSParserTest");
        this.addTests("test.aria.templates.css.cssFolderPath.CSSFolderPathTestCase");
        this.addTests("test.aria.templates.css.cssMgr.CSSMgrTestCase");
        this.addTests("test.aria.templates.css.cssMgr.issue722.CSSMgrIssue722TestCase");
        this.addTests("test.aria.templates.css.cssMgr.tagReuse.TagReuseTestCase");
        this.addTests("test.aria.templates.css.ctxtMgr.CtxtMgrTestCase");
        this.addTests("test.aria.templates.css.cssScripts.CSSScriptTestCase");
        this.addTests("test.aria.templates.css.dataReadyRefresh.RefreshTest");
        this.addTests("test.aria.templates.css.widget.DependencyTest");
        this.addTests("test.aria.templates.css.widgetContext.ContextTest");
        this.addTests("test.aria.templates.css.events.EventsTestCase");
        this.addTests("test.aria.templates.css.global.GlobalCssTemplateTestCase");
        this.addTests("test.aria.templates.css.imgprefix.ImgPrefixTemplateTestCase");
        this.addTests("test.aria.templates.css.inheritance.InheritTestCase");
        this.addTests("test.aria.templates.css.numberReload.OneLevelTemplate");
    }
});
