/*
 * Copyright 2015 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.input.checkbox.CheckboxJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.checkbox.CheckboxTestCaseTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {

            var filterRegExp = /(First textfield Edit|Type in text\.)\n/gi;
            var checkedRegExp = /not checked\nchecked/g;
            var notCheckedRegExp = /checked\nnot checked/g;

            this.synEvent.execute([
                ["click", this.getElementById("tf1")],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[down][down][down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[down][down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[down][down]"],
                ["pause", 1000],
                ["type", null, "[<shift>][tab][>shift<]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[up][up]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "Checkbox A check box not checked\nCheckbox A check box checked\nCheckbox A\nCheckbox B check box not checked\nCheckbox B\nCheckbox B check box checked\nCheckbox B\nCheckbox C check box not checked\nCheckbox C check box checked\nCheckbox C\nLast textfield\nCheckbox C check box not checked\nCheckbox B\nCheckbox B check box checked\nCheckbox B check box not checked",
                    this.end,
                    function(response) {
                        return response.replace(filterRegExp, "").
                            replace(checkedRegExp, "checked").
                            replace(notCheckedRegExp, "not checked");
                    });
                },
                scope: this
            });
        }
    }
});
