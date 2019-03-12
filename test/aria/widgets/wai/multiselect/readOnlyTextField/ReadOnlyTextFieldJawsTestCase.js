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
    $classpath : "test.aria.widgets.wai.multiselect.readOnlyTextField.ReadOnlyTextFieldJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.multiselect.readOnlyTextField.ReadOnlyTextFieldTpl"
        });
    },
    $prototype : {
        // skips removeDuplicates in assertJawsHistoryEquals, as we call it ourselves from our filter function
        skipRemoveDuplicates: true,

        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var chechBoxStartingLineRegExp = /\ncheck box/g;

            this.execute([
                ["click", this.getElementById("tf")], ["pause", 2000],
                ["type", null, "[tab]"], ["pause", 2000],
                ["type", null, "[down]"], ["pause", 2000],
                ["type", null, "[space]"], ["pause", 2000],
                ["type", null, "[space]"], ["pause", 2000],
                ["type", null, "[escape]"], ["pause", 2000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals([
                        "Edit",
                        "Type in text.",
                        "What do you need to be happy? read only edit",
                        "Press down then space to open the list of check boxes.",
                        "Press space to open the list of check boxes",
                        "God check box not checked",
                        "checked",
                        "What do you need to be happy? read only edit",
                        "God",
                        "Press down then space to open the list of check boxes."
                    ].join("\n"),
                    this.end,
                    function(response) {
                        return this.removeDuplicates(response.replace(chechBoxStartingLineRegExp, " check box"));
                    });
                },
                scope: this
            });
        }
    }
});
