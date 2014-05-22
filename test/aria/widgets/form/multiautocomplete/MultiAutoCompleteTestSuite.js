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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.form.multiautocomplete.preselectExpandButton.PreselectExpandButtonTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test1.MultiAutoAdd");
        this.addTests("test.aria.widgets.form.multiautocomplete.test2.MultiAutoRemove");
        this.addTests("test.aria.widgets.form.multiautocomplete.test3.MultiAutoDataCheck");
        this.addTests("test.aria.widgets.form.multiautocomplete.test4.MultiAutoPrefill");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEdit");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditChangedFreetext");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditChangedSuggestion");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditUnchangedFreetext");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditUnchangedSuggestion");
        this.addTests("test.aria.widgets.form.multiautocomplete.test6.MultiAutoRange1");
        this.addTests("test.aria.widgets.form.multiautocomplete.test6.MultiAutoRange2");
        this.addTests("test.aria.widgets.form.multiautocomplete.test7.MultiAutoError");
        this.addTests("test.aria.widgets.form.multiautocomplete.test8.MultiAutoMaxOptions");
        this.addTests("test.aria.widgets.form.multiautocomplete.test9.MultiAutoBackSpace");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoRangeHighlighted");
        this.addTests("test.aria.widgets.form.multiautocomplete.test11.MultiAutoInvalidDataModel");
        this.addTests("test.aria.widgets.form.multiautocomplete.testHighlightMethods.MultiAutoHighlightTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.testHighlightMethods.MultiAutoHighlightNavigation");
        this.addTests("test.aria.widgets.form.multiautocomplete.duplicateValuesAfterError.DuplicateValuesAfterError");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpandoTest1");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpandoTest2");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpandoTest3");
        this.addTests("test.aria.widgets.form.multiautocomplete.onChangeHandler.MultiAutoOnChangeTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.navigation.MultiAutoCompleteNavigationTestSuite");
        this.addTests("test.aria.widgets.form.multiautocomplete.testDataModelOnEdit.MultiAutoDataModelTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.issue1076.blur.OnBlurTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.issue1076.focus.OnFocusTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.issue1085.InitCheckboxesTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.enterAndTab.EnterAndTabTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.popupGeometry.PopupWidthTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.popupGeometry.PopupLeftPositionTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.popupGeometry.PopupTopPositionTest");
        this.addTests("test.aria.widgets.form.multiautocomplete.preselectAutofill.PreselectAutofillTestSuite");
        this.addTests("test.aria.widgets.form.multiautocomplete.testDMOnFreetext.MultiAutoDataModelTest");
    }
});
