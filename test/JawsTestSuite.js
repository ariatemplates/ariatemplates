/*
 * Copyright 2016 Amadeus s.a.s.
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
 * Test suite grouping all tests to be run with Jaws enabled
 */
Aria.classDefinition({
    $classpath : "test.JawsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.wai.datePicker.DatePickerJawsTest1");

        this.addTests("test.aria.widgets.wai.autoComplete.AutoCompleteJawsTest1");
        this.addTests("test.aria.widgets.wai.autoComplete.AutoCompleteJawsTest2");

        this.addTests("test.aria.widgets.wai.popup.dialog.modal.ModalDialogJawsTest");
        this.addTests("test.aria.widgets.wai.errorlist.binding.ErrorListBindingJawsTestCase");
        this.addTests("test.aria.widgets.wai.errorlist.titleTag.ErrorListTitleTagJawsTestCase");
        this.addTests("test.aria.widgets.wai.tabs.TabsJawsTest");

        this.addTests("test.aria.widgets.wai.input.checkbox.CheckboxJawsTestCase");
        this.addTests("test.aria.widgets.wai.input.radiobutton.RadioButtonGroupJawsTestCase");
        this.addTests("test.aria.widgets.wai.input.label.WaiInputLabelJawsTestSuite");
        this.addTests("test.aria.widgets.wai.iconLabel.IconLabelJawsTest");

        this.addTests("test.aria.widgets.wai.textInputBased.NumberFieldMandatoryJawsTestCase");
        this.addTests("test.aria.widgets.wai.textInputBased.TextAreaMandatoryJawsTestCase");
        this.addTests("test.aria.widgets.wai.textInputBased.TextFieldMandatoryJawsTestCase");

        this.addTests("test.aria.widgets.wai.fieldset.FieldsetLabelJawsTestCase");

        this.addTests("test.aria.widgets.wai.input.selectBox.SelectBoxSuggestionsJawsTestCase");

        this.addTests("test.aria.widgets.wai.multiselect.MultiSelectJawsTest");

        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipJawsTestSuite");
        this.addTests("test.aria.widgets.wai.popup.dialog.focusableItems.FocusableItemsJawsTestSuite");
        this.addTests("test.aria.widgets.wai.popup.dialog.titleTag.DialogTitleTagJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.dialog.waiEscapeMsg.DialogEscapeJawsTestCase");
    }
});
