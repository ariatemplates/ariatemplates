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
    $classpath : "test.aria.widgets.wai.iconLabel.IconLabelJawsTest",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.iconLabel.IconLabelTpl"
        });
    },
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            this.synEvent.execute([
                ["click", this.getElementById("tf")],
                ["pause", 2000],

                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[down]"],
                ["pause", 500],

                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[down]"],
                ["pause", 500],

                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[down]"],
                ["pause", 500],

                ["type", null, "[tab]"],
                ["pause", 500],
                ["type", null, "[down]"],
                ["pause", 500]

            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "First textfield Edit\nType in text.\nCity Edit\nType in text.\nPress space to open the autocomplete list button menu collapsed\nTravel date Edit\nType in text.\nPress space to open the calendar button menu collapsed\nMulti-select: Edit\nType in text.\nPress space to open the selection list button menu collapsed\nAll Countries: Edit\nType in text.\nPress space to open the selection list\nbutton menu collapsed",
                        this.end
                    );
                },
                scope: this
            });
        }
    }
});
