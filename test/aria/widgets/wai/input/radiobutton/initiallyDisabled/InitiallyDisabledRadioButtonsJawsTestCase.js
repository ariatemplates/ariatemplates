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
    $classpath : "test.aria.widgets.wai.input.radiobutton.initiallyDisabled.InitiallyDisabledRadioButtonsJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.radiobutton.initiallyDisabled.InitiallyDisabledRadioButtonsTpl"
        });
        this.noiseRegExps.push(/(edit|text)/i);
    },
    $prototype : {
        skipClearHistory : true,

        runTemplateTest : function () {

            this.execute([
                ["click", this.getElementById("tf1")],
                ["waitForJawsToSay","Type in text."],
                ["type",null,"[tab]"],
                ["waitForJawsToSay","Automatic radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Manual radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."],
                ["type",null,"[tab]"],
                ["waitForJawsToSay","Manual option 1 radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Manual option 2 radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."],
                ["type",null,"[down]"],
                ["waitForJawsToSay","Manual option 4 radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."],
                ["type",null,"[up]"],
                ["waitForJawsToSay","Manual option 2 radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."],
                ["type",null,"[<shift>][tab][>shift<]"],
                ["waitForJawsToSay","Manual radio button  checked"],
                ["waitForJawsToSay","To change the selection press Up or Down Arrow."]
            ], {
                fn: this.end,
                scope: this
            });
        }
    }
});
