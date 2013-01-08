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

        this.addTests("test.aria.widgets.AriaSkinInterfaceTest");
        this.addTests("test.aria.widgets.AriaSkinNormalizationTest");
        this.addTests("test.aria.widgets.WidgetTest");
        this.addTests("test.aria.widgets.action.SortIndicatorTest");
        this.addTests("test.aria.widgets.calendar.CalendarControllerTest");
        this.addTests("test.aria.widgets.container.DivTest");
        this.addTests("test.aria.widgets.container.FieldsetTest");
        this.addTests("test.aria.widgets.container.SplitterTest");
        this.addTests("test.aria.widgets.controllers.SelectBoxControllerTest");
        this.addTests("test.aria.widgets.controllers.SelectControllerTest");
        this.addTests("test.aria.widgets.environment.WidgetSettings");
        this.addTests("test.aria.widgets.errorlist.ErrorListControllerTest");
        this.addTests("test.aria.widgets.form.CheckBoxTest");
        this.addTests("test.aria.widgets.form.GaugeTest");
        this.addTests("test.aria.widgets.form.InputTest");
        this.addTests("test.aria.widgets.form.InputValidationHandlerTest");
        this.addTests("test.aria.widgets.form.ListControllerTest");
        this.addTests("test.aria.widgets.form.NumberFieldTest");
        this.addTests("test.aria.widgets.form.SelectTest");
        this.addTests("test.aria.widgets.form.TextareaTest");
        this.addTests("test.aria.widgets.form.TextInputTest");
        this.addTests("test.aria.widgets.form.multiselect.issue223.MultiSelect");
        this.addTests("test.aria.widgets.form.multiselect.issue312.Issue312TestSuite");
        this.addTests("test.aria.widgets.form.autocomplete.issue315.OpenDropDownFromButtonTest");
        this.addTests("test.aria.widgets.form.datepicker.DatePickerTestSuite");
    }
});
