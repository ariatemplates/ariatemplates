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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.MultiAutoCompleteTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test1.MultiAutoAdd");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test2.MultiAutoRemove");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test3.MultiAutoDataCheck");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test4.MultiAutoPrefill");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test5.MultiAutoEdit");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test5.MultiAutoEditChangedFreetext");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test5.MultiAutoEditChangedSuggestion");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test5.MultiAutoEditUnchangedFreetext");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test5.MultiAutoEditUnchangedSuggestion");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test6.MultiAutoRange1");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test6.MultiAutoRange2");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test7.MultiAutoError");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test8.MultiAutoMaxOptions");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test9.MultiAutoBackSpace");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test10.MultiAutoRangeHighlighted");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test11.MultiAutoInvalidDataModel");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.testHighlightMethods.MultiAutoHighlightTest");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.testHighlightMethods.MultiAutoHighlightNavigation");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.duplicateValuesAfterError.DuplicateValuesAfterError");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test10.MultiAutoExpandoTest1");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test10.MultiAutoExpandoTest2");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.test10.MultiAutoExpandoTest3");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.onChangeHandler.MultiAutoOnChangeTest");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.navigation.MultiAutoCompleteNavigationTestSuite");
        this.addTests("test.aria.widgets.form.autocomplete.multiautocomplete.testDataModelOnEdit.MultiAutoDataModelTest");
    }
});
