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
    $classpath : "test.aria.widgets.form.select.valueAndOptionsBinding.SelectTemplateTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.utils.Dom", "aria.utils.Json"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.data = {
            selectedValue1 : "two",
            selectedValue2 : "two",
            options : [{
                value : "one",
                label : "One"
            }, {
                value : "two",
                label : "Two"
            },{
                value : "three",
                label : "Three"
            }]
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.select.valueAndOptionsBinding.SelectTemplateTest",
            data : this.data

        });
    },
    $prototype : {
        runTemplateTest : function () {

            // Change the options by binding:
            aria.utils.Json.setValue(this.data, "options", [{
                value : "zero",
                label : "Zero"
            },{
                value : "four",
                label : "Four"
            }, {
                value : "two",
                label : "Two"
            }]);

            // Check that the selected is still "two" for a simple html widget
            var select = this.getWidgetInstance("simple_select").getSelectField();
            this.assertEquals(select.value, "two", "The value %2 should be selected instead of %1");

            // Check that the selected is still "two" for a 'complex' select widget
            var select = this.getWidgetInstance("select").getTextInputField();
            var text = aria.utils.String.trim(select.textContent || select.innerText);
            this.assertEquals(text, "Two", "The value %2 should be selected instead of %1");

            this.end();
        }
    }
});
