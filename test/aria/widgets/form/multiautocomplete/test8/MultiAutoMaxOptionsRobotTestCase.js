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
    $classpath : "test.aria.widgets.form.multiautocomplete.test8.MultiAutoMaxOptionsRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteRobotBase",
    $constructor : function () {
        this.data = {
            ac_airline_values : [],
            freeText : true,
            maxOptions : 3
        };
        this.$MultiAutoCompleteRobotBase.constructor.call(this);
    },
    $prototype : {

        runTemplateTest : function () {

            this.clickAndType(["a", "[down][enter]", "a", "[down][enter]", "a", "[down][enter]", "fi", "[enter]"], {
                fn : this._afterType,
                scope : this
            }, 800);
        },

        _afterType : function () {
            this.checkDataModel(3, [{
                        label : 'American Airlines',
                        code : 'AA'
                    }, {
                        label : 'Air France',
                        code : 'AF'

                    }, {
                        label : 'Air Canada',
                        code : 'AC'
                    }]);
            this.checkSelectedItems(3, ["American Airlines", "Air France", "Air Canada"]);
            this.end();
        }

    }
});
