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
    $classpath : "test.aria.widgets.form.passwordfield.PasswordField",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            password : ""
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.passwordfield.PasswordFieldTemplate",
            data : this.data
        });

    },
    $prototype : {

        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("pf"), {
                fn : this._onFieldFocused,
                scope : this
            });
        },

        _onFieldFocused : function () {
            this.synEvent.type(this.getInputField("pf"), "abcd", {
                fn : this._afterFieldType,
                scope : this
            });
        },

        _afterFieldType : function () {
            this.getInputField("pf").blur();
            this.assertTrue(this.getInputField("tf").value == "abcd");
            this.assertTrue(this.data.password == "abcd");
            this.notifyTemplateTestEnd();

        }
    }
});
