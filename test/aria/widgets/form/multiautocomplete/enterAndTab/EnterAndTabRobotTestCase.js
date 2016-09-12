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
    $classpath : "test.aria.widgets.form.multiautocomplete.enterAndTab.EnterAndTabTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {
        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.multiautocomplete.enterAndTab.EnterAndTabTpl",
            data : this.data
        });

    },
    $prototype : {
        /**
         * This test is here to be sure that 'tab', defined as a selection key, behaves the same way as 'enter' (the
         * first list item is selected)
         */
        runTemplateTest : function () {
            this.clickAndType(["fi", this.dropdownOpenCondition], {
                fn : this._pressTab,
                scope : this
            }, 1);
        },

        _pressTab : function () {
            this.type({
                text : ["[TAB]"],
                cb : {
                    fn : this._checkValues,
                    scope : this
                }
            });
        },

        _checkValues : function () {
            this.checkSelectedItems(1, ["Finnair"]);
            this.checkDataModel(1, [{
                        label : 'Finnair',
                        code : 'XX'
                    }]);

            this.end();
        }

    }
});
