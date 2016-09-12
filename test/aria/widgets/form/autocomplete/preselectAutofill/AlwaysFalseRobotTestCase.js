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
    $classpath : "test.aria.widgets.form.autocomplete.preselectAutofill.AlwaysFalseRobotTestCase",
    $extends : "test.aria.widgets.form.autocomplete.preselectAutofill.PreselectAutofillRobotBase",
    $constructor : function () {
        this.autofill = false;
        this.preselect = "always";
        this.allTestValues = {
            freetext : {
                input : ["p", "P4. TESTER D", "p1", "P1. TESTER A", "p", "P3. TESTER C"],
                dataModel : [null, {
                            label : "P4. TESTER D",
                            code : "P4"
                        }, null, {
                            label : "P1. TESTER A",
                            code : "P1"
                        }, null, {
                            label : "P3. TESTER C",
                            code : "P3"
                        }],
                items : [[4, [0]], [0], [1, [0]], [0], [4, [1]], [0]]
            }
        };

        this.allTestValues.noFreetext = aria.utils.Json.copy(this.allTestValues.freetext);
        this.$PreselectAutofillRobotBase.constructor.call(this);
    }
});
