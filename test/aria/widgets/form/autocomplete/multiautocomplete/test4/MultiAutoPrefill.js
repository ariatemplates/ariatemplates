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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test4.MultiAutoPrefill",
    $extends : "test.aria.widgets.form.autocomplete.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {

        this.data = {
            ac_airline_values : [],
            freeText : true
        };

        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);

    },
    $prototype : {

        runTemplateTest : function () {
            this.checkSelectedItems(0);

            this.data.ac_airline_values = [{
                        label : 'Air France',
                        code : 'AF'

                    }, {
                        label : 'Air Canada',
                        code : 'AC'
                    }];
            this.templateCtxt.$refresh();
            this.checkSelectedItems(2, ["Air France", "Air Canada"]);

            this.data.freeText = false;
            this.templateCtxt.$refresh();
            this.checkSelectedItems(2, ["Air France", "Air Canada"]);

            this.data.freeText = true;
            this.data.ac_airline_values = [{
                        label : 'Air France',
                        code : 'AF'

                    }, "aaa", "bbb"];
            this.templateCtxt.$refresh();
            this.checkSelectedItems(3, ["Air France", "aaa", "bbb"]);

            this.data.freeText = false;
            this.templateCtxt.$refresh();
            this.checkSelectedItems(3, ["Air France", "aaa", "bbb"]);

            this.end();
        }
    }
});
