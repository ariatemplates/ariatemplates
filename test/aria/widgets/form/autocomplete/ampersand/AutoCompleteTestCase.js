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
    $classpath : 'test.aria.widgets.form.autocomplete.ampersand.AutoComplete',
    $extends : 'aria.jsunit.TemplateTestCase',
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this._autoCompleteTestCaseEnv = {
            template : "test.aria.widgets.form.autocomplete.ampersand.AutoCompleteTpl",
            moduleCtrl : {
                classpath : 'test.aria.widgets.form.autocomplete.ampersand.AutoCompleteCtrl'
            },
            data : null
        };
        this.setTestEnv(this._autoCompleteTestCaseEnv);
    },
    $prototype : {
        runTemplateTest : function () {
            this.clickAndType("ac1", "(&", {
                fn : this._blurField,
                scope : this
            }, false);
        },

        _blurField : function () {
            this.synEvent.click(this.getElementById('display'), {
                fn : this.finishTest,
                scope : this
            });
        },

        finishTest : function () {
            var field = this.getWidgetInstance('ac1');
            var display = this.getWidgetInstance('display');
            this.assertTrue(field._cfg.error, "The bound value in the data model was not updated when using either an ampersand or an opening parenthesis character, resulting in the validation failing to work correctly.");
            this.assertEquals(field._cfg.value, display._cfg.value, "The bound value in the data model was not updated when using either an ampersand or an opening parenthesis character, resulting in the bound field not being updated.");
            this.assertEquals(field._cfg.value, '(&', "The bound value in the data model was not updated when using either an ampersand or an opening parenthesis character.");
            this.end();
        }
    }
});
