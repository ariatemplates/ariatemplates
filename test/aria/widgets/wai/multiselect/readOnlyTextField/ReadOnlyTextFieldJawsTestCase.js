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
        skipClearHistory : true,

        /**
         * This method is always the first entry point to a template test Start the test by focusing the first field
         */
        runTemplateTest : function () {
            var tf = this.getElementById("tf");
            this.execute([
                ["click", tf],
                ["waitFocus", tf],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "What do you need to be happy?"],
                ["waitForJawsToSay", "Press tab then space to open the list of check boxes."],
                ["type", null, "[tab]"],
                ["waitForJawsToSay", "Press space to open the list of check boxes"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "God check box not checked"],
                ["type", null, "[space]"],
                ["waitForJawsToSay", "checked"],
                ["type", null, "[escape]"],
                ["waitForJawsToSay", "What do you need to be happy?"],
                ["waitForJawsToSay", "God"],
                ["waitForJawsToSay", "Press tab then space to open the list of check boxes."]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
