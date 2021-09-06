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
    $classpath : "test.aria.widgets.wai.input.label.LabelJawsBase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.label.LabelJawsBaseTpl"
        });
    },
    $prototype : {
        skipClearHistory: true,
        nbTabs: 2,

        runTemplateTest : function () {
            var domElement = this.getElementById(this.elementsToTest);
            var forbidLabelHidden = {
                match: /with\s+aria\s+label\s+hidden/i,
                fn: this.lastJawsTextFailure,
                scope: this
            };
            var actions = [
                ["registerJawsListener", forbidLabelHidden],
                ["ensureVisible", domElement],
                ["click", domElement], ["pause", 1000]
            ];
            var nbTabs = this.nbTabs;
            for (var i = 0 ; i < nbTabs ; i++) {
                actions.push(["type", null, "[tab]"], ["pause", 1000]);
            }
            actions.push(
                ["waitForJawsToSay", { find: "wai Label", skipClear: true }],
                ["waitForJawsToSay", { find: "aria label described by", skipClear: true }],
                ["waitForJawsToSay", { find: "aria label labelled by", skipClear: true }]
            );
            this.execute(actions, {
                fn : this.end,
                scope : this
            });
        }
    }
});