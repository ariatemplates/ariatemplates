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
    $classpath : "test.aria.widgets.form.autocomplete.helptext.test2.AutoCompleteHelptextTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.dataModel = {
            value1 : "England"
        };
        this.setTestEnv({
            template : "test.aria.widgets.form.autocomplete.helptext.test2.HelptextTpl",
            data : this.dataModel
        });
    },
    $prototype : {

        runTemplateTest : function () {
            this._setData();
            var field = this.getInputField("ac");
            field.focus();
        },
        _setData : function () {
            aria.core.Timer.addCallback({
                fn : this._setWidgetValue,
                scope : this,
                delay : 100
            });
        },
        _setWidgetValue : function () {
            var myData = Aria.$window.document.getElementById("testArea_" + this.$class).childNodes[0].__data;
            var field = this.getInputField("ac");
            aria.utils.Json.setValue(myData, "value1", '');
            this.assertTrue(field.value === "", "The value has been set to the helptext.");
            this._finalizeTest();
        },
        _finalizeTest : function () {
            this.end();
        }
    }
});