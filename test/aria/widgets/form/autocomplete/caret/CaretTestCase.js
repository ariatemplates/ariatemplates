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
    $classpath : "test.aria.widgets.form.autocomplete.caret.CaretTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
    },
    $prototype : {
        runTemplateTest : function () {
            var field = this.getInputField("ac");

            this.templateCtxt.$focus("ac");

            Syn.selectText(field, 1, 3);

            Syn.type(field, "a");

            aria.core.Timer.addCallback({
                fn : this.onTypeFirstLetter,
                scope : this,
                delay : 500
            });
        },

        onTypeFirstLetter : function () {
            var field = this.getInputField("ac");

            Syn.type(field, "p");

            aria.core.Timer.addCallback({
                fn : this.onType,
                scope : this,
                delay : 500
            });
        },

        /**
         * After pasting, check that the dropdown is opened. The datamodel is updated on blur
         */
        onType : function () {
            var fieldText = this.getInputField("ac").value;
            this.assertEquals(fieldText, "japan", "Text in the autocomplete should be japan, got: " + fieldText);

            this.notifyTemplateTestEnd();
        }
    }
});