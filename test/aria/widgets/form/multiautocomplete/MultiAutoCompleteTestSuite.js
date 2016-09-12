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

        this.addTests("test.aria.widgets.form.multiautocomplete.preselectExpandButton.PreselectExpandButtonRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test1.MultiAutoAddRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test2.MultiAutoRemoveRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test3.MultiAutoDataCheckRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test4.MultiAutoPrefillRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditChangedFreetextRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditChangedSuggestionRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditUnchangedFreetextRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test5.MultiAutoEditUnchangedSuggestionRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test6.MultiAutoRange1RobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test6.MultiAutoRange2RobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test7.MultiAutoErrorTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test8.MultiAutoMaxOptionsRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test9.MultiAutoBackSpaceRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoRangeHighlightedRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test11.MultiAutoInvalidDataModelRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.testHighlightMethods.MultiAutoHighlightRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.testHighlightMethods.MultiAutoHighlightNavigationRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.duplicateValuesAfterError.DuplicateValuesAfterErrorRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpando1RobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpando2RobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpando3RobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.onChangeHandler.MultiAutoOnChangeRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.navigation.MultiAutoCompleteNavigationTestSuite");
        this.addTests("test.aria.widgets.form.multiautocomplete.testDataModelOnEdit.MultiAutoDataModelRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.issue1076.blur.OnBlurRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.issue1076.focus.OnFocusRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.issue1085.InitCheckboxesRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.enterAndTab.EnterAndTabRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.popupGeometry.PopupWidthRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.popupGeometry.PopupLeftPositionRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.popupGeometry.PopupTopPositionRobotTestCase");
        this.addTests("test.aria.widgets.form.multiautocomplete.preselectAutofill.PreselectAutofillTestSuite");
        this.addTests("test.aria.widgets.form.multiautocomplete.testDMOnFreetext.MultiAutoDataModelRobotTestCase");
    }
});
