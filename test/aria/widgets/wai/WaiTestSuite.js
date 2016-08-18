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
    $classpath : "test.aria.widgets.wai.WaiTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.widgets.wai.dropdown.DropdownTestSuite");
        this.addTests("test.aria.widgets.wai.autoComplete.WaiAutoCompleteTestSuite");
        this.addTests("test.aria.widgets.wai.datePicker.DatePickerTest");
        this.addTests("test.aria.widgets.wai.textInputBased.WaiTextInputBasedTestSuite");
        this.addTests("test.aria.widgets.wai.input.WaiInputTestSuite");
        this.addTests("test.aria.widgets.wai.popup.WaiPopupTestSuite");
        this.addTests("test.aria.widgets.wai.errorlist.ListErrorTestCase");
        this.addTests("test.aria.widgets.wai.icon.IconTest");
        this.addTests("test.aria.widgets.wai.tabs.Suite");
    }
});
