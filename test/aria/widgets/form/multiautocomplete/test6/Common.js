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
    $classpath : "test.aria.widgets.form.multiautocomplete.test6.Common",
    $extends : "test.aria.widgets.form.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $prototype : {
        rangePattern1 : "",
        rangePattern2 : "",
        rangeLabels : [],
        rangeCount : [],

        runTemplateTest : function () {
            this.clickAndType([this.rangePattern1, "[enter]"], {
                fn : this._afterFirstType,
                scope : this
            }, 800);
        },

        _afterFirstType : function () {
            this.checkSelectedItems(this.rangeCount[0], this.rangeLabels.slice(0, this.rangeCount[0] - 1));
            this.clickAndType([this.rangePattern2, "[enter]"], {
                fn : this._afterSecondType,
                scope : this
            }, 800);
        },

        _afterSecondType : function () {
            this.checkSelectedItems(this.rangeCount[1], this.rangeLabels);
            this.end();
        }
    }
});
