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
    $classpath : "test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpandoTest2",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {
        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpandoTpl",
            data : this.data
        });

    },
    $prototype : {
        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.clickonExpandoButton("_checkOptions");
        },
        _checkOptions : function () {
            this.toggleOption("MultiAutoId", 1, "_checkValuefirst");
        },
        _checkValuefirst : function () {
            this.checkSelectedItems(1, ["Qantas"]);
            this.toggleOption("MultiAutoId", 4, "_checkValueSecond");
        },
        _checkValueSecond : function () {
            this.checkSelectedItems(2, ["Qantas", "P2.kon"]);
            this.checkDataModel(2, [{
                        label : 'Qantas',
                        code : '--'
                    }, {
                        label : 'P2.kon',
                        code : 'P2'

                    }]);
            this.toggleOption("MultiAutoId", 1, "_checkValueThird");
        },
        _checkValueThird : function () {
            this.checkSelectedItems(1, ["P2.kon"]);
            this.synEvent.click(this._getField(), {
                scope : this,
                fn : this._reOpenDropdown
            });
        },
        _reOpenDropdown : function () {
            this.clickonExpandoButton("_selectOtherOption");
        },
        _selectOtherOption : function () {
            this.toggleOption("MultiAutoId", 2, "_checkFinalValue");
        },
        _checkFinalValue : function () {
            this.checkSelectedItems(2, ["P2.kon", "P4.redd"]);
            this.end();
        }
    }
});
