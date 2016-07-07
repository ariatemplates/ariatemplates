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
    $classpath : "test.aria.widgets.wai.input.checkbox.CheckboxDisabledBaseJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $dependencies : ["aria.utils.Json"],
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.data = {};
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.checkbox.CheckboxDisabledTestCaseTpl",
            data: this.data
        });
        this.defaultTestTimeout = 120000;
    },
    $prototype : {
        EXPECTED_OUTPUT_DISABLED: "First textfield Edit\nstd input 1 check box checked Unavailable\nstd input 1\nstd input 2 check box checked Unavailable\nstd input 3 check box checked Unavailable\nsimple input 1 check box checked Unavailable\nsimple input 1\nsimple input 2 check box checked Unavailable\nsimple input 3 check box checked Unavailable\nLast textfield",

        setupCheckedDisabledState: function () {
            var data = this.data;
            aria.utils.Json.setValue(data, "checkboxChecked", true);
            aria.utils.Json.setValue(data, "checkboxDisabled", true);
        },

        removeCheckedDisabledState: function () {
            aria.utils.Json.setValue(this.data, "checkboxDisabled", false);
        },

        runTemplateTest : function () {
            function step1() {
                this.checkAllCheckedUnavailable(step2);
            }

            function step2() {
                this.clearJawsHistory(step3);
            }

            function step3() {
                this.checkDontReact(step4);
            }

            function step4() {
                this.clearJawsHistory(step5);
            }

            function step5() {
                this.removeCheckedDisabledState();
                this.checkAllEnabled(this.end);
            }

            step1.call(this);
        },

        filterResponse: function (response) {
            response = response.replace(/(^|\n).*type.*(?=\n)/gi, "").trim();
            response = response.replace(/\n(?=check box)/gi, " "); // replaces the new line before "check box" by a space
            // sometimes Jaws says something and immediately correct himself, we only take into account the correction:
            response = response.replace(/not checked Unavailable\n(?=checked Unavailable\n)/gi, "");
            response = this.removeDuplicates(response);
            return response;
        },

        checkAllCheckedUnavailable : function (cb) {
            this.synEvent.execute([
                ["click", this.getElementById("tf1")], ["pause", 500],
                ["type", null, "[tab]"], ["pause", 500],
                ["type", null, "[<shift>][tab][>shift<]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "First textfield Edit\nLast textfield Edit\n" + this.EXPECTED_OUTPUT_DISABLED,
                        cb,
                        this.filterResponse
                    );
                },
                scope: this
            });
        },

        checkDontReact : function (cb) {
            this.synEvent.execute([
                ["click", this.getElementById("tf1")], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 1500],
                ["type", null, "[down]"], ["pause", 500]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(this.EXPECTED_OUTPUT_DISABLED, cb, this.filterResponse);
                },
                scope: this
            });
        },

        checkAllEnabled : function (cb) {
            this.synEvent.execute([
                ["click", this.getElementById("tf1")], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(this.EXPECTED_OUTPUT_DISABLED.replace(/ unavailable/gi, ""), cb, this.filterResponse);
                },
                scope: this
            });
        }
    }
});
