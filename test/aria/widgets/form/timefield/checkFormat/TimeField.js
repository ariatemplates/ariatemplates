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
    $classpath : "test.aria.widgets.form.timefield.checkFormat.TimeField",
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
            this.synEvent.type(myField, "12", {
                fn : this.changeFocus,
                scope : this
            });
        },
        changeFocus : function () {
            var myField = this.getInputField("tf1");
            var pm = aria.utils.Date.res.timeFormatLabels.pm;

            myField.blur();
            this.assertTrue(myField.value == "12:0:0 " + pm, "'12:0:0 PM' was expected in the timefield 1.");
            this.notifyTemplateTestEnd();
        }
    }

});
