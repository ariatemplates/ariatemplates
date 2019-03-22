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
    $classpath : "test.aria.widgets.wai.input.radiobutton.RadioButtonGroupJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.radiobutton.RadioButtonGroupTestCaseTpl"
        });
        this.noiseRegExps.push(/(First textfield Edit|Type in text\.)$/i);
    },
    $prototype : {
        skipClearHistory: false,

        runTemplateTest : function () {

            this.execute([
                ["click", this.getElementById("tf1")],
                ["waitForJawsToSay","First textfield Edit"],
                ["type",null,"[down]"],
                ["waitForJawsToSay",/radio button\s+not checked\s+Radio A/],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Space"],
                ["waitForJawsToSay","Radio A radio button  checked"],
                ["type",null,"[down][down][down][down][down]"],
                ["waitForJawsToSay","Radio A"],
                ["waitForJawsToSay",/radio button\s+not checked\s+Radio B/],
                ["waitForJawsToSay","Radio B"],
                ["waitForJawsToSay",/radio button\s+not checked\s+Radio C/],
                ["waitForJawsToSay","Radio C"],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Space"],
                ["waitForJawsToSay","Radio C radio button  checked"],
                ["type",null,"[up][up]"],
                ["waitForJawsToSay","Radio B"],
                ["waitForJawsToSay",/radio button\s+not checked\s+Radio B/],
                ["type",null,"[space]"],
                ["waitForJawsToSay","Space"],
                ["waitForJawsToSay","Radio B radio button  checked"],
                ["type",null,"[down][down][down][down][down]"],
                ["waitForJawsToSay","Radio B"],
                ["waitForJawsToSay",/radio button\s+not checked\s+Radio C/],
                ["waitForJawsToSay","Radio C"],
                ["waitForJawsToSay","Last textfield"],
                ["waitForJawsToSay","Edit"],
                ["type",null,"[<shift>][tab][>shift<]"],
                ["waitForJawsToSay","Shift Tab"],
                ["waitForJawsToSay","Radio B radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
