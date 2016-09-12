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
    $classpath : "test.aria.widgets.form.multiautocomplete.test10.MultiAutoExpandoTest3",
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
            this.clickAndType(["air", "[down][down][enter]", "fi", "[down][enter]"], {
                fn : this._checkSelected,
                scope : this
            }, 500);
        },
        _checkSelected : function () {
            this.checkSelectedItems(2, ["Air Canada", "Finnair"]);
            this.clickonExpandoButton("_checkOptions");
        },

        _checkOptions : function (id, cb) {
            var checkBox = this.getCheckBox("MultiAutoId", 6)._state;
            this.assertEquals(checkBox, "normalSelected", "Checkbox Should be in selected state but found in "
                    + checkBox + " state");
            checkBox = this.getCheckBox("MultiAutoId", 10)._state;
            this.assertEquals(checkBox, "normalSelected", "Checkbox Should be in selected state but found in "
                    + checkBox + " state");
            this.end();
        }

    }
});
