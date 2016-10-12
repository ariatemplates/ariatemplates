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
    $classpath : "test.aria.widgets.form.multiautocomplete.testDMOnFreetext.MultiAutoDataModelRobotTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.MultiAutoCompleteRobotBase",
    $constructor : function () {

        this.data = {
            ac_airline_values : ["India", "Singapore"],
            freeText : true
        };
        this.$MultiAutoCompleteRobotBase.constructor.call(this);

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            // initial test for all the suggestions added
            this.checkSelectedItems(2);
            this.clickAndType(["p1-3", "[enter]"], {
                fn : this._afterFirstEnter,
                scope : this
            }, 800);
        },
        _afterFirstEnter : function () {
            this.checkSelectedItems(5, ["India", "Singapore", "P1.some", "P2.kon", "P3.red"]);
            this.checkDataModel(5, ["India", "Singapore", {
                        label : 'P1.some',
                        code : 'P1'
                    }, {
                        label : 'P2.kon',
                        code : 'P2'
                    }, {
                        label : 'P3.red',
                        code : 'P3'
                    }]);

            this.clickAndType(["p1-3", "[enter]"], {
                fn : this._afterSecondEnter,
                scope : this
            }, 800);
        },
        _afterSecondEnter : function () {
            this.checkSelectedItems(6, ["India", "Singapore", "P1.some", "P2.kon", "P3.red", "p1-3"]);
            this.checkDataModel(6, ["India", "Singapore", {
                        label : 'P1.some',
                        code : 'P1'
                    }, {
                        label : 'P2.kon',
                        code : 'P2'
                    }, {
                        label : 'P3.red',
                        code : 'P3'
                    }, "p1-3"]);
            this.end();
        }
    }
});
