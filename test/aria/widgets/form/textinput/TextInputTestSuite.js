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
    $classpath : "test.aria.widgets.form.textinput.TextInputTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this._tests = ["test.aria.widgets.form.textinput.onchange.OnChangeTestCase",
                "test.aria.widgets.form.textinput.helpText.HelpTextTestCase",
                "test.aria.widgets.form.textinput.onblur.OnBlurTest",
                "test.aria.widgets.form.textinput.blurvalidation.BlurValidationTestCase",
                "test.aria.widgets.form.textinput.quotes.QuotesTestCase",
                "test.aria.widgets.form.textinput.onclick.OnClickTest",
                "test.aria.widgets.form.textinput.onfocus.OnFocusTest",
                "test.aria.widgets.form.textinput.blurOnDestroy.ClickButtonAfterDestroyTest",
                "test.aria.widgets.form.textinput.eventWrapperPropagation.EventWrapperPropagationTest"];
    }
});
