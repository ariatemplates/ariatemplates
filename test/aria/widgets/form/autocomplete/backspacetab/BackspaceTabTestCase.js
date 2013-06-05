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
    $classpath : "test.aria.widgets.form.autocomplete.backspacetab.BackspaceTabTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.backspacetab.BackTemplate",
            data : {
                value : null
            }
        });

        this.defaultTestTimeout = 20000;
    },
    $prototype : {
        runTemplateTest : function () {
            this.templateCtxt.$focus("ac");

            // Type something than [backspace] and [tab]
            this.synEvent.type(this.getInputField("ac"), "anything\b\t", {
                fn : this.onAfterType,
                scope : this
            });
        },

        onAfterType : function () {
            // Check that the value is correctly set in the datamodel
            var field = this.getInputField("ac");

            this.assertEquals("anythin", field.value, "Value in the field: " + field.value + " - expecting: anythin");

            this.notifyTemplateTestEnd();
        }
    }
});