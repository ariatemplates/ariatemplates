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
    $classpath : "test.aria.widgets.form.select.nocontroller.NoControllerTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);


        this.data = {
            options : [{label : "", value : ""}]
        };

        this.setTestEnv({
            template : "test.aria.widgets.form.select.nocontroller.NoControllerTpl",
            data : this.data
        });
    },
    $prototype : {

        _checkOption : function(optionDom, value, label) {
            this.assertEquals(optionDom.value, value, "The option value should be %2 instead of %1");
            this.assertEquals(optionDom.innerHTML, label, "The option label should be %2 instead of %1");
        },

        runTemplateTest : function () {
            aria.utils.Json.setValue(this.data, "options", [
                {label : 'One', value : 'One'},
                {label : 'Two', value : 'Two'},
                {label : 'Three', value : 'Three'},
                {label : 'Four', value : 'Four'}
            ]);

            var select = this.testDiv.getElementsByTagName("select")[0];
            var options = select.getElementsByTagName("option");

            this.assertEquals(options.length, 4, "The select should have %2 options instead of %1");

            this._checkOption(options[0], "One", "One");
            this._checkOption(options[1], "Two", "Two");
            this._checkOption(options[2], "Three", "Three");
            this._checkOption(options[3], "Four", "Four");

            this.end();
        }
    }
});
