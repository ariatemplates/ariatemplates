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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test9.MultiAutoBackSpace",
    $extends : "test.aria.widgets.form.autocomplete.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $prototype : {

        runTemplateTest : function () {
            this.clickAndType(["p1-4", "[enter]", "[backspace]"], {
                fn : this._afterType,
                scope : this
            }, 800);
        },

        _afterType : function () {
            this.checkDataModel(3, [{
                        label : 'P1.some',
                        code : 'P1'
                    }, {
                        label : 'P2.kon',
                        code : 'P2'
                    }, {
                        label : 'P3.red',
                        code : 'P3'
                    }]);
            this.checkSelectedItems(3, ['P1.some', 'P2.kon', 'P3.red']);
            this.end();
        }
    }
});
