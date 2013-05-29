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
    $classpath : "test.aria.widgets.WidgetsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.autoselect.AutoSelect");
        this.addTests("test.aria.widgets.autoselect.programmatic.AutoSelect");
        this.addTests("test.aria.widgets.errorTip.ButtonErrorTipsTest");
        this.addTests("test.aria.widgets.errorTip.IconButtonErrorTipsTest");
        this.addTests("test.aria.widgets.errorTip.LinkErrorTipsTest");
        this.addTests("test.aria.widgets.AriaSkinInterfaceTest");
        this.addTests("test.aria.widgets.AriaSkinNormalizationTest");
        this.addTests("test.aria.widgets.WidgetTest");
        this.addTests("test.aria.widgets.action.SortIndicatorTest");
        this.addTests("test.aria.widgets.action.SortIndicatorBlockTest");
        this.addTests("test.aria.widgets.calendar.CalendarControllerTest");
        this.addTests("test.aria.widgets.calendar.lineHeight.CalendarLineHeightTest");
        this.addTests("test.aria.widgets.container.DivTest");
        this.addTests("test.aria.widgets.container.FieldsetTest");
        this.addTests("test.aria.widgets.container.SplitterTest");
        this.addTests("test.aria.widgets.container.dialog.DialogTestSuite");
        this.addTests("test.aria.widgets.container.issue80.BindableSizeTestSuite");
        this.addTests("test.aria.widgets.controllers.SelectBoxControllerTest");
        this.addTests("test.aria.widgets.controllers.SelectControllerTest");
        this.addTests("test.aria.widgets.environment.WidgetSettings");
        this.addTests("test.aria.widgets.errorlist.ErrorListControllerTest");
        this.addTests("test.aria.widgets.form.FormTestSuite");
        this.addTests("test.aria.widgets.action.iconbutton.issue276.IconButtonTestCase");
        this.addTests("test.aria.widgets.container.issue367.MovableDialogTestCase");
        this.addTests("test.aria.widgets.verticalAlign.VerticalAlignTestCase");

    }
});
