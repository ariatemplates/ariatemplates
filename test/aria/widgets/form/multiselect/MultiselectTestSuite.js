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
    $classpath : "test.aria.widgets.form.multiselect.MultiselectTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this._tests = ["test.aria.widgets.form.multiselect.checkFeatures.MultiSelect",
                "test.aria.widgets.form.multiselect.deleteFieldValue.test1.MultiSelect",
                "test.aria.widgets.form.multiselect.deleteFieldValue.test2.MultiSelect",
                "test.aria.widgets.form.multiselect.downArrowKey.MultiSelect",
                "test.aria.widgets.form.multiselect.instantbind.InstantBindTestCase",
                "test.aria.widgets.form.multiselect.invalidcontent.MultiSelect",
                "test.aria.widgets.form.multiselect.issue223.MultiSelect",
                "test.aria.widgets.form.multiselect.issue312.Issue312TestSuite",
                "test.aria.widgets.form.multiselect.issue470.MultiSelect",
                "test.aria.widgets.form.multiselect.longlist.test1.MsLongList",
                "test.aria.widgets.form.multiselect.longlist.test2.MsLongList",
                "test.aria.widgets.form.multiselect.onblur.MultiSelect",
                "test.aria.widgets.form.multiselect.toggleMultiSelect.MultiSelect",
                "test.aria.widgets.form.multiselect.upArrowKey.test1.MultiSelect",
                "test.aria.widgets.form.multiselect.upArrowKey.test2.MultiSelect",
                "test.aria.widgets.form.multiselect.labelsToTrim.LabelsToTrim",
                "test.aria.widgets.form.multiselect.focusMove.Issue968TestCase"];
    }
});
