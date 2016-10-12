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
    $classpath : "test.aria.widgets.form.selectbox.checkTypeLetters.SelectBoxTypeAllLettersTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {
        runTemplateTest : function () {
            this.clickAndType('selectBox1', 'FR', {
                fn : this.afterTypeSecondLetter,
                scope : this
            }, true);
        },

        afterTypeSecondLetter : function () {
            this.assertTrue(this.getInputField("selectBox1").value == "Fr");
            this.end();
        }
    }
});
