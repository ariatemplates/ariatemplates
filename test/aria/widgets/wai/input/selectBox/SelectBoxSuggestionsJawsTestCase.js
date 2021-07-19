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
    $classpath : "test.aria.widgets.wai.input.selectBox.SelectBoxSuggestionsJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.selectBox.SelectBoxSuggestionsJawsTestCaseTpl"
        });
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {
            var domElement = this.getElementById("sbWaiEnabledStart");
            this.execute([
                ["ensureVisible",domElement],
                ["click",domElement],
                ["waitForJawsToSay","Type in text."],
                ["type",null,"[tab]"],
                ["waitForJawsToSay","All Countries Edit"],
                ["waitForJawsToSay","Type in text."],
                ["type",null,"f"],
                ["waitForJawsToSay","f"],
                ["waitForJawsToSay","There is one suggestion, use up and down arrow keys to navigate and enter to validate."]
            ], {
                fn : this.end,
                scope : this
            });
        }
    }
});