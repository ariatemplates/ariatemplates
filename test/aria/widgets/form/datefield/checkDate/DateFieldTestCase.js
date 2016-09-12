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
    $classpath : "test.aria.widgets.form.datefield.checkDate.DateFieldTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            date1 : null,
            date2 : null,
            displayField : true
        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("df1"), {
                fn : function () {
                    this.waitForWidgetFocus("df1", this.onFieldFocused);
                },
                scope : this
            });
        },

        onFieldFocused : function () {
            this.synEvent.type(this.getInputField("df1"), "something in datefield 1", {
                fn : this.onUserDateTyped,
                scope : this
            });
        },

        onUserDateTyped : function () {
            this.synEvent.click(this.getInputField("df2"), {
                fn : function () {
                    this.waitForWidgetFocus("df2", this.onBlur);
                },
                scope : this
            });
        },

        onBlur : function () {
            this.templateCtxt.$refresh();

            var input = this.getInputField("df1");
            this.assertEquals(input.value, "something in datefield 1", "The incorrect value should have been restored.");
            this.assertTrue(input.parentNode.className.indexOf("normalError") > -1, "The error state should have been restored.");

            this.noDisplay();
        },

        noDisplay : function () {
            this.data.displayField = false;
            this.templateCtxt.$refresh();

            aria.utils.Json.setValue(this.data, 'date1', new Date(2011, 5, 20));
            this.data.displayField = true;

            this.templateCtxt.$refresh();

            var input = this.getInputField("df1");
            this.assertEquals(input.value, "20/6/11", "'20/6/11' was expected in the datefield 1, got '" + input.value
                    + "'");
            this.assertFalse(input.parentNode.className.indexOf("normalError") > -1, "The datefield 1 state shouldn't be in error.");

            this.finishTest();

        },

        finishTest : function () {
            this.notifyTemplateTestEnd();
        }
    }
});
