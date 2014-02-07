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
    $classpath : "test.aria.widgets.form.timefield.checkValue.TimeField",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            time1 : null,
            time2 : null

        };
        this.setTestEnv({
            data : this.data
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.synEvent.click(this.getInputField("tf1"), {
                fn : this.onFieldFocused,
                scope : this
            });
        },
        onFieldFocused : function () {
            var myField = this.getInputField("tf1");
            this.synEvent.type(myField, "12:00am", {
                fn : this.changeFocus,
                scope : this
            });
        },
        changeFocus : function () {
            var myField = this.getInputField("tf1");

            myField.blur();
            aria.core.Timer.addCallback({
                fn : function() {
                    this.assertTrue(myField.value === "00:00", "'00:00' was expected in the timefield.");
                    this.notifyTemplateTestEnd();
                },
                scope : this,
                delay : 25
            });
        }
    }

});
