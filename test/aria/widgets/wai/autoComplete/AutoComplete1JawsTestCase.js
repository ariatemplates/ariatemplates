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
    $classpath : "test.aria.widgets.wai.autoComplete.AutoComplete1JawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.autoComplete.AutoCompleteTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.synEvent.execute([
                ["click", this.getElementById("inputBeforeAutoComplete")],
                ["pause", 1000],
                ["type", null, "[down][down][down]"],
                ["pause", 1000],
                ["type", null, "p"],
                ["pause", 1000],
                ["type", null, "a"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[enter]"],
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals("Edit\nType in text.\nWith accessibility enabled:\nCity 2\nEdit\nThere are 8 suggestions, use up and down arrow keys to navigate and enter to validate.\nThere are 2 suggestions, use up and down arrow keys to navigate and enter to validate.\nList view Pau 1 of 2\nList view Paris 2 of 2\nCity 2 Edit\nParis\nType in text.", this.end);
                },
                scope: this
            });
        }
    }
});
