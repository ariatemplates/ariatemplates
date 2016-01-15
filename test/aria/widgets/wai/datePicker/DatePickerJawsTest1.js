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
    $classpath : "test.aria.widgets.wai.datePicker.DatePickerJawsTest1",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.datePicker.DatePickerTestTpl",
            data : {
                dpWaiEnabledValue : new Date(2016, 0, 1)
            }
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.synEvent.execute([
                ["click", this.getElementById("dpWaiEnabledNextInput")],
                ["pause", 1000],
                ["type", null, "[up][up][up]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[down]"],
                ["pause", 1000],
                ["type", null, "[space]"],
                ["pause", 1000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals("Next field Edit\nType in text.\nNext field\nDisplay calendar button menu collapsed\nEntering Application Region\nCalendar table. Use arrow keys to navigate and space to validate.\nFriday 1 January 2016\nFriday 8 January 2016\nFriday 15 January 2016\nLeaving Application Region\nTravel date Edit\n15/1/16\nType in text.", this.end);
                },
                scope: this
            });
        }
    }
});
