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
    $classpath : "test.aria.widgets.form.multiautocomplete.test2.MultiAutoRemove",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $prototype : {

        runTemplateTest : function () {
            this.clickAndType(["air", "[down][down][enter]", "fi", "[down][enter]", "a", "[down][enter]"], {
                fn : this._removeFirstItem,
                scope : this
            }, 500);

        },

        _removeFirstItem : function () {
            this.checkSelectedItems(3, ["Air Canada", "Finnair", "American Airlines"]);
            this.removeByCrossClick(0, {
                fn : this._checkFirstRemoval,
                scope : this
            });
        },

        _checkFirstRemoval : function () {
            this.checkSelectedItems(2, ["Finnair", "American Airlines"]);
            this.removeByCrossClick(0, {
                fn : this._checkSecondRemoval,
                scope : this
            });
        },

        _checkSecondRemoval : function () {
            this.checkSelectedItems(1, ["American Airlines"]);
            this.end();
        }

    }
});
