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
    $classpath : "test.aria.widgets.wai.input.checkbox.CheckboxDisabledJawsBase",
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
        skipClearHistory: true,

        expectedChecked: false,
        expectedDisabled: false,

        jawsTextForCheckbox: function (checkboxName) {
            var res = checkboxName + "\\s+check box\\s+" + (this.expectedChecked ? "checked" : "not checked");
            if (this.expectedDisabled) {
                res += "\\s+Unavailable";
            }
            return new RegExp(res);
        },

        setupCheckedDisabledState: function () {
            var data = this.data;
            aria.utils.Json.setValue(data, "checkboxChecked", true);
            aria.utils.Json.setValue(data, "checkboxDisabled", true);
            this.expectedChecked = true;
            this.expectedDisabled = true;
        },

        setupUncheckedDisabledState: function () {
            var data = this.data;
            aria.utils.Json.setValue(data, "checkboxChecked", false);
            aria.utils.Json.setValue(data, "checkboxDisabled", true);
            this.expectedChecked = false;
            this.expectedDisabled = true;
        },

        removeCheckedDisabledState: function () {
            aria.utils.Json.setValue(this.data, "checkboxDisabled", false);
            this.expectedDisabled = false;
        },

        runTemplateTest : function () {
            function step1() {
                this.checkAllCheckedUnavailable(step2);
            }

            function step2() {
                this.checkDontReact(step3);
            }

            function step3() {
                this.removeCheckedDisabledState();
                this.checkAllEnabled(this.end);
            }

            step1.call(this);
        },

        checkAllCheckedUnavailable : function (cb) {
            var field = this.getInputField("tf1");
            this.execute([
                ["click", field],
                ["waitFocus", field],
                ["type", null, "[tab]"],
                ["waitForJawsToSay","Last textfield"],
                ["type", null, "[<shift>][tab][>shift<]"],
                ["waitForJawsToSay","First textfield"],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 1")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 2")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 3")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 1")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 2")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 3")],
                ["type", null, "[down]"],
                ["waitForJawsToSay","Last textfield"]
            ], {
                fn: cb,
                scope: this
            });
        },

        checkDontReact : function (cb) {
            var field = this.getInputField("tf1");
            var changeCheckboxStateListener = {
                match: this.expectedChecked ? /(check\s+box|^)\s+not\s+checked/i : /(check\s+box|^)\s+checked/i,
                fn: this.lastJawsTextFailure,
                scope: this
            };
            this.execute([
                ["click", field],
                ["waitFocus", field],
                ["registerJawsListener", changeCheckboxStateListener],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 1")],
                ["type", null, "[space]"], ["waitForJawsToSay","Space"], ["pause", 1500],
                // pressing space on a disabled checkbox looses the current position in the document
                // so we start from the field again:
                ["click", field],
                ["waitFocus", field],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 1")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 2")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 3")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 1")],
                ["type", null, "[space]"], ["waitForJawsToSay","Space"], ["pause", 1500],

                ["click", field],
                ["waitFocus", field],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 1")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 2")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 3")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 1")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 2")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 3")],
                ["type", null, "[down]"],
                ["waitForJawsToSay","Last textfield"],
                ["unregisterJawsListener", changeCheckboxStateListener]
            ], {
                fn: cb,
                scope: this
            });
        },

        checkAllEnabled : function (cb) {
            var field = this.getInputField("tf1");
            var unavailableTextListener = {
                match: /unavailable/i,
                fn: this.lastJawsTextFailure,
                scope: this
            };
            this.execute([
                ["click", field],
                ["waitFocus", field],
                ["registerJawsListener", unavailableTextListener],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 1")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 2")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("std input 3")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 1")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 2")],
                ["type", null, "[down]"],
                ["waitForJawsToSay", this.jawsTextForCheckbox("simple input 3")],
                ["type", null, "[down]"],
                ["waitForJawsToSay","Last textfield"],
                ["unregisterJawsListener", unavailableTextListener]
            ], {
                fn: cb,
                scope: this
            });
        }
    }
});
