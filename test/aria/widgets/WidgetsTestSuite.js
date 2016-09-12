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

        this.addTests("test.aria.widgets.form.FormTestSuite");
        this.addTests("test.aria.widgets.container.ContainerTestSuite");
        this.addTests("test.aria.widgets.autoselect.AutoSelectTestCase");
        this.addTests("test.aria.widgets.autoselect.programmatic.AutoSelectTestCase");
        this.addTests("test.aria.widgets.errorTip.ButtonErrorTipsTestCase");
        this.addTests("test.aria.widgets.errorTip.IconButtonErrorTipsTestCase");
        this.addTests("test.aria.widgets.errorTip.LinkErrorTipsTestCase");
        this.addTests("test.aria.widgets.AriaSkinInterfaceTestCase");
        this.addTests("test.aria.widgets.AriaSkinNormalizationTestCase");
        this.addTests("test.aria.widgets.WidgetATestCase");
        this.addTests("test.aria.widgets.action.ActionTestSuite");
        this.addTests("test.aria.widgets.form.text.TextTestCase");
        this.addTests("test.aria.widgets.form.text.EllipsisTestCase");
        this.addTests("test.aria.widgets.calendar.CalendarControllerTestCase");
        this.addTests("test.aria.widgets.calendar.lineHeight.CalendarLineHeightTestCase");
        this.addTests("test.aria.widgets.calendar.rangeCalendar.RangeCalendarTestSuite");
        this.addTests("test.aria.widgets.controllers.SelectBoxControllerTestCase");
        this.addTests("test.aria.widgets.controllers.SelectControllerTestCase");
        this.addTests("test.aria.widgets.dropdown.DropDownTestSuite");
        this.addTests("test.aria.widgets.environment.WidgetSettingsTestCase");
        this.addTests("test.aria.widgets.defaults.CheckDefaultsTestCase");
        this.addTests("test.aria.widgets.errorlist.ErrorListControllerTestCase");
        this.addTests("test.aria.widgets.errorlist.ListErrorTestCase");
        this.addTests("test.aria.widgets.action.iconbutton.issue276.IconButtonTestCase");
        this.addTests("test.aria.widgets.verticalAlign.VerticalAlignTestCase");
        this.addTests("test.aria.widgets.icon.IconTestCase");
        this.addTests("test.aria.widgets.icon.notooltip.NoTooltipIconTestCase");
        this.addTests("test.aria.widgets.splitter.scrollbars.ScrollbarTestCase");
        this.addTests("test.aria.widgets.issue746.SkinClassFallbackTestCase");
        this.addTests("test.aria.widgets.form.text.textcontentissue.TextContentTestCase");
        this.addTests("test.aria.widgets.wai.WaiTestSuite");
    }
});
