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

        this._tests = [
            "test.aria.widgets.form.multiselect.checkFeatures.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.emptyMultiSelect.MultiSelectRobotTestCase",
            "test.aria.widgets.form.multiselect.deleteFieldValue.test1.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.deleteFieldValue.test2.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.downArrowKey.MultiSelectARobotTestCase",
            "test.aria.widgets.form.multiselect.downArrowKeyPreventDef.MSDownArrowKeyRobotTestCase",
            "test.aria.widgets.form.multiselect.instantbind.InstantBindTestCase",
            "test.aria.widgets.form.multiselect.invalidcontent.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.issue223.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.issue312.Issue312TestSuite",
            "test.aria.widgets.form.multiselect.issue470.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.longlist.test1.MsLongListRobotTestCase",
            "test.aria.widgets.form.multiselect.longlist.test2.MsLongListRobotTestCase",
            "test.aria.widgets.form.multiselect.onblur.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.toggleMultiSelect.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.upArrowKey.test1.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.upArrowKey.test2.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.labelsToTrim.LabelsToTrimTestCase",
            "test.aria.widgets.form.multiselect.focusMove.Issue968RobotTestCase",
            "test.aria.widgets.form.multiselect.popupReposition.MultiSelectTestCase",
            "test.aria.widgets.form.multiselect.escapeKey.MultiSelectRobotTestCase"
        ];
    }
});
