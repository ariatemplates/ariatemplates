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
    $classpath : "test.aria.html.HTMLTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.html.element.ElementTestSuite");
        this.addTests("test.aria.html.controllers.suggestions.ResourcesHandlerTest");
        this.addTests("test.aria.html.textinput.TextInputTestSuite");
        this.addTests("test.aria.html.checkbox.CheckBoxTest");
        this.addTests("test.aria.html.template.basic.HtmlTemplateTestCase");
        this.addTests("test.aria.html.template.submodule.SubModuleTestCase");
        this.addTests("test.aria.html.radioButton.RadioButtonTest");
        this.addTests("test.aria.html.select.SelectTest");
        this.addTests("test.aria.html.select.bodycontent.BodyContentTestCase");
        this.addTests("test.aria.html.select.onchange.DataModelOnChangeTestCase");
        this.addTests("test.aria.html.DisabledTraitTest");
        this.addTests("test.aria.html.radioButton.ieBug.RadioButtonTestCase");
        this.addTests("test.aria.html.textarea.TextAreaTestSuite");
    }
});
