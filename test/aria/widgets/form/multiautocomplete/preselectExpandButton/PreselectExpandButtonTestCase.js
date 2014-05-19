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
    $classpath : "test.aria.widgets.form.multiautocomplete.preselectExpandButton.PreselectExpandButtonTestCase",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $constructor : function () {
        this.$BaseMultiAutoCompleteTestCase.constructor.call(this);

        // setTestEnv has to be invoked before runTemplateTest fires
        this.setTestEnv({
            template : "test.aria.widgets.form.multiautocomplete.preselectExpandButton.PreselectExpandButtonTpl",
            data : this.data
        });

    },
    $prototype : {
        /**
         * This test is here to be sure that when preselect is 'always' and there is no value in the input field, then
         * when expanded the first item is NOT selected.
         */
        runTemplateTest : function (id, continueWith) {
            this.clickAndType(["[down]"], {
                fn : this._afterType,
                scope : this
            });
        },

        _afterType : function (evt, args) {
            this.waitFor({
                condition : function () {
                    return this.isMultiAutoCompleteOpen("MultiAutoId");
                },
                callback : this._checkValues
            });
        },

        _checkValues : function (evt, args) {
            this.assertFalse(this.getCheckBox('MultiAutoId', 0)._isChecked(), 'The first checkbox should not be checked.');
            this.end();
        }

    }
});
