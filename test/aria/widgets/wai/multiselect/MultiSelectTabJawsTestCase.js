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
    $classpath : "test.aria.widgets.wai.multiselect.MultiSelectTabJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.multiselect.MultiSelectTpl"
        });
    },
    $prototype : {
        // skips removeDuplicates in assertJawsHistoryEquals, as we call it ourselves from filterResponse
        skipRemoveDuplicates: true,

        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var checkedRegExp = /not checked\nchecked/g;
            var notCheckedRegExp = /checked\nnot checked/g;
            var checkBoxStartingLineRegExp = /\ncheck box/g;

            this.synEvent.execute([
                ["click", this.getElementById("tf")],
                ["pause", 2000],
                ["type", null, "[down][down]"],
                ["pause", 1000],
                ["type", null, "[<shift>][F10][>shift<]"],
                ["pause", 1000],
                ["type", null, "[<shift>][tab][>shift<]"], // Shouldn't move
                ["pause", 500],
                ["type", null, "[space]"],
                ["pause", 500],
                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[space]"], // Select all
                ["pause", 500],
                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[tab]"], // One extra tab, shouldn't move
                ["pause", 500],
                ["type", null, "[enter]"], // Close
                ["pause", 500],
                ["type", null, "[down]"],
                ["pause", 500],
                ["type", null, "[space]"], // Open dropdown
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 500],
                ["type", null, "[space]"], // Unselect the second one
                ["pause", 500],
                ["type", null, "[escape]"], // Close the dropdown
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "Here is the default Multi-Select: Edit\nType in text.\nMy Multi-select:\nEdit\nAir Canada check box checked\nAir France check box not checked\nAir New Zealand check box not checked\nBritish Airways check box not checked\nDelta Airlines check box not checked\nSelect All Link\nDeselect All Link\nClose Link\nMy Multi-select: Edit\nAir Canada,Air France,British Airways\nType in text.\nPress space to open the selection list\nAir Canada check box checked\nAir France check box checked\nAir France check box not checked\nMy Multi-select: Edit\nAir Canada,British Airways\nType in text.",
                    this.end,
                    function(response) {
                        return this.removeDuplicates(response.
                            replace(checkBoxStartingLineRegExp, " check box").
                            replace(checkedRegExp, "checked").
                            replace(notCheckedRegExp, "not checked")
                        );
                    });
                },
                scope: this
            });
        }
    }
});
