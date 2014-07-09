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
 * Test suite grouping all tests
 */
Aria.classDefinition({
    $classpath : "test.MainTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.AriaTest");
        this.addTests("test.aria.core.CoreTestSuite");
        this.addTests("test.aria.dom.DomTestSuite");
        this.addTests("test.aria.embed.EmbedTestSuite");
        this.addTests("test.aria.ext.ExtTestSuite");
        this.addTests("test.aria.html.HTMLTestSuite");
        this.addTests("test.aria.jsunit.JsunitTestSuite");
        this.addTests("test.aria.modules.ModulesTestSuite");
        this.addTests("test.aria.map.MapTestSuite");
        this.addTests("test.aria.pageEngine.PageEngineTestSuite");
        this.addTests("test.aria.popups.PopupsTestSuite");
        this.addTests("test.aria.resources.ResourcesTestSuite");
        this.addTests("test.aria.storage.StorageTestSuite");
        this.addTests("test.aria.templates.TemplatesTestSuite");
        this.addTests("test.aria.tools.ToolsTestSuite");
        this.addTests("test.aria.touch.TouchTestSuite");
        this.addTests("test.aria.utils.UtilsTestSuite");
        this.addTests("test.aria.widgetLibs.WidgetLibsTestSuite");
        this.addTests("test.aria.widgets.WidgetsTestSuite");
        this.addTests("test.aria.widgets.skin.AllSkinTestSuite");
        this.addTests("test.performance.PerfTestSuite");
    }
});
