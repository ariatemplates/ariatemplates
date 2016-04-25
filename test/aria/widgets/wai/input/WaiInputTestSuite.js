/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.WaiInputTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.widgets.wai.input.checkbox.CheckboxTestCase");
        this.addTests("test.aria.widgets.wai.input.dateField.DateFieldTestCase");
        this.addTests("test.aria.widgets.wai.input.datePicker.DatePickerTestCase");
        this.addTests("test.aria.widgets.wai.input.link.LinkTestCase");
        this.addTests("test.aria.widgets.wai.input.multiSelect.MultiSelectTestCase");
        this.addTests("test.aria.widgets.wai.input.numberField.NumberFieldTestCase");
        this.addTests("test.aria.widgets.wai.input.passwordField.PasswordFieldTestCase");
        this.addTests("test.aria.widgets.wai.input.radiobutton.RadioButtonTestCase");
        this.addTests("test.aria.widgets.wai.input.select.SelectTestCase");
        this.addTests("test.aria.widgets.wai.input.selectBox.SelectBoxTestCase");
        this.addTests("test.aria.widgets.wai.input.textArea.TextAreaTestCase");
        this.addTests("test.aria.widgets.wai.input.textField.TextFieldTestCase");
        this.addTests("test.aria.widgets.wai.input.timeField.TimeFieldTestCase");
    }
});
