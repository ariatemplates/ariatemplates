/*
 * Copyright 2016 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.wai.autoComplete.preselect.AutoCompletePreselect1JawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.autoComplete.preselect.AutoCompleteTpl"
        });
        this.noiseRegExps.push(/type in text/i);
    },
    $prototype : {
        runTemplateTest : function () {
            this.execute([
                ["click", this.getInputField("country")], ["pause", 1000],
                ["type", null, "+"], ["pause", 5000],
                ["type", null, "4"], ["pause", 5000],
                ["type", null, "[down]"], ["pause", 1000],
                ["type", null, "[up]"], ["pause", 1000],
                ["type", null, "[enter]"], ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals("Country Edit\nList view Austria +43 1 of 4\nThere are 3 other suggestions, use up and down arrow keys to navigate and enter to validate.\nList view Austria +43 1 of 2\nThere is 1 other suggestion, use up and down arrow keys to navigate and enter to validate.\nList view United Kingdom +44 2 of 2\nList view Austria +43 1 of 2\nCountry Edit\nAustria +43", this.end);
                },
                scope: this
            });
        }
    }
});
