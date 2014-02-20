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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test1.MultiAutoAdd",
    $extends : "test.aria.widgets.form.autocomplete.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $prototype : {

        runTemplateTest : function () {
            this.clickAndType(["air", "[down][down][enter]", "fi", "[down][enter]", "sys", "[down][enter]"], {
                fn : this._checkSelected,
                scope : this
            }, 500);
        },

        _checkSelected : function () {
            this.checkSelectedItems(3, ["Air Canada", "Finnair", "Scandinavian Airlines System"]);
            this.checkInputValue("");
            this.end();
        }

    }
});
